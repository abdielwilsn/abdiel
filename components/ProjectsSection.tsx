import React from "react";
import Badge from "./Badge";
import BadgeGroup from "./BadgeGroup";

interface Project {
  id: string;
  label: string;
  href?: string;
}

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  return (
    <section>
      <BadgeGroup title="CREATED PROJECTS">
        {projects.map((p) => (
          <Badge key={p.id} href={p.href}>
            {p.label}
          </Badge>
        ))}
      </BadgeGroup>
    </section>
  );
};

export default ProjectsSection;
