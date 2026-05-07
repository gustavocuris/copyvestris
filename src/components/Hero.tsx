interface Props {
  openForm: () => void
}

const Hero = ({ openForm }: Props) => {

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">Acesso Antecipado</p>

        <h1 className="hero-title">VESTRIS</h1>

        <p className="hero-subtitle">
          O primeiro sistema do Brasil focado em animais silvestres e exóticos
        </p>

        <button className="hero-cta" onClick={openForm}>
          Quero acesso antecipado
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <p className="hero-strip">
        Tenha acesso antecipado, influencie o desenvolvimento e faça parte desde o início.
      </p>
    </section>
  )
}

export default Hero
