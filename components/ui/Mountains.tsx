export default function Mountains({ className = "" }: { className?: string }) {
  return (
  <svg
  className={className}
  viewBox="0 0 800 280"
  preserveAspectRatio="none"
  fill="none"
  >
  <path
  d="M0 280 L0 200 L120 140 L200 180 L280 110 L360 170 L440 130 L540 200 L640 150 L720 190 L800 160 L800 280 Z"
  fill="rgba(138,124,255,0.10)"
  />
  <path
  d="M0 280 L0 220 L80 180 L160 220 L240 160 L320 210 L400 170 L500 220 L580 180 L680 230 L800 200 L800 280 Z"
  fill="rgba(198,247,74,0.10)"
  />
  <path
  d="M0 280 L0 240 L100 220 L200 250 L300 220 L400 245 L500 225 L600 250 L700 230 L800 245 L800 280 Z"
  fill="rgba(255,255,255,0.04)"
  />
  </svg>
  );
}
