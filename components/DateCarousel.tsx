"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface DateCarouselProps {
  uniqueDates: string[]
  dateToFilter: string
}

export default function DateCarousel({ uniqueDates, dateToFilter }: DateCarouselProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
//   const [pendingDate, setPendingDate] = [null, () => {}] // Mock for now, let's fix this logic

  const handleDateClick = (dateStr: string) => {
    if (dateStr === dateToFilter) return

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("date", dateStr)
      router.push(`/dashboard?${params.toString()}`)
    })
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar relative">
      {isPending && (
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
           <Loader2 className="text-primary animate-spin" size={24} />
        </div>
      )}
      
      {uniqueDates.map((dateStr) => {
        const isActive = dateStr === dateToFilter
        const dateObj = new Date(dateStr + "T12:00:00Z")
        
        return (
          <button
            key={dateStr}
            onClick={() => handleDateClick(dateStr)}
            disabled={isPending}
            className={cn(
              "flex flex-col items-center min-w-[90px] md:min-w-[110px] p-2 md:p-3 rounded-xl border transition-all duration-300",
              isActive 
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20",
              isPending && !isActive && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60">
              {dateObj.toLocaleDateString('es-AR', { weekday: 'short' })}
            </span>
            <span className="font-heading text-lg md:text-xl whitespace-nowrap">
              {dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }).toUpperCase().replace('.', '')}
            </span>
          </button>
        )
      })}
    </div>
  )
}
