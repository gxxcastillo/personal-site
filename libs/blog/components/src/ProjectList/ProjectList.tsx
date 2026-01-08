import { ProjectCards } from '../ProjectCard/ProjectCard';
import { ProjectCardData } from '../ProjectCard/ProjectCard';

export interface ProjectListProps {
  projects: ProjectCardData[];
}

export function ProjectList({ projects }: ProjectListProps) {
  if (!projects || projects.length === 0) {
    return <p>No projects yet.</p>;
  }

  return <ProjectCards projects={projects} />;
}

export default ProjectList;
