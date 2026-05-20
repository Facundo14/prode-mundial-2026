import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen p-4 md:p-10 space-y-10">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-20 w-3/4 bg-white/5" />
        <Skeleton className="h-6 w-1/4 bg-white/5" />
      </header>

      <div className="space-y-8">
        <div className="flex gap-1 mb-8">
          <Skeleton className="h-10 w-32 bg-white/5" />
          <Skeleton className="h-10 w-32 bg-white/5" />
        </div>

        {/* Carrusel de fechas skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="min-w-[110px] h-20 rounded-xl bg-white/5" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-xl h-[400px] p-6 space-y-6">
              <Skeleton className="h-4 w-1/2 mx-auto bg-white/10" />
              <div className="flex justify-between items-center pt-4">
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="w-16 h-12 bg-white/10" />
                  <Skeleton className="h-4 w-16 bg-white/10" />
                  <Skeleton className="w-16 h-16 bg-white/10" />
                </div>
                <Skeleton className="h-8 w-8 bg-white/10" />
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="w-16 h-12 bg-white/10" />
                  <Skeleton className="h-4 w-16 bg-white/10" />
                  <Skeleton className="w-16 h-16 bg-white/10" />
                </div>
              </div>
              <Skeleton className="h-12 w-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
