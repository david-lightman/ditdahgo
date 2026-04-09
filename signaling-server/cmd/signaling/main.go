package main

import (
	"log/slog"
	"os"
	"signaling-server/internal/server"
	"signaling-server/internal/session"
)

const defaultListenAddr = ":8080"

func main() {
	// Use Go 1.21's structured logger.
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	// 1. Create the dependency (the session store).
	store := session.NewStore()

	// 2. Inject the dependency into the server.
	listenAddr := resolveListenAddr()
	srv := server.New(store, listenAddr)

	// 3. Start the server.
	slog.Info("Signaling server starting", "address", srv.Addr)
	if err := srv.ListenAndServe(); err != nil {
		slog.Error("Failed to start server", "error", err)
		os.Exit(1)
	}
}

func resolveListenAddr() string {
	if addr := os.Getenv("SIGNAL_ADDR"); addr != "" {
		return addr
	}

	if port := os.Getenv("PORT"); port != "" {
		return ":" + port
	}

	return defaultListenAddr
}
