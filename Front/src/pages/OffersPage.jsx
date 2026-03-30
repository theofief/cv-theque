import { useState } from 'react'
import { useAppStore } from '../context/AppStore'

export default function OffersPage() {
  const { state, actions } = useAppStore()
  const [form, setForm] = useState({
    sourceType: 'company',
    sourceId: state.companies[0].id,
    title: '',
    contract: 'Alternance',
  })

  const sourceOptions = form.sourceType === 'company' ? state.companies : state.schools

  const handleSourceTypeChange = (value) => {
    const nextSourceId = value === 'company' ? state.companies[0].id : state.schools[0].id
    setForm((current) => ({ ...current, sourceType: value, sourceId: nextSourceId }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      return
    }
    actions.addOffer({ ...form, title: form.title.trim() })
    setForm((current) => ({ ...current, title: '' }))
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Offres par les boites et schools uniquement</h2>
        <p>
          Le workflow force la source sur entreprise/ecole, pour coller au besoin metier.
        </p>
      </div>

      <form className="formGrid" onSubmit={handleSubmit}>
        <label>
          Type source
          <select
            value={form.sourceType}
            onChange={(event) => handleSourceTypeChange(event.target.value)}
          >
            <option value="company">Entreprise</option>
            <option value="school">Ecole</option>
          </select>
        </label>

        <label>
          Source
          <select
            value={form.sourceId}
            onChange={(event) => setForm((c) => ({ ...c, sourceId: event.target.value }))}
          >
            {sourceOptions.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Contrat
          <select
            value={form.contract}
            onChange={(event) => setForm((c) => ({ ...c, contract: event.target.value }))}
          >
            <option value="Alternance">Alternance</option>
            <option value="Stage">Stage</option>
          </select>
        </label>

        <label className="formWide">
          Intitule offre
          <input
            value={form.title}
            onChange={(event) => setForm((c) => ({ ...c, title: event.target.value }))}
          />
        </label>

        <button className="primaryBtn" type="submit">
          Ajouter offre
        </button>
      </form>

      <div className="cardGrid">
        {state.offers.map((offer) => {
          const source =
            offer.sourceType === 'company'
              ? state.companies.find((company) => company.id === offer.sourceId)
              : state.schools.find((school) => school.id === offer.sourceId)
          return (
            <article className="card" key={offer.id}>
              <h3>{offer.title}</h3>
              <p>Source: {offer.sourceType === 'company' ? 'Entreprise' : 'Ecole'}</p>
              <p>Nom source: {source?.name}</p>
              <p>Contrat: {offer.contract}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
