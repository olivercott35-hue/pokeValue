import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PokeValue",
  description:
    "Learn why PokeValue was built, how it helps Pokémon TCG collectors and how its card data and marketplace estimates are presented.",
  alternates: {
    canonical: "https://www.pokevalue.co.uk/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
