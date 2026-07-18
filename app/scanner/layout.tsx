import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Scanner Preview | PokeValue",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function ScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
