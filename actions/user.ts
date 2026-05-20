"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function getUserStats() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error("No autenticado")
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      predictions: {
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!user) {
    return {
      points: 0,
      predictionCount: 0,
      exactHits: 0,
      tendencyHits: 0,
      efficiency: 0,
      history: []
    }
  }

  const finishedPredictions = user.predictions.filter(p => p.match.status === 'FINISHED');
  const exactHits = finishedPredictions.filter(p => p.pointsEarned === 5).length;
  const tendencyHits = finishedPredictions.filter(p => p.pointsEarned >= 1).length;
  const efficiency = finishedPredictions.length > 0 
    ? Math.round((tendencyHits / finishedPredictions.length) * 100) 
    : 0;

  return {
    points: user.points,
    predictionCount: user.predictions.length,
    exactHits,
    tendencyHits,
    efficiency,
    history: user.predictions
  }
}
