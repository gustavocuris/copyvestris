/* Jabuti (Red-footed Tortoise) — side view */
const Jabuti = ({ opacity = 1 }: { opacity?: number }) => (
  <svg viewBox="0 0 280 210" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', maxWidth: 280, height: 'auto', opacity,
      filter: opacity < 0.4 ? 'none' : 'drop-shadow(0 0 12px rgba(240,180,41,0.2))' }}>

    {/* ── SHELL DOME ── */}
    <path d="M 42 148 C 42 88, 68 52, 140 50 C 212 52, 238 88, 238 148 Z"
      fill="rgba(0,12,5,0.8)" stroke="#F0B429" strokeWidth="2"
      style={{ filter: 'drop-shadow(0 0 6px rgba(240,180,41,0.35))' }}/>

    {/* shell base band */}
    <path d="M 36 150 C 36 162, 62 172, 140 172 C 218 172, 244 162, 244 150
             C 244 142, 218 138, 140 138 C 62 138, 36 142, 36 150 Z"
      fill="rgba(0,10,4,0.75)" stroke="#F0B429" strokeWidth="1.5"/>

    {/* ── SHELL SCUTE PATTERN ── */}
    {/* central vertebral row */}
    <path d="M 140 58 L 136 90 L 140 122 L 144 90 Z"
      fill="none" stroke="rgba(240,180,41,0.3)" strokeWidth="0.8"/>
    <line x1="140" y1="58"  x2="140" y2="138" stroke="rgba(240,180,41,0.22)" strokeWidth="0.8"/>

    {/* lateral divisions */}
    <path d="M 140 82 C 110 78, 80 82, 58 98"  stroke="rgba(240,180,41,0.22)" strokeWidth="0.8" fill="none"/>
    <path d="M 140 82 C 170 78, 200 82, 222 98" stroke="rgba(240,180,41,0.22)" strokeWidth="0.8" fill="none"/>
    <path d="M 140 108 C 108 102, 76 110, 52 128" stroke="rgba(240,180,41,0.18)" strokeWidth="0.8" fill="none"/>
    <path d="M 140 108 C 172 102, 204 110, 228 128" stroke="rgba(240,180,41,0.18)" strokeWidth="0.8" fill="none"/>
    <path d="M 86 60, Q 72 78, 60 108"  stroke="rgba(240,180,41,0.15)" strokeWidth="0.8" fill="none"/>
    <path d="M 194 60 Q 208 78, 220 108" stroke="rgba(240,180,41,0.15)" strokeWidth="0.8" fill="none"/>

    {/* ── LEGS ── */}
    {/* front */}
    <path d="M 80 150 C 72 156, 66 165, 60 170"
      stroke="#00D966" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <path d="M 60 170 L 50 178 M 60 170 L 57 180 M 60 170 L 65 178"
      stroke="#00D966" strokeWidth="1.5" strokeLinecap="round"/>
    {/* rear */}
    <path d="M 196 150 C 204 156, 210 165, 216 170"
      stroke="#00D966" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <path d="M 216 170 L 208 178 M 216 170 L 215 180 M 216 170 L 224 178"
      stroke="#00D966" strokeWidth="1.5" strokeLinecap="round"/>
    {/* middle left */}
    <path d="M 104 158 C 98 166, 94 174, 90 180"
      stroke="#00D966" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    {/* middle right */}
    <path d="M 172 158 C 178 166, 182 174, 186 180"
      stroke="#00D966" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

    {/* ── HEAD ── */}
    <ellipse cx="55" cy="138" rx="22" ry="16"
      fill="rgba(0,10,4,0.85)" stroke="#00D966" strokeWidth="1.5"/>
    {/* neck */}
    <path d="M 36 142 C 40 148, 45 150, 52 150" stroke="#00D966" strokeWidth="1.2" fill="none"/>
    {/* eye */}
    <circle cx="48" cy="134" r="5"  fill="rgba(0,4,2,0.9)" stroke="#F0B429" strokeWidth="1.3"/>
    <circle cx="48" cy="134" r="2.5" fill="rgba(240,180,41,0.65)"/>
    <circle cx="49.2" cy="133" r="0.9" fill="rgba(255,255,255,0.88)"/>
    {/* nostril */}
    <circle cx="36"  cy="138" r="1.5" fill="rgba(0,217,102,0.4)"/>

    {/* ── TAIL ── */}
    <path d="M 238 152 C 246 155, 250 152, 248 148"
      stroke="#00D966" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

    {/* ── CIRCUIT ── */}
    <line x1="140" y1="50"  x2="140" y2="34" stroke="rgba(240,180,41,0.2)" strokeWidth="0.8"/>
    <line x1="140" y1="34"  x2="158" y2="34" stroke="rgba(240,180,41,0.2)" strokeWidth="0.8"/>
    <circle cx="158" cy="34" r="2.5" fill="rgba(240,180,41,0.32)"/>
    <line x1="140" y1="34"  x2="122" y2="34" stroke="rgba(240,180,41,0.12)" strokeWidth="0.8"/>
    <circle cx="122" cy="34" r="1.5" fill="rgba(240,180,41,0.2)"/>
  </svg>
)

export default Jabuti
