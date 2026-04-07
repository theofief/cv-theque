import { useState } from 'react'
import { useAppStore } from '../context/useAppStore'

export default function MessagingPage() {
  const { state, actions } = useAppStore()
  const [form, setForm] = useState({
    from: state.students[0].name,
    fromType: 'student',
    to: state.companies[0].name,
    toType: 'company',
    content: '',
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.content.trim()) {
      return
    }
    actions.addMessage({ ...form, content: form.content.trim() })
    setForm((current) => ({ ...current, content: '' }))
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Messagerie interne student / company</h2>
        <p>
          La liste est reactive: chaque envoi ajoute un message sans recharger la page.
        </p>
      </div>

      <form className="formGrid" onSubmit={handleSubmit}>
        <label>
          Expediteur
          <input
            value={form.from}
            onChange={(event) => setForm((c) => ({ ...c, from: event.target.value }))}
          />
        </label>
        <label>
          Type expediteur
          <select
            value={form.fromType}
            onChange={(event) =>
              setForm((c) => ({ ...c, fromType: event.target.value }))
            }
          >
            <option value="student">Student</option>
            <option value="company">Company</option>
          </select>
        </label>
        <label>
          Destinataire
          <input
            value={form.to}
            onChange={(event) => setForm((c) => ({ ...c, to: event.target.value }))}
          />
        </label>
        <label>
          Type destinataire
          <select
            value={form.toType}
            onChange={(event) => setForm((c) => ({ ...c, toType: event.target.value }))}
          >
            <option value="company">Company</option>
            <option value="student">Student</option>
          </select>
        </label>
        <label className="formWide">
          Message
          <textarea
            rows="3"
            value={form.content}
            onChange={(event) => setForm((c) => ({ ...c, content: event.target.value }))}
          />
        </label>
        <button className="primaryBtn" type="submit">
          Envoyer
        </button>
      </form>

      <div className="messageList">
        {state.messages.map((message) => (
          <article key={message.id} className="message">
            <header>
              <strong>
                {message.from} ({message.fromType})
              </strong>
              <span>{message.date}</span>
            </header>
            <p>
              Vers {message.to} ({message.toType})
            </p>
            <p>{message.content}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
