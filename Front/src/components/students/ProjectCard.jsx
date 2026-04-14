export default function ProjectCard({ project }) {
  return (
    <article className="card border-0 project-card">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-3">
          <h4 className="h6 mb-0">{project.name}</h4>
          <div className="d-flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span key={technology} className="badge rounded-pill text-bg-light text-primary-emphasis">
                {technology}
              </span>
            ))}
          </div>
        </div>
        <p className="text-secondary mb-0">{project.description}</p>
      </div>
    </article>
  )
}
