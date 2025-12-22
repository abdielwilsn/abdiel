import React from "react";
import { useData } from "../App";
import HeroSection from "../components/HeroSection";
import AffiliationsSection from "../components/AffiliationsSection";
import ProjectsSection from "../components/ProjectsSection";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import CertificationsSection from "../components/CertificationsSection";
import SocialLinksSection from "../components/SocialLinksSection";
import ContactSection from "../components/ContactSection";

const Home: React.FC = () => {
  const { homeData } = useData();

  return (
    <div className="space-y-12">
      <HeroSection name={homeData.name} bioTitle={homeData.bioTitle} />

      <AffiliationsSection
        affiliations={homeData.affiliations}
        coreTeam={homeData.coreTeam}
        creatorOf={homeData.creatorOf}
      />

      <ProjectsSection projects={homeData.createdProjects} />

      <AboutSection />

      <ExperienceSection experiences={homeData.experiences} />

      <CertificationsSection certifications={homeData.certifications || []} />

      <SocialLinksSection />

      <ContactSection />
    </div>
  );
};

export default Home;
