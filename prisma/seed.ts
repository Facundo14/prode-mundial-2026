import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.prediction.deleteMany({});
  await prisma.match.deleteMany({});

  const matches = [
    {
      homeTeam: { connect: { name: "Argentina" } },
      awayTeam: { connect: { name: "Argelia" } },
      date: new Date("2026-06-10T15:00:00Z"),
      status: "PENDING" as any,
    },
    {
      homeTeam: { connect: { name: "Argentina" } },
      awayTeam: { connect: { name: "Austria" } },
      date: new Date("2026-06-14T18:00:00Z"),
      status: "PENDING" as any,
    },
    {
      homeTeam: { connect: { name: "Jordania" } },
      awayTeam: { connect: { name: "Argentina" } },
      date: new Date("2026-06-18T20:00:00Z"),
      status: "PENDING" as any,
    },
  ];

  for (const match of matches) {
    // Usamos 'any' para evitar errores de tipo si los IDs de los equipos no existen aún
    // aunque lo ideal es que los equipos ya estén en la DB.
    await prisma.match.create({ data: match as any });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
