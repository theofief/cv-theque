export default function PrivacyPage() {
  return (
    <section className="card border-0 shadow-sm surface-card legal-page">
      <div className="card-body p-4 p-lg-5 d-grid gap-3">
        <h1 className="h2 mb-2">Politique de confidentialite</h1>
        <p className="mb-0 text-secondary">
          Les donnees de profils sont stockees dans une base de donnees backend. Les champs
          sensibles sont proteges et les operations d ecriture sont reservees aux utilisateurs
          authentifies.
        </p>
        <p className="mb-0 text-secondary">
          Pour toute demande relative aux donnees personnelles, ecrivez a contact@gott.dev.
        </p>
      </div>
    </section>
  )
}
