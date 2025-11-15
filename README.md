# Node.js


C:\Windows\System32\drivers\etc\hosts 
127.0.0.1   meu-projeto.test
ipconfig /flushdns

## Http1.1

## Http2

Generating a Certificate for localhost Once the CA is installed,

```bash
mkcert localhost 127.0.0.1 ::1 
```

## Http3

QUIC Handshakes & Faster TTFB

```bash
mkcert -key-file localhost.key -cert-file localhost.crt localhost 127.0.0.1 ::1
```
