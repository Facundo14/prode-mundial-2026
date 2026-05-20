import Leaderboard from "@/components/Leaderboard"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export default async function LeaderboardPage() {
  const { userId } = await auth()

  const users = await prisma.user.findMany({
    orderBy: {
      points: 'desc'
    },
    take: 50 // Traemos el top 50
  })

  // Mapeamos para que el componente reciba lo que necesita
  const leaderboardData = users.map(user => ({
    id: user.id,
    clerkId: user.clerkId,
    name: user.name,
    points: user.points,
    // Aquí podrías agregar lógica para traer el avatar desde Clerk o guardarlo en tu DB
    avatar: undefined 
  }))

  return (
    <div className="min-h-screen p-4 md:p-10 space-y-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-6xl md:text-8xl font-heading tracking-tighter text-white drop-shadow-2xl">
          RANKING <span className="text-primary">GLOBAL</span>
        </h1>
        <p className="text-slate-400 font-sans font-bold uppercase tracking-[0.3em] text-sm ml-1">
          The Elite Leaderboard
        </p>
      </header>

      <Leaderboard users={leaderboardData} currentUserId={userId} />
    </div>
  )
}
