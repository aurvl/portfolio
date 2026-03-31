import ProjectCard from "./ProjectCard";
import type { Project } from "../../types/project";

type ProjectGridProps = {
    projects: Project[]
    onOpenProject?: (project: Project) => void
}

function ProjectGrid({ projects, onOpenProject }: ProjectGridProps) {
  return (
    <div className="grid min-w-0 auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
