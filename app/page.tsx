import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <h1 className="text-6xl md:text-9xl font-heading tracking-tighter text-white drop-shadow-2xl mb-6">
        LA <span className="text-primary italic">PIZARRA</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-400 font-bold uppercase tracking-[0.2em] mb-8 max-w-2xl">
        Dominio Táctico | Predicciones Mundial 2026
      </p>
      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button size="lg" className="text-xl font-black px-8 py-6 shadow-neon hover:shadow-neon-hover">
            ENTRAR AL JUEGO
          </Button>
        </Link>
      </div>
    </div>
  );
}
