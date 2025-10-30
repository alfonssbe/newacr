const { createServer } = require('http');
const { parse } = require('url');
const { readFile } = require('fs/promises');
const { join } = require('path');
const next = require('next');

const dev = false;
const hostname = 'localhost';
const port = 3002;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      let reqUrl = req.url
        .replaceAll(/\[/g, '%5B')
        .replaceAll(/\]/g, '%5D')
        .replaceAll('%5b', '%5B')
        .replaceAll('%5d', '%5D');

      const parsedUrl = parse(reqUrl, true);
      const { pathname, query } = parsedUrl;

      if (pathname.startsWith('/uploads/')) {
        // Use the raw URL to avoid double decoding
        const rawPath = decodeURIComponent(reqUrl.split('?')[0]); // remove query string, decode %20 -> space
        const filePath = join(__dirname, rawPath.replace(/^\/+/, ''));
        try {
          const data = await readFile(filePath);
          res.statusCode = 200;

          if (filePath.match(/\.(jpg|jpeg)$/i)) {
            res.setHeader('Content-Type', 'image/jpeg');
          } else if (filePath.match(/\.png$/i)) {
            res.setHeader('Content-Type', 'image/png');
          } else if (filePath.match(/\.webp$/i)) {
            res.setHeader('Content-Type', 'image/webp');
          }

          res.end(data);
        } catch (err) {
          console.error('File serve error:', err);
          res.statusCode = 404;
          res.end('File not found');
        }
        return;
      }

      // Custom routes
      if (pathname === '/a') {
        await app.render(req, res, '/a', query);
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
