import PortfolioRoot from "@/components/PortfolioRoot";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <>
      {/* Semantic, accessible SSR content for Search Engine Crawlers & Screen Readers */}
      <main id="main-content">
        <section className="sr-only" aria-label="About Utkarsh Solanki">
          <h1>Utkarsh Solanki | Full Stack Software Engineer &amp; Developer (utkrsh.in)</h1>
          <p>
            Welcome to the official developer portfolio of Utkarsh Solanki (utkrsh).
            Full Stack Software Engineer specializing in Next.js, React, TypeScript, Node.js,
            Three.js interactive web applications, and AI integrations.
          </p>

          <h2>Featured Projects &amp; Software Engineering Work</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.slug}>
                <h3>{project.title} - {project.matchLabel}</h3>
                <p>{project.description}</p>
                <p>Tech Stack: {project.stack.join(", ")}</p>
                {project.github && (
                  <a href={project.github} rel="noopener noreferrer">
                    {project.title} GitHub Repository
                  </a>
                )}
                {project.live && (
                  <a href={project.live} rel="noopener noreferrer">
                    {project.title} Live Application
                  </a>
                )}
              </li>
            ))}
          </ul>

          <h2>Technical Skills &amp; Stack</h2>
          <p>
            React, Next.js, TypeScript, JavaScript, Node.js, Tailwind CSS, Three.js,
            React Native, Supabase, PostgreSQL, AI Agent Integrations, Web Development,
            Software Architecture.
          </p>

          <h2>Connect with Utkarsh Solanki</h2>
          <nav aria-label="Social and Professional Profiles">
            <ul>
              <li>
                <a href="https://github.com/UtkarshSolanki0709" rel="noopener noreferrer">
                  Utkarsh Solanki on GitHub (UtkarshSolanki0709)
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/utkarsh-solanki-424b55291/"
                  rel="noopener noreferrer"
                >
                  Utkarsh Solanki on LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.utkrsh.in">
                  Utkarsh Solanki Portfolio Website (utkrsh.in)
                </a>
              </li>
            </ul>
          </nav>
        </section>

        <PortfolioRoot />
      </main>
    </>
  );
}
