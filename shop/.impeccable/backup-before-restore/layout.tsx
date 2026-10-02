import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "gamecommendo",
  description:
    "A fake game shop. Browse the most popular Games and follow Recommendations matched by meaning.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full scroll-smooth antialiased [color-scheme:dark] [scrollbar-color:var(--accent)_var(--background)]",
        geistMono.variable,
        archivo.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="flex min-h-full flex-col font-sans selection:bg-primary selection:text-primary-foreground">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
