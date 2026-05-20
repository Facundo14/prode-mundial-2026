import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, User, Trophy, Table as TableIcon, Shield } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const isAdmin = userId && userId === process.env.ADMIN_USER_ID;

  return (
    <div className="flex min-h-screen bg-slate-950 flex-col md:flex-row text-slate-200">
      {/* Sidebar Lateral - Solo Desktop (md+) */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl z-50 transition-all hidden md:flex flex-col justify-between p-4">
        <div className="space-y-8">
          <div className="flex items-center px-2">
            <span className="text-2xl font-heading text-primary tracking-tighter">
              LA<span className="text-white">PIZARRA</span>
            </span>
          </div>

          <nav className="space-y-2">
            <NavLink href="/dashboard" icon={<LayoutDashboard size={24} />} label="Inicio" />
            <NavLink href="/dashboard/leaderboard" icon={<Trophy size={24} />} label="Ranking" />
            <NavLink href="/dashboard/profile" icon={<User size={24} />} label="Mi Perfil" />
            <NavLink href="/dashboard?tab=groups" icon={<TableIcon size={24} />} label="Grupos" />
            {isAdmin && (
              <NavLink 
                href="/admin" 
                icon={<Shield size={24} className="text-primary animate-pulse" />} 
                label="Admin Panel" 
              />
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4 px-2 pb-4 border-t border-white/5 pt-6">
          <UserButton afterSignOutUrl="/" />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Cuenta</p>
            <p className="text-[10px] text-slate-500 uppercase font-black">
              {isAdmin ? "Admin Root" : "Pro Player"}
            </p>
          </div>
        </div>
      </aside>

      {/* Bottom Navigation Bar - Solo Móvil (hasta md) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 z-50 flex md:hidden items-center justify-around px-2">
        <MobileNavLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Inicio" />
        <MobileNavLink href="/dashboard/leaderboard" icon={<Trophy size={20} />} label="Ranking" />
        {isAdmin && (
          <MobileNavLink 
            href="/admin" 
            icon={<Shield size={20} className="text-primary" />} 
            label="Admin" 
          />
        )}
        <MobileNavLink href="/dashboard?tab=groups" icon={<TableIcon size={20} />} label="Grupos" />
        <MobileNavLink href="/dashboard/profile" icon={<User size={20} />} label="Perfil" />
        <div className="flex items-center justify-center w-12">
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* Contenido Principal - Ajuste de padding según dispositivo */}
      <main className="flex-1 pb-20 md:pb-0 md:pl-64 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group"
    >
      <div className="text-slate-400 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="font-heading text-sm tracking-widest uppercase">
        {label}
      </span>
    </Link>
  );
}

function MobileNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-all active:scale-90"
    >
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-tighter">
        {label}
      </span>
    </Link>
  );
}
