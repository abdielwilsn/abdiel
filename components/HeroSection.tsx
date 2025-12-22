import React from "react";

interface HeroSectionProps {
  name: string;
  bioTitle: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ name, bioTitle }) => {
  return (
    <section className="text-center md:text-left">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">{name}</h1>
      <p className="text-xl md:text-2xl leading-relaxed opacity-80 font-light">
        {bioTitle}
      </p>
    </section>
  );
};

export default HeroSection;
