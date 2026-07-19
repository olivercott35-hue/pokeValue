import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Bug, Mail, MessageSquareText, ShieldCheck } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import { GlassPanel, PageHero, PageShell, SectionHeading } from "@/components/ui/SitePage";

export const metadata: Metadata = {
  title: "Contact PokeValue",
  description:
    "Contact PokeValue about incorrect card data, pricing-source issues, editorial corrections, privacy or general feedback.",
  alternates: { canonical: "https://www.pokevalue.co.uk/contact" },
};

const email = "olivercott35@gmail.com";

export default function ContactPage() {
  return (
    <AppLayout>
      <PageShell width="content">
        <PageHero
          eyebrow="Contact"
          icon={<Mail className="h-4 w-4" />}
          title="Found a data issue or have useful collector feedback?"
          description={
            <p>
              Contact PokeValue for card-data corrections, price-source concerns,
              broken pages, privacy questions or suggestions that would make the
              archive more useful. Include enough detail to reproduce the issue.
            </p>
          }
        />

        <section className="mt-7 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <GlassPanel>
            <SectionHeading eyebrow="Direct email" title="Reach the site owner" />
            <a
              href={`mailto:${email}`}
              className="block rounded-[1.5rem] border border-violet-200/[0.12] bg-violet-300/[0.04] p-5 transition hover:border-violet-200/[0.22] hover:bg-violet-300/[0.065]"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200/75">Email</p>
              <p className="mt-3 break-all text-lg font-black text-white">{email}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-500">Open your email app with the address filled in.</p>
            </a>
            <p className="mt-5 text-xs leading-6 text-zinc-600">
              PokeValue does not buy collections, guarantee valuations or provide
              emergency support. Never send passwords, API keys or payment-card
              details by email.
            </p>
          </GlassPanel>

          <GlassPanel>
            <SectionHeading eyebrow="Useful reports" title="What to include" description="Clear reports are easier to investigate and correct." />
            <div className="grid gap-3 sm:grid-cols-3">
              <ContactType icon={<Bug className="h-5 w-5" />} title="Technical issue" text="URL, device, browser, what you expected and what happened." />
              <ContactType icon={<MessageSquareText className="h-5 w-5" />} title="Data correction" text="Card ID, set, number, incorrect field and a reliable supporting source." />
              <ContactType icon={<ShieldCheck className="h-5 w-5" />} title="Privacy request" text="The relevant browser, feature or data concern without sending sensitive credentials." />
            </div>
          </GlassPanel>
        </section>

        <GlassPanel className="mt-7">
          <h2 className="text-2xl font-black tracking-tight text-white">Editorial corrections</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-500">
            When reporting an article issue, identify the guide, quote the
            specific claim and include the strongest available primary or
            marketplace evidence. Material corrections should be reviewed under
            the published editorial policy.
          </p>
          <Link href="/editorial-policy" className="mt-5 inline-flex text-sm font-black text-violet-200/80 hover:text-white">
            Read the editorial policy →
          </Link>
        </GlassPanel>
      </PageShell>
    </AppLayout>
  );
}

function ContactType({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/[0.065] bg-white/[0.025] p-5">
      <div className="pv-icon-box">{icon}</div>
      <h3 className="mt-4 text-sm font-black text-white">{title}</h3>
      <p className="mt-2 text-xs leading-6 text-zinc-600">{text}</p>
    </div>
  );
}
