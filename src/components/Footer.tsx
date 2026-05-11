import { useState } from 'react'
import AdminArea from './AdminArea'

const Footer = () => {
  const [showAdmin, setShowAdmin] = useState(false)

  return (
    <>
      <footer className="footer">
        <div className="footer-logo">VESTRIS</div>
        <p className="footer-tagline">O primeiro sistema do Brasil focado em animais silvestres e exóticos.</p>
        <div className="footer-links">
          <span style={{display:'flex',alignItems:'center',gap:'4px'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Dados protegidos
          </span>
          <span>·</span>
          <span>Privacidade</span>
          <span>·</span>
          <span>Termos de uso</span>
          <span>·</span>
          <a href="https://wa.me/5511939214936" target="_blank" rel="noopener noreferrer">WhatsApp: (11) 93921-4936</a>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} VESTRIS. Todos os direitos reservados.</p>
        <button className="footer-admin-btn" onClick={() => setShowAdmin(true)}>
          Ver lista
        </button>
      </footer>

      {showAdmin && <AdminArea onClose={() => setShowAdmin(false)} />}
    </>
  )
}

export default Footer
