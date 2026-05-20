"use client"

import { useState, useTransition } from "react"
import { finishMatch } from "@/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { translateCountry } from "@/utils/i18n"

interface AdminMatchRowProps {
  match: {
    id: string
    homeTeam: { name: string; isoCode: string }
    awayTeam: { name: string; isoCode: string }
    homeGoals: number | null
    awayGoals: number | null
    status: string
    date: Date
  }
}

export default function AdminMatchRow({ match }: AdminMatchRowProps) {
  const [homeScore, setHomeScore] = useState(match.homeGoals?.toString() ?? "")
  const [awayScore, setAwayScore] = useState(match.awayGoals?.toString() ?? "")
  const [isPending, startTransition] = useTransition()

  const isFinished = match.status === "FINISHED"

  const handleFinish = () => {
    if (homeScore === "" || awayScore === "") {
      toast.error("Debes ingresar ambos resultados")
      return
    }

    startTransition(async () => {
      try {
        const result = await finishMatch(
          match.id,
          parseInt(homeScore),
          parseInt(awayScore)
        )

        if (result.success) {
          toast.success("PARTIDO FINALIZADO Y PUNTOS REPARTIDOS", {
            className: "font-heading uppercase tracking-widest",
          })
        } else {
          // Usamos casting a 'any' para evitar el error de tipos en el build de producción
          // ya que el discriminante de éxito/error de Prisma en la acción de servidor 
          // a veces confunde al compilador de TS en el CI/CD.
          toast.error((result as any).error || "ERROR AL FINALIZAR")
        }
      } catch (error: any) {
        toast.error(error.message || "ERROR INESPERADO")
      }
    })
  }

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 rounded-xl glass transition-all",
      isFinished ? "opacity-60 grayscale" : "hover:bg-white/5"
    )}>
      {/* Info Partido */}
      <div className="md:col-span-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {new Date(match.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className={cn(
            "text-[8px] uppercase tracking-tighter",
            isFinished ? "border-green-500/50 text-green-500" : "border-yellow-500/50 text-yellow-500"
          )}>
            {match.status}
          </Badge>
        </div>
      </div>

      {/* Equipos y Marcadores */}
      <div className="md:col-span-6 flex items-center justify-center gap-4">
        <div className="flex-1 text-right font-heading text-sm uppercase truncate">
          {translateCountry(match.homeTeam.name)}
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            disabled={isFinished || isPending}
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            className="w-12 h-10 bg-black/40 border-white/10 text-center font-heading text-xl"
          />
          <span className="text-slate-600 font-bold">-</span>
          <Input
            type="number"
            min="0"
            disabled={isFinished || isPending}
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            className="w-12 h-10 bg-black/40 border-white/10 text-center font-heading text-xl"
          />
        </div>

        <div className="flex-1 text-left font-heading text-sm uppercase truncate">
          {translateCountry(match.awayTeam.name)}
        </div>
      </div>

      {/* Acción */}
      <div className="md:col-span-3 flex justify-end">
        {isFinished ? (
          <div className="flex items-center gap-2 text-green-500 font-heading text-xs tracking-widest">
            <CheckCircle2 size={16} /> FINALIZADO
          </div>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={isPending}
            variant="outline"
            className="w-full md:w-auto font-heading text-[10px] tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "FINALIZAR Y SUMAR"}
          </Button>
        )}
      </div>
    </div>
  )
}
