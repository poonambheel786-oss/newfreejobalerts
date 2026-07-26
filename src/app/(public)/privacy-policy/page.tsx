import React from "react";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | NewFreeJobAlert",
  description: "Read the Privacy Policy of NewFreeJobAlert to understand how we collect, use, and protect candidate information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="July 26, 2026">
      <div className="space-y-6">
        <p className="leading-relaxed">
          At <strong>NewFreeJobAlert</strong>, accessible from <span className="text-primary font-bold">newfreejobalert.com</span>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by NewFreeJobAlert and how we use it.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">1. Log Files</h2>
        <p className="leading-relaxed">
          NewFreeJobAlert follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">2. Cookies and Web Beacons</h2>
        <p className="leading-relaxed">
          Like any other website, NewFreeJobAlert uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">3. Google DoubleClick DART Cookie</h2>
        <p className="leading-relaxed">
          Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://policies.google.com/technologies/ads</a>.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">4. Our Advertising Partners</h2>
        <p className="leading-relaxed">
          Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google AdSense:</strong> They serve personalized ads based on user interests. You can view their Privacy Policy details at their official site.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-6">5. Third-Party Privacy Policies</h2>
        <p className="leading-relaxed">
          NewFreeJobAlert's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">6. Children's Information</h2>
        <p className="leading-relaxed">
          Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. NewFreeJobAlert does not knowingly collect any Personal Identifiable Information from children under the age of 13.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">7. Consent</h2>
        <p className="leading-relaxed">
          By using our website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>
      </div>
    </LegalLayout>
  );
}
