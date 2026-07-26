import React from "react";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy | NewFreeJobAlert",
  description: "Read the Cookie Policy of NewFreeJobAlert to understand how we use cookies to optimize your browsing experience.",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="July 26, 2026">
      <div className="space-y-6">
        <p className="leading-relaxed">
          This is the Cookie Policy for <strong>NewFreeJobAlert</strong>, accessible from <span className="text-primary font-bold">newfreejobalert.com</span>.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">1. What Are Cookies</h2>
        <p className="leading-relaxed">
          As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored; however, this may downgrade or break certain elements of the site's functionality.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">2. How We Use Cookies</h2>
        <p className="leading-relaxed">
          We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">3. Disabling Cookies</h2>
        <p className="leading-relaxed">
          You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">4. Third-Party Cookies</h2>
        <p className="leading-relaxed">
          In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google AdSense:</strong> Google AdSense uses cookies to serve more relevant ads across the web and limit the number of times a given ad is shown to you.</li>
          <li><strong>Analytics Cookies:</strong> We may use third-party analytics to track and measure usage of this site so that we can continue to produce engaging content.</li>
        </ul>
      </div>
    </LegalLayout>
  );
}
