import React from "react";

const SocialLinksSection: React.FC = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium opacity-50 dark:opacity-70 flex items-center gap-2">
        Find me on
      </h2>
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <a
          href="https://github.com/abdielwilsn"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 opacity-40 dark:opacity-60 hover:opacity-100 hover:text-black dark:hover:text-white transition-all group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          {/* <span className="text-sm font-medium">GitHub</span> */}
        </a>

        {/* Changed from Twitter to X */}
        <a
          href="https://x.com/abdielwilsn"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 opacity-40 dark:opacity-60 hover:opacity-100 hover:text-black dark:hover:text-white transition-all group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          {/* <span className="text-sm font-medium">X</span> */}
        </a>

        <a
          href="https://youtube.com/@abdiwlwilsn"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 opacity-40 dark:opacity-60 hover:opacity-100 hover:text-[#FF0000] transition-all group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          {/* <span className="text-sm font-medium">YouTube</span> */}
        </a>

        <a
          href="https://instagram.com/abdielwilsn"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 opacity-40 dark:opacity-60 hover:opacity-100 hover:text-[#E1306C] transition-all group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.239 2.242 1.301 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.069 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.239-3.608 1.301-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.069c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.239-2.242-1.301-3.608-.058-1.266-.069-1.646-.069-4.85s.012-3.584.069-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.239 3.608-1.301 1.266-.058 1.646-.069 4.85-.069zM12 0C8.741 0 8.332.014 7.052.072 5.775.131 4.905.333 4.14 1.098.333 4.905.131 5.775.072 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.059 1.277.261 2.147 1.026 2.912.776.776 1.646.978 2.923 1.037C8.332 20.986 8.741 21 12 21s3.668-.014 4.948-.072c1.277-.059 2.147-.261 2.912-1.026.776-.776.978-1.646 1.037-2.923.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.059-1.277-.261-2.147-1.026-2.912C19.145.333 18.275.131 17 0.072 16.668.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
          </svg>
          {/* <span className="text-sm font-medium">Instagram</span> */}
        </a>

        <a
          href="https://tiktok.com/@abdielwilsn"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 opacity-40 dark:opacity-60 hover:opacity-100 hover:text-[#FF0050] transition-all group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12.53.02C13.84.02 15.14 0 16.44 0c.08 1.53.63 3.09 1.81 4.17 1.26 1.11 2.96 1.52 4.75 1.51v4.36c-1.81.01-3.62-.38-5.05-1.38-.97-.68-1.68-1.75-2.07-2.92v10.07c0 2.69-1.5 5.05-3.94 6.26-2.44 1.21-5.57.78-7.47-1.11-1.9-1.89-2.4-4.98-1.29-7.35 1.11-2.37 3.6-3.93 6.17-3.7v4.43c-.84-.07-1.67.28-2.24.88-.57.6-.85 1.41-.77 2.22.08.81.52 1.54 1.22 2.04.7.5 1.58.74 2.45.67.87-.07 1.68-.4 2.27-1 .59-.6.88-1.41.81-2.22V.02z" />
          </svg>
          {/* <span className="text-sm font-medium">TikTok</span> */}
        </a>
      </div>
    </section>
  );
};

export default SocialLinksSection;