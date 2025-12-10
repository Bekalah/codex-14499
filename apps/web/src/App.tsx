<<<<<<< origin
=======
<<<<<<< HEAD
>>>>>>> modified
import { useEffect, useState } from 'react'

// Example: load unlocked Claude data you’ve exported into /public/registry
type Arcana = { id:number; name:string; avatar?:string; keywords?:string[] }

export default function App() {
  const [arcana, setArcana] = useState<Arcana[]>([])
  const [ok, setOk] = useState<boolean | null>(null)

  useEffect(() => {
    // Pages Functions health (add apps/web/functions/api/health.ts to enable)
    fetch('/api/health')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(() => setOk(true))
      .catch(() => setOk(false))

    // Static JSON from public/ (moves with the site, works on Cloudflare)
    fetch('/registry/arcana.json')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setArcana)
      .catch(() => setArcana([]))
  }, [])

  return (
    <main style={{padding:'24px', maxWidth:920, margin:'0 auto'}}>
      <h1 style={{marginBottom:8}}>Cathedral of Circuits</h1>
      <p style={{marginTop:0, opacity:.8}}>
        {ok === null ? 'Checking /api…' : ok ? 'API online' : 'API offline'} · ND-safe build
      </p>

      <section style={{marginTop:24}}>
        <h2>Major Arcana (sample)</h2>
        <ul>
          {arcana.map(c => (
            <li key={c.id}>
              <strong>{c.name}</strong>
              {c.keywords?.length ? <> — <em>{c.keywords.join(', ')}</em></> : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
<<<<<<< origin
=======
=======
/**
 * 🏛️✨ CATHEDRAL OF CIRCUITS - MAIN APP COMPONENT
 *
 * React app that integrates your native ES game engine
 * Guild Wars-style RPG with your authentic Codex 144:99 system
 *
 * @architecture React + TypeScript + Vite
 * @game_authentic Your real Guild Wars-style RPG
 */

import { CathedralGameInterface } from './components/CathedralGameInterface';
import './App.css';

function App() {
  return (
    <div className="cathedral-app">
      <CathedralGameInterface />
    </div>
  );
}

export default App;
>>>>>>> 238560e80e8a371b7ddac79f30ccbecd9fca80b0
>>>>>>> modified
