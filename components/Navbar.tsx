import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useData } from "../App";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  isAuthenticated?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  isDark,
  toggleTheme,
  isAuthenticated,
}) => {
  const { posts, projects, talks } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "Blog", path: "/posts" },
    { label: "Projects", path: "/projects" },
    { label: "Talks", path: "/talks" },
    { label: "Now", path: "/now" },
  ];

  // Close search and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
        inputRef.current?.focus();
      }
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredResults = {
    posts: posts
      .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5),
    projects: projects
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5),
    talks: talks
      .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5),
  };

  const hasResults =
    searchQuery.length > 0 &&
    (filteredResults.posts.length > 0 ||
      filteredResults.projects.length > 0 ||
      filteredResults.talks.length > 0);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full px-6 py-4 md:px-12 lg:px-20 relative z-50 flex items-center justify-between">
      {/* Logo + Search */}
      <div className="flex items-center gap-6 md:gap-8">
        <NavLink to="/" className="group flex items-center select-none">
          <div className="font-signature text-2xl md:text-3xl flex gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="inline-block animate-letter-1">a</span>
            <span className="inline-block animate-letter-2">j</span>
            <span className="inline-block animate-letter-3">w</span>
          </div>
        </NavLink>

        {/* Search Bar - Desktop only */}
        <div ref={searchRef} className="relative hidden md:block">
          <div
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border
              ${
                isSearchOpen
                  ? "w-64 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm"
                  : "w-40 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            `}
          >
            <svg
              className="w-4 h-4 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full placeholder:opacity-50"
            />
            {!isSearchOpen && (
              <span className="text-[10px] opacity-20 font-mono hidden lg:inline">
                /
              </span>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl z-[60] p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {!hasResults ? (
                <div className="p-4 text-center text-xs opacity-40 italic">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {filteredResults.posts.length > 0 && (
                    <section>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-30 px-2 mb-2">
                        Posts
                      </h3>
                      {filteredResults.posts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSelect(`/posts/${p.id}`)}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
                        >
                          <div className="text-sm opacity-80 group-hover:opacity-100 line-clamp-1">
                            {p.title}
                          </div>
                          <div className="text-[10px] opacity-30">{p.date}</div>
                        </button>
                      ))}
                    </section>
                  )}
                  {filteredResults.projects.length > 0 && (
                    <section>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-30 px-2 mb-2">
                        Projects
                      </h3>
                      {filteredResults.projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => window.open(p.link, "_blank")}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
                        >
                          <div className="text-sm opacity-80 group-hover:opacity-100">
                            {p.name}
                          </div>
                          <div className="text-[10px] opacity-30 line-clamp-1">
                            {p.description}
                          </div>
                        </button>
                      ))}
                    </section>
                  )}
                  {filteredResults.talks.length > 0 && (
                    <section>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-30 px-2 mb-2">
                        Talks
                      </h3>
                      {filteredResults.talks.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleSelect("/talks")}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
                        >
                          <div className="text-sm opacity-80 group-hover:opacity-100">
                            {t.title}
                          </div>
                          <div className="text-[10px] opacity-30">
                            {t.event}
                          </div>
                        </button>
                      ))}
                    </section>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Nav Links + Action Icons */}
      <div className="flex items-center gap-6 md:gap-8">
        {/* Text Nav Links - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-5 md:gap-7 mr-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                text-[13px] tracking-wide transition-opacity hover:opacity-100
                ${isActive ? "opacity-100 font-medium" : "opacity-50"}
              `}
            >
              {item.label}
            </NavLink>
          ))}
          {/* <NavLink
            to={isAuthenticated ? "/admin" : "/login"}
            className={({ isActive }) => `
              text-[13px] tracking-wide transition-opacity hover:opacity-100
              ${isActive ? "opacity-100 font-medium" : "opacity-50"}
              px-2 py-0.5 border border-transparent rounded hover:border-gray-200 dark:hover:border-gray-800
            `}
          >
            {isAuthenticated ? "Admin" : "Login"}
          </NavLink> */}
        </div>

        {/* Action Icons - Always visible */}
        <div className="flex items-center gap-3 md:gap-4">
          <NavLink
            to="/media"
            className="p-1 opacity-50 hover:opacity-100 transition-opacity"
            title="Podcast"
          >
            <svg
              className="w-[18px] h-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </NavLink>

          <NavLink
            to="/photos"
            className="p-1 opacity-50 hover:opacity-100 transition-opacity"
            title="Photos"
          >
            <svg
              className="w-[18px] h-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </NavLink>

          <NavLink
            to="/use"
            className="p-1 opacity-50 hover:opacity-100 transition-opacity"
            title="Tools"
          >
            <svg
              className="w-[18px] h-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </NavLink>

          <a
            href="https://bsky.app"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 opacity-50 hover:opacity-100 transition-opacity"
            title="Social"
          >
            <svg
              className="w-[18px] h-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </a>

          <a
            href="https://github.com/abdielwilsn"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 opacity-50 hover:opacity-100 transition-opacity"
            title="GitHub"
          >
            <svg
              className="w-[18px] h-[18px]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          <button
            onClick={toggleTheme}
            className="p-1 opacity-50 hover:opacity-100 transition-opacity ml-1"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Hamburger Menu Button - Mobile only */}
          <button
            className="sm:hidden p-1 opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            ref={mobileMenuRef}
            className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 p-6 flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-medium">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    text-lg py-2 transition-colors
                    ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-700 dark:text-gray-300"
                    }
                  `}
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                <NavLink
                  to={isAuthenticated ? "/admin" : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    text-lg py-2 transition-colors
                    ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-700 dark:text-gray-300"
                    }
                  `}
                >
                  {isAuthenticated ? "Admin" : "Login"}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;