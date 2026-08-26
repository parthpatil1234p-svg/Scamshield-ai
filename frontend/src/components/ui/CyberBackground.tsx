/**
 * src/components/ui/CyberBackground.tsx
 * Subtle cybersecurity ambient background with soft grid lines and floating signal particles.
 * 100% CSS/SVG, GPU-accelerated, zero CPU overhead.
 */
export function CyberBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Radial soft ambient glow */}
      <div className="absolute inset-0 hero-radial-glow opacity-80" />

      {/* Cyber grid lines */}
      <div className="absolute inset-0 cyber-grid opacity-40" />

      {/* Subtle floating glow orbs */}
      <div
        className="absolute top-1/4 left-10 w-96 h-96 rounded-full opacity-10 animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="absolute bottom-1/3 right-10 w-[30rem] h-[30rem] rounded-full opacity-10 animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, #38BDF8 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDelay: '1.5s',
        }}
      />
    </div>
  );
}
