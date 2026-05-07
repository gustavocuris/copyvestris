/* Macaco (Capuchin) — side profile, sitting */
const Monkey = () => (
  <svg viewBox="0 0 260 340" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', maxWidth: 260, height: 'auto',
      filter: 'drop-shadow(0 0 14px rgba(0,217,102,0.22))' }}>

    {/* ── TAIL (behind body) ── */}
    <path d="M 155 230 C 200 228, 228 212, 232 180 C 236 148, 214 128, 195 110
             C 182 98, 175 90, 180 78"
      stroke="#00D966" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* tail tip curl */}
    <path d="M 180 78 C 192 65, 200 68, 198 80 C 196 90, 186 92, 182 86"
      stroke="#00D966" strokeWidth="2" strokeLinecap="round" fill="none"/>

    {/* ── BODY ── */}
    <ellipse cx="120" cy="218" rx="52" ry="62"
      fill="rgba(0,12,5,0.85)" stroke="#00D966" strokeWidth="1.8"/>

    {/* ── ARM (front) ── */}
    <path d="M 98 190 C 82 200, 68 218, 65 240 C 62 254, 70 260, 80 258"
      stroke="#00D966" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    {/* fingers */}
    <path d="M 80 258 L 68 270 M 80 258 L 76 272 M 80 258 L 83 271 M 80 258 L 90 266"
      stroke="#00D966" strokeWidth="1.3" strokeLinecap="round"/>

    {/* ── SITTING LEGS ── */}
    <path d="M 96 272 C 86 282, 72 290, 66 295"
      stroke="#00D966" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M 145 272 C 155 282, 168 290, 174 295"
      stroke="#00D966" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M 60 295 Q 90 305 120 300 Q 150 295 180 295"
      stroke="#00D966" strokeWidth="1.4" strokeLinecap="round" fill="none"/>

    {/* ── NECK ── */}
    <path d="M 108 158 C 110 162, 130 162, 134 158"
      stroke="#00D966" strokeWidth="1.2" fill="none"/>

    {/* ── HEAD ── */}
    <circle cx="120" cy="125" r="55"
      fill="rgba(0,12,5,0.88)" stroke="#00D966" strokeWidth="1.8"/>

    {/* ── FACE OVAL (lighter cap) ── */}
    <ellipse cx="124" cy="130" rx="36" ry="40"
      fill="rgba(0,217,102,0.04)" stroke="rgba(0,217,102,0.18)" strokeWidth="1"/>

    {/* ── EAR (left visible) ── */}
    <path d="M 72 110 C 60 102, 55 115, 60 130 C 64 140, 74 142, 82 136"
      fill="rgba(0,12,5,0.8)" stroke="#00D966" strokeWidth="1.5"/>
    <path d="M 72 112 C 64 108, 61 120, 65 130" stroke="rgba(0,217,102,0.3)" strokeWidth="0.8"/>

    {/* ── EYE ── */}
    <circle cx="110" cy="118" r="11"
      fill="rgba(0,4,2,0.92)" stroke="#00D966" strokeWidth="1.5"/>
    <circle cx="110" cy="118" r="6"  fill="rgba(0,255,136,0.6)"/>
    <circle cx="112.5" cy="116" r="2.2" fill="rgba(255,255,255,0.9)"/>

    {/* ── NOSE ── */}
    <ellipse cx="124" cy="138" rx="8" ry="5"
      fill="rgba(0,12,5,0.9)" stroke="rgba(0,217,102,0.4)" strokeWidth="1"/>
    <circle cx="121" cy="139" r="2" fill="rgba(0,217,102,0.25)"/>
    <circle cx="127" cy="139" r="2" fill="rgba(0,217,102,0.25)"/>

    {/* ── MOUTH ── */}
    <path d="M 110 150 Q 124 158, 138 150"
      stroke="rgba(0,217,102,0.35)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>

    {/* ── BROW ── */}
    <path d="M 100 108 Q 110 103, 120 108"
      stroke="rgba(0,217,102,0.3)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>

    {/* ── CIRCUIT DETAILS ── */}
    <line x1="64"  y1="125" x2="42"  y2="125" stroke="rgba(0,217,102,0.15)" strokeWidth="0.8"/>
    <line x1="42"  y1="125" x2="42"  y2="108" stroke="rgba(0,217,102,0.15)" strokeWidth="0.8"/>
    <circle cx="42" cy="108" r="2.5" fill="rgba(0,217,102,0.25)"/>

    <line x1="160" y1="218" x2="182" y2="218" stroke="rgba(0,217,102,0.15)" strokeWidth="0.8"/>
    <line x1="182" y1="218" x2="182" y2="200" stroke="rgba(0,217,102,0.15)" strokeWidth="0.8"/>
    <circle cx="182" cy="200" r="2.5" fill="rgba(0,217,102,0.25)"/>
  </svg>
)

export default Monkey
