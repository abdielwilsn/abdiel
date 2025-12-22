// components/CertificationsSection.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import CertStack from "./CertStack";
import { Certification } from "../types";

// Black & white icons (same as above)
const CloudIcon = () => (
  <svg className="w-12 h-12 md:w-14 md:h-14 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

const DevOpsIcon = () => (
  <svg className="w-12 h-12 md:w-14 md:h-14 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="w-12 h-12 md:w-14 md:h-14 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 0 1 10 10v2a10 10 0 0 1-10 10A10 10 0 0 1 2 14v-2A10 10 0 0 1 12 2z" />
    <path d="M12 16v-4" />
    <circle cx="12" cy="8" r="1" />
  </svg>
);

interface CertificationsSectionProps {
  certifications: Certification[];
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
}) => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const cloudCerts = certifications?.filter((c) => c.stack === "cloud") || [];
  const devopsCerts = certifications?.filter((c) => c.stack === "devops") || [];
  const securityCerts = certifications?.filter((c) => c.stack === "security") || [];

  return (
    <section className="space-y-32 py-40">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Certifications
        </h2>
        <p className="text-xl opacity-70 max-w-2xl mx-auto">
          Explore my technical achievements across cloud, DevOps, and security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-40 lg:gap-56 max-w-7xl mx-auto px-4">
        <CertStack
          title="Cloud Architecture"
          icon={<CloudIcon />}
          color="from-blue-500 to-indigo-600"
          certifications={cloudCerts}
          selectedCert={selectedCert}
          onSelectCert={setSelectedCert}
        />
        <CertStack
          title="DevOps & Infra"
          icon={<DevOpsIcon />}
          color="from-green-500 to-emerald-600"
          certifications={devopsCerts}
          selectedCert={selectedCert}
          onSelectCert={setSelectedCert}
        />
        <CertStack
          title="Security & Agile"
          icon={<SecurityIcon />}
          color="from-purple-500 to-pink-600"
          certifications={securityCerts}
          selectedCert={selectedCert}
          onSelectCert={setSelectedCert}
        />
      </div>

      {/* Modal remains unchanged */}
      <AnimatePresence>
        {selectedCert && (
          <Dialog
            open={!!selectedCert}
            onClose={() => setSelectedCert(null)}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
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
                    <h3 className="text-2xl font-bold">{selectedCert.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-lg opacity-80">{selectedCert.issuer}</p>
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
  );
};

export default CertificationsSection;