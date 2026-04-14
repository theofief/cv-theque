export default function StatsStrip({ stats, filteredCount }) {
  const items = [
    {
      label: 'Profils actifs',
      value: stats.studentsCount,
      icon: 'bi-person-vcard',
    },
    {
      label: 'Selection visible',
      value: filteredCount,
      icon: 'bi-funnel',
    },
    {
      label: 'Talents mis en avant',
      value: stats.featuredCount,
      icon: 'bi-award',
    },
    {
      label: 'Competences avancees',
      value: stats.advancedSkills,
      icon: 'bi-bar-chart',
    },
  ]

  return (
    <section className="row g-3" aria-label="Indicateurs clefs">
      {items.map((item) => (
        <div key={item.label} className="col-12 col-sm-6 col-xl-3">
          <article className="card border-0 shadow-sm h-100 surface-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <span className="text-secondary small text-uppercase fw-semibold brand-kicker">
                  {item.label}
                </span>
                <i className={`bi ${item.icon} text-warning fs-5`} />
              </div>
              <strong className="stats-number d-block">{item.value}</strong>
            </div>
          </article>
        </div>
      ))}
    </section>
  )
}
