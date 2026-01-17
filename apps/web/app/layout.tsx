import "./globals.css";
import { Fraunces, Space_Grotesk } from "next/font/google";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif" });

export const metadata = {
  title: "AI Pet",
  description: "Tiny deterministic pet companion"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
