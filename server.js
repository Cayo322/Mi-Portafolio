const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Obtén la ruta del archivo solicitado dentro de la carpeta 'public'
  const filePath = path.join(__dirname, 'public', req.url);

  console.log('Ruta del archivo solicitado:', filePath);

  // Verifica si filePath es un archivo o un directorio
  if (fs.statSync(filePath).isDirectory()) {
    console.error('Se intentó leer un directorio:', filePath);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('Error del servidor');
    return;
  }

  // Si la solicitud es para la página principal ("/") o no se especifica un archivo,
  // sirve un archivo de inicio (por ejemplo, "index.html").
  if (req.url === '/' || req.url === '') {
    req.url = '/index.html';
  }

  // Lee el archivo solicitado y responde con su contenido
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      if (err.code === 'ENOENT') {
        console.error('Archivo no encontrado:', filePath);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Archivo no encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('Error del servidor');
      }
    } else {
      const ext = path.extname(filePath);
      let contentType = 'text/html';

      switch (ext) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpeg';
          break;
      }

      console.log('Sirviendo archivo:', filePath);

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
