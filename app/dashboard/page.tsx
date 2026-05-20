import PredictionCard from "@/components/PredictionCard"
import prisma from "@/lib/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { auth } from "@clerk/nextjs/server"
import { calculateGroupStandings } from "@/utils/standings"
import { Info } from "lucide-react"
import DateCarousel from "@/components/DateCarousel"
import { translateCountry } from "@/utils/i18n"
import { cn } from "@/lib/utils"

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; tab?: string }>
}) {
  const { userId } = await auth();
  const { date: selectedDate, tab: activeTab = "predictions" } = await searchParams;

  // Ejecutamos las consultas pesadas en paralelo para ahorrar tiempo
  const [allMatchesForDates, teams] = await Promise.all([
    prisma.match.findMany({
      select: { date: true },
      orderBy: { date: "asc" },
    }),
    prisma.team.findMany()
  ]);

  const uniqueDates = Array.from(
    new Set(allMatchesForDates.map((m) => m.date.toISOString().split("T")[0]))
  );

  // Fecha por defecto: la primera disponible si no hay seleccionada
  const dateToFilter = selectedDate || uniqueDates[0];

  // Consulta específica para el contenido de la pestaña activa
  const [filteredMatches, allMatchesForStandings] = await Promise.all([
    prisma.match.findMany({
      where: dateToFilter ? {
        date: {
          gte: new Date(`${dateToFilter}T00:00:00Z`),
          lte: new Date(`${dateToFilter}T23:59:59Z`),
        }
      } : {},
      orderBy: { date: "asc" },
      include: {
        homeTeam: true,
        awayTeam: true,
        predictions: userId ? {
          where: {
            user: {
              clerkId: userId
            }
          }
        } : undefined
      }
    }),
    activeTab === "groups" 
      ? prisma.match.findMany({
          include: { homeTeam: true, awayTeam: true },
        })
      : Promise.resolve([]) // Solo cargamos esto si estamos en la pestaña de grupos
  ]);

  return (
    <div className="min-h-screen p-4 md:p-10 space-y-6 md:space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-8xl font-heading tracking-tighter text-white drop-shadow-2xl">
            CENTRO DE <span className="text-primary">MANDO</span>
          </h1>
          <p className="text-slate-400 font-sans font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm ml-1">
            World Cup 2026 Operations | La Pizarra
          </p>
        </div>

        {/* Sistema de Puntuación Quick View */}
        <Card className="glass border-primary/20 bg-primary/5 md:max-w-xs w-full">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sistema de Puntos</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Exacto</span>
                <span className="text-xs font-heading text-primary">5 PTS</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Diferencia</span>
                <span className="text-xs font-heading text-primary">3 PTS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Tendencia</span>
                <span className="text-xs font-heading text-primary">1 PT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Empate</span>
                <span className="text-xs font-heading text-primary">3 PTS</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </header>

      <Tabs key={activeTab} defaultValue={activeTab} className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 mb-6 md:mb-8 flex overflow-x-auto no-scrollbar justify-start md:justify-center">
          <TabsTrigger value="predictions" className="flex-1 md:flex-none font-heading tracking-widest px-4 md:px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-base">
            PRONÓSTICOS
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex-1 md:flex-none font-heading tracking-widest px-4 md:px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-base">
            FASE DE GRUPOS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6 md:space-y-8">
          {/* Carrusel de Fechas - Ahora es un Client Component con Feedback */}
          <DateCarousel uniqueDates={uniqueDates} dateToFilter={dateToFilter} />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredMatches.map((match, index) => (
              <PredictionCard 
                key={match.id} 
                match={match} 
                index={index}
              />
            ))}
            
            {filteredMatches.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-2xl font-heading uppercase text-slate-500">No hay misiones disponibles para esta fecha.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="groups">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {GROUPS.map((groupLetter) => {
              const groupTeams = teams.filter(t => t.group === groupLetter);
              const groupStandings = calculateGroupStandings(groupTeams, allMatchesForStandings as any);

              return (
                <Card key={groupLetter} className="glass overflow-hidden border-none">
                  <CardHeader className="bg-white/5 py-3">
                    <CardTitle className="font-heading text-xl tracking-wider">GRUPO {groupLetter}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-black/20">
                        <TableRow className="hover:bg-transparent border-white/5">
                          <TableHead className="w-[50%] text-xs font-bold text-slate-500 uppercase">Equipo</TableHead>
                          <TableHead className="text-center text-xs font-bold text-slate-500 uppercase">PJ</TableHead>
                          <TableHead className="text-center text-xs font-bold text-slate-500 uppercase">DG</TableHead>
                          <TableHead className="text-right text-xs font-bold text-slate-500 uppercase pr-4">PTS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupStandings.map((standing) => (
                          <TableRow key={standing.team.id} className="hover:bg-white/5 border-white/5">
                            <TableCell className="font-heading text-sm py-3 flex items-center gap-3">
                              <div className="relative w-6 h-4 rounded-sm overflow-hidden border border-white/10">
                                <Image 
                                    src={`https://flagcdn.com/w80/${standing.team.isoCode.toLowerCase()}.png`}
                                    alt={standing.team.name}
                                    fill
                                    className="object-cover"
                                  />
                              </div>
                              <span className="truncate max-w-[100px]">{translateCountry(standing.team.name)}</span>
                            </TableCell>
                            <TableCell className="text-center font-sans text-xs">{standing.played}</TableCell>
                            <TableCell className={cn(
                              "text-center font-sans text-xs",
                              standing.goalDifference > 0 ? "text-green-400" : standing.goalDifference < 0 ? "text-red-400" : ""
                            )}>
                              {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                            </TableCell>
                            <TableCell className="text-right font-heading text-primary pr-4">{standing.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
