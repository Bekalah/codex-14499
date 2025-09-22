export function createCtxSpy() {
  const calls = [];
  const record = (name) => (...args) => {
    calls.push({ name, args });
  };
  const ctx = {
    canvas: { width: 1440, height: 900 },
    beginPath: record('beginPath'),
    moveTo: record('moveTo'),
    lineTo: record('lineTo'),
    arc: record('arc'),
    stroke: record('stroke'),
    fill: record('fill'),
    save: record('save'),
    restore: record('restore'),
    setTransform: record('setTransform'),
    clearRect: record('clearRect'),
    fillRect: record('fillRect'),
    translate: record('translate')
  };

  Object.defineProperties(ctx, {
    fillStyle: {
      set(value) {
        calls.push({ name: 'set:fillStyle', args: [value] });
      },
      get() {
        return undefined;
      }
    },
    strokeStyle: {
      set(value) {
        calls.push({ name: 'set:strokeStyle', args: [value] });
      },
      get() {
        return undefined;
      }
    },
    globalAlpha: {
      set(value) {
        calls.push({ name: 'set:globalAlpha', args: [value] });
      },
      get() {
        return undefined;
      }
    },
    lineWidth: {
      set(value) {
        calls.push({ name: 'set:lineWidth', args: [value] });
      },
      get() {
        return undefined;
      }
    }
  });

  return { ctx, calls };
}
