# Signaling Server

This service handles the SDP exchange for the dit-dah-go peers.

## Local Run

```bash
go run ./cmd/signaling
```

The server listens on `:8080` by default.

You can override the bind address with either `SIGNAL_ADDR` or `PORT`:

```bash
SIGNAL_ADDR=:9090 go run ./cmd/signaling
PORT=9090 go run ./cmd/signaling
```

## Podman

Build the image from the `signaling-server` directory:

```bash
podman build -t ditdahgo-signaling -f Containerfile .
```

Run it detached and publish the default port to the host:

```bash
podman run -d --name ditdahgo-signaling -p 8080:8080 ditdahgo-signaling
```

To stop and remove the container:

```bash
podman rm -f ditdahgo-signaling
```

Because the desktop app and CLI currently use `http://localhost:8080` for signaling, publishing port `8080` keeps them working without further changes.