export function createCtxSpy() {
  const calls = [];
  const record = (name) => (...args) => { calls.push({ name, args }); };
  const ctx = {
    // state
    fillStyle: null,
    strokeStyle: null,
    globalAlpha: 1,
    lineWidth: 1,
    // path methods
    beginPath: record('beginPath'),
    moveTo: record('moveTo'),
    lineTo: record('lineTo'),
    arc: record('arc'),
    stroke: record('stroke'),
    fill: record('fill'),
    // canvas ops
    save: record('save'),
    restore: record('restore'),
    setTransform: record('setTransform'),
    clearRect: record('clearRect'),
    fillRect: record('fillRect'),
  };
  // Track property sets by defining setters that log changes
  Object.defineProperties(ctx, {
    fillStyle: {
      set(v) { calls.push({ name: 'set:fillStyle', args: [v] }); },
      get() { return undefined; }
    },
    strokeStyle: {
      set(v) { calls.push({ name: 'set:strokeStyle', args: [v] }); },
      get() { return undefined; }
    },
    globalAlpha: {
      set(v) { calls.push({ name: 'set:globalAlpha', args: [v] }); },
      get() { return undefined; }
    },
    lineWidth: {
      set(v) { calls.push({ name: 'set:lineWidth', args: [v] }); },
      get() { return undefined; }
    }
  });
  return { ctx, calls };
}