import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "NewFreeJobAlerts.Com | freejobalert.com : Free job alerts Government, Bank Jobs and All",
  description: "FreeJobAlert com Job site is for Government,Sarkari Naukri,Banks,Railways,Police Recruitment, Results of IBPS,UPSC,SSC,RRB, Fresher IT Jobs and Walkins",
  keywords: "free job alert, govt job, latest govt jobs, government jobs 2026, free job alerts, sarkari result, sarkari job, railway recruitment, SSC recruitment, UPSC notification, bank jobs, police recruitment, defence jobs, teaching jobs, state government jobs, central government jobs, PSU recruitment, apprentice jobs, engineering government jobs, 10th pass govt jobs, 12th pass govt jobs, graduate govt jobs, diploma government jobs, ITI jobs, Indian Army recruitment, Indian Air Force recruitment, Navy recruitment, Rajasthan government jobs, employment news, live free job alerts, SSC Jobs, Railway Jobs, UPSC, Bank Jobs, Police Jobs, Defence Jobs, Teaching Jobs, State Govt Jobs, Rajasthan Govt Jobs, 10th Pass Jobs, 12th Pass Jobs, Graduate Jobs, ITI Jobs, Diploma Jobs, Engineering Jobs, Free Job Alerts, Sarkari Result, Admit Card, Answer Key, Result, Latest Notifications, Upcoming Jobs, Walk-in Jobs, PSU Jobs, Apprenticeship, High Court Jobs, AIIMS Jobs, ESIC Jobs, DRDO Jobs, ISRO Jobs",
  authors: [{ name: "NewFreeJobAlert Team" }],
  verification: {
    google: "hJhBh6P7z0tc6pNVcqSBCfie9ktdepuEMMsjrQH3GAI",
  },
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3085706097528661"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
        <GoogleAnalytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
