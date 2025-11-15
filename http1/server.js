const https = require("node:https");
const fs = require("node:fs");
const path = require("node:path");
const { readFileSync } = fs;
const zlib = require("node:zlib");

const promClient = require("prom-client");
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const brotliOptions = {
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 10,
  },
};

const httpsPort = 8045;
const httpsHost = "0.0.0.0";

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

    if (req.url === "/metrics") {
      res.writeHead(200, { "Content-Type": register.contentType });
      res.end(await register.metrics());
      return;
    }

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

    stream.pipe(res);
  })
  .listen(httpsPort, httpsHost, () => {
    console.log(`HTTPS server listening on https://${httpsHost}:${httpsPort}`);
  });
