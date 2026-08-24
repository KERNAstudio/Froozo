/** A small rotating-text stamp, the kind of decorative detail a real cafe
 * badge/coaster would carry. Purely ornamental. */
export function SealBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <circle cx="60" cy="60" r="57" fill="none" stroke="var(--brass)" strokeWidth="1" opacity="0.8" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--brass)" strokeWidth="0.5" opacity="0.5" />
      <path id="seal-ring" fill="none" d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
      <text fontSize="8.4" letterSpacing="2.5" fill="var(--cream)" className="uppercase">
        <textPath href="#seal-ring" startOffset="0%">
          Cafe &amp; Good Times • Cafe &amp; Good Times •
        </textPath>
      </text>
      <path
        d="M60 48 L64 58 L60 68 L56 58 Z"
        fill="var(--froozo-red)"
        transform="rotate(45 60 60)"
      />
    </svg>
  );
}
