import { useEffect, useRef } from 'react'

const STEPS = [
  {
    num: '01',
    title: 'Acesso liberado',
    desc: 'Você recebe acesso à plataforma antes do lançamento oficial ao público.',
  },
  {
    num: '02',
    title: 'Uso na prática',
    desc: 'Utilize o sistema no seu dia a dia clínico e explore os recursos reais.',
  },
  {
    num: '03',
    title: 'Feedback direto',
    desc: 'Compartilhe sua experiência diretamente com a equipe de desenvolvimento.',
  },
  {
    num: '04',
    title: 'Evolução do sistema',
    desc: 'Suas contribuições moldam as próximas versões do produto.',
  },
]

const WhyItMatters = () => {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

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
      { threshold: 0.15 }
    )
    stepsRef.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <section className="how-section" id="why">
      <p className="section-eyebrow">Como funciona</p>
      <h2 className="section-title">O acesso antecipado <em>em quatro etapas</em></h2>
      <p className="section-desc">
        Você entra, utiliza o sistema antes de todos e compartilha sua experiência com a equipe.
      </p>

      <div className="how-steps">
        <div className="how-steps-line" />
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="how-step"
            data-delay={String(i * 120)}
            ref={(el) => { stepsRef.current[i] = el }}
          >
            <div className="how-step-num">{step.num}</div>
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WhyItMatters
