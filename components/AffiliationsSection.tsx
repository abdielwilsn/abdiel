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
  creatorOf: AffiliationItem[];
}

const AffiliationsSection: React.FC<AffiliationsSectionProps> = ({
  affiliations,
  coreTeam,
  creatorOf,
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
        Core team member {" "}
        {coreTeam.map((a, idx) => (
          <React.Fragment key={a.id}>
            <Badge href={a.href}>{a.label}</Badge>
            {idx < coreTeam.length - 1 ? " / " : ""}
          </React.Fragment>
        ))}
      </p>
      <p>
        Creator Of{" "}
        {creatorOf.map((a, idx) => (
          <React.Fragment key={a.id}>
            <Badge href={a.href}>{a.label}</Badge>
            {idx < creatorOf.length - 1 ? " / " : ""}
          </React.Fragment>
        ))}
      </p>
    </section>
  );
};

export default AffiliationsSection;
