import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  r: number
  dx: number
  dy: number
  alpha: number
  alphaDir: number
}

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []
    const COUNT = 55

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const rand = (min: number, max: number) => Math.random() * (max - min) + min

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        r: rand(1, 3.5),
        dx: rand(-0.25, 0.25),
        dy: rand(-0.25, 0.25),
        alpha: rand(0.1, 0.5),
        alphaDir: rand(-0.003, 0.003),
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.dx
        p.y += p.dy
        p.alpha += p.alphaDir
        if (p.alpha <= 0.05 || p.alpha >= 0.55) p.alphaDir *= -1
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139,195,74,${p.alpha})`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

export default Particles
