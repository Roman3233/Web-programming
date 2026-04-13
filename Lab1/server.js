const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const timestamp = new Date().toISOString();
  const { method, url } = req;
  const parsedUrl = new URL(url, `http://${req.headers.host || 'localhost'}`);
  const { pathname } = parsedUrl;

  console.log(`[${timestamp}] ${method} ${url}`);

  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Home page');
    return;
  }

  if (pathname === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('About page');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(`404 Not Found. You made a ${method} request to ${url}`);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
