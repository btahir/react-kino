import Link from "next/link";
import { storyRecipes } from "react-kino/recipes";
import { LandingStory } from "@/components/landing-story";
import "./landing.css";
export default function Page() {
  return (
    <main className="kino-landing">
      <nav className="kl-nav" aria-label="Main navigation">
        <Link className="kl-logo" href="/">
          kino<span>↗</span>
        </Link>
        <div>
          <Link href="/docs">Documentation</Link>
          <Link href="#recipes">Recipes</Link>
          <Link href="https://github.com/btahir/react-kino">GitHub ↗</Link>
          <Link className="kl-button kl-button-small" href="/studio">
            Open Storyboard
          </Link>
        </div>
      </nav>
      <header className="kl-hero">
        <div className="kl-kicker">
          <span /> OPEN-SOURCE SCROLL STORYTELLING FOR REACT
        </div>
        <h1>
          Give your story
          <br />
          <em>a sense of motion.</em>
        </h1>
        <p>
          Build cinematic pages in React. Tune the timing by eye.
          <br className="kl-desktop" /> Keep every scene, component, and line of
          code yours.
        </p>
        <div className="kl-hero-actions">
          <Link href="/studio" className="kl-button">
            Make a story <span>↗</span>
          </Link>
          <Link href="/docs">Start with code →</Link>
        </div>
        <div className="kl-install">
          <code>npm install react-kino</code>
          <span>React 18+ · MIT · No account</span>
        </div>
      </header>
      <section
        className="kl-canvas-wrap"
        aria-label="Interactive story preview"
      >
        <LandingStory />
        <p className="kl-caption">
          <span>A real scene. The same runtime your site uses.</span>
          <span>Scrub it. Change it. Make it yours.</span>
        </p>
      </section>
      <section className="kl-workflow">
        <div>
          <span className="kl-kicker">FROM AN IDEA TO A PAGE</span>
          <h2>
            A visual workflow.
            <br />A familiar codebase.
          </h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <h3>Compose your story</h3>
              <p>
                Start with a complete recipe, or bring your own components.
                Arrange scenes and give each layer its moment.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>See what feels right</h3>
              <p>
                Scrub the real renderer. Drag timing handles. Preview a phone
                layout. Undo the experiment that went too far.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Take it with you</h3>
              <p>
                Export a small JSON document, commit it beside your code, and
                render it in your application. No hosted player required.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section className="kl-recipes" id="recipes">
        <div className="kl-section-title">
          <div>
            <span className="kl-kicker">A GOOD PLACE TO BEGIN</span>
            <h2>One story. Many possibilities.</h2>
          </div>
          <Link href="/docs/recipes/story-recipes">
            Get the recipe source →
          </Link>
        </div>
        <div className="kl-recipe-grid">
          {storyRecipes.map((recipe, index) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="kl-recipe"
            >
              <div className={`kl-recipe-art kl-art-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{recipe.title}</strong>
                <i>↗</i>
              </div>
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="kl-principles">
        <div>
          <span className="kl-kicker">MADE TO FIT THE REAL WORLD</span>
          <h2>
            Motion should never
            <br />
            get in the way.
          </h2>
        </div>
        <div>
          <p>
            Readable mobile layouts. A reduced-motion path. Automatic fallback
            when a pinned scene grows too tall. Your words should always have
            room.
          </p>
          <p>
            Use Kino's components on their own or add Storyboard through a
            separate import. Your visitors don't download the editor.
          </p>
          <Link href="/docs/responsive-stories">
            Read the layout principles →
          </Link>
        </div>
      </section>
      <section className="kl-final">
        <span className="kl-kicker">YOUR NEXT PAGE STARTS HERE</span>
        <h2>
          Make something
          <br />
          <em>worth scrolling.</em>
        </h2>
        <Link href="/studio" className="kl-button">
          Open Storyboard <span>↗</span>
        </Link>
      </section>
      <footer className="kl-footer">
        <span className="kl-logo">
          kino<span>↗</span>
        </span>
        <p>Independent. Open source. Free under MIT.</p>
        <div>
          <Link href="/docs">Docs</Link>
          <Link href="/playground">Components</Link>
          <Link href="https://react-tourlight.vercel.app/support">
            Support this project
          </Link>
          <Link href="https://github.com/btahir/react-kino">GitHub ↗</Link>
        </div>
      </footer>
    </main>
  );
}
