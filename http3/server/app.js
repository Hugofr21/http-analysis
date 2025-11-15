const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./certs/localhost.key"),
  cert: fs.readFileSync("./certs/localhost.crt"),
};

const PORT = 8443;
const HOST = "0.0.0.0";

https
  .createServer(options, (req, res) => {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <title>Servidor Node.js</title>
        <style>
          body { font-family: sans-serif; background: #f0f0f0; color: #333; }
          div { background: #fff; border-radius: 8px; padding: 20px; margin: 40px; }
          h1 { color: #004a99; }
          p { font-size: 1.1em; }
        </style>
      </head>
      <body>
        <div>
          <h1>Olá do Servidor Node.js (H2)!</h1>
          <p>Esta página está a ser servida diretamente pelo seu backend Node.js.</p>
          <p>O NGINX viu o seu IP como: <strong>${clientIp}</strong></p>
        </div>
      </body>
      </html>
    `;

    res.end(htmlResponse);
  })
  .listen(PORT, HOST, () => {
    console.log(`Server Node.js HTTPS (H2) running at https://${HOST}:${PORT}`);
  });
