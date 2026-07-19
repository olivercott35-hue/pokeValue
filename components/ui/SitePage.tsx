import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function PageShell({
  children,
  className,
  width = "wide",
}: {
  children: ReactNode;
  className?: string;
  width?: "wide" | "content" | "article";
}) {
  const widthClass =
    width === "article"
      ? "max-w-5xl"
      : width === "content"
        ? "max-w-7xl"
        : "max-w-[1540px]";

  return (
    <div className={classes("pv-page", className)}>
      <div className={classes("relative mx-auto w-full", widthClass)}>
        {children}
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  icon,
  actions,
  aside,
  compact = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={classes("pv-hero pv-shine", compact && "pv-hero-compact")}>
      <div className="pv-hero-glow" aria-hidden="true" />
      <div
        className={classes(
          "relative grid gap-8",
          aside ? "lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end" : ""
        )}
      >
        <div>
          <div className="pv-kicker">
            {icon ? <span className="text-violet-200/90">{icon}</span> : null}
            <span>{eyebrow}</span>
          </div>

          <h1 className={classes("pv-title", compact && "pv-title-compact")}>
            {title}
          </h1>

          <div className="pv-lead">{description}</div>

          {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}

export function PrimaryLink({
  href,
  children,
  arrow = false,
}: {
  href: string;
  children: ReactNode;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className="pv-button pv-button-primary">
      {children}
      {arrow ? <ArrowRight className="h-4 w-4" /> : null}
    </Link>
  );
}

export function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="pv-button pv-button-secondary">
      {children}
    </Link>
  );
}

export function GlassPanel({
  children,
  className,
  as: Component = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div";
}) {
  return (
    <Component className={classes("pv-panel", className)}>{children}</Component>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="pv-section-kicker">{eyebrow}</p> : null}
        <h2 className="pv-section-title">{title}</h2>
        {description ? <div className="pv-section-copy">{description}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="pv-metric">
      <div className="flex items-center justify-between gap-3">
        <p className="pv-metric-label">{label}</p>
        {icon ? <span className="text-violet-200/75">{icon}</span> : null}
      </div>
      <p className="pv-metric-value">{value}</p>
      {detail ? <p className="pv-metric-detail">{detail}</p> : null}
    </div>
  );
}

export function FeatureCard({
  title,
  description,
  icon,
  href,
  linkLabel = "Explore",
}: {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  const content = (
    <>
      <div className="pv-icon-box">{icon}</div>
      <h3 className="mt-5 text-xl font-black tracking-[-0.025em] text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-zinc-500">{description}</p>
      {href ? (
        <p className="mt-5 inline-flex items-center gap-2 text-sm font-black text-violet-200/85">
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </p>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="pv-feature-card group">
        {content}
      </Link>
    );
  }

  return <div className="pv-feature-card">{content}</div>;
}

export function CheckList({ items }: { items: ReactNode[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3 text-sm leading-7 text-zinc-400">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-violet-300/80" />
          <div>{item}</div>
        </div>
      ))}
    </div>
  );
}

export function ProseCard({ children }: { children: ReactNode }) {
  return <article className="pv-panel pv-prose">{children}</article>;
}

export function Notice({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-violet-300/[0.11] bg-violet-300/[0.035] p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200/80">
        {title}
      </p>
      <div className="mt-2 text-sm leading-7 text-zinc-500">{children}</div>
    </div>
  );
}
