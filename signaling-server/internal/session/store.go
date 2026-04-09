// Package session provides thread-safe, in-memory storage for WebRTC session descriptions.
package session

import (
	"fmt"
	"sync"
)

// Description is a standard WebRTC session description.
type Description struct {
	Type string `json:"type"`
	SDP  string `json:"sdp"`
}

// Store manages all active sessions.
type Store struct {
	mu       sync.RWMutex
	sessions map[string]*peerSessions
}

// peerSessions holds the offer and answer for a single WebRTC handshake.
type peerSessions struct {
	offer  *Description
	answer *Description
}

// NewStore creates a new session store.
func NewStore() *Store {
	return &Store{
		sessions: make(map[string]*peerSessions),
	}
}

// CreateSession stores the initial offer and returns a unique session ID.
func (s *Store) CreateSession(offer *Description, id string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.sessions[id] = &peerSessions{offer: offer}
}

// SetAnswer adds the answer to an existing session.
func (s *Store) SetAnswer(id string, answer *Description) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	sess, ok := s.sessions[id]
	if !ok {
		return fmt.Errorf("session %q not found", id)
	}
	sess.answer = answer
	return nil
}

// GetOffer retrieves the initial offer for a session.
func (s *Store) GetOffer(id string) (*Description, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	sess, ok := s.sessions[id]
	if !ok {
		return nil, fmt.Errorf("session %q not found", id)
	}
	return sess.offer, nil
}

// GetAnswer retrieves the answer for a session and then deletes the session.
func (s *Store) GetAnswer(id string) (*Description, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	sess, ok := s.sessions[id]
	if !ok {
		return nil, fmt.Errorf("session %q not found", id)
	}

	if sess.answer == nil {
		return nil, nil // No answer available yet.
	}

	// Once the answer is retrieved, the handshake is complete.
	// We can remove the session to free up memory.
	delete(s.sessions, id)

	return sess.answer, nil
}
