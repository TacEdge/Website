import { contourPaths } from "./contour-paths";

/**
 * Topographic contour background. Behind dark bars and hero panels only,
 * never over body text. Thin strokes at low opacity, non-interactive.
 */
export default function ContourMotif() {
  return (
    <svg
      className="contour"
      viewBox="0 0 1600 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {contourPaths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
