/**
 * src/pages/LandingPage.tsx
 * Premium Cybersecurity & AI Landing Page.
 * Staggered animations, interactive cards, floating shield nodes, and trust indicators.
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
  ArrowRight,
  Cpu,
  Sparkles,
  Zap,
  Activity,
} from 'lucide-react';
import { CyberBackground } from '../components/ui/CyberBackground';

/* ── Navbar ───────────────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 border-b transition-all"
      style={{
        background: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        borderColor: 'var(--color-border)',
      }}
    >
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="p-1.5 rounded-lg bg-blue-950/60 border border-blue-800/40 group-hover:border-blue-500/60 transition-colors">
          <ShieldCheck size={22} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
        </div>
        <span className="text-base font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
        </span>
      </Link>

      <nav className="flex items-center gap-3 md:gap-4">
        <Link
          to="/about"
          className="hidden md:block text-sm font-medium px-3.5 py-2 rounded-lg transition-colors hover:text-white"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Methodology
        </Link>
        <Link
          to="/login"
          className="text-sm font-medium px-4 py-2 rounded-xl border transition-all hover:bg-slate-800/60"
          style={{
            color: 'var(--color-text-secondary)',
            borderColor: 'var(--color-border)',
          }}
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="btn-primary text-sm font-semibold px-5 py-2 rounded-xl transition-all flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#ffffff',
          }}
        >
          <span>Analyze Now</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
function Hero({ howItWorksRef }: { howItWorksRef: React.RefObject<HTMLElement | null> }) {
  const scroll = () => howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative py-20 md:py-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-14 relative z-10">
        {/* Left Text Content */}
        <div className="flex-1 text-left">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border animate-fade-in"
            style={{
              color: 'var(--color-accent)',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              background: 'rgba(30, 58, 95, 0.4)',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.15)',
            }}
          >
            <Cpu size={13} className="animate-pulse text-sky-400" aria-hidden="true" />
            <span>AI Threat Intelligence · CS-2</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-6 animate-fade-in-up delay-100"
            style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
          >
            Detect Investment Scams
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Before They Reach You.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg mb-8 max-w-xl leading-relaxed animate-fade-in-up delay-200"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Paste suspicious social media pitches, Telegram messages, or investment URLs.
            Receive an <strong>explainable AI risk assessment (0–100)</strong> with verbatim evidence in seconds.
          </p>

          {/* Trust points */}
          <div className="space-y-3 mb-9 animate-fade-in-up delay-300">
            {[
              'Explainable AI — verbatim quotes showing exactly why signals were flagged',
              'Multi-signal extraction across 9 Text and 10 URL indicator categories',
              'Zero outbound HTTP requests to analyzed links (Strict SSRF protection)',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center bg-emerald-500/20 border border-emerald-500/40 flex-shrink-0">
                  <CheckCircle size={12} style={{ color: 'var(--color-risk-low)' }} aria-hidden="true" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 animate-fade-in-up delay-400">
            <Link
              to="/register"
              className="btn-primary inline-flex items-center gap-2.5 text-base font-semibold px-8 py-3.5 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
              }}
            >
              <span>Analyze Now</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <button
              onClick={scroll}
              className="inline-flex items-center gap-2 text-base font-medium px-6 py-3.5 rounded-xl border transition-all hover:bg-slate-800/40 hover:text-white"
              style={{
                color: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              <span>How It Works</span>
              <span>↓</span>
            </button>
          </div>
        </div>

        {/* Right Interactive Cyber Shield Visual */}
        <div className="flex-shrink-0 relative flex items-center justify-center w-72 h-72 sm:w-96 sm:h-96 animate-fade-in-scale delay-200">
          {/* Animated decorative rings */}
          <div
            className="absolute inset-0 rounded-full border border-blue-500/20 animate-pulse-glow"
            style={{ animationDuration: '4s' }}
          />
          <div
            className="absolute inset-8 rounded-full border border-sky-400/15"
            style={{ animation: 'spin 25s linear infinite' }}
          />

          {/* Glowing central container */}
          <div
            className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 rounded-3xl border card-interactive"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 26, 58, 0.7) 0%, rgba(7, 11, 20, 0.85) 100%)',
              borderColor: 'rgba(30, 58, 95, 0.8)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(37, 99, 235, 0.15)',
            }}
          >
            {/* Center Shield Icon */}
            <div className="relative p-6 rounded-2xl bg-blue-950/40 border border-blue-800/40 animate-float">
              <ShieldCheck
                size={84}
                style={{ color: 'var(--color-brand)', filter: 'drop-shadow(0 0 20px rgba(37, 99, 235, 0.6))' }}
                aria-hidden="true"
              />
            </div>

            {/* Floating Live Signal Chips */}
            <div
              className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border animate-float"
              style={{
                background: 'rgba(5, 46, 22, 0.9)',
                color: 'var(--color-risk-low)',
                borderColor: 'rgba(52, 211, 153, 0.4)',
                boxShadow: '0 4px 15px rgba(52, 211, 153, 0.25)',
                animationDelay: '1s',
              }}
            >
              <Activity size={12} className="animate-pulse" aria-hidden="true" />
              <span>9 Text Signals Active</span>
            </div>

            <div
              className="absolute -bottom-3 -left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border animate-float"
              style={{
                background: 'rgba(45, 10, 10, 0.9)',
                color: 'var(--color-risk-critical)',
                borderColor: 'rgba(248, 113, 113, 0.4)',
                boxShadow: '0 4px 15px rgba(248, 113, 113, 0.25)',
                animationDelay: '2.5s',
              }}
            >
              <Zap size={12} aria-hidden="true" />
              <span>Critical Threat Block</span>
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
    title: 'Submit Content',
    desc: 'Paste suspicious text, investment pitch, or website URL from any platform (Telegram, WhatsApp, Instagram).',
    icon: FileText,
  },
  {
    num: '02',
    title: 'AI Signal Extraction',
    desc: 'Our engine extracts lexical patterns across 9 text risk categories and 10 structural URL indicators.',
    icon: Sparkles,
  },
  {
    num: '03',
    title: 'Explainable Findings',
    desc: 'View your 0–100 risk score, verbatim evidence highlights, and actionable safety recommendations.',
    icon: ShieldCheck,
  },
];

function HowItWorks({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="how-it-works"
      className="py-24 px-6 md:px-12 relative border-t"
      style={{
        background: 'rgba(13, 19, 33, 0.6)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            How ScamShield AI Works
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Transparent three-step pipeline from raw input to explainable risk report.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-7 rounded-2xl border card-interactive text-left"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-950/60 border border-blue-800/40 text-sky-400">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <span className="text-2xl font-bold font-mono opacity-30 text-slate-400">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Features Grid ────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: FileText,      title: 'Text Signal Analysis',  desc: 'Detects 9 text risk categories including guaranteed return claims, urgency tactics, and crypto solicitation.' },
  { icon: Link2,         title: 'URL Security Scan',     desc: 'Inspects URLs for IP hostnames, high-abuse TLDs, punycode spoofing, and suspicious query parameters.' },
  { icon: Layers,        title: 'Combined Fused Mode',   desc: 'Fuses text and URL analysis with a Critical Ceiling Governor for holistic threat evaluation.' },
  { icon: MessageSquare, title: 'Explainable AI (XAI)',  desc: 'Highlights verbatim evidence quotes directly from your input so you understand why content is risky.' },
  { icon: History,       title: 'Scan Audit History',    desc: 'Review past scans with risk-level filtering and permanent record deletion on demand.' },
  { icon: Lock,          title: 'Zero Outbound Requests',desc: 'Zero outbound connections made to analyzed URLs, completely neutralizing SSRF attack vectors.' },
];

function FeaturesGrid() {
  return (
    <section className="py-24 px-6 md:px-12 relative border-t" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Enterprise Cybersecurity Capabilities
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Engineered with zero-trust architecture and explainable threat modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border card-interactive"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-950/60 border border-blue-800/40 text-sky-400 mb-4">
                <Icon size={20} aria-hidden="true" />
              </div>
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
  { icon: Lock,        text: 'User data isolated with strict IDOR access control' },
  { icon: EyeOff,      text: 'Zero tracking or external behavioral profiling' },
  { icon: ShieldCheck, text: 'Zero outbound network requests made to analyzed URLs' },
];

function SecurityStrip() {
  return (
    <section
      className="py-14 px-6 md:px-12 border-y relative"
      style={{ background: 'rgba(13, 19, 33, 0.7)', borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {SECURITY_ITEMS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3.5 p-4 rounded-xl border bg-slate-900/40 border-slate-800/60">
            <div className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-sky-400 flex-shrink-0">
              <Icon size={18} aria-hidden="true" />
            </div>
            <p className="text-sm leading-snug" style={{ color: 'var(--color-text-secondary)' }}>
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
    <section className="py-24 px-6 md:px-12 relative">
      <div
        className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl border relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 26, 58, 0.8) 0%, rgba(7, 11, 20, 0.95) 100%)',
          borderColor: 'rgba(37, 99, 235, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(37, 99, 235, 0.15)',
        }}
      >
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Scan a Suspicious Investment Post Now
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Get instant risk scoring, verbatim evidence detection, and guidance before committing any capital.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/register"
              className="btn-primary inline-flex items-center gap-2 text-base font-semibold px-8 py-3.5 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#ffffff',
              }}
            >
              <span>Create Free Account</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-base font-medium px-7 py-3.5 rounded-xl border transition-all hover:bg-slate-800/40"
              style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="border-t px-6 md:px-12 py-12 relative z-10"
      style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <ShieldCheck size={22} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
              <span className="font-bold text-base tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                ScamShield AI
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Explainable AI-powered investment and trading scam detection system. Built for Cyber Security Hackathon 2026.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider text-slate-400">Navigation</p>
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/scanner',   label: 'Scanner' },
              { to: '/history',   label: 'Scan History' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="block text-sm mb-2 text-slate-400 hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider text-slate-400">Legal &amp; Trust</p>
            <Link to="/about" className="block text-sm mb-2 text-slate-400 hover:text-white transition-colors">
              Methodology &amp; Disclaimers
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 mt-2">
              Results are probabilistic risk indicators based on detected signals and do not constitute financial advice.
            </p>
          </div>
        </div>

        <div className="border-t pt-6 text-xs leading-relaxed text-slate-500" style={{ borderColor: 'var(--color-border)' }}>
          © 2026 ScamShield AI. All rights reserved. Built with zero-trust AI architecture.
        </div>
      </div>
    </footer>
  );
}

/* ── Main Landing Page ────────────────────────────────────────────────────── */
export function LandingPage() {
  const howItWorksRef = useRef<HTMLElement>(null);

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--color-bg-base)' }}>
      <CyberBackground />
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
