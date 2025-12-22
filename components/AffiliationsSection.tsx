import React from "react";
import Badge from "./Badge";

interface AffiliationItem {
  id: string;
  label: string;
  href?: string;
}

interface AffiliationsSectionProps {
  affiliations: AffiliationItem[];
  coreTeam: AffiliationItem[];
  maintaining: AffiliationItem[];
}

const AffiliationsSection: React.FC<AffiliationsSectionProps> = ({
  affiliations,
  coreTeam,
  maintaining,
}) => {
  return (
    <section className="space-y-2 opacity-90">
      <p>
        Working at{" "}
        {affiliations.map((a, idx) => (
          <React.Fragment key={a.id}>
            <Badge href={a.href}>{a.label}</Badge>
            {idx < affiliations.length - 1 ? " / " : ""}
          </React.Fragment>
        ))}
      </p>
      <p>
        Core team member of{" "}
        {coreTeam.map((a, idx) => (
          <React.Fragment key={a.id}>
            <Badge href={a.href}>{a.label}</Badge>
            {idx < coreTeam.length - 1 ? " / " : ""}
          </React.Fragment>
        ))}
      </p>
      <p>
        Maintaining{" "}
        {maintaining.map((a, idx) => (
          <React.Fragment key={a.id}>
            <Badge href={a.href}>{a.label}</Badge>
            {idx < maintaining.length - 1 ? " / " : ""}
          </React.Fragment>
        ))}
      </p>
    </section>
  );
};

export default AffiliationsSection;
