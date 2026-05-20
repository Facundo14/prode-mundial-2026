import { getUserStats } from "@/actions/user"
import { currentUser } from "@clerk/nextjs/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { Trophy, Target, Calendar, CheckCircle2 } from "lucide-react"
import ConfettiTrigger from "@/components/ConfettiTrigger"
import { cn } from "@/lib/utils"
import { translateCountry } from "@/utils/i18n"

export default async function ProfilePage() {
  const clerkUser = await currentUser()
  const stats = await getUserStats()

  if (!clerkUser) return null

  // Lógica para celebrar: si alguna predicción reciente tuvo 5 puntos
  const shouldCelebrate = stats.history.some(p => p.pointsEarned === 5)

  return (
    <div className="min-h-screen p-4 md:p-10 space-y-6 md:space-y-10 max-w-full overflow-x-hidden">
      {shouldCelebrate && <ConfettiTrigger />}
      <header className="flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-2xl shadow-primary/20">
          <Image
            src={clerkUser.imageUrl}
            alt={clerkUser.firstName || "Usuario"}
            fill
            className="object-cover"
            sizes="128px"
            priority
          />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-4xl md:text-6xl font-heading tracking-tighter text-white">
            {clerkUser.firstName} <span className="text-primary">{clerkUser.lastName}</span>
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Badge className="bg-primary text-primary-foreground font-heading tracking-widest px-4 py-1">
              {stats.points} PUNTOS TOTALES
            </Badge>
            <Badge variant="outline" className="border-white/20 text-slate-400 font-heading tracking-widest px-4 py-1">
              PRO PLAYER
            </Badge>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Calendar className="text-cyan-400" />} 
          label="Predicciones" 
          value={`${stats.predictionCount}/72`} 
          sub="Partidos completados"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-green-400" />} 
          label="Plenos Exactos" 
          value={stats.exactHits.toString()} 
          sub="Resultados perfectos"
        />
        <StatCard 
          icon={<Target className="text-purple-400" />} 
          label="Aciertos" 
          value={stats.tendencyHits.toString()} 
          sub="Ganador o empate"
        />
        <StatCard 
          icon={<Trophy className="text-yellow-400" />} 
          label="Efectividad" 
          value={`${stats.efficiency}%`} 
          sub="Ratio de precisión"
        />
      </div>

      {/* Historial de Predicciones */}
      <Card className="glass border-none overflow-hidden">
        <CardHeader className="bg-white/5 p-6 border-b border-white/10">
          <CardTitle className="font-heading text-2xl tracking-widest uppercase">Historial de Operaciones</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="font-heading text-xs uppercase tracking-widest py-4 pl-6">Partido</TableHead>
                <TableHead className="text-center font-heading text-xs uppercase tracking-widest py-4">Tu Pronóstico</TableHead>
                <TableHead className="text-center font-heading text-xs uppercase tracking-widest py-4">Resultado Real</TableHead>
                <TableHead className="text-right font-heading text-xs uppercase tracking-widest py-4 pr-6">Puntos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.history.map((pred: any) => {
                const isFinished = pred.match.status === 'FINISHED';
                return (
                  <TableRow key={pred.id} className="hover:bg-white/5 border-white/5 group">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center min-w-[50px]">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            {new Date(pred.match.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-heading text-xs md:text-sm uppercase truncate max-w-[80px] md:max-w-none">{translateCountry(pred.match.homeTeam.name)}</span>
                          <span className="text-primary font-black italic text-[10px]">VS</span>
                          <span className="font-heading text-xs md:text-sm uppercase truncate max-w-[80px] md:max-w-none">{translateCountry(pred.match.awayTeam.name)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md border border-white/5">
                        <span className="font-heading text-xl text-primary">{pred.homeGoals}</span>
                        <span className="text-slate-600">-</span>
                        <span className="font-heading text-xl text-primary">{pred.awayGoals}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {isFinished ? (
                        <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                          <span className="font-heading text-xl text-white">{pred.match.homeGoals}</span>
                          <span className="text-slate-600">-</span>
                          <span className="font-heading text-xl text-white">{pred.match.awayGoals}</span>
                        </div>
                      ) : (
                        <span className="font-heading text-[10px] text-slate-500 italic tracking-widest">PENDIENTE</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <span className={cn(
                        "font-heading text-xl",
                        pred.pointsEarned > 0 ? "text-green-400" : "text-slate-400"
                      )}>
                        {isFinished ? `+${pred.pointsEarned}` : "--"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {stats.history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <p className="font-heading text-slate-500 uppercase tracking-widest">No has realizado predicciones todavía.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <Card className="glass border-none p-4 md:p-6 space-y-3 md:space-y-4 hover:border-primary/30 transition-all group">
      <div className="p-2 md:p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-3xl font-heading text-white">{value}</p>
        <p className="text-[10px] font-bold text-slate-600 uppercase mt-1">{sub}</p>
      </div>
    </Card>
  )
}
