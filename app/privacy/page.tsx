import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import PolicyPage from "@/components/ui/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | PokeValue",
  description:
    "How PokeValue handles browser-stored collection data, analytics, advertising consent, logs and contact information.",
  alternates: { canonical: "https://www.pokevalue.co.uk/privacy" },
};

const sections = [
  {
    title: "Information PokeValue processes",
    paragraphs: [
      <p key="a">You can browse public card, set and guide pages without creating an account. Standard hosting and security systems may process technical information such as IP address, browser type, device type, requested URL, timestamps and error or performance logs.</p>,
      <p key="b">When you contact PokeValue by email, the message, sender address and any information you choose to include are processed so the enquiry can be answered and relevant records retained.</p>,
    ],
  },
  {
    title: "Collection and favourite data",
    paragraphs: [
      <p key="a">Collection, favourite and related portfolio information is currently stored in your browser using local storage unless a feature explicitly says otherwise. It is not a cloud account and does not automatically follow you to another device or browser.</p>,
      <p key="b">Clearing browser data, using private browsing or changing device may remove those records. Do not rely on the browser tools as the only permanent record of an important collection.</p>,
    ],
  },
  {
    title: "Analytics",
    paragraphs: [
      <p key="a">PokeValue may use privacy-conscious analytics and hosting telemetry to understand page usage, performance and errors. These services may process device and request information under their own terms and security controls.</p>,
      <p key="b">Analytics consent and storage behaviour may vary depending on your region and the choices made in the consent interface.</p>,
    ],
  },
  {
    title: "Advertising and consent",
    paragraphs: [
      <p key="a">PokeValue may use Google AdSense on eligible public-content pages. Google and its partners may use cookies or similar technologies for ad delivery, measurement, fraud prevention and personalisation where permitted.</p>,
      <p key="b">For visitors in the UK, European Economic Area and Switzerland, the site should use a Google-certified consent management platform. The consent message allows you to accept, refuse or manage relevant advertising choices. You can revisit choices through the consent interface where available.</p>,
    ],
  },
  {
    title: "Third-party card and infrastructure services",
    paragraphs: [
      <p key="a">The site relies on hosting, analytics and Pokémon card data providers. Card images and marketplace links may be served from third-party domains. Opening an external marketplace or provider means that provider’s own privacy policy applies.</p>,
      <p key="b">PokeValue does not sell personal information. The site is not designed to collect payment-card details, passwords for other services or sensitive identity documents.</p>,
    ],
  },
  {
    title: "Retention and security",
    paragraphs: [
      <p key="a">Contact records and technical logs are retained only as reasonably necessary for support, security, legal compliance and service improvement. Browser-stored collection information remains under your browser’s storage controls.</p>,
      <p key="b">Reasonable security measures are used, but no internet service can guarantee absolute security or uninterrupted availability.</p>,
    ],
  },
  {
    title: "Your choices and contact",
    paragraphs: [
      <p key="a">You can remove local collection data through the relevant PokeValue tool or your browser settings. You can also block or delete cookies, although some features or advertising preferences may stop working as expected.</p>,
      <p key="b">Privacy questions can be sent through the <Link key="contact" href="/contact" className="font-bold text-violet-200/85 hover:text-white">Contact page</Link> or to <a key="email" href="mailto:olivercott35@gmail.com" className="font-bold text-violet-200/85 hover:text-white">olivercott35@gmail.com</a>.</p>,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy & consent"
      title="Privacy policy"
      description={<p>What is stored in your browser, what service providers may process and how advertising consent is handled on PokeValue.</p>}
      icon={<ShieldCheck className="h-4 w-4" />}
      updated="18 July 2026"
      sections={sections}
    />
  );
}
