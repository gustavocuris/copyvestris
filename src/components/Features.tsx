import { useEffect, useRef } from 'react'

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
)
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconMessage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconActivity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)

const CARDS = [
  { icon: <IconCheck />,     title: 'Uso real no dia a dia',            desc: 'Teste o sistema dentro da sua rotina clínica antes de qualquer lançamento público.' },
  { icon: <IconUsers />,     title: 'Construção conjunta',              desc: 'Suas necessidades e feedbacks ajudam diretamente a moldar o sistema.' },
  { icon: <IconMessage />,   title: 'Contato direto com o time',        desc: 'Comunicação direta com a equipe de desenvolvimento durante todo o processo.' },
  { icon: <IconBook />,      title: 'Base científica estruturada',      desc: 'Informações organizadas por espécie, doença e manejo com respaldo técnico.' },
  { icon: <IconZap />,       title: 'Acesso antes de todos',            desc: 'Você entra antes do lançamento público e experimenta o produto em primeira mão.' },
  { icon: <IconActivity />,  title: 'Dosagens e protocolos',            desc: 'Calcule doses por peso e espécie. Acesse protocolos clínicos por procedimento.' },
]

const Features = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = parseInt(el.dataset.delay || '0', 10)
            setTimeout(() => el.classList.add('visible'), delay)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.12 }
    )
    cardsRef.current.forEach((c) => { if (c) observer.observe(c) })
    return () => observer.disconnect()
  }, [])

  return (
    <section className="value-section" id="features">
      <p className="section-eyebrow">Por que entrar agora</p>
      <h2 className="section-title">Vantagens de quem <em>entra desde o início</em></h2>
      <p className="section-desc">
        Quem entra agora não é apenas usuário. É parte da construção.
      </p>

      <div className="value-grid">
        {CARDS.map((card, i) => (
          <div
            key={card.title}
            className="value-card"
            data-delay={String(i * 80)}
            ref={(el) => { cardsRef.current[i] = el }}
          >
            <div className="value-card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
