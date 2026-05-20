import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import AdminMatchRow from "@/components/AdminMatchRow"
import { ShieldCheck, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const { userId } = await auth()

  // Protección de Ruta: Solo el Admin puede ver esta página
  if (!userId || userId !== process.env.ADMIN_USER_ID) {
    redirect("/dashboard")
  }

  const matches = await prisma.match.findMany({
    orderBy: { date: "asc" },
    include: {
      homeTeam: true,
      awayTeam: true,
    }
  })

  return (
    <div className="min-h-screen p-4 md:p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-4">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group w-fit"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Dashboard
          </Link>
          <div>
            <h1 className="text-4xl md:text-6xl font-heading tracking-tighter text-white flex items-center gap-4">
              TACTICAL <span className="text-primary italic">CORE</span>
              <ShieldCheck className="text-primary" size={32} />
            </h1>
            <p className="text-slate-400 font-sans font-bold uppercase tracking-[0.2em] text-[10px] md:text-sm mt-2">
              Gestión de Resultados | La Pizarra Admin
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <div className="hidden md:grid grid-cols-12 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
          <div className="col-span-3">Info</div>
          <div className="col-span-6 text-center">Enfrentamiento</div>
          <div className="col-span-3 text-right">Estado / Acción</div>
        </div>

        <div className="flex flex-col gap-3">
          {matches.map((match) => (
            <AdminMatchRow key={match.id} match={match} />
          ))}

          {matches.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="font-heading text-slate-500 uppercase tracking-widest">No hay partidos cargados en el sistema.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
