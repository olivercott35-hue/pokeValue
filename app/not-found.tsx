import type { ReactNode } from "react";
import Link from "next/link";
import { Boxes, Home, SearchX, Sparkles } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import { GlassPanel, PageShell } from "@/components/ui/SitePage";

export default function NotFound() {
  return (
    <AppLayout>
      <PageShell width="article" className="flex min-h-[70vh] items-center">
        <GlassPanel className="w-full text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-violet-200/[0.14] bg-violet-300/[0.05] text-violet-200/80">
            <SearchX className="h-9 w-9" />
          </div>
          <p className="mt-7 text-[10px] font-black uppercase tracking-[0.28em] text-violet-200/70">Error 404</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">This record is not in the archive.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-500">
            The page may have moved, the link may be old or the card identifier may be incorrect. Continue through one of the verified archive routes below.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <NotFoundLink href="/" icon={<Home className="h-5 w-5" />} title="Home" text="Return to the collector dashboard." />
            <NotFoundLink href="/cards" icon={<Sparkles className="h-5 w-5" />} title="Cards" text="Search the complete card archive." />
            <NotFoundLink href="/sets" icon={<Boxes className="h-5 w-5" />} title="Sets" text="Browse set checklists by era." />
          </div>
        </GlassPanel>
      </PageShell>
    </AppLayout>
  );
}

function NotFoundLink({ href, icon, title, text }: { href: string; icon: ReactNode; title: string; text: string }) {
  return (
    <Link href={href} className="group rounded-[1.4rem] border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:-translate-y-1 hover:border-violet-200/[0.17] hover:bg-white/[0.045]">
      <div className="pv-icon-box">{icon}</div>
      <p className="mt-4 font-black text-white">{title}</p>
      <p className="mt-2 text-xs leading-6 text-zinc-600">{text}</p>
    </Link>
  );
}
