# dit-dah-go

Local WebRTC chat/practice project with three parts:

- `signaling-server`: small Go HTTP service that exchanges SDP offers and answers.
- `client`: terminal client.
- `app`: Wails desktop client.

## TL;DR

Start the signaling server in Podman:

```bash
cd signaling-server
podman machine start
podman build -t ditdahgo-signaling -f Containerfile .
podman run -d --name ditdahgo-signaling -p 8080:8080 ditdahgo-signaling
podman ps -a
```

Run the CLI client as host:

```bash
cd client
go run ./cmd/ditdahgo -host -signal http://localhost:8080
```

Run the CLI client as joiner:

```bash
cd client
go run ./cmd/ditdahgo -join SESSION_ID -signal http://localhost:8080
```

Run the desktop app in development:

```bash
cd app
wails dev
```

In the desktop app, enter the signaling URL in the connection panel:

- same machine as Podman: `http://localhost:8080`
- another machine on your LAN: `http://<server-ip>:8080`

## What We Are Doing

The signaling server is no longer something you need to keep running in a separate development terminal. It can run as a detached Podman container on your laptop or another machine on your local network.

Both clients are now configurable at runtime instead of being locked to `localhost`:

- `client` accepts `-signal` and `SIGNAL_SERVER_URL`.
- `app` accepts a URL entered in the UI and also supports `SIGNAL_SERVER_URL` as a backend fallback.

That means you can:

- run everything on one machine with `http://localhost:8080`
- run the signaling server on one LAN machine and point the clients at `http://<lan-ip>:8080`

## Project Layout

```text
dit-dah-go/
├── app/
├── client/
└── signaling-server/
```

### `signaling-server`

Purpose: exchange SDP messages between peers.

Run locally without Podman:

```bash
cd signaling-server
go run ./cmd/signaling
```

Override the listen address if needed:

```bash
SIGNAL_ADDR=:9090 go run ./cmd/signaling
PORT=9090 go run ./cmd/signaling
```

### `client`

Purpose: terminal-based peer client.

Examples:

```bash
cd client
go run ./cmd/ditdahgo -host -signal http://localhost:8080
go run ./cmd/ditdahgo -join SESSION_ID -signal http://localhost:8080
```

You can also use an environment variable instead of passing `-signal` each time:

```bash
export SIGNAL_SERVER_URL=http://192.168.1.50:8080
go run ./cmd/ditdahgo -host
go run ./cmd/ditdahgo -join SESSION_ID
```

### `app`

Purpose: Wails desktop client.

Development run:

```bash
cd app
wails dev
```

Build a desktop app:

```bash
cd app
wails build
```

The app stores the signaling server URL in local UI storage on your machine. That setting is not written into the repository.

## Podman Workflow

Build the image:

```bash
cd signaling-server
podman build -t ditdahgo-signaling -f Containerfile .
```

Run the container:

```bash
podman run -d --name ditdahgo-signaling -p 8080:8080 ditdahgo-signaling
```

Inspect it:

```bash
podman ps -a
podman logs ditdahgo-signaling
```

Stop and remove it:

```bash
podman rm -f ditdahgo-signaling
```

## LAN Usage

If the signaling server runs on your laptop and another local machine needs to join, use your laptop's LAN IP instead of `localhost`.

Example:

```bash
http://192.168.1.50:8080
```

On macOS, one common way to get your IP is:

```bash
ipconfig getifaddr en0
```

If that interface is not active, try `en1`.

## Dev Config And Git Safety

The intended development pattern is runtime-only config, not source edits.

Safe options:

- pass `-signal` to the CLI
- export `SIGNAL_SERVER_URL` in your shell
- type the URL into the desktop app UI

These approaches keep machine-specific settings separate from tracked code.

Examples:

```bash
export SIGNAL_SERVER_URL=http://192.168.1.50:8080
cd client
go run ./cmd/ditdahgo -host
```

```bash
cd client
go run ./cmd/ditdahgo -join SESSION_ID -signal http://192.168.1.50:8080
```

## Current Scope

This setup is aimed at local and LAN testing.

- signaling is containerized with Podman
- clients are configurable at runtime
- no machine-specific URL needs to be committed to the repo

For broader internet use later, you will probably want TURN in addition to signaling.