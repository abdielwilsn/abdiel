
import React from 'react';

const Now: React.FC = () => {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Now</h1>
        <p className="opacity-50 italic">What I'm doing right now (inspired by Ant Fu).</p>
      </header>

      <article className="prose dark:prose-invert max-w-none space-y-8 leading-7 opacity-90">
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">Location</h2>
          <p>Living and working in 🇯🇵 Tokyo, Japan. Enjoying the autumn breeze and the vibrant tech scene here.</p>
        </section>

        {/* <section>
          <h2 className="text-xl font-semibold mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">Main Focus</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Leading the development of <strong>Vite 6</strong> and its ecosystem stability.</li>
            <li>Rethinking component-based design systems with <strong>UnoCSS</strong>.</li>
            <li>Improving <strong>Nuxt 3</strong> documentation and developer onboarding experience.</li>
          </ul>
        </section> */}

        <section>
          <h2 className="text-xl font-semibold mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">Learning & Reading</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Practicing German.</li>
            <li>Reading <em>"The Da Vinci Code Work"</em> by Dan Brown.</li>
            <li>Exploring cybersecurity and building rock solid applications.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">Entertainment</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Playing: <em>The Legend of Zelda: Echoes of Wisdom</em>.</li>
            <li>Watching: <em>Naruto</em> again.</li>
          </ul>
        </section>
      </article>

      <p className="text-xs opacity-30 pt-8">Last updated: Nov 2025</p>
    </div>
  );
};

export default Now;
