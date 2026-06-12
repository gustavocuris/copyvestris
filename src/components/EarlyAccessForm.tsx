import { useState } from 'react'
import Particles from './Particles'
import { supabase } from '../lib/supabase'

interface Props {
  onClose: () => void
  referralSource?: string
}

const PROFESSIONAL_TYPES = [
  'Veterinário(a) autônomo(a)',
  'Clínica veterinária',
  'Hospital veterinário',
  'Estudante de veterinária',
  'Outro',
]

const INTEREST_OPTIONS = [
  'Consulta por espécie',
  'Cálculo de dosagem',
  'Prontuário',
  'Manejo',
  'Protocolos',
  'Parceria',
  'Outro',
]

const NEEDS_CLINIC = ['Clínica veterinária', 'Hospital veterinário']

interface FormData {
  name: string
  whatsapp: string
  email: string
  professionalType: string
  clinicName: string
  city: string
  interest: string
}

interface Errors {
  name?: string
  whatsapp?: string
  email?: string
  professionalType?: string
}

const EarlyAccessForm = ({ onClose, referralSource = '' }: Props) => {
  const [form, setForm] = useState<FormData>({
    name: '',
    whatsapp: '',
    email: '',
    professionalType: '',
    clinicName: '',
    city: '',
    interest: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const showClinicField = NEEDS_CLINIC.includes(form.professionalType)

  const validate = (): boolean => {
    const errs: Errors = {}
    if (!form.name.trim() || form.name.trim().length < 3) {
      errs.name = 'Informe seu nome completo.'
    }
    const rawWa = form.whatsapp.replace(/\D/g, '')
    if (!rawWa || rawWa.length < 10) {
      errs.whatsapp = 'Informe um WhatsApp válido com DDD.'
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Informe um e-mail válido.'
    }
    if (!form.professionalType) {
      errs.professionalType = 'Selecione o tipo de profissional.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target
    let { value } = e.target
    if (name === 'whatsapp') {
      const digits = value.replace(/\D/g, '').slice(0, 11)
      if (digits.length <= 2) value = digits.length ? `(${digits}` : ''
      else if (digits.length <= 7) value = `(${digits.slice(0,2)}) ${digits.slice(2)}`
      else if (digits.length <= 10) value = `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`
      else value = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
    }
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const registration = {
      p_name: form.name.trim(),
      p_whatsapp: form.whatsapp.trim(),
      p_email: form.email.trim(),
      p_professional_type: form.professionalType,
      p_clinic_name: showClinicField ? form.clinicName.trim() || null : null,
      p_city: form.city.trim() || null,
      p_interest: form.interest || null,
      p_referral_source: referralSource || null,
    }
    const { data, error } = await supabase.rpc('register_early_access', registration)

    // Keep the original VESTRIS form available while the additive migration is deployed.
    if (error?.code === 'PGRST202' && !referralSource) {
      const { error: fallbackError } = await supabase.from('registrations').insert({
        name: registration.p_name,
        whatsapp: registration.p_whatsapp,
        email: registration.p_email,
        professional_type: registration.p_professional_type,
        clinic_name: registration.p_clinic_name,
        city: registration.p_city,
        interest: registration.p_interest,
      })
      setLoading(false)
      if (!fallbackError) {
        setSubmitted(true)
        return
      }
      alert('Erro ao salvar cadastro. Tente novamente.')
      return
    }

    setLoading(false)
    if (!error && data === true) {
      setSubmitted(true)
    } else if (!error && data === false) {
      alert('Este link de parceiro não está ativo. Solicite um novo link.')
    } else {
      alert('Erro ao salvar cadastro. Verifique a configuração do banco de dados.')
    }
  }

  return (
    <div className="form-screen">
      <Particles />
      <nav className="form-screen-nav">
        <div className="form-screen-logo">VEST<span>RIS</span></div>
        <button className="form-screen-close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
          Voltar
        </button>
      </nav>

      <div className="form-screen-body">
        <div className="form-screen-inner">
          <div className="form-screen-header">
            <p className="section-eyebrow">Lista de espera</p>
            <h2 className="section-title">
              Participe da construção do<br /><em>primeiro sistema do Brasil</em>
            </h2>
            <p className="section-desc">
              Tenha acesso antecipado, influencie o desenvolvimento e faça parte desde o início.
            </p>
          </div>

        <div className="form-card">
          {submitted ? (
            <div className="success-message">
              <div className="success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3>Cadastro realizado com sucesso!</h3>
              <p>
                Obrigado pelo interesse na VESTRIS.<br />
                Em breve entraremos em contato com as próximas novidades.
              </p>
              <button className="success-back-btn" onClick={onClose}>
                Voltar à página
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="name">
                  Nome completo <span className="required">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  autoComplete="name"
                />
                {errors.name && <p className="form-error-msg">{errors.name}</p>}
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="whatsapp">
                    WhatsApp <span className="required">*</span>
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={form.whatsapp}
                    onChange={handleChange}
                    className={errors.whatsapp ? 'error' : ''}
                    autoComplete="tel"
                  />
                  {errors.whatsapp && <p className="form-error-msg">{errors.whatsapp}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="email">
                    E-mail <span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    autoComplete="email"
                  />
                  {errors.email && <p className="form-error-msg">{errors.email}</p>}
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="professionalType">
                  Tipo de profissional <span className="required">*</span>
                </label>
                <select
                  id="professionalType"
                  name="professionalType"
                  value={form.professionalType}
                  onChange={handleChange}
                  className={errors.professionalType ? 'error' : ''}
                >
                  <option value="">Selecione uma opção</option>
                  {PROFESSIONAL_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.professionalType && (
                  <p className="form-error-msg">{errors.professionalType}</p>
                )}
              </div>

              {showClinicField && (
                <div className="form-field">
                  <label htmlFor="clinicName">
                    Nome da clínica ou hospital
                  </label>
                  <input
                    id="clinicName"
                    name="clinicName"
                    type="text"
                    placeholder="Nome da sua clínica ou hospital"
                    value={form.clinicName}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="city">Cidade e estado</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Ex: São Paulo - SP"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="interest">Principal interesse</label>
                  <select
                    id="interest"
                    name="interest"
                    value={form.interest}
                    onChange={handleChange}
                  >
                    <option value="">Selecione (opcional)</option>
                    {INTEREST_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-form" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Garantir acesso'}
              </button>
            </form>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default EarlyAccessForm
