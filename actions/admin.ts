"use server"

import prisma from "@/lib/prisma"
import { calculatePoints } from "@/utils/scoring"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

/**
 * Finaliza un partido y reparte puntos a todos los usuarios que hicieron predicciones
 */
export async function finishMatch(
  matchId: string,
  realHomeScore: number,
  realAwayScore: number
) {
  const { userId } = await auth();

  // Validación de Seguridad: Solo el ID configurado como ADMIN puede ejecutar esto
  if (!userId || userId !== process.env.ADMIN_USER_ID) {
    throw new Error("No autorizado: Solo el administrador puede finalizar partidos.");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Actualizar el partido a finalizado
      const match = await tx.match.update({
        where: { id: matchId },
        data: {
          homeGoals: realHomeScore,
          awayGoals: realAwayScore,
          status: "FINISHED",
        },
      })

      // 2. Buscar todas las predicciones para este partido
      const predictions = await tx.prediction.findMany({
        where: { matchId },
      })

      // 3. Procesar cada predicción
      for (const pred of predictions) {
        const points = calculatePoints(
          pred.homeGoals,
          pred.awayGoals,
          realHomeScore,
          realAwayScore
        )

        // Actualizar los puntos ganados en la predicción
        await tx.prediction.update({
          where: { id: pred.id },
          data: { pointsEarned: points },
        })

        // Sumar puntos al total del usuario
        await tx.user.update({
          where: { id: pred.userId },
          data: {
            points: {
              increment: points,
            },
          },
        })
      }

      revalidatePath("/dashboard")
      revalidatePath("/dashboard/profile")
      
      return { success: true, match }
    })
  } catch (error) {
    console.error("Error finishing match:", error)
    return { success: false, error: "No se pudo finalizar el partido" }
  }
}
