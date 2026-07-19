import type { ReactNode } from "react";

import AppLayout from "@/components/layout/AppLayout";
import { GlassPanel, PageHero, PageShell } from "@/components/ui/SitePage";

export type ContentSection = {
  title: string;
  paragraphs: ReactNode[];
};

export default function PolicyPage({
  eyebrow,
  title,
  description,
  icon,
  updated,
  sections,
  width = "article",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  updated?: string;
  sections: ContentSection[];
  width?: "article" | "content";
  children?: ReactNode;
}) {
  return (
    <AppLayout>
      <PageShell width={width}>
        <PageHero
          compact
          eyebrow={eyebrow}
          title={title}
          description={description}
          icon={icon}
          actions={
            updated ? (
              <p className="text-xs font-bold text-zinc-600">Last updated: {updated}</p>
            ) : undefined
          }
        />

        <div className="mt-7 space-y-5">
          {sections.map((section, index) => (
            <GlassPanel key={section.title} as="section">
              <div className="grid gap-5 sm:grid-cols-[52px_1fr]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/[0.11] bg-violet-300/[0.04] text-[11px] font-black text-violet-200/75">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.035em] text-white">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-8 text-zinc-400">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <div key={paragraphIndex}>{paragraph}</div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>

        {children ? <div className="mt-7">{children}</div> : null}
      </PageShell>
    </AppLayout>
  );
}
