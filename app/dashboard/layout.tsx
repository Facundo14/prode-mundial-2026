import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, User, Trophy, Table as TableIcon, Shield, Loader2 } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const isAdmin = userId && userId === process.env.ADMIN_USER_ID;

  return (
    <div className="flex min-h-screen bg-slate-950 flex-col md:flex-row text-slate-200">
      <DashboardSidebar isAdmin={!!isAdmin} />
      <DashboardBottomNav isAdmin={!!isAdmin} />

      {/* Contenido Principal - Ajuste de padding según dispositivo */}
      <main className="flex-1 pb-20 md:pb-0 md:pl-64 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

function DashboardSidebar({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleNav = (href: string) => {
    if (pathname === href) return;
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl z-50 transition-all hidden md:flex flex-col justify-between p-4">
      {isPending && (
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-[60] flex items-center justify-center rounded-xl">
          <Loader2 className="text-primary animate-spin" size={24} />
        </div>
      )}
      <div className="space-y-8">
        <div className="flex items-center px-2">
          <span className="text-2xl font-heading text-primary tracking-tighter">
            LA<span className="text-white">PIZARRA</span>
          </span>
        </div>

        <nav className="space-y-2">
          <NavLink 
            onClick={() => handleNav("/dashboard")} 
            active={pathname === "/dashboard"}
            icon={<LayoutDashboard size={24} />} 
            label="Inicio" 
          />
          <NavLink 
            onClick={() => handleNav("/dashboard/leaderboard")} 
            active={pathname === "/dashboard/leaderboard"}
            icon={<Trophy size={24} />} 
            label="Ranking" 
          />
          <NavLink 
            onClick={() => handleNav("/dashboard/profile")} 
            active={pathname === "/dashboard/profile"}
            icon={<User size={24} />} 
            label="Mi Perfil" 
          />
          <NavLink 
            onClick={() => handleNav("/dashboard?tab=groups")} 
            active={pathname.includes("tab=groups")}
            icon={<TableIcon size={24} />} 
            label="Grupos" 
          />
          {isAdmin && (
            <NavLink 
              onClick={() => handleNav("/admin")} 
              active={pathname === "/admin"}
              icon={<Shield size={24} className="text-primary animate-pulse" />} 
              label="Admin Panel" 
            />
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4 px-2 pb-4 border-t border-white/5 pt-6">
        <UserButton />
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">Cuenta</p>
          <p className="text-[10px] text-slate-500 uppercase font-black">
            {isAdmin ? "Admin Root" : "Pro Player"}
          </p>
        </div>
      </div>
    </aside>
  );
}

function DashboardBottomNav({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleNav = (href: string) => {
    if (pathname === href) return;
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 z-50 flex md:hidden items-center justify-around px-2">
      {isPending && (
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-[60] flex items-center justify-center">
          <Loader2 className="text-primary animate-spin" size={20} />
        </div>
      )}
      <MobileNavLink onClick={() => handleNav("/dashboard")} active={pathname === "/dashboard"} icon={<LayoutDashboard size={20} />} label="Inicio" />
      <MobileNavLink onClick={() => handleNav("/dashboard/leaderboard")} active={pathname === "/dashboard/leaderboard"} icon={<Trophy size={20} />} label="Ranking" />
      {isAdmin && (
        <MobileNavLink 
          onClick={() => handleNav("/admin")} 
          active={pathname === "/admin"}
          icon={<Shield size={20} className="text-primary" />} 
          label="Admin" 
        />
      )}
      <MobileNavLink onClick={() => handleNav("/dashboard?tab=groups")} active={pathname.includes("tab=groups")} icon={<TableIcon size={20} />} label="Grupos" />
      <MobileNavLink onClick={() => handleNav("/dashboard/profile")} active={pathname === "/dashboard/profile"} icon={<User size={20} />} label="Perfil" />
      <div className="flex items-center justify-center w-12">
        <UserButton />
      </div>
    </nav>
  );
}

function NavLink({ onClick, icon, label, active }: { onClick: () => void; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group w-full text-left",
        active ? "text-white bg-white/5" : "text-slate-400 hover:text-white"
      )}
    >
      <div className={cn("transition-colors", active ? "text-primary" : "text-slate-400 group-hover:text-primary")}>
        {icon}
      </div>
      <span className="font-heading text-sm tracking-widest uppercase">
        {label}
      </span>
    </button>
  );
}

function MobileNavLink({ onClick, icon, label, active }: { onClick: () => void; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 transition-all active:scale-90",
        active ? "text-primary" : "text-slate-400 hover:text-primary"
      )}
    >
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-tighter">
        {label}
      </span>
    </button>
  );
}
