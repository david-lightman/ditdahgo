package main

import (
	"app/internal/webrtc" // Make sure this matches your module name
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const defaultSignalServerURL = "http://localhost:8080"

// App struct
type App struct {
	ctx  context.Context
	conn *webrtc.Connection
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// HostSession creates a new WebRTC session and returns the Session ID to the frontend

func (a *App) HostSession(signalURL string) (string, error) {
	var err error
	if a.conn != nil {
		a.conn.Close()
	}
	a.conn, err = webrtc.NewConnection(resolveSignalServerURL(signalURL))
	if err != nil {
		return "", err
	}

	sessionID, err := a.conn.CreateSession()
	if err != nil {
		return "", err
	}

	a.setupConnectionListeners()
	return sessionID, nil
}

// JoinSession takes a Session ID from the frontend and connects to it
func (a *App) JoinSession(sessionID string, signalURL string) error {
	var err error
	if a.conn != nil {
		a.conn.Close()
	}
	a.conn, err = webrtc.NewConnection(resolveSignalServerURL(signalURL))
	if err != nil {
		return err
	}

	err = a.conn.JoinSession(sessionID)
	if err != nil {
		return err
	}

	a.setupConnectionListeners()
	return nil
}

// SendMessage sends a text message over the WebRTC data channel
func (a *App) SendMessage(msg string) error {
	if a.conn == nil {
		return fmt.Errorf("not connected")
	}
	return a.conn.SendMessage(msg)
}

func resolveSignalServerURL(signalURL string) string {
	signalURL = strings.TrimSpace(signalURL)
	if signalURL == "" {
		signalURL = strings.TrimSpace(os.Getenv("SIGNAL_SERVER_URL"))
	}
	if signalURL == "" {
		return defaultSignalServerURL
	}
	return strings.TrimRight(signalURL, "/")
}

// setupConnectionListeners listens to our WebRTC channels and sends events to JavaScript
func (a *App) setupConnectionListeners() {
	conn := a.conn

	// Listen for the connection being fully established
	go func() {
		select {
		case <-conn.Connected():
			// Emit an event to the frontend so it can update the UI
			runtime.EventsEmit(a.ctx, "onConnected")
		case <-conn.Done():
		}
	}()

	// Listen for incoming chat messages
	go func() {
		for {
			select {
			case msg := <-conn.Messages():
				// Send the message string to the frontend
				runtime.EventsEmit(a.ctx, "onMessage", msg)
			case <-conn.Done():
				return
			}
		}
	}()

	go func() {
		select {
		case err := <-conn.Errors():
			runtime.EventsEmit(a.ctx, "onConnectionError", err.Error())
		case <-conn.Done():
		}
	}()
}
