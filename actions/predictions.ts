"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitPrediction(
  matchId: string,
  homeGoals: number,
  awayGoals: number
) {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return { success: false, error: "Debes estar logueado" }
  }

  try {
    // 1. Obtener o crear el usuario en nuestra DB basado en Clerk
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: {
        clerkId,
        email: `${clerkId}@clerk.user`, // Fallback
        name: "Usuario Prode",
      },
    })

    // 2. Guardar o actualizar la predicción
    await prisma.prediction.upsert({
      where: {
        userId_matchId: {
          userId: user.id,
          matchId,
        },
      },
      update: {
        homeGoals,
        awayGoals,
      },
      create: {
        userId: user.id,
        matchId,
        homeGoals,
        awayGoals,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error submitting prediction:", error)
    return { success: false, error: "Error al guardar en la base de datos" }
  }
}
