export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Audio proxy: /proxy/audio/:id
    const audioMatch = url.pathname.match(/^\/proxy\/audio\/([0-9a-f-]{36})$/);
    if (audioMatch) {
      const id = audioMatch[1];
      const range = request.headers.get("Range");
      const headers = { "User-Agent": "Mozilla/5.0" };
      if (range) headers["Range"] = range;
      const res = await fetch(`https://cdn1.suno.ai/${id}.mp3`, { headers });
      const out = new Headers({
        "Content-Type": "audio/mpeg",
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=86400",
      });
      const cl = res.headers.get("Content-Length");
      const cr = res.headers.get("Content-Range");
      if (cl) out.set("Content-Length", cl);
      if (cr) out.set("Content-Range", cr);
      return new Response(res.body, { status: res.status, headers: out });
    }

    // Image proxy: /proxy/image/:id
    const imageMatch = url.pathname.match(/^\/proxy\/image\/([0-9a-f-]{36})$/);
    if (imageMatch) {
      const id = imageMatch[1];
      const res = await fetch(`https://cdn2.suno.ai/image_large_${id}.jpeg`);
      const out = new Headers({
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      });
      const cl = res.headers.get("Content-Length");
      if (cl) out.set("Content-Length", cl);
      return new Response(res.body, { status: res.status, headers: out });
    }

    // Everything else → static assets
    return env.ASSETS.fetch(request);
  },
};
