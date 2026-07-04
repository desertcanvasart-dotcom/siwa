/**
 * Arch — Siwan / fortress arch motif.
 * Decorative SVG used as a divider or above section headings.
 */
interface ArchProps {
  className?: string;
}

export function Arch({ className = "" }: ArchProps) {
  return (
    <svg
      viewBox="0 0 56 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 30C2 15 13 2 28 2C43 2 54 15 54 30"
        stroke="#B89A5B"
        strokeWidth="0.8"
        strokeOpacity="0.45"
      />
      <path
        d="M8 30C8 17 17 6 28 6C39 6 48 17 48 30"
        stroke="#B89A5B"
        strokeWidth="0.5"
        strokeOpacity="0.22"
      />
    </svg>
  );
}

export default Arch;
