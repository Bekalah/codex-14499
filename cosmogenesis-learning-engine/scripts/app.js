import { dedupeSort, fmtPalette, findRealm, inferNodeForTarot, applyRealmPreview } from './utils.js';

const state = {
  nodes: [],
  realms: [],
  tarot: {}, // id -> {style, sigil, realm}
  selected: { style:'', tarotId:'', nodeId:null, realmId:'' }
};

async function loadJSON(path){
  const res = await fetch(path, {cache:'no-store'});
  if(!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function boot(){
  try {
    const [codex, realmMap, tarotHooks] = await Promise.all([
      loadJSON('data/codex_nodes.json'),
      loadJSON('data/realm_map.json'),
      loadJSON('data/tarot_hooks.json')
    ]);

    state.nodes  = codex?.nodes ?? [];
    state.realms = realmMap?.realms ?? [];
    state.tarot  = tarotHooks ?? {};

    populateTarotSelect();
    populateNodeSelect();

    // default: pick first tarot ID if present
    const firstTarot = Object.keys(state.tarot)[0];
    if(firstTarot){ onTarotChange(firstTarot); }
  } catch (err){
    console.error(err);
    alert('Failed to load Codex data. Please ensure data/*.json exist.');
  }

  bindUI();
}

function bindUI(){
  const styleSel = document.getElementById('styleSelect');
  const tarotSel = document.getElementById('tarotSelect');
  const nodeSel  = document.getElementById('nodeSelect');
  const openBtn  = document.getElementById('openRealmBtn');

  styleSel.addEventListener('change', e => {
    state.selected.style = e.target.value || '';
    // If style is manually set, just reflect it; do not override tarot realm
    render();
  });

  tarotSel.addEventListener('change', e => onTarotChange(e.target.value));
  nodeSel.addEventListener('change', e => {
    state.selected.nodeId = Number(e.target.value) || null;
    render();
  });

  openBtn.addEventListener('click', () => {
    if(!state.selected.realmId){
      alert('No realm selected. Choose a Tarot helper or node with realm.');
      return;
    }
    // In a full app, this would navigate into the realm UI/scene.
    // For this viewer, we just highlight the preview and scroll to it.
    document.getElementById('realmPreview').scrollIntoView({behavior:'smooth', block:'center'});
  });
}

function populateTarotSelect(){
  const tarotSel = document.getElementById('tarotSelect');
  tarotSel.innerHTML = '';
  const ids = Object.keys(state.tarot);
  if(ids.length === 0){
    const opt = document.createElement('option');
    opt.value = ''; opt.textContent = '(no tarot hooks found)';
    tarotSel.appendChild(opt);
    return;
  }
  for(const id of dedupeSort(ids)){
    const opt = document.createElement('option');
    const { style, sigil, realm } = state.tarot[id];
    opt.value = id;
    opt.textContent = `${id} — ${style ?? 'style?'} ${sigil ?? ''}`;
    tarotSel.appendChild(opt);
  }
}

function populateNodeSelect(){
  const nodeSel = document.getElementById('nodeSelect');
  nodeSel.innerHTML = '';
  if(state.nodes.length === 0){
    const opt = document.createElement('option');
    opt.value = ''; opt.textContent = '(no nodes found)';
    nodeSel.appendChild(opt);
    return;
  }
  for(const n of state.nodes){
    const opt = document.createElement('option');
    opt.value = String(n.id);
    opt.textContent = `${n.id.toString().padStart(3,'0')} — ${n.name}`;
    nodeSel.appendChild(opt);
  }
}

function onTarotChange(tarotId){
  state.selected.tarotId = tarotId;
  const hook = state.tarot[tarotId] || {};
  // Update style if none chosen manually
  if(!state.selected.style){
    state.selected.style = hook.style || '';
    document.getElementById('styleSelect').value = state.selected.style;
  }
  // Realm from tarot
  state.selected.realmId = hook.realm || '';

  // Try to infer node by matching realm or tarotRef in node data
  const node = inferNodeForTarot(state.nodes, tarotId, state.selected.realmId);
  state.selected.nodeId = node?.id ?? null;
  if (state.selected.nodeId){
    document.getElementById('nodeSelect').value = String(state.selected.nodeId);
  }
  render();
}

function render(){
  // Node card
  const node = state.nodes.find(n => n.id === state.selected.nodeId) || null;
  setText('nodeId', node ? node.id : '—');
  setText('nodeName', node ? node.name : '—');
  setText('nodeLayer', node ? node.layer : '—');
  setText('nodeTone', node ? node.tone : '—');
  setText('nodeColor', node ? node.colorHex : '—');
  setText('nodeGeo', node ? node.geometry : '—');
  setText('nodePlanet', node ? (node.planet || '—') : '—');
  setText('nodePath', node ? (node.path || '—') : '—');
  setText('nodeAngel', node?.shemPair?.angel || '—');
  setText('nodeDaemon', node?.shemPair?.daemon || '—');

  // Tarot card
  const hook = state.tarot[state.selected.tarotId] || {};
  setText('tarotId', state.selected.tarotId || '—');
  setText('tarotStyle', state.selected.style || hook.style || '—');
  setText('tarotSigil', hook.sigil || '—');
  setText('tarotRealm', hook.realm || '—');

  // Realm card
  const realm = findRealm(state.realms, state.selected.realmId);
  setText('realmId', realm?.id || '—');
  setText('realmName', realm?.name || '—');
  setText('realmPalette', realm ? fmtPalette(realm.palette) : '—');
  setText('realmOverlays', realm?.overlays?.join(', ') || '—');
  applyRealmPreview(realm);
}

function setText(id, txt){
  const el = document.getElementById(id);
  if(el) el.textContent = String(txt);
}

boot();
