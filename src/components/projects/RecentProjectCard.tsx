import type { Project } from '../../types/project'
import ProjectCard from './ProjectCard'

type RecentProjectCardProps = {
  project: Project
}

function RecentProjectCard({ project }: RecentProjectCardProps) {
  return (
    <ProjectCard project={project} />
  )
}

export default RecentProjectCard