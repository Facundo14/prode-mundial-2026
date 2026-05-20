import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

const TEAMS_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.teams.json";
const MATCHES_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const ISO_MAP: Record<string, string> = {
  "Mexico": "mx",
  "South Africa": "za",
  "South Korea": "kr",
  "Czech Republic": "cz",
  "Canada": "ca",
  "Bosnia & Herzegovina": "ba",
  "Qatar": "qa",
  "Switzerland": "ch",
  "Brazil": "br",
  "Morocco": "ma",
  "Haiti": "ht",
  "Scotland": "gb-sct",
  "USA": "us",
  "Paraguay": "py",
  "Australia": "au",
  "Turkey": "tr",
  "Germany": "de",
  "Curaçao": "cw",
  "Ivory Coast": "ci",
  "Ecuador": "ec",
  "Netherlands": "nl",
  "Japan": "jp",
  "Sweden": "se",
  "Tunisia": "tn",
  "Belgium": "be",
  "Egypt": "eg",
  "Iran": "ir",
  "New Zealand": "nz",
  "Spain": "es",
  "Cape Verde": "cv",
  "Saudi Arabia": "sa",
  "Uruguay": "uy",
  "France": "fr",
  "Senegal": "sn",
  "Iraq": "iq",
  "Norway": "no",
  "Argentina": "ar",
  "Algeria": "dz",
  "Austria": "at",
  "Jordan": "jo",
  "Portugal": "pt",
  "DR Congo": "cd",
  "Uzbekistan": "uz",
  "Colombia": "co",
  "England": "gb-eng",
  "Croatia": "hr",
  "Ghana": "gh",
  "Panama": "pa",
};

async function main() {
  console.log("🚀 Iniciando importación masiva desde GitHub...");

  try {
    console.log("📥 Descargando JSONs...");
    const teamsRes = await fetch(TEAMS_URL);
    const teamsData = await teamsRes.json();
    
    const matchesRes = await fetch(MATCHES_URL);
    const matchesData = await matchesRes.json();

    console.log("🧹 Limpiando base de datos...");
    await prisma.prediction.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.match.deleteMany({});
    await prisma.team.deleteMany({});

    console.log("🏟️ Insertando equipos...");
    const teamMap = new Map<string, string>();

    for (const t of teamsData) {
      const isoCode = ISO_MAP[t.name] || t.fifa_code.toLowerCase().substring(0, 2);
      const team = await prisma.team.create({
        data: {
          name: t.name,
          isoCode: isoCode,
          group: t.group || "Unknown",
        }
      });
      teamMap.set(t.name, team.id);
    }

    console.log("⚽ Insertando partidos...");
    let matchCount = 0;
    
    // En el JSON de worldcup.json, los partidos están directamente en la propiedad "matches"
    for (const m of matchesData.matches) {
      const homeTeamId = teamMap.get(m.team1);
      const awayTeamId = teamMap.get(m.team2);

      if (!homeTeamId || !awayTeamId) {
        // Saltamos si son placeholders de eliminatorias (ej: "1A", "2B")
        continue;
      }

      await prisma.match.create({
        data: {
          homeTeamId,
          awayTeamId,
          date: new Date(m.date + (m.time ? `T${m.time.split(' ')[0]}:00Z` : "T12:00:00Z")),
          status: "PENDING",
        }
      });
      matchCount++;
    }
    
    console.log(`✅ Se insertaron ${matchCount} partidos.`);
    console.log("✨ ¡Importación completada con éxito!");
  } catch (error) {
    console.error("❌ Error durante la importación:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
