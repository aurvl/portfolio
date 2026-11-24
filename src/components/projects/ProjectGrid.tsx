// Grille des cartes projet du Hub : 3 colonnes sur ordinateur, 2 sur tablette, 1 sur mobile (styles/v3/hub.css).
import ProjectCard from './ProjectCard'
import type { Project } from '../../types/project'

type ProjectGridProps = {
  projects: Project[]
  onOpenProject?: (project: Project) => void
}

function ProjectGrid({ projects, onOpenProject }: ProjectGridProps) {
  return (
    <div className="hub-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onOpenProject={onOpenProject}
          cardId={`project-card-${project.slug}`}
        />
      ))}
    </div>
  )
}

export default ProjectGrid
