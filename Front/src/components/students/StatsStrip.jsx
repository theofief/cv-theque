export default function StatsStrip({ stats }) {
  const items = [
    { label: 'Profils', value: stats.studentsCount },
    { label: 'Profils featured', value: stats.featuredCount },
    { label: 'Skills avancees', value: stats.advancedSkills },
    { label: 'Skills total', value: stats.totalSkills },
  ]

  return (
    <section className="statsStrip">
      {items.map((item) => (
        <article key={item.label} className="statCard">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  )
}
