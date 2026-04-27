/**
 * SVG donut chart built with arc paths.
 * Uses inline styles for segment colors because they are dynamic at runtime.
 *
 * @param {{
 *   data: Array<{ label: string, value: number, color: string }>,
 *   size?: number,
 *   strokeWidth?: number,
 * }} props
 */
export default function DonutChart({ data, size = 184, strokeWidth = 36 }) {
  const r  = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const total   = data.reduce((sum, d) => sum + d.value, 0);
  const GAP_RAD = 0.05; // radians between segments

  let angle = -Math.PI / 2; // start at 12 o'clock

  const segments = total > 0
    ? data
        .filter((d) => d.value > 0)
        .map((d) => {
          const sweep = (d.value / total) * 2 * Math.PI;
          const sa    = angle + GAP_RAD / 2;
          const ea    = angle + sweep - GAP_RAD / 2;
          angle += sweep;
          return { ...d, sa, ea };
        })
    : [];

  /** Build an SVG arc path string from start to end angle. */
  const arc = (sa, ea) => {
    const x1 = cx + r * Math.cos(sa);
    const y1 = cy + r * Math.sin(sa);
    const x2 = cx + r * Math.cos(ea);
    const y2 = cy + r * Math.sin(ea);
    const largeArc = ea - sa > Math.PI ? 1 : 0;
    return `M${x1.toFixed(3)} ${y1.toFixed(3)} A${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#F1F5F9"
        strokeWidth={strokeWidth}
      />
      {/* Coloured segments */}
      {segments.map((seg, i) => (
        <path
          key={i}
          d={arc(seg.sa, seg.ea)}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth - 2}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  );
}
