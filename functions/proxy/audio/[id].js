export async function onRequest(context) {
  const { request, params } = context;
  const id = params.id;

  const upstreamHeaders = new Headers();
  const range = request.headers.get('Range');
  if (range) upstreamHeaders.set('Range', range);

  const upstream = await fetch(`https://cdn1.suno.ai/${id}.mp3`, {
    headers: upstreamHeaders,
  });

  const headers = new Headers();
  headers.set('Content-Type', 'audio/mpeg');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'public, max-age=86400');

  for (const h of ['Content-Length', 'Content-Range']) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
