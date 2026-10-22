import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });
const nastaliq = Noto_Nastaliq_Urdu({ variable: "--font-nastaliq", subsets: ["arabic"], weight: ["400", "700"], preload: false, display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Azad Government of the State of Jammu & Kashmir | Official Portal",
    template: "%s | Government of AJK",
  },
  description:
    "Official portal of the Azad Government of the State of Jammu & Kashmir: news, leadership, departments, helplines and the Kashmir cause.",
};

export const viewport: Viewport = {
  themeColor: "#08331f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable} ${nastaliq.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
