import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "NewFreeJobAlert | Official Government Recruitment Portal",
  description: "Access real-time recruitment notifications, official admit cards, and merit lists from all government departments in one place.",
  keywords: "Govt jobs, Free job alert, Admit card, Exam syllabus, Government scheme, SSC, UPSC, Bank jobs, Railway recruitment",
  authors: [{ name: "NewFreeJobAlert Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light h-full">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
