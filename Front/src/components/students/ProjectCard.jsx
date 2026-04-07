export default function ProjectCard({ project }) {
  return (
    <article className="projectCard">
      <div className="projectCardHeader">
        <h4>{project.name}</h4>
        <div className="techRow">
          {project.technologies.map((technology) => (
            <span key={technology} className="techBadge">
              {technology}
            </span>
          ))}
        </div>
      </div>
      <p>{project.description}</p>
    </article>
  )
}
