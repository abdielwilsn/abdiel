import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-24 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50 text-sm">
      <div className="flex flex-col gap-1 items-center md:items-start">
        <p>© 2019-present Abdiel John Wilson</p>
        <p>CC BY-NC-SA 4.0</p>
      </div>
      <div className="flex gap-4">
        <a
          href="#"
          className="hover:text-black dark:hover:text-white transition-colors"
        >
          Sponsors
        </a>
        <a
          href="#"
          className="hover:text-black dark:hover:text-white transition-colors"
        >
          RSS
        </a>
        <a
          href="#"
          className="hover:text-black dark:hover:text-white transition-colors"
        >
          Twitter
        </a>
      </div>
    </footer>
  );
};

export default Footer;
