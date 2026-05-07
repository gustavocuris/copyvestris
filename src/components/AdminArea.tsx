import { useState } from 'react'
import type { Registration } from '../types'

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

  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar toda a lista? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('vestris_registrations')
      setRegistrations([])
    }
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
        <button className="modal-close" onClick={onClose} aria-label="Fechar">✕</button>

        {!authenticated ? (
          <>
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
          </>
        ) : (
          <>
            <h2>
              Lista de Acesso Antecipado
              <span className="admin-count">{registrations.length} cadastro{registrations.length !== 1 ? 's' : ''}</span>
            </h2>
            <p className="modal-subtitle">Todos os cadastros realizados na página.</p>

            <div className="modal-actions">
              <button className="btn-green" onClick={handleRefresh}>↻ Atualizar</button>
              {registrations.length > 0 && (
                <button className="btn-danger" onClick={handleClear}>🗑 Limpar lista</button>
              )}
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
