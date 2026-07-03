const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || 'v21.0'
const MAX_CONTACTS = Number(process.env.WHATSAPP_BROADCAST_MAX || 250)

const json = (response, status, body) => {
  response.status(status).json(body)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const onlyDigits = (value) => String(value || '').replace(/\D/g, '')

const sendTextMessage = async ({ token, phoneNumberId, contact, message }) => {
  const result = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: contact.digits,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    }),
  })

  const data = await result.json().catch(() => ({}))
  return {
    ok: result.ok,
    status: result.status,
    data,
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return json(response, 405, { ok: false, error: 'Metodo nao permitido.' })
  }

  const token = process.env.WHATSAPP_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    return json(response, 500, {
      ok: false,
      error: 'Configure WHATSAPP_TOKEN e WHATSAPP_PHONE_NUMBER_ID no Vercel para liberar o envio direto.',
    })
  }

  const contacts = Array.isArray(request.body?.contacts) ? request.body.contacts : []
  const message = String(request.body?.message || '').trim()

  if (!message) return json(response, 400, { ok: false, error: 'Mensagem vazia.' })
  if (!contacts.length) return json(response, 400, { ok: false, error: 'Nenhum contato selecionado.' })
  if (contacts.length > MAX_CONTACTS) {
    return json(response, 400, {
      ok: false,
      error: `Selecione no maximo ${MAX_CONTACTS} contatos por disparo.`,
    })
  }

  const uniqueContacts = []
  const seen = new Set()
  for (const contact of contacts) {
    const digits = onlyDigits(contact?.digits)
    if (!digits || seen.has(digits)) continue
    seen.add(digits)
    uniqueContacts.push({
      name: String(contact?.name || ''),
      source: String(contact?.source || ''),
      digits,
    })
  }

  const sent = []
  const failed = []

  for (const contact of uniqueContacts) {
    const personalizedMessage = message
      .replace(/\{nome\}/gi, contact.name)
      .replace(/\{telefone\}/gi, contact.digits)
      .replace(/\{origem\}/gi, contact.source)

    const result = await sendTextMessage({ token, phoneNumberId, contact, message: personalizedMessage })

    if (result.ok) {
      sent.push({ name: contact.name, digits: contact.digits })
    } else {
      failed.push({
        name: contact.name,
        digits: contact.digits,
        status: result.status,
        error: result.data?.error?.message || 'Falha ao enviar.',
      })
    }

    await sleep(120)
  }

  return json(response, 200, {
    ok: failed.length === 0,
    sent: sent.length,
    failed: failed.length,
    failures: failed.slice(0, 10),
  })
}
