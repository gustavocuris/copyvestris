/* Cobra (Boa/Jiboia) — coiled S-curve with triangular head */
const Snake = ({ opacity = 0.12 }: { opacity?: number }) => (
  <svg viewBox="0 0 220 300" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', maxWidth: 220, height: 'auto', opacity }}>

    {/* ── BODY ── */}
    {/* upper S-curve section */}
    <path d="M 115 30 C 155 28, 175 50, 170 80 C 165 108, 138 118, 110 118
             C 82 118, 52 108, 50 138 C 48 168, 72 185, 105 190
             C 140 195, 168 185, 178 215 C 188 240, 175 265, 148 278"
      stroke="#00D966" strokeWidth="9" strokeLinecap="round" fill="none"/>
    {/* inner lighter line */}
    <path d="M 115 30 C 155 28, 175 50, 170 80 C 165 108, 138 118, 110 118
             C 82 118, 52 108, 50 138 C 48 168, 72 185, 105 190
             C 140 195, 168 185, 178 215 C 188 240, 175 265, 148 278"
      stroke="rgba(0,255,136,0.25)" strokeWidth="2" strokeLinecap="round" fill="none"/>

    {/* ── SCALE PATTERN ── */}
    {([
      [118, 44, 128, 40],  [152, 52, 160, 48],  [170, 70, 176, 64],
      [168, 95, 174, 90],  [152, 114, 158, 110],[126, 120, 130, 115],
      [98,  118, 94, 114], [68, 116, 64, 112],  [52, 132, 46, 130],
      [49, 152, 43, 152],  [56, 170, 51, 172],  [76, 184, 73, 188],
      [102, 190, 100, 195],[128, 190, 130, 195],[152, 184, 156, 188],
    ] as [number,number,number,number][]).map(([x1,y1,x2,y2], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="rgba(0,255,136,0.28)" strokeWidth="1.2" strokeLinecap="round"/>
    ))}

    {/* ── HEAD ── */}
    <path d="M 108 22 C 120 16, 135 16, 144 22 L 150 34 C 148 46, 122 48, 110 44 Z"
      fill="rgba(0,10,4,0.88)" stroke="#00D966" strokeWidth="1.8"/>
    {/* forked tongue */}
    <path d="M 128 18 L 128 8 M 128 8 L 122 2 M 128 8 L 134 2"
      stroke="rgba(240,180,41,0.7)" strokeWidth="1.2" strokeLinecap="round"/>
    {/* eye */}
    <circle cx="120" cy="26" r="5"   fill="rgba(0,4,2,0.9)" stroke="#F0B429" strokeWidth="1.2"/>
    <circle cx="120" cy="26" r="2.5" fill="rgba(240,180,41,0.6)"/>
    <circle cx="121.2" cy="25" r="0.9" fill="rgba(255,255,255,0.85)"/>
    {/* pit organ */}
    <circle cx="112" cy="30" r="1.8" fill="rgba(240,180,41,0.35)"/>

    {/* ── TAIL TIP ── */}
    <circle cx="148" cy="278" r="4" fill="rgba(0,217,102,0.4)" stroke="#00D966" strokeWidth="1"/>
  </svg>
)

export default Snake
