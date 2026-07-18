import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PokeValue",
  description:
    "Learn how PokeValue handles local collection data, analytics, advertising consent, cookies and enquiries.",
  alternates: {
    canonical: "https://www.pokevalue.co.uk/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
