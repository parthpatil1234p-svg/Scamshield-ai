/**
 * src/pages/LandingPage.tsx
 * Public landing page per UI-UX-DESIGN.md §13.
 * Sections: Navbar → Hero → How It Works → Features → Security Strip → CTA → Footer
 */
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Link2,
  Layers,
  MessageSquare,
  History,
  Lock,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Cpu,
} from 'lucide-react';

/* ── Navbar ───────────────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 border-b"
      style={{
        background: 'rgba(7,11,20,0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border)',
      }}
    >
      <Link to="/" className="flex items-center gap-2">
        <ShieldCheck size={26} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
        <span className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
          ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
        </span>
      </Link>

      <nav className="flex items-center gap-2 md:gap-4">
        <Link
          to="/about"
          className="hidden md:block text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          About
        </Link>
        <Link
          to="/login"
          className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
          style={{
            color: 'var(--color-text-secondary)',
            borderColor: 'var(--color-border)',
          }}
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="text-sm font-semibold px-4 py-2 rounded-full transition-all"
          style={{
            background: 'var(--color-brand)',
            color: '#ffffff',
          }}
        >
          Start Scanning
        </Link>
      </nav>
    </header>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
function Hero({ howItWorksRef }: { howItWorksRef: React.RefObject<HTMLElement | null> }) {
  const scroll = () => howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero-bg py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text */}
        <div className="flex-1">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border"
            style={{
              color: 'var(--color-accent)',
              borderColor: 'var(--color-brand-subtle)',
              background: 'var(--color-brand-subtle)',
            }}
          >
            <Cpu size={12} aria-hidden="true" />
            AI Cybersecurity Tool — CS-2
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-5"
            style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
          >
            Detect Investment Scams
            <br />
            <span style={{ color: 'var(--color-brand)' }}>Before They Reach You.</span>
          </h1>

          <p
            className="text-lg mb-8 max-w-lg leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Paste text or a URL from any social media post and receive an explainable risk
            assessment in seconds — not just "Scam" or "Not Scam."
          </p>

          {/* Trust indicators */}
          <div className="space-y-2 mb-8">
            {[
              'Explainable results — see exactly what signals were found',
              'Risk scoring, not guaranteed detection',
              'No outbound requests made to analyzed URLs',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                <CheckCircle size={16} style={{ color: 'var(--color-risk-low)', flexShrink: 0 }} aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-base font-semibold px-8 py-3.5 rounded-full transition-all"
              style={{ background: 'var(--color-brand)', color: '#ffffff' }}
            >
              Start Scanning
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <button
              onClick={scroll}
              className="inline-flex items-center gap-2 text-base font-medium px-6 py-3.5 rounded-full border transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              How It Works ↓
            </button>
          </div>
        </div>

        {/* Shield Visual */}
        <div className="flex-shrink-0 flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
          <div
            className="relative flex items-center justify-center w-full h-full rounded-3xl"
            style={{ background: 'var(--color-brand-subtle)', border: '1px solid var(--color-border)' }}
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-4 rounded-2xl opacity-20"
              style={{ background: 'var(--color-brand)', filter: 'blur(24px)' }}
            />
            <ShieldCheck
              size={120}
              style={{ color: 'var(--color-brand)', position: 'relative', zIndex: 1 }}
              aria-hidden="true"
            />
            {/* Floating badges */}
            <div
              className="absolute top-5 right-5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: 'var(--color-risk-low-bg)', color: 'var(--color-risk-low)', border: '1px solid var(--color-risk-low)' }}
              aria-label="LOW Risk indicator example"
            >
              <CheckCircle size={10} aria-hidden="true" /> LOW
            </div>
            <div
              className="absolute bottom-8 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: 'var(--color-risk-critical-bg)', color: 'var(--color-risk-critical)', border: '1px solid var(--color-risk-critical)' }}
              aria-label="CRITICAL Risk indicator example"
            >
              <AlertTriangle size={10} aria-hidden="true" /> CRITICAL
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ─────────────────────────────────────────────────────────── */
const HOW_STEPS = [
  {
    num: '01',
    title: 'Submit',
    desc: 'Paste text or a URL from any social media post, Telegram message, or investment promotion.',
  },
  {
    num: '02',
    title: 'Analyze',
    desc: 'Our AI extracts risk signals from 9 text indicators and 10 URL signals, computing a risk score.',
  },
  {
    num: '03',
    title: 'Understand',
    desc: 'See exactly what was detected, why each signal is suspicious, and what action to take.',
  },
];

function HowItWorks({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="how-it-works"
      className="py-20 px-6 md:px-12"
      style={{ background: 'var(--color-bg-elevated)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            How It Works
          </h2>
          <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
            Three steps from suspicious content to actionable insight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {HOW_STEPS.map((step, i) => (
            <div key={step.num} className="relative text-center">
              {/* Connector line */}
              {i < HOW_STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-10 left-1/2 w-full h-px"
                  style={{ background: 'var(--color-border)', transform: 'translateX(50%)' }}
                  aria-hidden="true"
                />
              )}
              {/* Step number */}
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-3xl font-bold mb-5 mx-auto"
                style={{
                  background: 'var(--color-brand-subtle)',
                  color: 'var(--color-brand)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {step.num}
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features Grid ────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: FileText,      title: 'Text Analysis',      desc: 'Analyze investment promotion text for 9 categories of risk indicators including fake authority, urgency tactics, and crypto solicitation.' },
  { icon: Link2,         title: 'URL Analysis',        desc: 'Inspect URLs for suspicious structural and lexical signals including IP-based addresses, misleading keywords, and suspicious TLDs.' },
  { icon: Layers,        title: 'Combined Analysis',   desc: 'Submit both text and URL for a comprehensive risk picture with fused scoring across all detected signals.' },
  { icon: MessageSquare, title: 'Explainable Results', desc: 'Every flagged signal shows verbatim evidence from your input, why it matters, and what to do next.' },
  { icon: History,       title: 'Scan History',        desc: 'Review all your past scans and access detailed results anytime. Filter by risk level.' },
  { icon: ShieldCheck,   title: 'Privacy First',       desc: 'Your data is yours — delete any scan at any time. No outbound requests made to analyzed URLs.' },
];

function FeaturesGrid() {
  return (
    <section className="py-20 px-6 md:px-12" style={{ background: 'var(--color-bg-base)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Core Capabilities
          </h2>
          <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
            Multi-signal detection with explainable AI output.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-xl border transition-all"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Icon size={32} style={{ color: 'var(--color-accent)' }} className="mb-4" aria-hidden="true" />
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Security Strip ───────────────────────────────────────────────────────── */
const SECURITY_ITEMS = [
  { icon: Lock,      text: 'Your inputs are not stored beyond your account' },
  { icon: EyeOff,    text: 'No tracking or behavioral profiling' },
  { icon: ShieldCheck, text: 'No outbound requests made to submitted URLs in analysis' },
];

function SecurityStrip() {
  return (
    <section
      className="py-16 px-6 md:px-12 border-y"
      style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {SECURITY_ITEMS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-4">
            <div
              className="p-2.5 rounded-lg flex-shrink-0"
              style={{ background: 'var(--color-brand-subtle)' }}
            >
              <Icon size={20} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── CTA Banner ───────────────────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-20 px-6 md:px-12" style={{ background: 'var(--color-bg-base)' }}>
      <div
        className="max-w-3xl mx-auto text-center p-12 rounded-2xl border"
        style={{
          background: 'var(--color-brand-subtle)',
          borderColor: 'var(--color-border)',
        }}
      >
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Ready to scan a suspicious investment post?
        </h2>
        <p className="text-base mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Create a free account and start analyzing content for risk signals in seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-base font-semibold px-8 py-3.5 rounded-full transition-all"
            style={{ background: 'var(--color-brand)', color: '#ffffff' }}
          >
            Create Free Account
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-base font-medium px-8 py-3.5 rounded-full border transition-colors"
            style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="border-t px-6 md:px-12 py-10"
      style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={20} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
              <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                ScamShield AI
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Detect. Understand. Stay Safe.
            </p>
          </div>
          {/* Links */}
          <div>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Links
            </p>
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/scanner', label: 'Scanner' },
              { to: '/history', label: 'History' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="block text-sm mb-1.5 transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {label}
              </Link>
            ))}
          </div>
          {/* Legal */}
          <div>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Legal
            </p>
            <Link
              to="/about"
              className="block text-sm mb-1.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              About &amp; Methodology
            </Link>
            <p className="text-xs leading-relaxed mt-3" style={{ color: 'var(--color-text-disabled)' }}>
              Results are probabilistic risk assessments, not fraud determinations.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="border-t pt-6 text-xs leading-relaxed"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          ScamShield AI provides probabilistic risk assessments based on detected signals in submitted
          content. Results are not guaranteed fraud determinations and do not constitute financial or
          legal advice. Always independently verify investment opportunities.
        </div>
      </div>
    </footer>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export function LandingPage() {
  const howItWorksRef = useRef<HTMLElement>(null);

  return (
    <div style={{ background: 'var(--color-bg-base)' }}>
      <Navbar />
      <Hero howItWorksRef={howItWorksRef} />
      <HowItWorks sectionRef={howItWorksRef} />
      <FeaturesGrid />
      <SecurityStrip />
      <CTABanner />
      <Footer />
    </div>
  );
}
