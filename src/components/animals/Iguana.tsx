/* Iguana — landscape side view, facing right */
const Iguana = ({ opacity = 1 }: { opacity?: number }) => (
  <svg viewBox="0 0 460 210" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: 'auto', opacity,
      filter: opacity < 0.5 ? 'none' : 'drop-shadow(0 0 14px rgba(0,217,102,0.2))' }}>

    {/* ── BODY SILHOUETTE ── */}
    <path d="
      M 52 97
      C 64 86, 82 79, 108 76
      C 134 73, 160 74, 184 79
      C 208 83, 224 86, 240 89
      C 310 97, 368 124, 420 162
      C 416 170, 402 165, 370 150
      C 312 125, 240 108, 200 103
      C 170 99, 150 101, 130 103
      C 108 105, 90 110, 74 118
      C 62 124, 50 114, 52 97
      Z"
      fill="rgba(0,15,6,0.8)" stroke="#00D966" strokeWidth="1.8"/>

    {/* ── DEWLAP ── */}
    <path d="M 72 106 C 64 120, 62 136, 68 144 C 74 133, 76 118, 78 108 Z"
      fill="rgba(0,15,6,0.65)" stroke="#00D966" strokeWidth="1.2"/>

    {/* ── DORSAL SPINES ── */}
    {([
      [116, 74, 119, 55], [130, 71, 133, 51], [144, 70, 147, 49],
      [158, 71, 161, 50], [172, 73, 175, 53], [186, 77, 189, 58],
      [200, 81, 203, 63], [213, 84, 216, 68], [225, 87, 228, 72],
    ] as [number, number, number, number][]).map(([x1, y1, x2, y2], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#00D966" strokeWidth="1.8" strokeLinecap="round"/>
    ))}

    {/* ── FRONT LEG ── */}
    <path d="M 130 102 C 126 114, 122 126, 116 135"
      stroke="#00D966" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M 116 135 L 106 148 M 116 135 L 115 150 M 116 135 L 124 147"
      stroke="#00D966" strokeWidth="1.3" strokeLinecap="round"/>

    {/* ── REAR LEG ── */}
    <path d="M 188 99 C 186 112, 182 126, 178 136"
      stroke="#00D966" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M 178 136 L 168 150 M 178 136 L 177 152 M 178 136 L 186 148"
      stroke="#00D966" strokeWidth="1.3" strokeLinecap="round"/>

    {/* ── HEAD DETAILS ── */}
    {/* eye */}
    <circle cx="66"  cy="92"  r="7"  fill="rgba(0,5,2,0.9)" stroke="#00D966" strokeWidth="1.5"/>
    <circle cx="66"  cy="92"  r="3.5" fill="rgba(0,255,136,0.7)"/>
    <circle cx="67.5" cy="90.5" r="1.2" fill="rgba(255,255,255,0.9)"/>
    {/* tympanic disc */}
    <circle cx="82"  cy="95"  r="7"  fill="none" stroke="rgba(0,217,102,0.3)" strokeWidth="1.2"/>
    {/* nostril */}
    <circle cx="55"  cy="96"  r="2.2" fill="rgba(0,217,102,0.45)" stroke="#00D966" strokeWidth="0.8"/>
    {/* jaw line */}
    <path d="M 52 98 C 58 106, 66 110, 82 112" stroke="rgba(0,217,102,0.2)" strokeWidth="0.8"/>

    {/* ── SCALE TEXTURE ── */}
    <path d="M 120 85 C 138 84, 155 84, 172 85" stroke="rgba(0,217,102,0.1)" strokeWidth="0.7"/>
    <path d="M 120 92 C 138 91, 155 91, 172 92" stroke="rgba(0,217,102,0.07)" strokeWidth="0.7"/>

    {/* ── CIRCUIT DETAIL ── */}
    <line x1="148" y1="58" x2="148" y2="44" stroke="rgba(0,217,102,0.2)" strokeWidth="0.8"/>
    <line x1="148" y1="44" x2="165" y2="44" stroke="rgba(0,217,102,0.2)" strokeWidth="0.8"/>
    <circle cx="165" cy="44" r="2.5" fill="rgba(0,217,102,0.35)"/>
    <line x1="165" y1="44" x2="182" y2="44" stroke="rgba(0,217,102,0.12)" strokeWidth="0.8"/>
    <circle cx="182" cy="44" r="1.5" fill="rgba(0,217,102,0.22)"/>
  </svg>
)

export default Iguana
