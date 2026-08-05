export async function onRequest(context) {
  const { params } = context;
  const id = params.id;

  const upstream = await fetch(`https://cdn2.suno.ai/image_large_${id}.jpeg`);

  const headers = new Headers();
  headers.set('Content-Type', 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=86400');

  const contentLength = upstream.headers.get('Content-Length');
  if (contentLength) headers.set('Content-Length', contentLength);

  return new Response(upstream.body, { status: upstream.status, headers });
}
