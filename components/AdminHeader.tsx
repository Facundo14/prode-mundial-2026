"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, ChevronLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  title: string
  subtitle: string
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleBack = () => {
    startTransition(() => {
      router.push("/dashboard")
    })
  }

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8 relative">
      {isPending && (
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-xl">
          <Loader2 className="text-primary animate-spin" size={32} />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button
          onClick={handleBack}
          disabled={isPending}
          className={cn(
            "flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group w-fit disabled:opacity-50",
            isPending && "cursor-wait"
          )}
        >
          <ChevronLeft size={16} className={cn("transition-transform", !isPending && "group-hover:-translate-x-1")} />
          {isPending ? "Redirigiendo..." : "Volver al Dashboard"}
        </button>
        <div>
          <h1 className="text-4xl md:text-6xl font-heading tracking-tighter text-white flex items-center gap-4">
            {title} <span className="text-primary italic">CORE</span>
            <ShieldCheck className="text-primary" size={32} />
          </h1>
          <p className="text-slate-400 font-sans font-bold uppercase tracking-[0.2em] text-[10px] md:text-sm mt-2">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  )
}
