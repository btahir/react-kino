import { useState } from "react";
import { COMPONENTS } from "./component-registry";

type ComponentId = (typeof COMPONENTS)[number]["id"];

export function App() {
  const [activeId, setActiveId] = useState<ComponentId>(COMPONENTS[0].id);

  const active = COMPONENTS.find((c) => c.id === activeId)!;
  const { controls, preview } = active.component();

  return (
    <div className="playground">
      <header className="playground-header">
        <h1>
          <span>react-kino</span> playground
        </h1>
        <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer">
          docs &uarr;
        </a>
      </header>

      <div className="playground-body">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h2>Component</h2>
            <div className="component-list">
              {COMPONENTS.map((c) => (
                <button
                  key={c.id}
                  className={`component-btn${c.id === activeId ? " active" : ""}`}
                  onClick={() => setActiveId(c.id)}
                >
                  &lt;{c.label} /&gt;
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h2>Props</h2>
            <div className="controls">{controls}</div>
          </div>
        </aside>

        <main className="preview">
          <div className="preview-inner">{preview}</div>
        </main>
      </div>
    </div>
  );
}
