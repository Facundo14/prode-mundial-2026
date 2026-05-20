import { Skeleton } from "@/components/ui/skeleton"

export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen p-4 md:p-10 space-y-10">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-20 w-3/4 bg-white/5" />
        <Skeleton className="h-6 w-1/4 bg-white/5" />
      </header>

      <div className="space-y-6">
        {/* Podium Skeleton */}
        <div className="flex items-end justify-center gap-4 mb-12 pt-8">
          <Skeleton className="w-32 h-32 rounded-full bg-white/5" />
          <Skeleton className="w-32 h-44 rounded-full bg-white/5" />
          <Skeleton className="w-32 h-24 rounded-full bg-white/5" />
        </div>

        {/* List Skeleton */}
        <div className="glass rounded-3xl overflow-hidden border-none">
          <div className="h-12 w-full bg-white/5 mb-1" />
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="grid grid-cols-12 items-center gap-4 px-6 py-4 border-b border-white/5">
              <Skeleton className="col-span-1 h-6 w-4 bg-white/5" />
              <div className="col-span-8 flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full bg-white/5" />
                <Skeleton className="h-6 w-32 bg-white/5" />
              </div>
              <Skeleton className="col-span-3 h-8 w-12 ml-auto bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
