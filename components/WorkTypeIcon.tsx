/**
 * Line icons for the six ground-engineering work types. Single stroke
 * weight, no fills — matches the fine-border card language.
 */
const ICONS: Record<string, React.ReactNode> = {
  Anchoring: (
    // Ground anchor: bar into ground with bond zone
    <>
      <path d="M4 7h24" />
      <path d="M16 7v16" />
      <path d="M16 23c0 2.4-2 4-4.5 4M16 23c0 2.4 2 4 4.5 4" />
      <path d="M12 15h8M12 19h8" />
    </>
  ),
  Drilling: (
    // Drill mast and string
    <>
      <path d="M8 27h16" />
      <path d="M12 27V9l8-4v22" />
      <path d="M20 12l6 3M20 18l6 3" />
    </>
  ),
  Shotcrete: (
    // Nozzle spraying a face
    <>
      <path d="M25 5v22" />
      <path d="M5 14h7l3 2" />
      <path d="M19 10.5 21.5 9M20 16h2.5M19 21.5l2.5 1.5" />
    </>
  ),
  "Rockfall Protection": (
    // Mesh over slope
    <>
      <path d="M5 27 27 5" />
      <path d="M9 15l8 8M15 9l8 8" />
      <path d="M12 12l8 8" opacity=".55" />
    </>
  ),
  Drainage: (
    // Pipe with falling water
    <>
      <path d="M5 8h14a4 4 0 0 1 4 4v3" />
      <path d="M5 13h13" />
      <path d="M23 20v1M23 25v1M19 22v1" />
    </>
  ),
  "Piling and Retaining": (
    // Retained wall with piles
    <>
      <path d="M6 27V9M12 27V6M18 27V9" />
      <path d="M4 27h20" />
      <path d="M22 12h6M22 17h6M22 22h6" />
    </>
  ),
};

export default function WorkTypeIcon({ type }: { type: string }) {
  return (
    <svg
      className="worktype__icon"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[type]}
    </svg>
  );
}
