/* Toucan — perched on branch, neon line-art */
const Toucan = () => (
  <svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-toucan">

    {/* ── TAIL FEATHERS ── */}
    <line x1="108" y1="323" x2="78"  y2="386" stroke="#00D966" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="119" y1="326" x2="94"  y2="392" stroke="#00D966" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="131" y1="328" x2="114" y2="394" stroke="#00B34A" strokeWidth="2.5" strokeLinecap="round"/>

    {/* ── BODY ── */}
    <ellipse cx="122" cy="248" rx="58" ry="82"
      fill="rgba(0,12,5,0.85)" stroke="#00D966" strokeWidth="1.8"/>

    {/* chest highlight */}
    <path d="M 150 186 C 170 208, 174 262, 155 298 C 140 298, 112 292, 100 266
             C 90 238, 98 190, 124 186 Z"
      fill="rgba(228,244,234,0.04)" stroke="rgba(228,244,234,0.1)" strokeWidth="1"/>

    {/* ── WING ── */}
    <path d="M 68 218 C 42 196, 34 240, 48 280 C 58 304, 86 298, 104 280"
      fill="rgba(0,12,5,0.7)" stroke="#00D966" strokeWidth="1.5"/>
    <path d="M 70 222 C 49 246, 40 268, 50 280" stroke="rgba(0,217,102,0.28)" strokeWidth="0.8"/>
    <path d="M 75 238 C 55 260, 46 278, 54 290" stroke="rgba(0,217,102,0.18)" strokeWidth="0.8"/>

    {/* ── HEAD ── */}
    <circle cx="152" cy="148" r="52"
      fill="rgba(0,12,5,0.88)" stroke="#00D966" strokeWidth="1.8"/>

    {/* white throat */}
    <path d="M 128 175 C 140 185, 160 188, 172 178 C 178 172, 175 155, 168 148
             C 158 148, 140 156, 130 168 Z"
      fill="rgba(228,244,234,0.07)" stroke="rgba(228,244,234,0.12)" strokeWidth="0.8"/>

    {/* ── BEAK ── */}
    <path d="M 197 128 C 244 114, 292 128, 300 152 C 291 173, 245 183, 198 168 Z"
      fill="rgba(240,180,0,0.1)" stroke="#F0B429" strokeWidth="2.2"
      className="svg-beak-glow"/>
    {/* beak top ridge */}
    <path d="M 200 132 C 250 120, 288 133, 297 152"
      stroke="rgba(255,215,80,0.4)" strokeWidth="1"/>
    {/* beak tip dark */}
    <path d="M 278 126 C 300 140, 301 153, 292 170 C 283 146, 274 129, 278 126 Z"
      fill="rgba(18,5,0,0.5)" stroke="rgba(90,45,0,0.5)" strokeWidth="0.8"/>

    {/* ── EYE ── */}
    {/* outer glow ring */}
    <circle cx="161" cy="138" r="15" fill="none" stroke="rgba(0,220,220,0.18)" strokeWidth="3"/>
    <circle cx="161" cy="138" r="12" fill="none" stroke="rgba(0,255,200,0.1)" strokeWidth="1"/>
    {/* eyeball */}
    <circle cx="161" cy="138" r="9"
      fill="rgba(0,4,2,0.92)" stroke="#00D966" strokeWidth="1.5"/>
    {/* pupil glow */}
    <circle cx="161" cy="138" r="5" fill="rgba(0,255,136,0.65)" className="svg-eye-blink"/>
    {/* shine */}
    <circle cx="163.5" cy="136" r="2" fill="rgba(255,255,255,0.92)"/>

    {/* ── FEET ── */}
    <path d="M 109 352 L 92 370 M 109 352 L 105 374 M 109 352 L 116 371 M 109 352 L 124 366"
      stroke="#00D966" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M 147 352 L 131 370 M 147 352 L 141 374 M 147 352 L 153 371 M 147 352 L 162 366"
      stroke="#00D966" strokeWidth="1.8" strokeLinecap="round"/>

    {/* ── BRANCH ── */}
    <path d="M 0 358 Q 150 344 300 360" stroke="#0A2E12" strokeWidth="10" strokeLinecap="round"/>
    <path d="M 0 358 Q 150 346 300 360" stroke="#00D966" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
    <circle cx="75"  cy="352" r="4" fill="none" stroke="#00D966" strokeWidth="1" opacity="0.25"/>
    <circle cx="225" cy="356" r="3" fill="none" stroke="#00D966" strokeWidth="1" opacity="0.25"/>

    {/* ── CIRCUIT DETAILS ── */}
    <line x1="64"  y1="250" x2="36"  y2="250" stroke="rgba(0,217,102,0.17)" strokeWidth="0.8"/>
    <line x1="36"  y1="250" x2="36"  y2="228" stroke="rgba(0,217,102,0.17)" strokeWidth="0.8"/>
    <circle cx="36" cy="228" r="2.5" fill="rgba(0,217,102,0.28)"/>
    <line x1="36"  y1="228" x2="20"  y2="228" stroke="rgba(0,217,102,0.1)"  strokeWidth="0.8"/>
    <circle cx="20" cy="228" r="1.5" fill="rgba(0,217,102,0.2)"/>

    <line x1="170" y1="252" x2="196" y2="252" stroke="rgba(0,217,102,0.17)" strokeWidth="0.8"/>
    <line x1="196" y1="252" x2="196" y2="232" stroke="rgba(0,217,102,0.17)" strokeWidth="0.8"/>
    <circle cx="196" cy="232" r="2.5" fill="rgba(0,217,102,0.28)"/>

    {/* scan lines */}
    <line x1="66" y1="198" x2="170" y2="198" stroke="rgba(0,255,136,0.055)" strokeWidth="1"/>
    <line x1="66" y1="215" x2="170" y2="215" stroke="rgba(0,255,136,0.04)"  strokeWidth="1"/>
    <line x1="66" y1="232" x2="170" y2="232" stroke="rgba(0,255,136,0.03)"  strokeWidth="1"/>
  </svg>
)

export default Toucan
