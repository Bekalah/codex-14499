// Calm data hydrate: fetch node dossier without motion.
const NODES_SOURCE = 'data/nodes.json';
const statusElement = document.querySelector('[data-node-status]');
const listElement = document.querySelector('[data-node-list]');

// Mirror status messages in the UI for offline clarity.
function setStatus(message) {
  if (statusElement) statusElement.textContent = message;
}

// Fetch JSON with graceful failure handling.
async function fetchNodes(url) {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

// Build a definition row pairing label and value.
function createDetailRow(term, detail) {
  const dt = document.createElement('dt');
  dt.textContent = term;
  const dd = document.createElement('dd');
  dd.textContent = detail;
  return [dt, dd];
}

// Render a single node card with essential metadata.
function createNodeCard(node) {
  const item = document.createElement('li');
  item.className = 'node-card';

  const heading = document.createElement('h3');
  heading.textContent = node.name;
  item.appendChild(heading);

  const meta = document.createElement('dl');
  const rows = [
    createDetailRow('Element', node.element),
    createDetailRow('Planet', node.planet),
    createDetailRow('Geometry', node.geometry),
  ];
  // Append dt/dd pairs sequentially to respect definition order.
  rows.forEach(([term, detail]) => {
    meta.appendChild(term);
    meta.appendChild(detail);
  });
  item.appendChild(meta);

  return item;
}

// Paint the node grid, limited to nine for calm readability.
function renderNodes(nodes) {
  if (!listElement) return;
  listElement.innerHTML = '';
  nodes.slice(0, 9).forEach((node) => {
    listElement.appendChild(createNodeCard(node));
  });
}

// Provide offline fallback messaging when JSON is missing.
function renderFallback() {
  if (!listElement) return;
  const item = document.createElement('li');
  item.className = 'node-card';
  // InnerHTML keeps markup compact for the single fallback paragraph.
  item.innerHTML = '<h3>Nodes Offline</h3><p>Node data is unavailable. Visit the grimoire archive or retry locally.</p>';
  listElement.innerHTML = '';
  listElement.appendChild(item);
}

// Trigger hydration once DOM is ready.
async function hydrateNodes() {
  if (!listElement) return;
  setStatus('Loading node system...');
  const nodes = await fetchNodes(NODES_SOURCE);
  if (!nodes) {
    setStatus('Node data unavailable; showing offline notice.');
    renderFallback();
    return;
  }
  setStatus(`Loaded ${nodes.length} harmonic nodes.`);
  renderNodes(nodes);
}

hydrateNodes();
