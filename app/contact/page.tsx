"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import {
  Mail,
  MessageSquare,
  Send,
  Bug,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Clock,
  Copy,
  Check,
} from "lucide-react";

const CONTACT_EMAIL = "olivercott35@gmail.com";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = CONTACT_EMAIL;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

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
              <MessageSquare size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Get In Touch
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
              Contact PokeValue
            </h1>

            <p className="text-zinc-500 mt-3 max-w-3xl leading-7">
              Questions, feedback, bug reports, feature ideas, business
              enquiries, or anything else related to PokeValue.
            </p>
          </motion.header>

          <div className="grid xl:grid-cols-12 gap-8">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 24 }}
              className="xl:col-span-7 rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 md:p-10 backdrop-blur-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />

              <div className="relative">
                <div className="flex items-center gap-2 text-purple-400 mb-4">
                  <Send size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                    Direct Contact
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-5">
                  Reach the PokeValue team.
                </h2>

                <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-6">
                  For support, site feedback, bug reports, content questions, or
                  partnership enquiries, email PokeValue directly using the
                  address below.
                </p>

                <p className="text-zinc-500 leading-7 mb-8">
                  Please include as much detail as possible when reporting a
                  problem, such as the page you were using, what you expected to
                  happen, and what actually happened.
                </p>

                <button
                  type="button"
                  onClick={copyEmail}
                  className="group w-full text-left flex items-center gap-5 rounded-3xl border border-white/[0.06] bg-white/[0.035] p-5 backdrop-blur-xl hover:border-purple-500/25 hover:bg-white/[0.055] transition-all"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    {copied ? <Check size={24} /> : <Mail size={24} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.24em] mb-1">
                      Email Address
                    </p>

                    <p className="text-white font-black text-lg truncate group-hover:text-purple-300 transition-colors">
                      {CONTACT_EMAIL}
                    </p>

                    <p className="text-zinc-500 text-xs mt-1">
                      {copied ? "Copied to clipboard" : "Tap to copy email"}
                    </p>
                  </div>

                  <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-black/20 text-zinc-500 group-hover:text-purple-300 transition-colors">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </div>
                </button>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 130,
                damping: 24,
                delay: 0.08,
              }}
              className="xl:col-span-5 rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-2 text-purple-400 mb-6">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                  Support Topics
                </span>
              </div>

              <div className="space-y-4">
                <ContactTopic
                  icon={<Bug size={16} />}
                  title="Bug Reports"
                  desc="Report broken pages, incorrect data, display issues, or problems with collection tools."
                />

                <ContactTopic
                  icon={<Sparkles size={16} />}
                  title="Feature Ideas"
                  desc="Suggest tools, filters, guides, analytics, scanner features, or dashboard improvements."
                />

                <ContactTopic
                  icon={<Briefcase size={16} />}
                  title="Business Enquiries"
                  desc="Partnerships, collaborations, commercial questions, or brand opportunities."
                />

                <ContactTopic
                  icon={<ShieldCheck size={16} />}
                  title="Policy Questions"
                  desc="Questions about privacy, terms, data usage, price estimates, or site information."
                />
              </div>
            </motion.section>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 130,
              damping: 24,
              delay: 0.14,
            }}
            className="mt-8 grid md:grid-cols-3 gap-6"
          >
            <InfoPanel
              icon={<Clock size={16} />}
              label="Response Time"
              value="We aim to respond within 24–48 hours where possible."
            />

            <InfoPanel
              icon={<Mail size={16} />}
              label="Primary Contact"
              value="Email is currently the best way to contact PokeValue."
            />

            <InfoPanel
              icon={<MessageSquare size={16} />}
              label="Feedback"
              value="Collector feedback helps shape future PokeValue features."
            />
          </motion.section>
        </div>
      </div>
    </AppLayout>
  );
}

function ContactTopic({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-5 hover:border-purple-500/20 hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
          {icon}
        </div>

        <h3 className="font-black text-white">{title}</h3>
      </div>

      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function InfoPanel({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-5 backdrop-blur-xl hover:border-purple-500/20 transition-all">
      <div className="flex items-center gap-2 text-purple-400 mb-2">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.22em]">
          {label}
        </span>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">{value}</p>
    </div>
  );
}