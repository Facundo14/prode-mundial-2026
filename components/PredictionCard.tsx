"use client"

import { useState, useTransition, useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, Clock } from "lucide-react"
import { submitPrediction } from "@/actions/predictions"
import { toast } from "sonner"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { translateCountry } from "@/utils/i18n"

interface Team {
  id: string
  name: string
  isoCode: string
}

interface PredictionCardProps {
  match: {
    id: string
    homeTeam: Team
    awayTeam: Team
    homeGoals: number | null
    awayGoals: number | null
    status: "PENDING" | "IN_PROGRESS" | "FINISHED"
    date: Date
    predictions?: {
      homeGoals: number
      awayGoals: number
      pointsEarned: number
    }[]
  }
  index: number
}

export default function PredictionCard({ match, index }: PredictionCardProps) {
  const userPrediction = match.predictions?.[0]
  const [homeGoals, setHomeGoals] = useState(userPrediction?.homeGoals.toString() ?? "")
  const [awayGoals, setAwayGoals] = useState(userPrediction?.awayGoals.toString() ?? "")
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Lo hacemos asíncrono para evitar el "cascading render"
    const mountTimer = setTimeout(() => setMounted(true), 0)
    
    // Tu lógica original del reloj
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    
    return () => {
      clearTimeout(mountTimer)
      clearInterval(timer)
    }
  }, [])

  const matchDate = new Date(match.date)
  const isLocked = currentTime >= matchDate || match.status === "FINISHED"
  const isFinished = match.status === "FINISHED"
  const timeToMatch = !isLocked && !isFinished ? formatDistanceToNow(matchDate, { locale: es, addSuffix: true }) : ""

  const getFlagUrl = (isoCode: string) => `https://flagcdn.com/w160/${isoCode.toLowerCase()}.png`

  const handleSave = () => {
    if (isLocked) return

    startTransition(async () => {
      try {
        const result = await submitPrediction(
          match.id,
          parseInt(homeGoals),
          parseInt(awayGoals)
        )

        if (result.success) {
          toast.success("PRONÓSTICO GUARDADO", {
            className: "font-heading uppercase tracking-widest",
          })
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#8b5cf6', '#ec4899']
          })
        } else {
          toast.error(result.error || "ERROR AL GUARDAR")
        }
      } catch (error) {
        toast.error("ERROR INESPERADO")
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={!isLocked ? { y: -4 } : {}}
    >
      <Card className={`glass ${!isLocked ? 'glass-hover' : 'opacity-90'} overflow-hidden transition-all duration-300 relative ${isFinished ? 'border-primary/30' : ''}`}>
        {isLocked && !isFinished && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-slate-950/80 backdrop-blur-sm border border-white/10 rounded-full p-1.5 shadow-xl">
              <Lock size={12} className="text-slate-400" />
            </div>
          </div>
        )}

        {isFinished && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-primary/20 backdrop-blur-sm border border-primary/50 text-primary px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase">
              FINALIZADO
            </div>
          </div>
        )}
        
        <CardHeader className="text-center py-2 md:py-3 border-b border-white/5">
          <CardTitle className="flex flex-col items-center gap-0.5 md:gap-1">
            <span className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-400">
              {mounted ? matchDate.toLocaleDateString('es-AR', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }) : "CARGANDO..."}
            </span>
            {mounted && !isLocked && (
              <span className="flex items-center gap-1 text-[8px] md:text-[10px] text-primary font-bold uppercase tracking-widest animate-pulse">
                <Clock size={8} className="md:w-2.5 md:h-2.5" /> {timeToMatch}
              </span>
            )}
            {isFinished && userPrediction && (
              <span className={cn(
                "text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-1",
                userPrediction.pointsEarned > 0 ? "text-green-400 animate-bounce" : "text-slate-500"
              )}>
                {userPrediction.pointsEarned} PUNTOS OBTENIDOS
              </span>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 md:p-6 relative">
          {/* Resultado Real (Overlay si está finalizado) */}
          {isFinished && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="flex items-center gap-4 md:gap-8 bg-slate-950/40 backdrop-blur-[2px] p-4 rounded-3xl border border-white/5">
                <span className="text-4xl md:text-6xl font-heading text-white drop-shadow-lg">{match.homeGoals}</span>
                <span className="text-xl md:text-2xl font-heading text-primary/60">-</span>
                <span className="text-4xl md:text-6xl font-heading text-white drop-shadow-lg">{match.awayGoals}</span>
              </div>
            </div>
          )}

          <div className={cn("grid grid-cols-7 items-center gap-1 md:gap-2", isFinished ? "opacity-30 grayscale-[0.5]" : "")}>
            {/* Local */}
            <div className="col-span-3 flex flex-col items-center gap-2 md:gap-4">
              <div className="relative w-14 h-10 md:w-20 md:h-14 shadow-2xl rounded-sm overflow-hidden border border-white/10 group">
                <Image 
                  src={getFlagUrl(match.homeTeam.isoCode)} 
                  alt={match.homeTeam.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="font-heading text-sm md:text-xl text-center uppercase tracking-tight leading-none h-10 md:h-12 flex items-center px-1">
                {translateCountry(match.homeTeam.name)}
              </span>
              <Input
                type="number"
                min="0"
                disabled={isLocked}
                readOnly={isLocked}
                value={homeGoals}
                onChange={(e) => setHomeGoals(e.target.value)}
                className={`w-10 h-10 md:w-20 md:h-20 scoreboard-input text-xl md:text-4xl ${isLocked ? 'opacity-50 grayscale' : ''}`}
                placeholder="-"
              />
            </div>

            {/* VS */}
            <div className="col-span-1 flex flex-col items-center justify-center pt-12 md:pt-20">
              <div className="text-sm md:text-lg font-heading text-primary/40 italic">VS</div>
            </div>

            {/* Visitante */}
            <div className="col-span-3 flex flex-col items-center gap-2 md:gap-4">
              <div className="relative w-14 h-10 md:w-20 md:h-14 shadow-2xl rounded-sm overflow-hidden border border-white/10 group">
                <Image 
                  src={getFlagUrl(match.awayTeam.isoCode)} 
                  alt={match.awayTeam.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="font-heading text-sm md:text-xl text-center uppercase tracking-tight leading-none h-10 md:h-12 flex items-center px-1">
                {translateCountry(match.awayTeam.name)}
              </span>
              <Input
                type="number"
                min="0"
                disabled={isLocked}
                readOnly={isLocked}
                value={awayGoals}
                onChange={(e) => setAwayGoals(e.target.value)}
                className={`w-10 h-10 md:w-20 md:h-20 scoreboard-input text-xl md:text-4xl ${isLocked ? 'opacity-50 grayscale' : ''}`}
                placeholder="-"
              />
            </div>
          </div>
          
          {isFinished && (
            <div className="text-center mt-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tu Pronóstico</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-0 border-t border-white/5">
          {isFinished ? (
            <div className="w-full h-12 md:h-14 flex items-center justify-center bg-white/5">
               <span className="text-[10px] md:text-xs font-heading text-slate-400 tracking-[0.2em]">MISIÓN COMPLETADA</span>
            </div>
          ) : (
            <Button
              onClick={handleSave}
              disabled={isPending || homeGoals === "" || awayGoals === "" || isLocked}
              variant="ghost"
              className="w-full h-12 md:h-14 rounded-none font-heading text-[10px] md:text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-100 disabled:bg-white/5"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
              ) : isLocked ? (
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Lock size={12} /> BLOQUEADO
                </span>
              ) : (
                "CONFIRMAR"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
