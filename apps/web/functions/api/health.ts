export const onRequest = () =>
  new Response(JSON.stringify({ ok: true, app: 'cathedral' }), {
    headers: { 'content-type': 'application/json' }
  })
