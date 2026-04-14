export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="d-flex flex-column gap-2">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2">
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
