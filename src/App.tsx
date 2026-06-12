import { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Features from './components/Features'
import WhyItMatters from './components/WhyItMatters'
import EarlyAccessForm from './components/EarlyAccessForm'
import Footer from './components/Footer'

function App() {
  const referralSource = new URLSearchParams(window.location.search).get('ref') || ''
  const [showForm, setShowForm] = useState(() => Boolean(referralSource))
  const openForm  = () => setShowForm(true)
  const closeForm = () => setShowForm(false)

  return (
    <div className="app">
      <Navbar openForm={openForm} />
      <Hero openForm={openForm} />
      <div className="countdown-section">
        <Countdown />
      </div>
      <WhyItMatters />
      <Features />

      <section className="cta-section">
        <div className="cta-block">
          <p className="section-eyebrow">Lista de espera</p>
          <h2 className="section-title">
            Participe da construção do <em>primeiro sistema do Brasil</em>
          </h2>
          <button className="cta-btn" onClick={openForm}>
            Garantir acesso antecipado
          </button>
          <span className="cta-btn-note">Gratuito durante o período de acesso antecipado</span>
        </div>
      </section>

      <Footer />

      {showForm && <EarlyAccessForm onClose={closeForm} referralSource={referralSource} />}
    </div>
  )
}

export default App
