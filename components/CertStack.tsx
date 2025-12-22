// components/CertStack.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Certification } from '../types';

interface StackProps {
  title: string;
  icon: string;
  color: string;
  certifications: Certification[];
  selectedCert: Certification | null;
  onSelectCert: (cert: Certification | null) => void;
}

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
      {/* Header */}
      <div className="text-center mb-16 md:mb-24">
        <motion.div
          className="text-6xl md:text-7xl mb-4"
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-base md:text-lg opacity-70 mt-3">
          {certifications.length} certifications
        </p>
      </div>

      {/* Stack Container - Much Taller + Centered */}
      <div className="relative w-80 md:w-[460px] min-h-[600px] flex flex-col items-center justify-start">
        <AnimatePresence>
          {certifications.map((cert, index) => {
            const isTop = topCardId === cert.id;
            const zIndex = isTop ? 100 : certifications.length - index;
            // Larger vertical stagger for better spacing
            const verticalOffset = index * 80; // <--- Increased from 50 → 80
            const horizontalOffset = index * 15;
            const scale = isTop ? 1.12 : 0.88 + index * 0.04;

            return (
              <motion.div
                key={cert.id}
                className={`
                  absolute w-full p-7 md:p-8 bg-card/95 backdrop-blur-lg border border-border/40 
                  rounded-2xl shadow-2xl cursor-pointer overflow-hidden
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
                  y: isTop ? -80 : verticalOffset,
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
                <div className="space-y-6">
                  {/* Title + Issuer */}
                  <div>
                    <h4 className="font-semibold text-xl md:text-2xl leading-tight line-clamp-2">
                      {cert.name}
                    </h4>
                    <p className="text-base md:text-lg opacity-90 mt-2">{cert.issuer}</p>
                  </div>

                  {/* Date + Description */}
                  <div className="flex justify-between items-end gap-6">
                    <span className="text-sm md:text-base bg-muted/60 px-4 py-2 rounded-full opacity-90 whitespace-nowrap">
                      {cert.date}
                    </span>
                    <p className="text-base md:text-lg opacity-80 leading-relaxed line-clamp-4 flex-1">
                      {cert.description}
                    </p>
                  </div>
                </div>

                {/* Glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: `linear-gradient(to right, ${color})` }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.3 }}
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