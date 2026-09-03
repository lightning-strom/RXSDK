// Simple CORS proxy for GitDocs API
// Run: node proxy.mjs
import http from 'http';

const PORT = 3002;
const TARGET = 'http://10.43.0.13:8001';

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const targetUrl = `${TARGET}${url.pathname}${url.search}`;

  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const targetUrlObj = new URL(targetUrl);

    const proxyReq = http.request({
      hostname: targetUrlObj.hostname,
      port: targetUrlObj.port,
      path: targetUrlObj.pathname + targetUrlObj.search,
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Content-Length': body.length,
      },
    }, proxyRes => {
      res.writeHead(proxyRes.statusCode, {
        'Content-Type': proxyRes.headers['content-type'] || 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      proxyRes.pipe(res);
    });

    proxyReq.on('error', err => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ code: -1, message: 'Proxy error: ' + err.message }));
    });

    proxyReq.write(body);
    proxyReq.end();
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`GitDocs proxy running on http://0.0.0.0:${PORT}`);
  console.log(`Proxying to ${TARGET}`);
});
