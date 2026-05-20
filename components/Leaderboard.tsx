"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Trophy, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardUser {
  id: string
  clerkId: string
  name: string | null
  points: number
  avatar?: string
}

interface LeaderboardProps {
  users: LeaderboardUser[]
  currentUserId: string | null
}

export default function Leaderboard({ users, currentUserId }: LeaderboardProps) {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-end justify-center gap-2 md:gap-4 mb-8 md:mb-12 pt-4 md:pt-8 overflow-x-hidden px-2">
        {/* Podio - Plata */}
        {users[1] && (
          <PodiumItem 
            user={users[1]} 
            position={2} 
            color="text-slate-300" 
            height="h-24 md:h-32" 
            delay={0.2}
          />
        )}
        
        {/* Podio - Oro */}
        {users[0] && (
          <PodiumItem 
            user={users[0]} 
            position={1} 
            color="text-yellow-400" 
            height="h-32 md:h-44" 
            delay={0}
          />
        )}

        {/* Podio - Bronce */}
        {users[2] && (
          <PodiumItem 
            user={users[2]} 
            position={3} 
            color="text-amber-600" 
            height="h-20 md:h-24" 
            delay={0.4}
          />
        )}
      </div>

      <div className="glass rounded-2xl md:rounded-3xl overflow-hidden border-none mx-2 md:mx-0">
        <div className="grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 bg-white/5 text-[10px] md:text-xs font-heading tracking-widest text-slate-500 uppercase">
          <div className="col-span-2 md:col-span-1 text-center">#</div>
          <div className="col-span-7 md:col-span-8">Jugador</div>
          <div className="col-span-3 text-right">Pts</div>
        </div>

        <motion.ul layout className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {users.map((user, index) => {
              const isCurrentUser = user.clerkId === currentUserId;
              
              return (
                <motion.li
                  key={user.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={cn(
                    "grid grid-cols-12 items-center gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 transition-colors",
                    isCurrentUser ? "bg-primary/20 border-l-4 border-primary" : "hover:bg-white/5"
                  )}
                >
                  <div className="col-span-2 md:col-span-1 text-center font-heading text-base md:text-lg text-slate-400">
                    {index + 1}
                  </div>
                  
                  <div className="col-span-7 md:col-span-8 flex items-center gap-2 md:gap-3 overflow-hidden">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden relative flex-shrink-0">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.name || ""} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-heading text-primary text-xs md:text-base">
                          {user.name?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    <span className={cn(
                      "font-heading tracking-tight truncate",
                      isCurrentUser ? "text-white text-sm md:text-lg" : "text-slate-300 text-xs md:text-base"
                    )}>
                      {user.name || "Anon Player"}
                      {isCurrentUser && <span className="ml-1 md:ml-2 text-[8px] md:text-[10px] bg-primary/30 text-primary px-1.5 md:px-2 py-0.5 rounded-full uppercase tracking-widest inline-block">Tú</span>}
                    </span>
                  </div>

                  <div className="col-span-3 text-right font-heading text-lg md:text-xl text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]">
                    {user.points}
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
    </div>
  )
}

function PodiumItem({ user, position, color, height, delay }: { 
  user: LeaderboardUser, 
  position: number, 
  color: string, 
  height: string,
  delay: number
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      className="flex flex-col items-center gap-2 md:gap-3 w-20 md:w-32"
    >
      <div className="relative group">
        <div className={cn(
          "w-12 h-12 md:w-20 md:h-20 rounded-full border-2 md:border-4 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-110",
          position === 1 ? "border-yellow-400 shadow-yellow-400/20" : 
          position === 2 ? "border-slate-300 shadow-slate-300/20" : 
          "border-amber-600 shadow-amber-600/20"
        )}>
          {user.avatar ? (
            <Image src={user.avatar} alt={user.name || ""} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-lg md:text-2xl font-heading text-primary">
              {user.name?.[0] || "?"}
            </div>
          )}
        </div>
        <div className={cn(
          "absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-lg",
          position === 1 ? "bg-yellow-400" : position === 2 ? "bg-slate-300" : "bg-amber-600"
        )}>
          {position === 1 ? <Trophy size={12} className="text-slate-950 md:w-4 md:h-4" /> : <Medal size={12} className="text-slate-950 md:w-4 md:h-4" />}
        </div>
      </div>
      
      <div className="text-center px-1">
        <p className="font-heading text-[9px] md:text-sm text-white truncate w-16 md:w-28 uppercase tracking-tighter leading-tight">
          {user.name || "Anon"}
        </p>
        <p className={cn("font-heading text-base md:text-2xl", color)}>
          {user.points}
        </p>
      </div>

      <div className={cn(
        "w-full glass rounded-t-lg md:rounded-t-xl mt-1 md:mt-2 flex items-start justify-center pt-1 md:pt-2",
        height
      )}>
        <span className="font-heading text-2xl md:text-4xl text-white/10">{position}</span>
      </div>
    </motion.div>
  )
}
