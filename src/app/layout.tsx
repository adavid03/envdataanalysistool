import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { FileProvider } from './contexts/FileContext';
import { ThemeProvider } from 'next-themes';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { AnalysisModeProvider } from './contexts/AnalysisModeContext';
import { SpeedInsights } from "@vercel/speed-insights/next"

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beetlejuice eDNA Web",
  description: "A powerful, interactive tool for analyzing environmental data, tailored for CURE students and faculty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${publicSans.variable} antialiased`}>
        <SpeedInsights />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FileProvider>
            <AnalysisModeProvider>
              <ThemeSwitcher />
              {children}
            </AnalysisModeProvider>
          </FileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
