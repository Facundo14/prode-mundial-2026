import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetGame() {
  console.log("🚀 Iniciando reseteo táctico del sistema (LA PIZARRA)...");

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Borrar todas las predicciones
      console.log("🧹 Eliminando todas las predicciones de los usuarios...");
      const deletedPredictions = await tx.prediction.deleteMany({});
      console.log(`✅ ${deletedPredictions.count} predicciones eliminadas.`);

      // 2. Resetear todos los partidos a estado PENDING y goles a null
      console.log("⚽ Reseteando fixture: todos los partidos a PENDING...");
      const updatedMatches = await tx.match.updateMany({
        data: {
          status: "PENDING",
          homeGoals: null,
          awayGoals: null,
        },
      });
      console.log(`✅ ${updatedMatches.count} partidos reseteados.`);

      // 3. Resetear puntos de todos los usuarios a 0
      console.log("👤 Reseteando puntos de usuarios a 0...");
      const updatedUsers = await tx.user.updateMany({
        data: {
          points: 0,
        },
      });
      console.log(`✅ ${updatedUsers.count} perfiles de usuario actualizados.`);
    });

    console.log("\n✨ LIMPIEZA COMPLETADA CON ÉXITO.");
    console.log("La Pizarra está lista para el despliegue oficial. ¡A la cancha!");
  } catch (error) {
    console.error("\n❌ ERROR DURANTE EL RESETEO:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetGame();
