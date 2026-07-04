import { useState, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/layout/layout";
import { useSiteContent, pickContent } from "@/lib/useSiteContent";

const sections = [
  { id: "who-we-are",          label: "§1  Who We Are" },
  { id: "information-collect", label: "§2  Information We Collect" },
  { id: "how-we-use",          label: "§3  How We Use Your Information" },
  { id: "legal-basis",         label: "§4  Legal Basis for Processing" },
  { id: "information-sharing", label: "§5  Information Sharing" },
  { id: "international",       label: "§6  International Transfers" },
  { id: "retention",           label: "§7  Data Retention" },
  { id: "your-rights",         label: "§8  Your Rights" },
  { id: "cookies",             label: "§9  Cookies & Tracking" },
  { id: "marketing",           label: "§10  Marketing Communications" },
  { id: "childrens",           label: "§11  Children's Privacy" },
  { id: "third-party",         label: "§12  Third-Party Links" },
  { id: "security",            label: "§13  Security Measures" },
  { id: "changes",             label: "§14  Changes to This Policy" },
  { id: "contact",             label: "§15  Contact Us" },
];

export default function Privacy() {
  const [activeSection, setActiveSection] = useState("who-we-are");
  const c = useSiteContent();
  const eyebrow = pickContent(c, "privacy.eyebrow", "Legal");
  const title = pickContent(c, "privacy.title", "Privacy Policy.");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.15, rootMargin: "-80px 0px -55% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <Layout darkHero={false}>
      {/* ── Hero Header ──────────────────────────────────────────── */}
      <header className="bg-navy pt-32 pb-16 px-6 md:px-12 lg:px-20 relative overflow-hidden">
        {/* Textile pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #B89A5B 0,
              #B89A5B 1px,
              transparent 0,
              transparent 50%
            )`,
            backgroundSize: "14px 14px",
          }}
        />
        <div className="max-w-6xl mx-auto relative">
          <p className="text-[0.6rem] tracking-[0.32em] uppercase text-gold mb-5 font-body">
            {eyebrow}
          </p>
          <h1
            className="font-display italic text-white mb-10"
            style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)", lineHeight: 1.1 }}
          >
            {title}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/[0.08] pt-8">
            {[
              { label: "Effective Date",    value: "5 July 2025" },
              { label: "Governing Law",     value: "Egypt" },
              { label: "Data Controller",   value: "Soléi Inc." },
              { label: "Registered Office", value: "Cairo, Egypt" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[0.58rem] tracking-[0.22em] uppercase text-white/40 mb-1 font-body">
                  {label}
                </p>
                <p className="text-sm text-white/85 font-body font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-16 lg:flex lg:gap-16">

          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28">
              <nav className="space-y-0.5 mb-8">
                {sections.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block text-[0.72rem] leading-snug py-1.5 pl-3 border-l-2 transition-all duration-200 font-body"
                    style={{
                      borderColor: activeSection === id ? "#2F6F8F" : "transparent",
                      color:       activeSection === id ? "#2F6F8F" : "rgba(58,79,95,0.5)",
                      fontWeight:  activeSection === id ? 600 : 400,
                    }}
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="bg-navy rounded-lg p-5">
                <p className="text-[0.65rem] tracking-[0.18em] uppercase text-gold mb-2 font-body">
                  Questions?
                </p>
                <p className="text-xs text-white/60 leading-relaxed mb-4 font-body">
                  Anything about how we handle your data — we're here.
                </p>
                <Link
                  href="/enquire"
                  className="text-xs font-body font-medium text-gold hover:text-gold-light transition-colors"
                >
                  Contact our team →
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* Intro box */}
            <div
              className="border-l-4 border-gold p-6 mb-12 rounded-r-lg"
              style={{ backgroundColor: "#EDE5D8" }}
            >
              <p className="text-sm leading-relaxed text-ink font-body">
                Soléi Inc. ("Soléi", "we", "our", or "us") respects your privacy and is committed to
                protecting your personal data. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our website or engage our
                travel services across Siwa Oasis and Egypt's North Coast.
              </p>
            </div>

            {/* §1 */}
            <Section id="who-we-are" number="§1" title="Who We Are">
              <p>
                Soléi Inc. is a travel services company registered under the laws of Egypt, with its
                principal place of business at 31 Central Avenue, Moqattam, Cairo 11572, Egypt. We
                operate the website <strong>soléi.com</strong> and curate accommodation, experiences,
                and private transportation across Siwa Oasis and Egypt's North Coast.
              </p>
              <p>
                As data controller, we determine the purposes and means of processing your personal
                data. Our designated Privacy Contact can be reached at{" "}
                <a href="mailto:privacy@lasolei.com" className="text-coastal hover:underline">
                  privacy@lasolei.com
                </a>.
              </p>
            </Section>

            {/* §2 */}
            <Section id="information-collect" number="§2" title="Information We Collect">
              <p>We may collect and process the following categories of personal data:</p>
              <DataTable
                headers={["Category", "Examples"]}
                rows={[
                  ["Identity Data",  "Full name, date of birth, nationality, passport number & expiry"],
                  ["Contact Data",   "Email address, telephone number, postal address"],
                  ["Booking Data",   "Travel dates, accommodation preferences, dietary requirements, special requests"],
                  ["Payment Data",   "Payment method type, billing address (card numbers processed by our payment provider — never stored by us)"],
                  ["Technical Data", "IP address, browser type, device identifiers, cookie data, referring URLs"],
                  ["Marketing Data", "Communication preferences, survey responses, feedback"],
                  ["Sensitive Data", "Health or medical information relevant to travel safety, where you choose to provide it"],
                ]}
              />
              <HighlightBox>
                We collect personal data directly from you (enquiry forms, booking confirmations,
                email correspondence), automatically via cookies and analytics, and occasionally from
                third parties such as travel agents or booking platforms acting on your behalf.
              </HighlightBox>
            </Section>

            {/* §3 */}
            <Section id="how-we-use" number="§3" title="How We Use Your Information">
              <p>We use personal data for the following purposes:</p>
              <ul>
                <li>Processing and managing your travel bookings and payments</li>
                <li>Communicating booking confirmations, itineraries, and pre-departure information</li>
                <li>Providing customer support and responding to enquiries</li>
                <li>Personalising your experience based on your stated preferences</li>
                <li>Sending marketing communications where you have given consent or we have a legitimate interest</li>
                <li>Complying with legal and regulatory obligations (e.g., passport data for Egyptian border requirements)</li>
                <li>Analysing website usage to improve our services</li>
                <li>Preventing fraud and ensuring the security of our systems</li>
              </ul>
            </Section>

            {/* §4 */}
            <Section id="legal-basis" number="§4" title="Legal Basis for Processing">
              <DataTable
                headers={["Purpose", "Legal Basis"]}
                rows={[
                  ["Fulfilling a booking",                          "Performance of contract"],
                  ["Mandatory government data (passport details)",  "Legal obligation"],
                  ["Personalisation & preference-based recommendations", "Legitimate interests"],
                  ["Marketing emails to existing clients",          "Legitimate interests (with opt-out)"],
                  ["Marketing emails to new contacts",              "Consent"],
                  ["Sensitive health information",                  "Explicit consent"],
                  ["Analytics & website improvement",               "Legitimate interests"],
                ]}
              />
            </Section>

            {/* §5 */}
            <Section id="information-sharing" number="§5" title="Information Sharing">
              <p>We share your personal data only where necessary and with appropriate safeguards:</p>
              <ul>
                <li>
                  <strong>Service providers</strong> — hotels, ecolodges, transport operators, and
                  experience guides require your name and contact details to fulfil your booking.
                </li>
                <li>
                  <strong>Payment processors</strong> — payment data is passed to our PCI-DSS
                  compliant payment gateway; we do not store card numbers.
                </li>
                <li>
                  <strong>Government authorities</strong> — passport and travel data may be shared
                  with Egyptian immigration or other regulatory bodies as legally required.
                </li>
                <li>
                  <strong>Technology partners</strong> — analytics, email delivery, and CRM
                  providers processing data on our behalf under data processing agreements.
                </li>
                <li>
                  <strong>Professional advisors</strong> — lawyers, accountants, or insurers under
                  strict confidentiality obligations.
                </li>
              </ul>
              <p>We do not sell your personal data to third parties.</p>
            </Section>

            {/* §6 */}
            <Section id="international" number="§6" title="International Transfers">
              <p>
                Your data may be transferred to and processed in countries outside Egypt, including
                countries where our technology partners are based. Where such transfers occur, we
                ensure appropriate safeguards are in place, such as:
              </p>
              <ul>
                <li>Standard contractual clauses approved by relevant data protection authorities</li>
                <li>Adequacy decisions recognising equivalent protection</li>
                <li>Binding corporate rules where applicable</li>
              </ul>
              <p>
                By submitting your data through our website or booking process, you acknowledge
                these international transfers may occur.
              </p>
            </Section>

            {/* §7 */}
            <Section id="retention" number="§7" title="Data Retention">
              <DataTable
                headers={["Data Type", "Retention Period"]}
                rows={[
                  ["Booking records & invoices",   "7 years (legal / tax obligation)"],
                  ["Passport & identity data",     "Up to 2 years after trip completion"],
                  ["Marketing preferences",        "Until you opt out or withdraw consent"],
                  ["Website analytics",            "Rolling 26 months"],
                  ["Customer correspondence",      "3 years after last interaction"],
                  ["Payment transaction records",  "7 years"],
                ]}
              />
              <p>After the applicable retention period, data is securely deleted or anonymised.</p>
            </Section>

            {/* §8 */}
            <Section id="your-rights" number="§8" title="Your Rights">
              <p>
                Depending on applicable law, you may have the following rights regarding your
                personal data:
              </p>
              <ul>
                <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
                <li><strong>Rectification</strong> — correct inaccurate or incomplete data</li>
                <li><strong>Erasure</strong> — request deletion where we no longer have a lawful basis to retain it</li>
                <li><strong>Restriction</strong> — ask us to limit processing in certain circumstances</li>
                <li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
                <li><strong>Objection</strong> — object to processing based on legitimate interests or for direct marketing</li>
                <li><strong>Withdraw consent</strong> — where processing is consent-based, withdraw at any time without affecting prior lawfulness</li>
              </ul>
              <HighlightBox>
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:privacy@lasolei.com" className="text-coastal hover:underline">
                  privacy@lasolei.com
                </a>
                . We will respond within 30 days. We may need to verify your identity before
                processing the request.
              </HighlightBox>
            </Section>

            {/* §9 */}
            <Section id="cookies" number="§9" title="Cookies & Tracking">
              <p>
                Our website uses cookies and similar tracking technologies to enhance your
                experience and gather analytics. Categories of cookies we use:
              </p>
              <DataTable
                headers={["Type", "Purpose", "Duration"]}
                rows={[
                  ["Strictly Necessary", "Session management, security, core functionality",                                  "Session"],
                  ["Functional",         "Remembering your language and preferences",                                         "1 year"],
                  ["Analytics",          "Understanding how visitors use the site (e.g., page views, traffic sources)",       "26 months"],
                  ["Marketing",          "Delivering relevant ads and measuring campaign effectiveness",                      "90 days"],
                ]}
              />
              <p>
                You can control cookies through your browser settings. Disabling certain cookies
                may affect website functionality. We use a cookie consent banner on first visit to
                obtain your agreement for non-essential cookies.
              </p>
            </Section>

            {/* §10 */}
            <Section id="marketing" number="§10" title="Marketing Communications">
              <p>
                We may send you marketing emails, SMS messages, or WhatsApp notifications about
                our experiences, seasonal offers, and travel inspiration if you have:
              </p>
              <ul>
                <li>Made a booking with us and not opted out, <strong>or</strong></li>
                <li>Subscribed to our journal or newsletter</li>
              </ul>
              <p>
                Every marketing communication includes an unsubscribe link. You may also opt out
                by emailing{" "}
                <a href="mailto:hello@lasolei.com" className="text-coastal hover:underline">
                  hello@lasolei.com
                </a>{" "}
                with "Unsubscribe" in the subject line. We will action opt-outs within 10 business
                days.
              </p>
            </Section>

            {/* §11 */}
            <Section id="childrens" number="§11" title="Children's Privacy">
              <p>
                Our services are primarily directed at adults. We do not knowingly collect personal
                data from children under 14 without parental consent. Where a booking includes
                travellers under 14, we collect only the minimum data required for travel and
                safety purposes, and with the explicit consent of a parent or legal guardian.
              </p>
              <p>
                If you believe a child's data has been collected without appropriate consent,
                please contact us immediately at{" "}
                <a href="mailto:privacy@lasolei.com" className="text-coastal hover:underline">
                  privacy@lasolei.com
                </a>.
              </p>
            </Section>

            {/* §12 */}
            <Section id="third-party" number="§12" title="Third-Party Links">
              <p>
                Our website may contain links to third-party websites, social media platforms, or
                partner property pages. This Privacy Policy applies solely to soléi.com. We are
                not responsible for the privacy practices of external sites and encourage you to
                review their respective policies before providing any personal data.
              </p>
            </Section>

            {/* §13 */}
            <Section id="security" number="§13" title="Security Measures">
              <p>
                We implement appropriate technical and organisational measures to protect your
                personal data against unauthorised access, alteration, disclosure, or destruction.
                These measures include:
              </p>
              <ul>
                <li>TLS/SSL encryption for all data in transit</li>
                <li>AES-256 encryption for sensitive data at rest</li>
                <li>Access controls limiting data to authorised personnel only</li>
                <li>Regular security assessments and staff training</li>
                <li>PCI-DSS compliant payment handling via third-party processors</li>
              </ul>
              <p>
                No method of transmission over the internet is 100% secure. While we strive to
                protect your data, we cannot guarantee absolute security. In the event of a data
                breach affecting your rights, we will notify you as required by applicable law.
              </p>
            </Section>

            {/* §14 */}
            <Section id="changes" number="§14" title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our
                practices, technology, or legal requirements. When we make material changes, we
                will:
              </p>
              <ul>
                <li>Update the "Effective Date" at the top of this page</li>
                <li>Send an email notification to registered users where practical</li>
                <li>Display a prominent notice on our website for 30 days following the update</li>
              </ul>
              <p>
                Your continued use of our services after a policy update constitutes your
                acceptance of the revised terms.
              </p>
            </Section>

            {/* §15 */}
            <Section id="contact" number="§15" title="Contact Us" last>
              <p>
                For any privacy-related questions, requests, or complaints, please contact our
                Privacy team:
              </p>
              <div className="rounded-lg p-6 mt-4" style={{ backgroundColor: "#EDE5D8" }}>
                <p className="font-body font-semibold text-sm text-navy mb-1">
                  Soléi Inc. — Privacy Office
                </p>
                <p className="font-body text-sm text-ink-soft">
                  31 Central Avenue, Moqattam<br />
                  Cairo 11572, Egypt
                </p>
                <p className="font-body text-sm text-ink-soft mt-3">
                  Email:{" "}
                  <a href="mailto:privacy@lasolei.com" className="text-coastal hover:underline">
                    privacy@lasolei.com
                  </a>
                </p>
                <p className="font-body text-sm text-ink-soft">
                  WhatsApp:{" "}
                  <a href="https://wa.me/201206887575" className="text-coastal hover:underline">
                    +20 120 688 7575
                  </a>
                </p>
                <p className="font-body text-xs text-ink-soft/60 mt-3">
                  We aim to respond to all privacy requests within 30 calendar days.
                </p>
              </div>
            </Section>

          </main>
        </div>

        {/* ── Closing CTA ──────────────────────────────────────────── */}
        <div className="bg-cream-deep py-20 px-6 text-center">
          <p className="text-[0.6rem] tracking-[0.28em] uppercase text-gold font-body mb-4">
            Privacy Questions
          </p>
          <h2
            className="font-display italic text-navy mb-6"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
          >
            We're here to help.
          </h2>
          <p className="font-body text-sm text-ink-soft leading-relaxed max-w-md mx-auto mb-8">
            If you have any questions about how we handle your data, reach out to our team directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:privacy@lasolei.com"
              className="font-body text-[0.72rem] tracking-[0.18em] uppercase px-8 py-3 bg-navy text-cream hover:bg-navy-mid transition-colors"
            >
              privacy@lasolei.com
            </a>
            <Link
              href="/terms-of-service"
              className="font-body text-[0.72rem] tracking-[0.18em] uppercase px-8 py-3 border border-navy text-navy hover:bg-navy/5 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function Section({
  id,
  number,
  title,
  children,
  last = false,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section
      id={id}
      className={last ? "" : "mb-14 pb-14 border-b border-sand/50"}
    >
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-body text-[0.65rem] tracking-[0.18em] uppercase font-medium text-gold flex-shrink-0">
          {number}
        </span>
        <h2
          className="font-display text-navy"
          style={{ fontSize: "1.35rem", lineHeight: 1.2 }}
        >
          {title}
        </h2>
      </div>
      <div className="font-body text-sm leading-7 text-ink-soft space-y-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1">
        {children}
      </div>
    </section>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-[0.8rem] font-body border-collapse">
        <thead>
          <tr className="bg-navy">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-2.5 font-medium text-white/85"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{ backgroundColor: i % 2 === 0 ? "#EDE5D8" : "#F6F1E6" }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2.5 align-top text-ink"
                  dangerouslySetInnerHTML={{ __html: cell }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg px-5 py-4 text-sm font-body leading-relaxed text-ink"
      style={{
        backgroundColor: "rgba(47,111,143,0.08)",
        borderLeft: "3px solid #2F6F8F",
      }}
    >
      {children}
    </div>
  );
}
