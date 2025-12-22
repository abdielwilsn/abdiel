// components/CertStack.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Certification } from '../types';

interface StackProps {
  title: string;
  icon: React.ReactNode;
  color: string; // still used for card glow & title gradient
  certifications: Certification[];
  selectedCert: Certification | null;
  onSelectCert: (cert: Certification | null) => void;
}

// Black & white SVG icons
const CloudIcon = () => (
  <svg
    className="w-12 h-12 md:w-14 md:h-14 text-foreground" // ← uses foreground color (black in light mode, white in dark)
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

const DevOpsIcon = () => (
  <svg
    className="w-12 h-12 md:w-14 md:h-14 text-foreground"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v20M2 12h20" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const SecurityIcon = () => (
  <svg
    className="w-12 h-12 md:w-14 md:h-14 text-foreground"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a10 10 0 0 1 10 10v2a10 10 0 0 1-10 10A10 10 0 0 1 2 14v-2A10 10 0 0 1 12 2z" />
    <path d="M12 16v-4" />
    <circle cx="12" cy="8" r="1" />
  </svg>
);

const CertStack: React.FC<StackProps> = ({
  title,
  icon,
  color,
  certifications,
  selectedCert,
  onSelectCert,
}) => {
  const [topCardId, setTopCardId] = useState<string | null>(null);

  const handleCardClick = (cert: Certification) => {
    setTopCardId(cert.id);
    onSelectCert(cert);
  };

  return (
    <motion.div
      className="relative min-h-[800px] md:min-h-[1000px] flex flex-col items-center pb-20"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Header - icon and title side by side in black & white */}
      <div className="text-center mb-16 md:mb-24">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
            {React.cloneElement(icon as React.ReactElement, {
              className: "w-full h-full text-foreground"
            })}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            {title}
          </h3>
        </div>
        <p className="text-sm md:text-base opacity-70 mt-2">
          {certifications.length} certifications
        </p>
      </div>

      {/* Stack Container */}
      <div className="relative w-64 md:w-80 min-h-[400px] flex flex-col items-center justify-start">
        <AnimatePresence>
          {certifications.map((cert, index) => {
            const isTop = topCardId === cert.id;
            const zIndex = isTop ? 100 : certifications.length - index;
            const verticalOffset = index * 50;
            const horizontalOffset = index * 10;
            const scale = isTop ? 1.12 : 0.88 + index * 0.04;

            return (
              <motion.div
                key={cert.id}
                className={`
                  absolute w-full p-4 md:p-5 bg-card/95 backdrop-blur-lg border border-border/40
                  rounded-xl shadow-2xl cursor-pointer overflow-hidden
                  ${isTop ? 'scale-115 border-primary/70 shadow-3xl z-50' : 'opacity-90 hover:opacity-100'}
                  hover:shadow-3xl hover:border-primary/50 hover:scale-105 hover:z-40
                  transition-all duration-500
                `}
                style={{
                  top: `${verticalOffset}px`,
                  left: `${horizontalOffset}px`,
                  zIndex,
                  transformOrigin: 'center top',
                }}
                initial={{ scale: 0.6, opacity: 0, rotateX: 60, y: 150 }}
                animate={{
                  scale,
                  opacity: 1,
                  rotateX: isTop ? 0 : 25,
                  y: isTop ? -60 : verticalOffset,
                  x: isTop ? 0 : horizontalOffset,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 30,
                  delay: index * 0.12,
                }}
                onClick={() => handleCardClick(cert)}
              >
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-base md:text-lg leading-tight line-clamp-2">
                      {cert.name}
                    </h4>
                    <p className="text-sm md:text-base opacity-90 mt-1">{cert.issuer}</p>
                  </div>

                  <div className="flex justify-between items-end gap-3">
                    <span className="text-xs md:text-sm bg-muted/60 px-3 py-1.5 rounded-full opacity-90 whitespace-nowrap">
                      {cert.date}
                    </span>
                    <p className="text-xs md:text-sm opacity-80 leading-relaxed line-clamp-3 flex-1">
                      {cert.description}
                    </p>
                  </div>
                </div>

                {/* Subtle glow using the gradient color */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: `linear-gradient(to right, ${color})` }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.12 }} // reduced opacity for subtle effect
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CertStack;