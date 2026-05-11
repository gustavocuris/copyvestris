import { useState } from 'react'
import type { Registration } from '../types'
import Particles from './Particles'

const ADMIN_PASSWORD = 'vestris2026'

const AdminArea = ({ onClose }: { onClose: () => void }) => {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      const data: Registration[] = JSON.parse(
        localStorage.getItem('vestris_registrations') || '[]'
      )
      setRegistrations(data)
      setAuthenticated(true)
    } else {
      setPasswordError('Senha incorreta. Tente novamente.')
      setPassword('')
    }
  }

  const handleDelete = (id: string) => {
    const updated = registrations.filter((r) => r.id !== id)
    localStorage.setItem('vestris_registrations', JSON.stringify(updated))
    setRegistrations(updated)
  }

  const handleRefresh = () => {
    const data: Registration[] = JSON.parse(
      localStorage.getItem('vestris_registrations') || '[]'
    )
    setRegistrations(data)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Área administrativa">
        <Particles />
        <button className="modal-close" onClick={onClose} aria-label="Fechar">✕</button>

        {!authenticated ? (
          <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center'}}>
            <h2>Área Administrativa</h2>
            <p className="modal-subtitle">Acesso restrito. Informe a senha para continuar.</p>

            <form onSubmit={handleAuth} className="password-form">
              <label htmlFor="admin-password">Senha de acesso</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError('')
                }}
                placeholder="••••••••••"
                autoFocus
                autoComplete="current-password"
              />
              {passwordError && <p className="password-error">{passwordError}</p>}
              <button type="submit" className="btn-green">Entrar</button>
            </form>
          </div>
        ) : (
          <>
            <h2>
              Lista de Acesso Antecipado
              <span className="admin-count">{registrations.length} cadastro{registrations.length !== 1 ? 's' : ''}</span>
            </h2>
            <p className="modal-subtitle">Todos os cadastros realizados na página.</p>

            <div className="modal-actions">
              <button className="btn-green" onClick={handleRefresh}>↻ Atualizar</button>
            </div>

            {registrations.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum cadastro encontrado ainda.</p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>WhatsApp</th>
                      <th>E-mail</th>
                      <th>Tipo</th>
                      <th>Clínica / Hospital</th>
                      <th>Cidade</th>
                      <th>Interesse</th>
                      <th>Cadastrado em</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, idx) => (
                      <tr key={reg.id}>
                        <td>{idx + 1}</td>
                        <td>{reg.name}</td>
                        <td>{reg.whatsapp}</td>
                        <td>{reg.email}</td>
                        <td>{reg.professionalType}</td>
                        <td>{reg.clinicName || '—'}</td>
                        <td>{reg.city || '—'}</td>
                        <td>{reg.interest || '—'}</td>
                        <td>{reg.createdAt}</td>
                        <td>
                          <button className="btn-delete-row" onClick={() => handleDelete(reg.id)} title="Excluir">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4h6v2"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminArea
