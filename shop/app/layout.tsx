import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FavouriteStyle } from "@/features/favourite/components/favourite-style";
import { Footer } from "@/features/footer/components/footer";
import { Header } from "@/features/header/components/header";
import { LibraryStyle } from "@/features/library/components/library-style";
import { PaletteScript } from "@/features/palette/components/palette-script";
import { cn } from "@/lib/utils";

const jetbrainsMonoHeading = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
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
      suppressHydrationWarning
      className={cn(
        "h-full scroll-smooth antialiased [scrollbar-color:var(--accent)_var(--background)]",
        spaceGrotesk.variable,
        jetbrainsMonoHeading.variable,
      )}
    >
      <head>
        <PaletteScript />
      </head>
      <body className="flex min-h-full flex-col font-sans selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <LibraryStyle />
            <FavouriteStyle />
            <Header />
            <main
              id="main"
              tabIndex={-1}
              className="flex flex-1 flex-col outline-none"
            >
              {children}
            </main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
