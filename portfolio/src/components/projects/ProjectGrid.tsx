import ProjectCard from "./ProjectCard";
import type { Project } from "../../types/project";

type ProjectGridProps = {
    projects: Project[]
    onOpenProject?: (project: Project) => void
}

function ProjectGrid({ projects, onOpenProject }: ProjectGridProps) {
  return (
    <div className="flex flex-wrap gap-4">
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
