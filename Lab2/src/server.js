const http = require('http');
const fs = require('fs');
const path = require('path');
const { PORT, PUBLIC_DIR } = require('./config/env');
const logger = require('./utils/logger');
const { getContentType } = require('./utils/contentType');

function getFilePath(url) {
  if (url === '/') {
    return path.join(PUBLIC_DIR, 'index.html');
  }

  if (url === '/about') {
    return path.join(PUBLIC_DIR, 'about.html');
  }

  const normalizedPath = url.startsWith('/') ? url.slice(1) : url;
  return path.join(PUBLIC_DIR, normalizedPath);
}

const server = http.createServer((req, res) => {
  const start = Date.now();
  const requestUrl = req.url || '/';
  const filePath = getFilePath(requestUrl);
  const normalizedPublicDir = path.resolve(PUBLIC_DIR);
  const resolvedFilePath = path.resolve(filePath);

  if (!resolvedFilePath.startsWith(normalizedPublicDir)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Forbidden');
    return;
  }

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    logger.log(req.method, requestUrl, res.statusCode, durationMs);
    console.log(`${req.method} ${requestUrl} ${res.statusCode} ${durationMs}ms`);
  });

  fs.readFile(resolvedFilePath, (err, content) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Not found');
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', getContentType(resolvedFilePath));
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
