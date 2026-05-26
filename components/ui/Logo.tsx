export default function Logo({ size = 32, withName = true }: { size?: number; withName?: boolean }) {
  return (
  <div className="flex items-center gap-2.5">
  <div
  className="grid place-items-center font-mono font-bold text-accent-ink rounded-[10px]"
  style={{
  width: size,
  height: size,
  background: "linear-gradient(135deg, #c6f74a, #8a7cff)",
  fontSize: size * 0.5,
  }}
  >
  IM
  </div>
  {withName && (
  <div className="font-semibold tracking-tight">
  IIT Mandi <span className="text-accent">Campus</span>
  </div>
  )}
  </div>
  );
}
