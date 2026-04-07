import ProjectCard from './ProjectCard'

export default function ProjectList({ projects }) {
  return (
    <div className="projectList">
      {projects.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </div>
  )
}
