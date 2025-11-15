const https = require("node:https"); // Módulo HTTP/1.1
const fs = require("node:fs");
const path = require("node:path");
const { readFileSync } = fs;
const zlib = require("node:zlib"); // Você não está a usar isto, mas estava no seu ficheiro

// --- INÍCIO: Correcção 1 - Adicionar Prom-Client ---
const promClient = require("prom-client");
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });
// --- FIM: Correcção 1 ---

// (O seu código brotliOptions... httpsPort... etc.)
const brotliOptions = {
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 10,
  },
};

const httpsPort = 8045;
const httpsHost = "0.0.0.0"; // Corrigido de 'localhost' para '0.0.0.0' para funcionar no Docker

const options = {
  key: readFileSync(path.resolve("./certs/server-key.pem")),
  cert: readFileSync(path.resolve("./certs/server-cert.pem")),
};

https
  .createServer(options, async (req, res) => {
    if (req.url === "/favicon.ico") {
      res.writeHead(204);
      return res.end();
    }

    // --- INÍCIO: Correcção 2 - Reescrever /metrics para H1.1 ---
    if (req.url === "/metrics") {
      // Use a sintaxe padrão do HTTP/1.1
      res.writeHead(200, { "Content-Type": register.contentType });
      res.end(await register.metrics());
      return;
    }
    // --- FIM: Correcção 2 ---

    const filePath = path.join(
      __dirname,
      "src",
      req.url === "/" ? "index.html" : req.url
    );

    const stream = fs.createReadStream(filePath);

    stream.on("error", () => {
      if (!res.headersSent) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Ficheiro não encontrado.");
      } else {
        res.end();
      }
    });

    // Nota: Você definiu brotliOptions mas não o está a usar aqui.
    // O seu código anterior comprimia, este não.
    stream.pipe(res);
  })
  .listen(httpsPort, httpsHost, () => {
    console.log(`HTTPS server listening on https://${httpsHost}:${httpsPort}`);
  });
