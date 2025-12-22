import React from "react";

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  href?: string;
  description?: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
      <div className="overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory flex gap-6 md:gap-8">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="min-w-[300px] md:min-w-[380px] flex-shrink-0 snap-center p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl transition-all hover:scale-[1.03] hover:shadow-lg hover:border-primary/50 duration-300"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{exp.role}</h3>
                  {exp.href ? (
                    <a
                      href={exp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm mt-1 inline-block"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    <p className="text-sm opacity-80 mt-1">{exp.company}</p>
                  )}
                </div>
                <div className="text-right text-sm opacity-70 whitespace-nowrap">
                  {exp.period}
                  {exp.location && (
                    <span className="block text-xs opacity-50">
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>

              {exp.description && (
                <p className="text-sm opacity-80 leading-relaxed mt-auto">
                  {exp.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center opacity-50 dark:opacity-70 md:hidden">
        Swipe to explore →
      </p>
    </section>
  );
};

export default ExperienceSection;
