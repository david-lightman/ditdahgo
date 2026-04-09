package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"client/internal/webrtc"
)

const defaultSignalServerURL = "http://localhost:8080"
const peerMetadataPrefix = "__peer_meta__:"

func main() {
	hostFlag := flag.Bool("host", false, "Start a new session as the host")
	joinFlag := flag.String("join", "", "Join an existing session with the given ID")
	signalFlag := flag.String("signal", "", "Signaling server base URL (for example http://192.168.1.50:8080)")
	flag.Parse()

	if *hostFlag && *joinFlag != "" {
		log.Fatal("Cannot use both -host and -join flags at the same time")
	}

	var conn *webrtc.Connection
	var err error
	signalURL := resolveSignalServerURL(*signalFlag)

	// Create a new WebRTC connection manager
	conn, err = webrtc.NewConnection(signalURL)
	if err != nil {
		log.Fatalf("Failed to create connection: %v", err)
	}

	log.Printf("Using signaling server: %s", signalURL)

	if *hostFlag {
		fmt.Println("Starting a new session as the host...")
		sessionID, err := conn.CreateSession()
		if err != nil {
			log.Fatalf("Failed to create session: %v", err)
		}
		fmt.Printf("\n--- SESSION CREATED ---\n")
		fmt.Printf("Share this ID with your buddy: %s\n", sessionID)
		fmt.Println("Waiting for buddy to join...")

	} else if *joinFlag != "" {
		fmt.Printf("Joining session: %s\n", *joinFlag)
		if err := conn.JoinSession(*joinFlag); err != nil {
			log.Fatalf("Failed to join session: %v", err)
		}
	} else {
		log.Fatal("You must specify either -host or -join=<session_id>")
	}

	// Wait for the connection to be established
	<-conn.Connected()
	fmt.Println("\n>>> Connection established! Type a message and press Enter to send.")

	// --- Simple Chat Logic ---
	peerName := "Buddy"
	// Start a goroutine to read incoming messages
	go func() {
		for msg := range conn.Messages() {
			if metadata := parsePeerMetadata(msg); metadata != nil {
				if metadata.Name != "" {
					peerName = metadata.Name
					fmt.Printf("\nPeer identified as %s\n> ", peerName)
				}
				continue
			}
			fmt.Printf("\n%s says: %s\n> ", peerName, msg)
		}
		fmt.Println("Connection closed by peer.")
		os.Exit(0)
	}()

	// Read from stdin to send messages
	go func() {
		scanner := bufio.NewScanner(os.Stdin)
		fmt.Print("> ")
		for scanner.Scan() {
			text := scanner.Text()
			if err := conn.SendMessage(text); err != nil {
				log.Printf("Error sending message: %v", err)
			}
			fmt.Print("> ")
		}
	}()

	// Wait for a signal to gracefully shut down
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c

	fmt.Println("\nShutting down...")
	conn.Close()
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

type peerMetadata struct {
	Name string `json:"name"`
}

func parsePeerMetadata(value string) *peerMetadata {
	if !strings.HasPrefix(value, peerMetadataPrefix) {
		return nil
	}

	var metadata peerMetadata
	if err := json.Unmarshal([]byte(strings.TrimPrefix(value, peerMetadataPrefix)), &metadata); err != nil {
		return nil
	}
	metadata.Name = strings.TrimSpace(metadata.Name)
	if metadata.Name == "" {
		return nil
	}
	return &metadata
}
