export function renderHelix(ctx, opts) {
  let g;
  if (typeof global !== 'undefined') {
    g = global;
  } else if (typeof window !== 'undefined') {
    g = window;
  } else {
    g = Function('return this')();
  }
  if (!g.__renderHelixCalls) g.__renderHelixCalls = [];
  g.__renderHelixCalls.push({ ctx, opts });
}