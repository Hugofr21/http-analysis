
# My Projeto Setup Guide

This README provides step-by-step instructions for setting up and running a Node.js project locally, including Docker Compose orchestration, local domain configuration, and generating self-signed SSL certificates for HTTP/1.1, HTTP/2, and HTTP/3 using mkcert. This setup is ideal for development environments where you need to simulate a production-like HTTPS setup on localhost.

## Prerequisites

* Node.js and npm installed (version 14+ recommended).
* Docker and Docker Compose installed.
* mkcert installed for generating local certificates (install via brew install mkcert on macOS, or follow instructions at [mkcert.dev](https://mkcert.dev)).
* Administrative access to edit your hosts file (e.g., on Windows: C:\Windows\System32\drivers\etc\hosts).

## Installation

### 1. Install Node.js Dependencies

Run the following commands in your project root to install dependencies and start the application:

bash

```
npm install  # Installs packages into node_modules
npm start    # Starts the Node.js server
```

This assumes your project has a package.json with appropriate scripts.

### 2. Build and Run with Docker Compose

If you're using Docker for containerization:

bash

```
docker compose build  # Builds the Docker images
docker compose up     # Starts the containers (orchestrator activation)
```

Use docker compose up -d to run in detached mode. Stop with docker compose down.

## Local Domain Configuration

To access your project via a custom domain like meu-projeto.test:

1. Edit your hosts file:

   * On Windows: Open C:\Windows\System32\drivers\etc\hosts as administrator.
   * Add the following line:
     text

     ```
     127.0.0.1   meu-projeto.test
     ```
2. Flush DNS cache:
   bash

   ```
   ipconfig /flushdns  # On Windows; use sudo equivalents on macOS/Linux
   ```

Now, you can access your app at http://meu-projeto.test or https://meu-projeto.test (after certificate setup).

## SSL Certificate Generation with mkcert

mkcert creates locally-trusted development certificates. First, install the local CA (Certificate Authority) by running mkcert -install (only once).

### For HTTP/1.1

Generate basic certificates:

bash

```
mkcert -key-file server-key.key -cert-file server-cert.crt localhost 127.0.0.1 ::1
```

### For HTTP/2

HTTP/2 requires TLS. Generate certificates for localhost:

bash

```
mkcert localhost 127.0.0.1 ::1
```

This creates localhost.pem (cert) and localhost-key.pem (key) by default.

### For HTTP/3 (QUIC Support)

HTTP/3 uses QUIC for faster handshakes and improved Time to First Byte (TTFB). Generate certificates:

bash

```
mkcert -key-file localhost.key -cert-file localhost.crt localhost 127.0.0.1 ::1
```

Configure your Node.js server to use these certificates for HTTPS. Example in Node.js:

js

```
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.crt')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Hello, secure world!');
}).listen(443);
```

For HTTP/3, you may need additional libraries like node-quic or a server that supports it (e.g., via Cloudflare or experimental Node.js flags).

## Troubleshooting

* **Certificate Errors** : Ensure mkcert -install was run and your browser trusts the CA. Restart your browser.
* **Docker Issues** : Check logs with docker compose logs. Ensure ports are not conflicting.
* **Hosts File** : Changes may require a system restart or DNS flush.
* **HTTP Versions** : Test with tools like curl --http1.1, curl --http2, or curl --http3 (requires curl built with HTTP/3 support).

## Additional Notes

* This setup is for development only. Use production-grade certificates (e.g., from Let's Encrypt) in live environments.
* Customize domains, ports, and file names as needed for your project.
* For more advanced setups, consider integrating with tools like NGINX for reverse proxying.

If you encounter issues, check the console output or provide more details for debugging.
