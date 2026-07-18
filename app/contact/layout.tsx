import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact PokeValue",
  description:
    "Contact PokeValue to report incorrect card data, broken pages, privacy questions, feedback or business enquiries.",
  alternates: {
    canonical: "https://www.pokevalue.co.uk/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
