// Package server provides the HTTP server and routing for the signaling service.
package server

import (
	"encoding/json"
	"fmt" // This should already be there
	"io"
	"log/slog"
	"net/http"
	"signaling-server/internal/session"
	"strings"

	"github.com/google/uuid"
)

// Server is the HTTP server.
type Server struct {
	store *session.Store
}

// New creates a new server with its routes.
func New(store *session.Store, addr string) *http.Server {
	srv := &Server{
		store: store,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/session", srv.handleSession)
	mux.HandleFunc("/session/", srv.handleSession) // Handle trailing slash

	return &http.Server{
		Addr:    addr,
		Handler: corsMiddleware(mux),
	}
}

// handleSession routes requests based on method and URL.
// handleSession routes requests based on method and URL.
func (s *Server) handleSession(w http.ResponseWriter, r *http.Request) {
	// Case 1: The host is creating a new session.
	// The path is exactly "/session" and the method is POST.
	if r.URL.Path == "/session" && r.Method == http.MethodPost {
		s.handleCreateSession(w, r)
		return
	}

	// Case 2: A client is interacting with an existing session.
	// The path must start with "/session/".
	pathPrefix := "/session/"
	if !strings.HasPrefix(r.URL.Path, pathPrefix) {
		http.Error(w, "Invalid request path", http.StatusBadRequest)
		return
	}

	sessionID := strings.TrimPrefix(r.URL.Path, pathPrefix)
	if sessionID == "" {
		http.Error(w, "Session ID cannot be empty", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodGet:
		s.handleGetSDP(w, r, sessionID)
	case http.MethodPost:
		s.handlePostAnswer(w, r, sessionID)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (s *Server) handleCreateSession(w http.ResponseWriter, r *http.Request) {
	var offer session.Description
	if err := decodeJSON(r.Body, &offer); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	sessionID := uuid.New().String()[:8]
	s.store.CreateSession(&offer, sessionID)

	slog.Info("Session created", "id", sessionID)
	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, sessionID)
}

func (s *Server) handleGetSDP(w http.ResponseWriter, r *http.Request, id string) {
	// A client can optionally add a "?client=host" query param when polling.
	// This makes our logic explicit and robust.
	isHostPolling := r.URL.Query().Get("client") == "host"

	if isHostPolling {
		// The host is polling for the answer.
		answer, err := s.store.GetAnswer(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		// If the answer isn't ready, send a "No Content" status.
		// The client will know to poll again.
		if answer == nil {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		slog.Info("Sending answer to host", "id", id)
		encodeJSON(w, answer)

	} else {
		// Assume it's the joiner fetching the initial offer.
		offer, err := s.store.GetOffer(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		slog.Info("Sending offer to joiner", "id", id)
		encodeJSON(w, offer)
	}
}

func (s *Server) handlePostAnswer(w http.ResponseWriter, r *http.Request, id string) {
	var answer session.Description
	if err := decodeJSON(r.Body, &answer); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := s.store.SetAnswer(id, &answer); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	slog.Info("Received answer", "id", id)
	w.WriteHeader(http.StatusOK)
}

// --- Helper Functions ---

func decodeJSON(r io.ReadCloser, v any) error {
	defer r.Close()
	return json.NewDecoder(r).Decode(v)
}

func encodeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
