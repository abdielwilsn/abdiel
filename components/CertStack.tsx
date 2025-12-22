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

const EngineeringIcon = () => (
  <svg
    className="w-12 h-12 md:w-14 md:h-14 text-foreground"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
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
      className="relative min-h-[350px] md:min-h-[450px] flex flex-col items-center pb-4 md:pb-6"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Header - icon and title side by side in black & white */}
      <div className="text-center mb-6 md:mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
            {React.cloneElement(icon as React.ReactElement, {
              className: "w-full h-full text-foreground"
            })}
          </div>
          <h3 className="text-base md:text-lg font-bold text-foreground">
            {title}
          </h3>
        </div>
        <p className="text-xs md:text-sm opacity-70 dark:opacity-80 mt-1">
          {certifications.length} certifications
        </p>
      </div>

      {/* Stack Container */}
      <div className="relative w-48 md:w-56 min-h-[280px] flex flex-col items-center justify-start">
        <AnimatePresence>
          {certifications.map((cert, index) => {
            const isTop = topCardId === cert.id;
            const zIndex = isTop ? 100 : certifications.length - index;
            const verticalOffset = index * 32;
            const horizontalOffset = index * 6;
            const scale = isTop ? 1.08 : 0.90 + index * 0.03;

            return (
              <motion.div
                key={cert.id}
                className={`
                  absolute w-full p-2.5 md:p-3 bg-card/95 backdrop-blur-lg border border-border/40
                  rounded-lg shadow-2xl cursor-pointer overflow-hidden
                  ${isTop ? 'scale-110 border-primary/70 shadow-3xl z-50' : 'opacity-90 hover:opacity-100'}
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
                  y: isTop ? -50 : verticalOffset,
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
                <div className="space-y-1.5">
                  <div>
                    <h4 className="font-semibold text-xs md:text-sm leading-tight line-clamp-2">
                      {cert.name}
                    </h4>
                    <p className="text-[10px] md:text-xs opacity-90 dark:opacity-95 mt-0.5">{cert.issuer}</p>
                  </div>

                  <div className="flex justify-between items-end gap-1.5">
                    <span className="text-[9px] md:text-[10px] bg-muted/60 px-1.5 py-0.5 rounded-full opacity-90 dark:opacity-95 whitespace-nowrap">
                      {cert.date}
                    </span>
                    <p className="text-[9px] md:text-[10px] opacity-80 dark:opacity-90 leading-relaxed line-clamp-2 flex-1">
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