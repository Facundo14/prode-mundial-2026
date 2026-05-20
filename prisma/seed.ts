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
      homeTeam: "Argentina",
      awayTeam: "Argelia",
      date: new Date("2026-06-10T15:00:00Z"),
      status: "PENDING" as any,
    },
    {
      homeTeam: "Argentina",
      awayTeam: "Austria",
      date: new Date("2026-06-14T18:00:00Z"),
      status: "PENDING" as any,
    },
    {
      homeTeam: "Jordania",
      awayTeam: "Argentina",
      date: new Date("2026-06-18T20:00:00Z"),
      status: "PENDING" as any,
    },
  ];

  for (const match of matches) {
    await prisma.match.create({ data: match });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
