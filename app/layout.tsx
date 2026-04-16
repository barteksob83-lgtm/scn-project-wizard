import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCN Group | Rozpocznij projekt",
  description: "Premium wizard dla procesu inwestycji domu od działki po realizację.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
