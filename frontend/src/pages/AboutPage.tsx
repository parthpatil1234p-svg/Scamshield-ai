/**
 * src/pages/AboutPage.tsx
 * Public about page per UI-UX-DESIGN.md §28 + APP-FLOW.md.
 * Mission, AI detection methodology, limitations, safety advisory.
 */
import { Link } from 'react-router-dom';
import {
  ShieldCheck, FileText, Link2, Layers, Cpu,
  AlertTriangle, Info, CheckCircle,
} from 'lucide-react';

const INDICATORS = [
  { code: 'TI-01', name: 'Guaranteed Return Claim',          desc: 'Phrases like "guaranteed profit", "100% returns", "zero risk" are legally and financially impossible for legitimate investments.' },
  { code: 'TI-02', name: 'Unrealistic Profit Multiplier',    desc: 'Promises of extreme returns (e.g., 500% profit, 10x in 24 hours) that are statistically impossible in legitimate markets.' },
  { code: 'TI-03', name: 'Urgency / Pressure Tactic',        desc: 'Artificial time pressure ("last 24 hours", "limited spots", "act now") designed to prevent careful evaluation.' },
  { code: 'TI-04', name: 'FOMO Language',                    desc: 'Fear of missing out language ("everyone is making money", "passive income secret") to trigger impulsive action.' },
  { code: 'TI-05', name: 'False Authority / Celebrity',      desc: 'False references to RBI, SEBI, Elon Musk, Warren Buffett, or government approval to establish fake credibility.' },
  { code: 'TI-06', name: 'Payment / Crypto Solicitation',    desc: 'Direct requests to transfer USDT, Bitcoin, or cash to activate/unlock an investment account.' },
  { code: 'TI-07', name: 'Private Channel Redirection',      desc: 'Directing victims to unmonitored Telegram channels, WhatsApp groups, or VIP chats.' },
  { code: 'TI-08', name: 'Testimonial / Social Proof',       desc: 'Fabricated payment screenshots, fake earnings claims, or manufactured user success stories.' },
  { code: 'TI-09', name: 'Unregistered Investment Solicit.', desc: 'Soliciting capital for unregulated trading bots, algorithmic funds, or unregistered financial advisors.' },
];

export function AboutPage() {
  return (
    <div style={{ background: 'var(--color-bg-base)', minHeight: '100vh' }}>
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 border-b"
        style={{ background: 'rgba(7,11,20,0.9)', backdropFilter: 'blur(12px)', borderColor: 'var(--color-border)' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck size={24} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
          <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
            ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Sign In</Link>
          <Link to="/register" className="text-sm font-semibold px-4 py-2 rounded-full" style={{ background: 'var(--color-brand)', color: '#fff' }}>
            Start Scanning
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border" style={{ color: 'var(--color-accent)', borderColor: 'var(--color-brand-subtle)', background: 'var(--color-brand-subtle)' }}>
            <Cpu size={12} /> AI Detection Methodology
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            About ScamShield AI
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            An explainable AI tool to help users identify potentially suspicious investment and trading
            content on social media — built for the CS-2 Hackathon Problem Statement.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-12 p-8 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Our Mission</h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Investment scams cause significant financial harm to individuals, particularly new investors
            and non-technical users who cannot easily distinguish between legitimate investment information
            and manipulative content appearing on Telegram, WhatsApp, Instagram, X/Twitter, and YouTube.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            ScamShield AI addresses the detection gap by surfacing suspicious signals in text and URLs,
            and <strong style={{ color: 'var(--color-text-primary)' }}>explains those signals to the user in plain language</strong> —
            not just a binary "Scam" or "Not Scam" label.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Detection Methodology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: FileText, label: 'Text Analysis', desc: '9 rule-based indicator categories, each with evidence extraction from submitted text.' },
              { icon: Link2,    label: 'URL Analysis',  desc: '10 structural and lexical URL signal checks — zero outbound HTTP requests made.' },
              { icon: Layers,   label: 'Combined Mode', desc: 'Weighted fusion: 60% text + 40% URL signals with a critical ceiling governor.' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="p-5 rounded-xl border" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                <Icon size={24} style={{ color: 'var(--color-accent)' }} className="mb-3" aria-hidden="true" />
                <p className="font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Risk scoring */}
          <div className="p-6 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--color-text-primary)' }}>Risk Scoring Formula</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Each detected indicator contributes a weighted score. The final risk score (0–100) is computed as:
            </p>
            <code
              className="block px-4 py-3 rounded-lg text-sm"
              style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}
            >
              Combined = (TextScore × 0.60) + (URLScore × 0.40)
            </code>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              A Critical Ceiling Governor ensures: if TextScore ≥ 75 OR URLScore ≥ 75,
              then CombinedScore = max(CombinedScore, 75). Risk tiers: LOW (0–24) · MEDIUM (25–49) · HIGH (50–74) · CRITICAL (75–100).
            </p>
          </div>
        </section>

        {/* Text Indicators */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Text Risk Indicators</h2>
          <div className="space-y-3">
            {INDICATORS.map(({ code, name, desc }) => (
              <div key={code} className="flex gap-4 p-4 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <code className="text-xs px-2 py-1 rounded flex-shrink-0 h-fit" style={{ background: 'var(--color-brand-subtle)', color: 'var(--color-brand)', fontFamily: 'var(--font-mono)' }}>
                  {code}
                </code>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{name}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-12 p-6 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-risk-medium)' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} style={{ color: 'var(--color-risk-medium)' }} aria-hidden="true" />
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Known Limitations</h2>
          </div>
          <ul className="space-y-2.5">
            {[
              'The system does not make outbound connections to analyze URLs — lexical analysis only.',
              'Sophisticated scams using novel language patterns may produce false negatives.',
              'Short or ambiguous inputs may produce low-confidence results.',
              'The system cannot analyze images, screenshots, voice recordings, or video content.',
              'Results are not legal confirmation of fraud. Always independently verify.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <Info size={14} style={{ color: 'var(--color-risk-medium)', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Safety Advisory */}
        <section className="mb-12 p-6 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-risk-low)' }}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} style={{ color: 'var(--color-risk-low)' }} aria-hidden="true" />
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Safety Advisory</h2>
          </div>
          <ul className="space-y-2.5">
            {[
              'Never transfer money or cryptocurrency to unverified investment platforms.',
              'Verify investment advisors on official SEBI/RBI/IRDA registers before engaging.',
              'Legitimate investments never guarantee fixed returns or pressure you to act immediately.',
              'Report suspicious investment promotions to cybercrime.gov.in.',
              'ScamShield AI is a decision-support tool — it does not replace professional financial advice.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <CheckCircle size={14} style={{ color: 'var(--color-risk-low)', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base"
            style={{ background: 'var(--color-brand)', color: '#ffffff' }}
          >
            Start Scanning for Free
          </Link>
          <p className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
            ScamShield AI — Detect. Understand. Stay Safe.
          </p>
        </div>
      </main>
    </div>
  );
}
