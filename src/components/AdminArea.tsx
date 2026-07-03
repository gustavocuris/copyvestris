import { useEffect, useMemo, useRef, useState } from 'react'
import type { Registration } from '../types'
import { supabase } from '../lib/supabase'

const ADMIN_FALLBACK_PASSWORD = 'vestris2026'
const GROUP_STATUS_STORAGE_KEY = 'vestris-group-status-v1'
type AccessAccount = 'admin' | 'partner'
type AdminView = 'overview' | 'registrations' | 'messages' | 'group' | 'partners'
type MessageAudience = 'all' | 'pending' | 'checked'

interface PartnerAccount {
  id: string
  displayName: string
  referralSource: string
  active: boolean
  registrationsCount: number
}

interface AccessPayload {
  authorized?: boolean
  account?: {
    display_name?: string
    role?: 'admin' | 'partner'
    referral_source?: string | null
  }
  registrations?: unknown[]
  partners?: Array<{
    id: string
    display_name: string
    referral_source: string
    active: boolean
    registrations_count: number
  }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapRow = (row: any): Registration => ({
  id: row.id,
  name: row.name,
  whatsapp: row.whatsapp,
  email: row.email,
  professionalType: row.professional_type,
  clinicName: row.clinic_name ?? undefined,
  city: row.city ?? undefined,
  interest: row.interest ?? undefined,
  createdAt: new Date(row.created_at).toLocaleString('pt-BR'),
  createdAtRaw: row.created_at,
  referralSource: row.referral_source ?? undefined,
})

const normalizeSource = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const startOfDay = (date: Date) => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

interface GroupContact {
  key: string
  name: string
  whatsapp: string
  digits: string
  source: string
}

const displayCell = (value: string | number | undefined | null) => {
  if (value === undefined || value === null || value === '') return '—'
  return String(value)
}

const contactKey = (registration: Registration) => {
  const digits = registration.whatsapp.replace(/\D/g, '')
  return digits || registration.email.toLowerCase().trim() || registration.name.toLowerCase().trim()
}

const whatsappDigits = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  return digits.startsWith('55') ? digits : `55${digits}`
}

const ScrollableTable = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 })

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const target = event.target as HTMLElement
    if (target.closest('button, a, input, select')) return
    const container = containerRef.current
    if (!container) return
    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: container.scrollLeft,
    }
    container.setPointerCapture(event.pointerId)
    container.classList.add('dragging')
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container || !dragRef.current.active) return
    container.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX)
  }

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current
    dragRef.current.active = false
    container?.classList.remove('dragging')
    if (container?.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId)
  }

  return (
    <div
      ref={containerRef}
      className="admin-table-wrap"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={(event) => dragRef.current.active && stopDragging(event)}
    >
      {children}
    </div>
  )
}

const AdminArea = ({ onClose }: { onClose: () => void }) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [partners, setPartners] = useState<PartnerAccount[]>([])
  const [account, setAccount] = useState<AccessAccount>('admin')
  const [accountName, setAccountName] = useState('VESTRIS')
  const [accountSource, setAccountSource] = useState('')
  const [adminView, setAdminView] = useState<AdminView>('overview')
  const [selectedSource, setSelectedSource] = useState('all')
  const [linkCopied, setLinkCopied] = useState('')
  const [partnerForm, setPartnerForm] = useState({ displayName: '', referralSource: '', password: '' })
  const [partnerMessage, setPartnerMessage] = useState('')
  const [savingPartner, setSavingPartner] = useState(false)
  const [databaseConfigured, setDatabaseConfigured] = useState(true)
  const [copiedCell, setCopiedCell] = useState('')
  const [messageAudience, setMessageAudience] = useState<MessageAudience>('pending')
  const [groupMessage, setGroupMessage] = useState('Olá, {nome}! Aqui é da VESTRIS. Tudo bem? Estamos organizando o grupo de acesso antecipado e queremos te enviar o convite.')
  const [messageCursor, setMessageCursor] = useState(0)
  const [broadcasting, setBroadcasting] = useState(false)
  const [broadcastStatus, setBroadcastStatus] = useState('')
  const [groupSearch, setGroupSearch] = useState('')
  const [groupStatus, setGroupStatus] = useState<Record<string, boolean>>(() => {
    try {
      const saved = window.localStorage.getItem(GROUP_STATUS_STORAGE_KEY)
      return saved ? JSON.parse(saved) as Record<string, boolean> : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    window.localStorage.setItem(GROUP_STATUS_STORAGE_KEY, JSON.stringify(groupStatus))
  }, [groupStatus])

  const copyTableCell = async (value: string | number | undefined | null) => {
    const text = displayCell(value)
    if (text === '—') return
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    setCopiedCell(text)
    window.setTimeout(() => setCopiedCell(''), 1200)
  }

  const copiedTitle = copiedCell ? `Copiado: ${copiedCell}` : 'Clique duas vezes para copiar'

  const copyableCell = (value: string | number | undefined | null) => {
    const text = displayCell(value)
    return (
      <td>
        <button
          type="button"
          className={`copyable-field${copiedCell === text ? ' copied' : ''}`}
          onDoubleClick={() => copyTableCell(value)}
          title={text === '—' ? undefined : copiedTitle}
        >
          {text}
        </button>
      </td>
    )
  }

  const applyPayload = (payload: AccessPayload) => {
    const accessAccount: AccessAccount = payload.account?.role === 'partner' ? 'partner' : 'admin'
    setAccount(accessAccount)
    setAccountName(payload.account?.display_name || 'VESTRIS')
    setAccountSource(payload.account?.referral_source || '')
    setRegistrations((payload.registrations || []).map(mapRow))
    setPartners((payload.partners || []).map((partner) => ({
      id: partner.id,
      displayName: partner.display_name,
      referralSource: partner.referral_source,
      active: partner.active,
      registrationsCount: Number(partner.registrations_count || 0),
    })))
    if (accessAccount === 'partner') setSelectedSource(payload.account?.referral_source || '')
  }

  const fetchDashboard = async (credential = password) => {
    const { data, error } = await supabase.rpc('get_access_dashboard', { p_password: credential })
    const payload = data as AccessPayload | null

    if (error) {
      if (credential !== ADMIN_FALLBACK_PASSWORD) {
        setPasswordError('Os logins de parceiros ainda precisam ser configurados no banco de dados.')
        return false
      }
      const fallback = await supabase.from('registrations').select('*').order('created_at', { ascending: false })
      if (fallback.error) {
        setPasswordError('Não foi possível acessar os cadastros.')
        return false
      }
      setAccount('admin')
      setAccountName('VESTRIS')
      setRegistrations((fallback.data || []).map(mapRow))
      setPartners([])
      setDatabaseConfigured(false)
      return true
    }
    if (!payload?.authorized) {
      setPasswordError('Senha incorreta. Tente novamente.')
      return false
    }

    setDatabaseConfigured(true)
    applyPayload(payload)
    return true
  }

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault()
    if (await fetchDashboard(password)) setAuthenticated(true)
  }

  const sourceOptions = useMemo(() => [
    { source: 'all', label: 'Todos', count: registrations.length },
    {
      source: 'vestris',
      label: 'VESTRIS',
      count: registrations.filter((item) => !item.referralSource).length,
    },
    ...partners.map((partner) => ({
      source: partner.referralSource,
      label: partner.displayName,
      count: registrations.filter((item) => item.referralSource === partner.referralSource).length,
    })),
  ], [partners, registrations])

  const displayedRegistrations = useMemo(() => {
    if (account === 'partner') return registrations
    if (selectedSource === 'all') return registrations
    if (selectedSource === 'vestris') return registrations.filter((item) => !item.referralSource)
    return registrations.filter((item) => item.referralSource === selectedSource)
  }, [account, registrations, selectedSource])

  const groupContacts = useMemo<GroupContact[]>(() => {
    const contacts = new Map<string, GroupContact>()

    registrations.forEach((registration) => {
      const key = contactKey(registration)
      if (!key || contacts.has(key)) return
      const source = partners.find((item) => item.referralSource === registration.referralSource)?.displayName || 'VESTRIS'
      contacts.set(key, {
        key,
        name: registration.name,
        whatsapp: registration.whatsapp,
        digits: whatsappDigits(registration.whatsapp),
        source,
      })
    })

    return [...contacts.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }, [partners, registrations])

  const filteredGroupContacts = useMemo(() => {
    const query = groupSearch.trim().toLocaleLowerCase('pt-BR')
    if (!query) return groupContacts
    return groupContacts.filter((contact) => contact.name.toLocaleLowerCase('pt-BR').startsWith(query))
  }, [groupContacts, groupSearch])

  const groupTotals = useMemo(() => {
    const inGroup = groupContacts.filter((contact) => groupStatus[contact.key]).length
    return {
      total: groupContacts.length,
      inGroup,
      pending: groupContacts.length - inGroup,
    }
  }, [groupContacts, groupStatus])

  const messageAudienceOptions = useMemo(() => [
    { value: 'all' as const, label: 'Todos', count: groupTotals.total },
    { value: 'pending' as const, label: 'Todos que ainda nao entraram', count: groupTotals.pending },
    { value: 'checked' as const, label: 'Todos que estao no grupo', count: groupTotals.inGroup },
  ], [groupTotals])

  const selectedMessageContacts = useMemo(() => {
    if (messageAudience === 'pending') return groupContacts.filter((contact) => !groupStatus[contact.key])
    if (messageAudience === 'checked') return groupContacts.filter((contact) => groupStatus[contact.key])
    return groupContacts
  }, [groupContacts, groupStatus, messageAudience])

  const metrics = useMemo(() => {
    const today = startOfDay(new Date())
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    const todayCount = displayedRegistrations.filter((item) => new Date(item.createdAtRaw) >= today).length
    const weekCount = displayedRegistrations.filter((item) => new Date(item.createdAtRaw) >= sevenDaysAgo).length
    const completeCount = displayedRegistrations.filter((item) => item.city && item.interest).length
    return {
      total: displayedRegistrations.length,
      today: todayCount,
      week: weekCount,
      complete: displayedRegistrations.length
        ? Math.round((completeCount / displayedRegistrations.length) * 100)
        : 0,
    }
  }, [displayedRegistrations])

  const weeklyData = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
    return Array.from({ length: 7 }, (_, index) => {
      const date = startOfDay(new Date())
      date.setDate(date.getDate() - (6 - index))
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      return {
        label: formatter.format(date).replace('.', ''),
        count: displayedRegistrations.filter((item) => {
          const createdAt = new Date(item.createdAtRaw)
          return createdAt >= date && createdAt < nextDay
        }).length,
      }
    })
  }, [displayedRegistrations])

  const maxWeekly = Math.max(...weeklyData.map((item) => item.count), 1)
  const selectedLabel = sourceOptions.find((item) => item.source === selectedSource)?.label || accountName
  const referralLink = accountSource
    ? `${window.location.origin}${window.location.pathname}?ref=${accountSource}`
    : ''

  const copyReferralLink = async (source: string) => {
    const link = `${window.location.origin}${window.location.pathname}?ref=${source}`
    await navigator.clipboard.writeText(link)
    setLinkCopied(source)
    window.setTimeout(() => setLinkCopied(''), 1800)
  }

  const openSource = (source: string) => {
    setSelectedSource(source)
    setAdminView('registrations')
  }

  const openList = () => {
    if (isAdmin) {
      setAdminView('registrations')
    }
    window.setTimeout(() => {
      document.getElementById('access-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  const toggleGroupStatus = (key: string) => {
    setGroupStatus((current) => ({ ...current, [key]: !current[key] }))
  }

  const openWhatsApp = (contact: GroupContact) => {
    if (!contact.digits) return
    const message = encodeURIComponent(`Olá, ${contact.name}! Aqui é da VESTRIS. Tudo bem?`)
    window.open(`https://wa.me/${contact.digits}?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  const buildGroupMessage = (contact: GroupContact) => groupMessage
    .replace(/\{nome\}/gi, contact.name)
    .replace(/\{telefone\}/gi, contact.whatsapp)
    .replace(/\{origem\}/gi, contact.source)

  const openPreparedGroupMessage = (contact: GroupContact) => {
    if (!contact.digits || !groupMessage.trim()) return
    const message = encodeURIComponent(buildGroupMessage(contact))
    window.open(`https://wa.me/${contact.digits}?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  const openNextSelectedMessage = () => {
    const contacts = selectedMessageContacts.filter((contact) => contact.digits)
    if (!contacts.length) return
    const currentIndex = messageCursor % contacts.length
    openPreparedGroupMessage(contacts[currentIndex])
    setMessageCursor((current) => (current + 1) % contacts.length)
  }

  const openAllSelectedMessages = () => {
    const contacts = selectedMessageContacts.filter((contact) => contact.digits)
    if (!contacts.length || !groupMessage.trim()) return
    contacts.forEach((contact) => openPreparedGroupMessage(contact))
    setMessageCursor(0)
  }

  const sendBroadcastMessages = async () => {
    const contacts = selectedMessageContacts.filter((contact) => contact.digits)
    if (!contacts.length || !groupMessage.trim()) return
    setBroadcasting(true)
    setBroadcastStatus(`Enviando para ${contacts.length} contato${contacts.length === 1 ? '' : 's'}...`)

    try {
      const response = await fetch('/api/whatsapp-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: groupMessage,
          contacts: contacts.map((contact) => ({
            name: contact.name,
            source: contact.source,
            digits: contact.digits,
          })),
        }),
      })
      const data = await response.json()

      if (!response.ok || !data.ok) {
        const error = data.error || data.failures?.[0]?.error || 'Nao foi possivel concluir o disparo.'
        setBroadcastStatus(`${error}${data.sent ? ` Enviadas: ${data.sent}.` : ''}`)
        return
      }

      setBroadcastStatus(`Disparo concluido: ${data.sent} mensagem${data.sent === 1 ? '' : 's'} enviada${data.sent === 1 ? '' : 's'}.`)
    } catch {
      setBroadcastStatus('Nao foi possivel chamar a API de envio. Verifique o deploy no Vercel.')
    } finally {
      setBroadcasting(false)
    }
  }

  const changeAdminView = (view: AdminView) => {
    setAdminView(view)
    window.setTimeout(() => {
      document.querySelector('.admin-workspace')?.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('registrations').delete().eq('id', id)
    setRegistrations((current) => current.filter((registration) => registration.id !== id))
  }

  const savePartner = async (event: React.FormEvent) => {
    event.preventDefault()
    const referralSource = normalizeSource(partnerForm.referralSource || partnerForm.displayName)
    if (!partnerForm.displayName.trim() || !referralSource || partnerForm.password.length < 6) {
      setPartnerMessage('Preencha o nome, o código do link e uma senha com pelo menos 6 caracteres.')
      return
    }
    setSavingPartner(true)
    setPartnerMessage('')
    const { data, error } = await supabase.rpc('admin_save_partner', {
      p_admin_password: password,
      p_display_name: partnerForm.displayName.trim(),
      p_referral_source: referralSource,
      p_partner_password: partnerForm.password,
    })
    if (error || data !== true) {
      setPartnerMessage('Não foi possível cadastrar. Verifique se o código do link já está em uso.')
    } else {
      setPartnerMessage('Parceiro cadastrado com sucesso.')
      setPartnerForm({ displayName: '', referralSource: '', password: '' })
      await fetchDashboard(password)
    }
    setSavingPartner(false)
  }

  const togglePartner = async (partner: PartnerAccount) => {
    const { data, error } = await supabase.rpc('admin_toggle_partner', {
      p_admin_password: password,
      p_referral_source: partner.referralSource,
      p_active: !partner.active,
    })
    if (!error && data === true) await fetchDashboard(password)
  }

  const isAdmin = account === 'admin'

  const renderDashboard = () => (
    <>
      <section className="admin-metrics">
        <article className="admin-metric primary"><span>Total de acessos</span><strong>{metrics.total}</strong><small>{selectedLabel}</small></article>
        <article className="admin-metric"><span>Hoje</span><strong>{metrics.today}</strong><small>novos cadastros</small></article>
        <article className="admin-metric"><span>Últimos 7 dias</span><strong>{metrics.week}</strong><small>novos contatos</small></article>
        <article className="admin-metric"><span>Perfis completos</span><strong>{metrics.complete}%</strong><small>cidade e interesse</small></article>
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-chart-panel">
          <div className="admin-section-heading">
            <div><span>Movimento da lista</span><h3>Cadastros por dia</h3></div>
            <strong>{metrics.week} na semana</strong>
          </div>
          <div className="admin-week-chart">
            {weeklyData.map((item) => (
              <div className="admin-week-column" key={item.label}>
                <b>{item.count}</b>
                <div className="admin-week-track">
                  <i style={{ height: `${Math.max((item.count / maxWeekly) * 100, item.count ? 10 : 2)}%` }} />
                </div>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-source-panel">
          <div className="admin-section-heading"><div><span>Distribuição</span><h3>Acessos por origem</h3></div></div>
          <div className="admin-source-list">
            {sourceOptions.filter((item) => item.source !== 'all').map((item) => (
              <button key={item.source} onClick={() => openSource(item.source)}>
                <span>{item.label}</span><strong>{item.count}</strong>
              </button>
            ))}
          </div>
        </article>
      </section>
    </>
  )

  return (
    <div className="modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal admin-workspace" role="dialog" aria-modal="true" aria-label="Área administrativa">
        <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>

        {!authenticated ? (
          <div className="admin-login-shell">
            <form onSubmit={handleAuth} className="password-form">
              <label htmlFor="admin-password">Senha de acesso</label>
              <div className="password-input-wrap">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setPasswordError('')
                  }}
                  placeholder="••••••••••"
                  autoFocus
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
              {passwordError && <p className="password-error">{passwordError}</p>}
              <button type="submit" className="btn-green">Entrar</button>
            </form>
          </div>
        ) : (
          <>
            <header className="admin-page-header">
              <div>
                <span className="admin-eyebrow">{isAdmin ? 'Painel administrativo' : 'Painel do parceiro'}</span>
                <h2>{accountName}</h2>
                <p className="modal-subtitle">Lista de acesso antecipado VESTRIS</p>
              </div>
              <div className="admin-header-actions">
                <button className="btn-green" onClick={openList}>Ver lista</button>
                <button className="btn-green" onClick={() => fetchDashboard(password)}>Atualizar</button>
                <button className="btn-danger" onClick={onClose}>Sair</button>
              </div>
            </header>

            {!isAdmin && (
              <section className="partner-share-box">
                <div>
                  <span>Seu link de divulgação</span>
                  <strong>{referralLink}</strong>
                  <small>Todo cadastro feito por este endereço aparecerá somente na sua lista.</small>
                </div>
                <button className="btn-green" onClick={() => copyReferralLink(accountSource)}>
                  {linkCopied === accountSource ? 'Link copiado!' : 'Copiar link'}
                </button>
              </section>
            )}

            {isAdmin && (
              <nav className="admin-tabs" aria-label="Navegação administrativa">
                <button className={adminView === 'overview' ? 'active' : ''} onClick={() => changeAdminView('overview')}>Visão geral</button>
                <button className={adminView === 'registrations' ? 'active' : ''} onClick={() => changeAdminView('registrations')}>Cadastros</button>
                <button className={adminView === 'messages' ? 'active' : ''} onClick={() => changeAdminView('messages')}>Mensagem automática <span>{selectedMessageContacts.length}</span></button>
                <button className={adminView === 'group' ? 'active' : ''} onClick={() => changeAdminView('group')}>Grupo de acesso antecipado <span>{groupTotals.pending}</span></button>
                <button className={adminView === 'partners' ? 'active' : ''} onClick={() => changeAdminView('partners')}>Parceiros <span>{partners.length}</span></button>
              </nav>
            )}

            {(!isAdmin || adminView === 'overview') && renderDashboard()}

            {isAdmin && adminView === 'partners' && (
              <div className="partner-management">
                {!databaseConfigured && (
                  <div className="admin-database-warning">
                    Execute <strong>supabase-partners.sql</strong> no Supabase para liberar contas, senhas e links.
                  </div>
                )}
                <form className="partner-create-form" onSubmit={savePartner}>
                  <div className="partner-create-head">
                    <div><h3>Novo parceiro</h3><p>Crie o acesso e o link exclusivo de divulgação.</p></div>
                    <button className="btn-green" type="submit" disabled={savingPartner || !databaseConfigured}>
                      {savingPartner ? 'Salvando...' : 'Cadastrar'}
                    </button>
                  </div>
                  <div className="partner-create-fields">
                    <label>Nome da conta<input value={partnerForm.displayName} onChange={(event) => setPartnerForm((current) => ({ ...current, displayName: event.target.value, referralSource: current.referralSource || normalizeSource(event.target.value) }))} placeholder="Ex: Dra. Ana Souza" /></label>
                    <label>Código do link<input value={partnerForm.referralSource} onChange={(event) => setPartnerForm((current) => ({ ...current, referralSource: normalizeSource(event.target.value) }))} placeholder="Ex: ana-souza" /></label>
                    <label>Senha inicial<input type="password" value={partnerForm.password} onChange={(event) => setPartnerForm((current) => ({ ...current, password: event.target.value }))} placeholder="Mínimo 6 caracteres" /></label>
                  </div>
                  {partnerMessage && <p className="partner-form-message">{partnerMessage}</p>}
                </form>

                <div className="partner-account-grid">
                  {partners.map((partner) => {
                    const partnerUrl = `${window.location.origin}${window.location.pathname}?ref=${partner.referralSource}`
                    return (
                      <article className="partner-account-card" key={partner.id}>
                        <div className="partner-account-top">
                          <div><span className={`partner-status ${partner.active ? 'active' : 'inactive'}`}>{partner.active ? 'Ativa' : 'Inativa'}</span><h3>{partner.displayName}</h3></div>
                          <strong>{partner.registrationsCount}</strong>
                        </div>
                        <div className="partner-card-link">{partnerUrl}</div>
                        <p>{partner.registrationsCount === 1 ? 'cadastro captado' : 'cadastros captados'}</p>
                        <div className="partner-account-actions">
                          <button className="btn-green" onClick={() => openSource(partner.referralSource)}>Ver lista</button>
                          <button className="btn-green" onClick={() => copyReferralLink(partner.referralSource)}>{linkCopied === partner.referralSource ? 'Copiado!' : 'Copiar link'}</button>
                          <button className={partner.active ? 'btn-danger' : 'btn-green'} onClick={() => togglePartner(partner)}>{partner.active ? 'Desativar' : 'Ativar'}</button>
                        </div>
                      </article>
                    )
                  })}
                  {partners.length === 0 && <div className="empty-state">Nenhuma conta parceira cadastrada.</div>}
                </div>
              </div>
            )}

            {(isAdmin && adminView === 'registrations') && (
              <section className="admin-registration-section" id="access-list">
                <div className="admin-list-toolbar">
                  <div>
                    <span>Visualizando</span>
                    <h3>{selectedLabel}</h3>
                  </div>
                  <select value={selectedSource} onChange={(event) => setSelectedSource(event.target.value)}>
                    {sourceOptions.map((option) => <option key={option.source} value={option.source}>{option.label} ({option.count})</option>)}
                  </select>
                </div>
                <div className="admin-list-summary">
                  <span>{displayedRegistrations.length}</span>
                  <p>{displayedRegistrations.length === 1 ? 'pessoa cadastrada' : 'pessoas cadastradas'} em {selectedLabel}</p>
                </div>
                {displayedRegistrations.length === 0 ? (
                  <div className="empty-state">Nenhum cadastro encontrado ainda.</div>
                ) : (
                  <ScrollableTable>
                    <table className="admin-table">
                      <thead><tr><th>#</th><th>Nome</th><th>WhatsApp</th><th>E-mail</th><th>Tipo</th><th>Clínica</th><th>Cidade</th><th>Interesse</th><th>Origem</th><th>Cadastro</th><th></th></tr></thead>
                      <tbody>
                        {displayedRegistrations.map((registration, index) => (
                          <tr key={registration.id}>
                            {copyableCell(index + 1)}
                            {copyableCell(registration.name)}
                            {copyableCell(registration.whatsapp)}
                            {copyableCell(registration.email)}
                            {copyableCell(registration.professionalType)}
                            {copyableCell(registration.clinicName)}
                            {copyableCell(registration.city)}
                            {copyableCell(registration.interest)}
                            {copyableCell(partners.find((item) => item.referralSource === registration.referralSource)?.displayName || 'VESTRIS')}
                            {copyableCell(registration.createdAt)}
                            <td><button className="btn-delete-row" onClick={() => handleDelete(registration.id)} title="Excluir">×</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollableTable>
                )}
              </section>
            )}

            {isAdmin && adminView === 'messages' && (
              <section className="admin-registration-section message-tab-section" id="access-message-center">
                <section className="group-message-panel" aria-label="Enviar mensagem para contatos filtrados">
                  <div className="group-message-head">
                    <div>
                      <span>Mensagem automatica</span>
                      <h3>Enviar convites pelo WhatsApp</h3>
                      <p>Use {'{nome}'}, {'{telefone}'} ou {'{origem}'} para personalizar.</p>
                    </div>
                    <strong>{selectedMessageContacts.length} selecionados</strong>
                  </div>
                  <div className="group-message-body">
                    <label className="group-message-compose">
                      <div className="group-message-label">
                        <span>Mensagem</span>
                        <small>Texto enviado para cada contato selecionado</small>
                      </div>
                      <textarea
                        value={groupMessage}
                        onChange={(event) => setGroupMessage(event.target.value)}
                        placeholder="Escreva aqui a mensagem que sera enviada pelo WhatsApp..."
                        rows={6}
                      />
                    </label>
                    <div className="group-message-side">
                      <div className="group-message-card">
                        <span className="group-message-card-title">Publico do disparo</span>
                        <div className="group-message-options">
                          {messageAudienceOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className={messageAudience === option.value ? 'active' : ''}
                              onClick={() => {
                                setMessageAudience(option.value)
                                setMessageCursor(0)
                              }}
                            >
                              <span>{option.label}</span>
                              <strong>{option.count}</strong>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="group-message-card">
                        <span className="group-message-card-title">Envio</span>
                        <div className="group-message-actions">
                          <button
                            type="button"
                            className="group-message-send"
                            onClick={sendBroadcastMessages}
                            disabled={broadcasting || !selectedMessageContacts.some((contact) => contact.digits) || !groupMessage.trim()}
                          >
                            {broadcasting ? 'Enviando...' : 'Enviar direto para todos'}
                          </button>
                          <button
                            type="button"
                            className="group-message-send secondary"
                            onClick={openAllSelectedMessages}
                            disabled={broadcasting || !selectedMessageContacts.some((contact) => contact.digits) || !groupMessage.trim()}
                          >
                            Abrir todos no WhatsApp
                          </button>
                          <button
                            type="button"
                            className="group-message-send secondary"
                            onClick={openNextSelectedMessage}
                            disabled={broadcasting || !selectedMessageContacts.some((contact) => contact.digits) || !groupMessage.trim()}
                          >
                            Abrir proximo no WhatsApp
                          </button>
                          {broadcastStatus && <small className="broadcast-status">{broadcastStatus}</small>}
                          <small>O envio direto usa a API oficial configurada no Vercel. Os botoes do WhatsApp ficam como plano B.</small>
                          <small>
                            {selectedMessageContacts.length
                              ? `Contato ${Math.min(messageCursor + 1, selectedMessageContacts.length)} de ${selectedMessageContacts.length}`
                              : 'Nenhum contato nessa selecao'}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </section>
            )}

            {isAdmin && adminView === 'group' && (
              <section className="admin-registration-section group-tab-section" id="access-group-list">
                <section className="group-control-panel" aria-label="Controle de entrada no grupo da VESTRIS">
                  <div className="group-control-head">
                    <div>
                      <span>Controle do grupo</span>
                      <h3>Lista VESTRIS sem duplicados</h3>
                    </div>
                    <div className="group-control-metrics">
                      <strong><b>{groupTotals.total}</b>Total</strong>
                      <strong><b>{groupTotals.inGroup}</b>No grupo</strong>
                      <strong><b>{groupTotals.pending}</b>Faltam</strong>
                    </div>
                  </div>

                  <label className="group-search">
                    <span>Buscar pessoa</span>
                    <input
                      type="search"
                      value={groupSearch}
                      onChange={(event) => setGroupSearch(event.target.value)}
                      placeholder="Digite o inicio do nome"
                    />
                    <small>{filteredGroupContacts.length} resultado{filteredGroupContacts.length === 1 ? '' : 's'}</small>
                  </label>

                  {groupContacts.length === 0 ? (
                    <div className="empty-state">Nenhum contato disponível para controle do grupo.</div>
                  ) : filteredGroupContacts.length === 0 ? (
                    <div className="empty-state">Nenhum contato encontrado para essa busca.</div>
                  ) : (
                    <>
                      <div className="group-contact-list">
                        {filteredGroupContacts.map((contact, index) => {
                          const isChecked = Boolean(groupStatus[contact.key])
                          return (
                            <article className={`group-contact-row${isChecked ? ' checked' : ''}`} key={contact.key}>
                              <span className="group-contact-number">{index + 1}</span>
                              <button className="group-contact-name" type="button" onDoubleClick={() => copyTableCell(contact.name)}>
                                {contact.name}
                              </button>
                              <button className="group-contact-phone" type="button" onDoubleClick={() => copyTableCell(contact.whatsapp)}>
                                {contact.whatsapp}
                              </button>
                              <button className="group-contact-source" type="button" onDoubleClick={() => copyTableCell(contact.source)}>
                                {contact.source}
                              </button>
                              <button
                                className="group-whatsapp-btn"
                                type="button"
                                onClick={() => openWhatsApp(contact)}
                                disabled={!contact.digits}
                              >
                                WhatsApp
                              </button>
                              <button
                                className="group-check-btn"
                                type="button"
                                onClick={() => toggleGroupStatus(contact.key)}
                                aria-pressed={isChecked}
                                aria-label={isChecked ? 'Remover marca de entrada no grupo' : 'Marcar como entrou no grupo'}
                                title={isChecked ? 'Marcar como fora do grupo' : 'Marcar como entrou no grupo'}
                              />
                            </article>
                          )
                        })}
                      </div>
                    </>
                  )}
                </section>
              </section>
            )}

            {!isAdmin && (
              <section className="admin-registration-section partner-own-list" id="access-list">
                <div className="admin-section-heading"><div><span>Seus contatos</span><h3>Lista completa</h3></div><strong>{registrations.length}</strong></div>
                {registrations.length === 0 ? <div className="empty-state">Nenhum cadastro pelo seu link ainda.</div> : (
                  <ScrollableTable>
                    <table className="admin-table">
                      <thead><tr><th>#</th><th>Nome</th><th>WhatsApp</th><th>E-mail</th><th>Tipo</th><th>Cidade</th><th>Interesse</th><th>Cadastro</th></tr></thead>
                      <tbody>
                        {registrations.map((registration, index) => (
                          <tr key={registration.id}>
                            {copyableCell(index + 1)}
                            {copyableCell(registration.name)}
                            {copyableCell(registration.whatsapp)}
                            {copyableCell(registration.email)}
                            {copyableCell(registration.professionalType)}
                            {copyableCell(registration.city)}
                            {copyableCell(registration.interest)}
                            {copyableCell(registration.createdAt)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollableTable>
                )}
              </section>
            )}

            <nav className="admin-mobile-nav" aria-label="Navegação móvel do painel">
              {isAdmin ? (
                <>
                  <button className={adminView === 'overview' ? 'active' : ''} onClick={() => changeAdminView('overview')}>Início</button>
                  <button className={adminView === 'registrations' ? 'active' : ''} onClick={() => changeAdminView('registrations')}>Cadastros</button>
                  <button className={adminView === 'messages' ? 'active' : ''} onClick={() => changeAdminView('messages')}>Msg</button>
                  <button className={adminView === 'group' ? 'active' : ''} onClick={() => changeAdminView('group')}>Grupo</button>
                  <button className={adminView === 'partners' ? 'active' : ''} onClick={() => changeAdminView('partners')}>Parceiros</button>
                </>
              ) : (
                <>
                  <button onClick={() => document.querySelector('.admin-workspace')?.scrollTo({ top: 0, behavior: 'smooth' })}>Início</button>
                  <button onClick={openList}>Cadastros</button>
                </>
              )}
              <button className="admin-mobile-exit" onClick={onClose}>Sair</button>
            </nav>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminArea
