import { useState, useEffect } from 'react'

const TOTAL = 3 * 3600 + 12 * 60 + 10 // 11530 seconds

const Countdown = () => {
  const [secs, setSecs] = useState(TOTAL)

  useEffect(() => {
    const id = setInterval(() => setSecs(prev => Math.max(0, prev - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const p = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="countdown-wrap">
      <div className="countdown-header">
        <p className="countdown-title">Vagas Abertas</p>
        <p className="countdown-label">encerram em</p>
      </div>
      <div className="countdown-digits">
        <div className="countdown-block">
          <span className="countdown-num">02</span>
          <span className="countdown-unit">dias</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-block">
          <span className="countdown-num">{p(h)}</span>
          <span className="countdown-unit">horas</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-block">
          <span className="countdown-num">{p(m)}</span>
          <span className="countdown-unit">min</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-block">
          <span className="countdown-num">{p(s)}</span>
          <span className="countdown-unit">seg</span>
        </div>
      </div>
    </div>
  )
}

export default Countdown
