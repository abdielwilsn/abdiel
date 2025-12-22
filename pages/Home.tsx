import React, { useState } from "react";
import Badge from "../components/Badge";
import BadgeGroup from "../components/BadgeGroup";
import { useData } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";

// Import types and CertStack component
import { Certification } from "../types"; // Adjust path if needed
import CertStack from "../components/CertStack"; // Make sure this file exists

const Home: React.FC = () => {
  const { homeData } = useData();

  // State for selected certification modal
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <div className="space-y-12">
      {/* Hero / Name + Bio */}
      <section className="text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{homeData.name}</h1>
        <p className="text-xl md:text-2xl leading-relaxed opacity-80 font-light">
          {homeData.bioTitle}
        </p>
      </section>

      {/* Affiliations / Core Team / Maintaining */}
      <section className="space-y-2 opacity-90">
        <p>
          Working at{" "}
          {homeData.affiliations.map((a, idx) => (
            <React.Fragment key={a.id}>
              <Badge href={a.href}>{a.label}</Badge>
              {idx < homeData.affiliations.length - 1 ? " / " : ""}
            </React.Fragment>
          ))}
        </p>
        <p>
          Core team member of{" "}
          {homeData.coreTeam.map((a, idx) => (
            <React.Fragment key={a.id}>
              <Badge href={a.href}>{a.label}</Badge>
              {idx < homeData.coreTeam.length - 1 ? " / " : ""}
            </React.Fragment>
          ))}
        </p>
        <p>
          Maintaining{" "}
          {homeData.maintaining.map((a, idx) => (
            <React.Fragment key={a.id}>
              <Badge href={a.href}>{a.label}</Badge>
              {idx < homeData.maintaining.length - 1 ? " / " : ""}
            </React.Fragment>
          ))}
        </p>
      </section>

      {/* Created Projects */}
      <section>
        <BadgeGroup title="CREATED PROJECTS">
          {homeData.createdProjects.map((p) => (
            <Badge key={p.id} href={p.href}>
              {p.label}
            </Badge>
          ))}
        </BadgeGroup>
      </section>

      {/* About Paragraphs */}
      <section className="prose dark:prose-invert max-w-none opacity-80 leading-7 space-y-4">
        <p>
          I love dreaming up ideas and then engineering them into reality. From
          full-stack apps to AI experiments and random weekend builds, I enjoy
          tinkering, crafting, and breaking things just to rebuild them better.
          I’m always exploring new tech, teaching what I learn, and shipping
          tools that make life a bit easier. Check out what I’ve been building.
          powered by curiosity and caffeine
        </p>

        <p>
          I write blogs about cool stuff I build, cool things I find while
          working with tools, open source, coding. I also do YouTube from time
          to time.
        </p>
        <p>
          Outside coding I also love music (not just consuming but also
          producing) one day I will share this passion. I also love anime. (I
          think Attack on Titan is the greatest anime ever, and I am still
          thinking about Vinland Saga years after.)
        </p>
      </section>

      {/* Experience Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
        <div className="overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory flex gap-6 md:gap-8">
          {homeData.experiences.map((exp) => (
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
        <p className="text-xs text-center opacity-50 md:hidden">
          Swipe to explore →
        </p>
      </section>

      {/* Certifications Stacks Section */}
<section className="space-y-32 py-40">
          <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Certifications
          </h2>
          <p className="text-xl opacity-70 max-w-2xl mx-auto">
            Explore my technical achievements across cloud, DevOps, and security
          </p>
        </div>

        {/* 3 Stacks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-40 lg:gap-56 max-w-7xl mx-auto px-4">
  <CertStack
    title="Cloud Architecture"
    icon="☁️"
    color="from-blue-500 to-indigo-600"
    certifications={homeData.certifications?.filter((c) => c.stack === "cloud") || []}
    selectedCert={selectedCert}
    onSelectCert={setSelectedCert}
  />

  <CertStack
    title="DevOps & Infra"
    icon="⚙️"
    color="from-green-500 to-emerald-600"
    certifications={homeData.certifications?.filter((c) => c.stack === "devops") || []}
    selectedCert={selectedCert}
    onSelectCert={setSelectedCert}
  />

  <CertStack
    title="Security & Agile"
    icon="🛡️"
    color="from-purple-500 to-pink-600"
    certifications={homeData.certifications?.filter((c) => c.stack === "security") || []}
    selectedCert={selectedCert}
    onSelectCert={setSelectedCert}
  />
</div>

        {/* Modal */}
        <AnimatePresence>
          {selectedCert && (
            <Dialog
              open={!!selectedCert}
              onClose={() => setSelectedCert(null)}
              className="relative z-50"
            >
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Content */}
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 50 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="w-full max-w-2xl bg-card/95 backdrop-blur-lg border border-border/50 rounded-2xl shadow-2xl p-8 relative"
                >
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
                  >
                    ✕
                  </button>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {selectedCert.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-lg opacity-80">
                          {selectedCert.issuer}
                        </p>
                        <span className="text-sm bg-muted/50 px-3 py-1 rounded-md opacity-70">
                          {selectedCert.date}
                        </span>
                      </div>
                    </div>

                    {selectedCert.description && (
                      <p className="text-base leading-relaxed opacity-90">
                        {selectedCert.description}
                      </p>
                    )}

                    {selectedCert.credentialLink && (
                      <a
                        href={selectedCert.credentialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                      >
                        View Credential →
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </Dialog>
          )}
        </AnimatePresence>
      </section>

      {/* Social Links */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium opacity-50 flex items-center gap-2">
          Find me on
        </h2>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <a
            href="https://github.com/abdielwilsn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 opacity-40 hover:opacity-100 hover:text-black dark:hover:text-white transition-all group"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-sm font-medium">GitHub</span>
          </a>

          <a
            href="https://twitter.com/abdielwilsn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 opacity-40 hover:opacity-100 hover:text-[#1DA1F2] transition-all group"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            <span className="text-sm font-medium">Twitter</span>
          </a>

          <a
            href="https://youtube.com/@abdiwlwilsn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 opacity-40 hover:opacity-100 hover:text-[#FF0000] transition-all group"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="text-sm font-medium">YouTube</span>
          </a>

          <a
            href="https://space.bilibili.com/668380"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 opacity-40 hover:opacity-100 hover:text-[#00AEEC] transition-all group"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.765-1.004.995-2.263 1.519-3.773 1.573H5.322c-1.51-.054-2.769-.578-3.773-1.573-1.004-.996-1.524-2.254-1.56-3.765V10.01c.036-1.51.556-2.765 1.56-3.76 1.004-.996 2.263-1.52 3.773-1.574h.774L4.39 1.97a.647.647 0 01.077-.736c.106-.118.236-.184.385-.205.148-.02.296.015.422.106l4.634 3.522h4.18l4.634-3.522a.566.566 0 01.422-.106c.15.021.28.087.385.205a.647.647 0 01.077.736l-1.705 2.683zm-10.37 9.143c-.456 0-.843.16-1.161.48-.318.32-.477.712-.477 1.178 0 .466.159.858.477 1.178.318.32.705.48 1.16.48.456 0 .843-.16 1.162-.48.318-.32.477-.712.477-1.178 0-.466-.159-.858-.477-1.178-.319-.32-.706-.48-1.162-.48zm7.114 0c-.456 0-.843.16-1.162.48-.318.32-.477.712-.477 1.178 0 .466.159.858.477 1.178.319.32.706.48 1.162.48.456 0 .843-.16 1.161-.48.318-.32.477-.712.477-1.178 0-.466-.159-.858-.477-1.178-.318-.32-.705-.48-1.161-.48z" />
            </svg>
            <span className="text-sm font-medium">Bilibili</span>
          </a>
        </div>
      </section>


      {/* Email */}
      <section className="pt-8 flex flex-col items-center md:items-start gap-4">
        <p className="text-sm opacity-40">
          Or mail me at{" "}
          <a
            href="mailto:hi@abdielwilsn.me"
            className="opacity-100 hover:underline"
          >
            hi@abdielwilsn.me
          </a>
        </p>
      </section>
    </div>
  );
};

export default Home;
