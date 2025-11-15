const http2 = require("node:http2");
const fs = require("node:fs");
const path = require("node:path");
const promClient = require("prom-client");
const register = new promClient.Registry();

const options = {
  key: fs.readFileSync("./certs/localhost.key"),
  cert: fs.readFileSync("./certs/localhost.crt"),
  allowHTTP1: true,
};

const PORT = 8443;
const HOST = "0.0.0.0";

promClient.collectDefaultMetrics({ register });

const server = http2.createSecureServer(options, async (req, res) => {
  if (req.url === "/metrics") {
    if (res.stream) {
      res.stream.respond({
        "content-type": register.contentType,
        ":status": 200,
      });
      res.stream.end(await register.metrics());
    } else {
      res.writeHead(200, { "content-type": register.contentType });
      res.end(await register.metrics());
    }
    return;
  }

  const filePath = path.join(
    __dirname,
    "src",
    req.url === "/" ? "index.html" : req.url
  );

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (res.stream) {
        res.stream.respond({ "content-type": "text/plain", ":status": 404 });
        res.stream.end("Ficheiro não encontrado.");
      } else {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Ficheiro não encontrado.");
      }
      return;
    }

    const ext = path.extname(filePath);
    const contentType =
      ext === ".html" ? "text/html" : "application/octet-stream"; // Simplificado

    if (res.stream) {
      res.stream.respond({ "content-type": contentType, ":status": 200 });
      res.stream.end(data);
    } else {
      res.writeHead(200, { "content-type": contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor HTTP/2 a correr em https://${HOST}:${PORT}`);
});
