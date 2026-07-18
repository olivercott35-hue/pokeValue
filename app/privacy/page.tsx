"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import {
  ShieldAlert,
  Cookie,
  Database,
  Eye,
  Mail,
  LockKeyhole,
  Scale,
  Sparkles,
  UserCheck,
  Globe,
} from "lucide-react";

const CONTACT_EMAIL = "olivercott35@gmail.com";

export default function PrivacyPage() {
  return (
    <AppLayout>
      <div className="relative w-full px-6 md:px-10 py-10 overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-24 h-96 w-96 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-20 left-16 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[150px]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            className="mb-10 border-b border-white/[0.05] pb-8"
          >
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <ShieldAlert size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Legal Disclosure
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>

            <p className="text-zinc-500 mt-3 max-w-3xl leading-7">
              This Privacy Policy explains how PokeValue handles local
              collection data, cookies, analytics, advertising, and user
              enquiries.
            </p>

            <p className="text-zinc-600 mt-3 text-sm">
              Last updated: 18 July 2026
            </p>
          </motion.header>

          <div className="grid xl:grid-cols-12 gap-8">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 24 }}
              className="xl:col-span-8 rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 md:p-10 backdrop-blur-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />

              <div className="relative space-y-8 text-zinc-400 leading-relaxed">
                <PolicySection title="Overview" icon={<Sparkles size={16} />}>
                  PokeValue respects your privacy. This policy explains what
                  information may be collected when you use the website, how that
                  information may be used, and what choices you have. PokeValue
                  is designed as a Pokémon TCG research, collection tracking,
                  and card value platform.
                </PolicySection>

                <PolicySection title="Information You Provide" icon={<UserCheck size={16} />}>
                  If you contact PokeValue by email, we may receive your email
                  address and any information you choose to include in your
                  message. This information is used only to respond to your
                  enquiry, investigate issues, improve the website, or handle
                  relevant support and business communication.
                </PolicySection>

                <PolicySection title="Local Collection Data" icon={<Database size={16} />}>
                  Cards saved to your collection or favourites are currently
                  stored in your browser using local storage. This means your
                  saved card data is stored on your own device/browser and may
                  not automatically transfer to another browser, device, or
                  cleared session. PokeValue does not currently require a user
                  account to use these local collection features.
                </PolicySection>

                <PolicySection title="Cookies And Advertising" icon={<Cookie size={16} />}>
                  PokeValue may use cookies and similar technologies. When Google
                  advertising is enabled for visitors in the UK or European
                  Economic Area, a Google-certified consent message is used to
                  request and record advertising choices. Google AdSense may use
                  cookies or similar identifiers to display, personalise, and
                  measure advertisements according to the choice you make.
                </PolicySection>

                <PolicySection title="Analytics" icon={<Eye size={16} />}>
                  PokeValue may use analytics tools to understand general site
                  usage, performance, page visits, errors, device types, and
                  traffic sources. This helps improve speed, usability, content,
                  and features. Analytics data is generally used in aggregated or
                  non-personally identifying form.
                </PolicySection>

                <PolicySection title="Third-Party Services" icon={<Globe size={16} />}>
                  PokeValue may use third-party services for analytics,
                  advertising, hosting, fonts, APIs, and performance monitoring.
                  These services may process data according to their own privacy
                  policies. PokeValue may also use Pokémon TCG market and card
                  data sources to display card information and estimated prices.
                </PolicySection>

                <PolicySection title="Your Choices" icon={<LockKeyhole size={16} />}>
                  You can use the consent message to accept, reject, or manage
                  advertising choices where it is displayed. You can also manage
                  cookies through your browser settings and clear browser storage
                  to remove locally saved collection and favourite data from your
                  current device.
                </PolicySection>

                <PolicySection title="Children's Privacy" icon={<ShieldAlert size={16} />}>
                  PokeValue is intended for general audiences interested in
                  Pokémon card collecting and research. The website is not
                  designed to knowingly collect personal information from
                  children. If you believe personal information has been provided
                  by a child, please contact us so it can be reviewed.
                </PolicySection>

                <PolicySection title="Policy Updates" icon={<Scale size={16} />}>
                  This Privacy Policy may be updated from time to time as
                  PokeValue develops, new features are added, advertising or
                  analytics tools change, or legal requirements evolve. Any
                  updates will be posted on this page.
                </PolicySection>
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 130,
                damping: 24,
                delay: 0.08,
              }}
              className="xl:col-span-4 space-y-6"
            >
              <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-2xl">
                <div className="flex items-center gap-2 text-purple-400 mb-6">
                  <ShieldAlert size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                    Privacy Summary
                  </span>
                </div>

                <div className="space-y-4">
                  <SummaryItem
                    label="Collection Data"
                    value="Stored locally in your browser"
                  />

                  <SummaryItem
                    label="Advertising"
                    value="May use Google AdSense cookies"
                  />

                  <SummaryItem
                    label="Analytics"
                    value="May track general site usage"
                  />

                  <SummaryItem
                    label="Control"
                    value="Manage cookies and storage in your browser"
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-2xl">
                <div className="flex items-center gap-2 text-purple-400 mb-4">
                  <Mail size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                    Privacy Enquiries
                  </span>
                </div>

                <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                  Questions about this Privacy Policy can be sent directly by
                  email.
                </p>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 hover:border-purple-500/25 hover:bg-white/[0.045] transition-all"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] text-purple-400 font-black uppercase tracking-[0.22em]">
                      Email
                    </p>

                    <p className="text-white font-black truncate group-hover:text-purple-300 transition-colors">
                      {CONTACT_EMAIL}
                    </p>
                  </div>
                </a>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function PolicySection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/[0.05] bg-white/[0.025] p-6">
      <div className="flex items-center gap-2 text-purple-400 mb-3">
        {icon}
        <h2 className="text-[10px] font-black uppercase tracking-[0.24em]">
          {title}
        </h2>
      </div>

      <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
        {children}
      </p>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-4">
      <p className="text-[9px] text-purple-400 font-black uppercase tracking-[0.22em] mb-2">
        {label}
      </p>

      <p className="text-sm text-zinc-400 leading-relaxed">{value}</p>
    </div>
  );
}