import { useState } from 'react'
import AdminArea from './AdminArea'

const Footer = () => {
  const [showAdmin, setShowAdmin] = useState(false)

  return (
    <>
      <footer className="footer">
        <div className="footer-logo">VESTRIS</div>
        <p>© {new Date().getFullYear()} VESTRIS. Todos os direitos reservados.</p>
        <p>O primeiro sistema do Brasil focado em animais silvestres e exóticos.</p>
        <button className="footer-admin-btn" onClick={() => setShowAdmin(true)}>
          Ver lista
        </button>
      </footer>

      {showAdmin && <AdminArea onClose={() => setShowAdmin(false)} />}
    </>
  )
}

export default Footer
