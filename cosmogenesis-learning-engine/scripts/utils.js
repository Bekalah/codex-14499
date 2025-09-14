export function dedupeSort(arr){
  return Array.from(new Set(arr)).sort((a,b)=>a.localeCompare(b));
}

export function fmtPalette(p){
  if(!Array.isArray(p)) return '—';
  return p.join(' · ');
}

export function findRealm(realms, realmId){
  return realms.find(r => r.id === realmId) || null;
}

export function inferNodeForTarot(nodes, tarotId, realmId){
  // heuristic: prefer exact tarotRef match, else realmRef match, else first node
  let n = nodes.find(n => n.tarotRef === tarotId);
  if(n) return n;
  if(realmId){
    n = nodes.find(n => n.realmRef === realmId);
    if(n) return n;
  }
  return nodes[0] || null;
}

export function applyRealmPreview(realm){
  const box = document.getElementById('realmPreview');
  if(!box){return;}
  if(!realm){
    box.style.background = 'rgba(255,255,255,.03)';
    return;
  }
  const a = realm.palette?.[0] ?? '#111';
  const b = realm.palette?.[1] ?? '#333';
  const c = realm.palette?.[2] ?? '#555';
  // Calm, ND-safe gradient — no strobe, no fast motion
  box.style.background = `linear-gradient(135deg, ${a}, ${b} 50%, ${c})`;
}
