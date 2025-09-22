GLOBAL CONTRACT (put in every repo as /BOT_CONTRACT.md)
• Never overwrite sacred content. Only add/append; when in doubt, create a new file and link it.
• Respect the Trinity routing:
  • cathedral-core = APIs, WS, DB (SQLite/Postgres), codex data, rites.
  • cathedral-scenes = experiential/3D/2D scenes (Stone Cathedral, Liber Arcanae UI).
  • cathedral-hub = public shell, navigation, two-panel UI, client → WS bridge.
• Style + Accessibility: Kanso/Ma/Shibumi tokens; reduced motion; AA+ contrast; 44px targets.
• Canon to enforce:
  • Codex 144:99 spine & mottos (99/93/2121 math)
  • Bones/Blood/Nerves fusion (Villard/Ripley/Soyga)
  • Central Thrones & 21 Pillars; ledger-only rule; visionary style/φ ratio
  • Factions, repaired registry, meta scenes (IFS Mirror, Chapel Perilous)
  • Temple of the Unbuilt realm + lineage role
  • Master Bot responsibilities by repo (Mind/Soul/Body + Companion)
  • Interactive-book schema/prompt for 144:99 nodes
  • Recovery Summary (33 spine/21 pillars, fusion logic, public-purity filter)
  • Witch Eye rite text (keep verbatim; ND-safe)

⸻

0) SHARED SETUP (apply in all 8 repos, unchanged)

Add /public/ui/tokens.css, /public/ui/primitives.css, /public/ui/index.html (the two-panel shell + motion gate).
Add /libs/event-bus.ts and point clients at wss://cathedral-core.fly.dev/ws.
Add .flyignore to exclude node_modules, dist, large art sources (no LFS).
