// Package webrtc handles the core WebRTC peer-to-peer connection logic.
package webrtc

import (
	"app/internal/signal"
	"context"
	"errors"
	"fmt"
	"log"
	"sync"

	"github.com/pion/webrtc/v4"
)

// Connection wraps the WebRTC peer connection and data channel.
type Connection struct {
	peerConn    *webrtc.PeerConnection
	dataChannel *webrtc.DataChannel
	sigClient   *signal.Client

	// Public channels for the main application to interact with.
	connected chan struct{}
	messages  chan string
	errors    chan error
	done      chan struct{}
	cancel    context.CancelFunc
	closeOnce sync.Once
	openOnce  sync.Once
}

// NewConnection creates and configures a new WebRTC connection manager.
func NewConnection(signalServerURL string) (*Connection, error) {
	// We use the default Pion API, but you could configure STUN/TURN servers here.
	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"}, // Google's public STUN server
			},
		},
	}

	pc, err := webrtc.NewPeerConnection(config)
	if err != nil {
		return nil, fmt.Errorf("failed to create peer connection: %w", err)
	}

	_, cancel := context.WithCancel(context.Background())

	conn := &Connection{
		peerConn:  pc,
		sigClient: signal.NewClient(signalServerURL),
		connected: make(chan struct{}),
		messages:  make(chan string, 1),
		errors:    make(chan error, 1),
		done:      make(chan struct{}),
		cancel:    cancel,
	}

	// Set a handler for when the connection state changes.
	pc.OnConnectionStateChange(func(s webrtc.PeerConnectionState) {
		log.Printf("Peer Connection State has changed: %s\n", s.String())
		if s == webrtc.PeerConnectionStateFailed {
			conn.reportError(fmt.Errorf("peer connection failed"))
		}
	})

	return conn, nil
}

func (c *Connection) waitForICEGatheringComplete() {
	gatherComplete := webrtc.GatheringCompletePromise(c.peerConn)
	<-gatherComplete
}

// CreateSession orchestrates the process for the "host" client.
func (c *Connection) CreateSession() (string, error) {
	// 1. Create a data channel. This MUST be done before creating an offer.
	dc, err := c.peerConn.CreateDataChannel("morse", nil)
	if err != nil {
		return "", fmt.Errorf("failed to create data channel: %w", err)
	}
	c.dataChannel = dc

	// 2. Set the handlers for the data channel.
	c.setDataChannelHandlers()

	// 3. Create an offer.
	offer, err := c.peerConn.CreateOffer(nil)
	if err != nil {
		return "", fmt.Errorf("failed to create offer: %w", err)
	}

	// 4. Set the local description.
	if err := c.peerConn.SetLocalDescription(offer); err != nil {
		return "", fmt.Errorf("failed to set local description: %w", err)
	}

	// This signaling flow only exchanges SDP once, so wait until ICE candidates
	// have been gathered and included in the local description before sending it.
	c.waitForICEGatheringComplete()

	// 5. Send the offer to the signaling server.
	log.Println("Sending offer to signaling server...")
	localDescription := c.peerConn.LocalDescription()
	if localDescription == nil {
		return "", fmt.Errorf("local description is not available after ICE gathering")
	}

	sdp := signal.SessionDescription{Type: localDescription.Type.String(), SDP: localDescription.SDP}
	sessionID, err := c.sigClient.CreateSession(sdp)
	if err != nil {
		return "", fmt.Errorf("failed to create session on server: %w", err)
	}

	// 6. Poll the signaling server for the answer.
	go func() {
		log.Println("Polling for answer...")
		answerSDP, err := c.sigClient.PollForAnswer(c.doneContext(), sessionID)
		if err != nil {
			if errors.Is(err, context.Canceled) {
				return
			}
			c.reportError(fmt.Errorf("waiting for peer answer: %w", err))
			return
		}
		log.Println("Received answer!")

		answer := webrtc.SessionDescription{
			Type: webrtc.NewSDPType(answerSDP.Type),
			SDP:  answerSDP.SDP,
		}

		if err := c.peerConn.SetRemoteDescription(answer); err != nil {
			c.reportError(fmt.Errorf("failed to set remote description: %w", err))
		}
	}()

	return sessionID, nil
}

// JoinSession orchestrates the process for the "joining" client.
func (c *Connection) JoinSession(sessionID string) error {
	// 1. Set a handler for when the remote peer opens a data channel.
	c.peerConn.OnDataChannel(func(dc *webrtc.DataChannel) {
		log.Printf("New DataChannel '%s' from remote peer\n", dc.Label())
		c.dataChannel = dc
		c.setDataChannelHandlers()
	})

	// 2. Get the offer from the signaling server.
	log.Println("Getting offer from signaling server...")
	offerSDP, err := c.sigClient.GetOffer(sessionID)
	if err != nil {
		return fmt.Errorf("failed to get offer: %w", err)
	}

	offer := webrtc.SessionDescription{
		Type: webrtc.NewSDPType(offerSDP.Type),
		SDP:  offerSDP.SDP,
	}

	// 3. Set the remote description.
	if err := c.peerConn.SetRemoteDescription(offer); err != nil {
		return fmt.Errorf("failed to set remote description: %w", err)
	}

	// 4. Create an answer.
	answer, err := c.peerConn.CreateAnswer(nil)
	if err != nil {
		return fmt.Errorf("failed to create answer: %w", err)
	}

	// 5. Set the local description.
	if err := c.peerConn.SetLocalDescription(answer); err != nil {
		return fmt.Errorf("failed to set local description: %w", err)
	}

	// This signaling flow only exchanges SDP once, so wait until ICE candidates
	// have been gathered and included in the local description before sending it.
	c.waitForICEGatheringComplete()

	// 6. Post the answer to the signaling server.
	log.Println("Posting answer to signaling server...")
	localDescription := c.peerConn.LocalDescription()
	if localDescription == nil {
		return fmt.Errorf("local description is not available after ICE gathering")
	}

	sdp := signal.SessionDescription{Type: localDescription.Type.String(), SDP: localDescription.SDP}
	if err := c.sigClient.PostAnswer(sessionID, sdp); err != nil {
		return fmt.Errorf("failed to post answer: %w", err)
	}

	return nil
}

// setDataChannelHandlers sets the OnOpen and OnMessage handlers.
func (c *Connection) setDataChannelHandlers() {
	c.dataChannel.OnOpen(func() {
		log.Printf("Data channel '%s' opened.\n", c.dataChannel.Label())
		// Signal that the connection is now fully established.
		c.openOnce.Do(func() {
			close(c.connected)
		})
	})

	c.dataChannel.OnMessage(func(msg webrtc.DataChannelMessage) {
		// Push the received message to the public channel.
		c.messages <- string(msg.Data)
	})
}

// --- Public Methods ---

// Connected returns a channel that is closed when the connection is established.
func (c *Connection) Connected() <-chan struct{} {
	return c.connected
}

// Messages returns a channel for receiving incoming messages.
func (c *Connection) Messages() <-chan string {
	return c.messages
}

// Errors returns a channel for asynchronous connection errors.
func (c *Connection) Errors() <-chan error {
	return c.errors
}

// Done returns a channel that is closed when the connection is shut down.
func (c *Connection) Done() <-chan struct{} {
	return c.done
}

// SendMessage sends a string message over the data channel.
func (c *Connection) SendMessage(text string) error {
	if c.dataChannel == nil {
		return fmt.Errorf("data channel is not open")
	}
	return c.dataChannel.SendText(text)
}

// Close gracefully closes the peer connection.
func (c *Connection) Close() {
	c.closeOnce.Do(func() {
		if c.cancel != nil {
			c.cancel()
		}
		close(c.done)
		if c.peerConn != nil {
			c.peerConn.Close()
		}
	})
}

func (c *Connection) reportError(err error) {
	select {
	case <-c.done:
		return
	default:
	}

	select {
	case c.errors <- err:
	default:
		log.Printf("Connection error dropped because no listener was ready: %v", err)
	}
}

func (c *Connection) doneContext() context.Context {
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		select {
		case <-c.done:
			cancel()
		case <-ctx.Done():
		}
	}()
	return ctx
}
