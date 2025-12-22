import React from "react";

const ContactSection: React.FC = () => {
  return (
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
  );
};

export default ContactSection;
