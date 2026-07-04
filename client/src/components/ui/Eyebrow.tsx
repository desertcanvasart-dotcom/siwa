import type { ReactNode } from "react";

/**
 * Eyebrow — small uppercase label with a gold rule, used above headings.
 * `light` variant keeps gold color but is intended for use on dark surfaces
 * (the component itself is color-neutral; the rule adapts via opacity).
 */
interface EyebrowProps {
  children: ReactNode;
  light?: boolean;
  className?: string;
}

export function Eyebrow({ children, light = false, className = "" }: EyebrowProps) {
  return (
    <p
      className={`flex items-center gap-3 text-[0.6rem] tracking-[0.38em] uppercase mb-8 ${
        light ? "text-gold" : "text-gold"
      } ${className}`}
    >
      <span className="block w-6 h-px bg-gold opacity-50" />
      {children}
    </p>
  );
}

export default Eyebrow;
