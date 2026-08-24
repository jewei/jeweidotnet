const PRODUCES = ['text/html', 'text/markdown'];
const STATIC_EXTENSION = /\.(?:css|js|mjs|map|png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|eot|xml|txt|json|pdf|mp4|webm|mp3|wav|ogg|zip)$/i;

function parseAccept(header) {
  return header
    .split(',')
    .map((raw) => {
      const parts = raw.trim().split(';').map((part) => part.trim());
      const type = parts[0].toLowerCase();
      if (!type) return null;

      let q = 1;
      for (const parameter of parts.slice(1)) {
        const [name, value] = parameter.split('=').map((part) => part.trim());
        if (name.toLowerCase() !== 'q') continue;
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
      }

      const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2;
      return { type, q, specificity };
    })
    .filter(Boolean);
}

function matches(entry, candidate) {
  if (entry.type === '*/*') return true;
  if (entry.type.endsWith('/*')) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

function preferredType(header, produces = PRODUCES) {
  if (!header) return produces[0] ?? null;
  const entries = parseAccept(header);
  if (entries.length === 0) return produces[0] ?? null;

  let bestType = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of produces) {
    let matched = null;
    let matchedPosition = Infinity;

    for (let position = 0; position < entries.length; position++) {
      const entry = entries[position];
      if (!matches(entry, candidate)) continue;
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && position < matchedPosition)
      ) {
        matched = entry;
        matchedPosition = position;
      }
    }

    if (matched === null || matched.q <= 0) continue;
    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestType = candidate;
      bestQ = matched.q;
      bestPosition = matchedPosition;
    }
  }

  return bestType;
}

function appendVaryAccept(headers) {
  const existing = headers.get('Vary');
  if (!existing) {
    headers.set('Vary', 'Accept');
    return;
  }

  const tokens = existing.split(',').map((token) => token.trim().toLowerCase());
  if (!tokens.includes('accept')) headers.set('Vary', `${existing}, Accept`);
}

function markdownPath(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return clean === '/' ? '/index.md' : `${clean}/index.md`;
}

function negotiatedResponse(body, init) {
  const response = new Response(body, init);
  appendVaryAccept(response.headers);
  return response;
}

function notAcceptable(message = 'Available representations: text/html, text/markdown') {
  return negotiatedResponse(`Not Acceptable\n\n${message}\n`, {
    status: 406,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

function markdownNotFound() {
  return negotiatedResponse(
    [
      '# 404: Page not found',
      '',
      'The requested path does not exist on jewei.net.',
      '',
      'Try one of these indexes:',
      '',
      '- [Agent guide](https://jewei.net/llms.txt)',
      '- [Sitemap](https://jewei.net/sitemap-index.xml)',
      '- [Blog index](https://jewei.net/blog/)',
      '- [Home](https://jewei.net/)',
      '',
    ].join('\n'),
    {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    },
  );
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (STATIC_EXTENSION.test(url.pathname) || url.pathname.startsWith('/api/')) {
    return context.next();
  }

  const accept = context.request.headers.get('Accept');
  const chosen = preferredType(accept);
  if (chosen === null && accept) return notAcceptable();

  const alternatePath = markdownPath(url.pathname);

  if (chosen === 'text/markdown') {
    const alternateUrl = new URL(url);
    alternateUrl.pathname = alternatePath;
    const markdownRequest = new Request(alternateUrl, context.request);
    const markdownResponse = await context.env.ASSETS.fetch(markdownRequest);

    if (markdownResponse.status === 200) {
      const response = new Response(markdownResponse.body, markdownResponse);
      response.headers.set('Content-Type', 'text/markdown; charset=utf-8');
      response.headers.set('Link', '</llms.txt>; rel="describedby"');
      appendVaryAccept(response.headers);
      return response;
    }

    const htmlResponse = await context.next();
    if (htmlResponse.status === 404) return markdownNotFound();

    if (!preferredType(accept, ['text/html'])) {
      return notAcceptable('The Markdown representation is unavailable and HTML is not acceptable.');
    }

    const response = new Response(htmlResponse.body, htmlResponse);
    appendVaryAccept(response.headers);
    return response;
  }

  const htmlResponse = await context.next();
  const response = new Response(htmlResponse.body, htmlResponse);
  appendVaryAccept(response.headers);

  if (response.status === 200 && response.headers.get('Content-Type')?.includes('text/html')) {
    const discoveryLinks = [
      `<${alternatePath}>; rel="alternate"; type="text/markdown"`,
      '</llms.txt>; rel="describedby"',
    ].join(', ');
    const existing = response.headers.get('Link');
    response.headers.set('Link', existing ? `${existing}, ${discoveryLinks}` : discoveryLinks);
  }

  return response;
}
