import Link from 'next/link';
import styles from './ProjectCard.module.css';

export interface ProjectCardData {
  title?: string;
  path: string;
  slug: string;
  excerpt?: string;
}

export interface ProjectCardsProps {
  projects: ProjectCardData[];
}

export function ProjectCards({ projects }: ProjectCardsProps) {
  if (!projects || projects.length === 0) {
    return <p>No projects yet.</p>;
  }

  return (
    <ul className={styles.ProjectCards}>
      {projects.map((project) => (
        <li key={project.slug} className={styles.card}>
          <Link href={project.path} className={styles.link}>
            <h3 className={styles.title}>{project.title}</h3>
            {project.excerpt && (
              <p className={styles.excerpt}>{project.excerpt}</p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default ProjectCards;
