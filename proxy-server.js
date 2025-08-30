const http = require('http');
const https = require('https');

const OLLAMA_HOST = 'ollama-xoa4.onrender.com';
const PROXY_PORT = 3010;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const options = {
            hostname: OLLAMA_HOST,
            path: req.url,
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const proxyReq = https.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (e) => {
            console.error('Proxy error:', e);
            res.writeHead(500);
            res.end('Proxy error');
        });

        if (body) {
            proxyReq.write(body);
        }
        proxyReq.end();
    });
});

server.listen(PROXY_PORT, () => {
    console.log(`Proxy server running on http://localhost:${PROXY_PORT}`);
    console.log(`Proxying requests to https://${OLLAMA_HOST}`);
});