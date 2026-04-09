# Dit Dah Go Design Spec

## Purpose

This file captures the current product and GUI direction for Dit Dah Go so future work can continue from a stable design baseline.

This is a working design spec, not a final design document. It should be updated as product and interface decisions become more concrete.

## Product Summary

Dit Dah Go is a Morse-code communication tool with learning and practice layered on top.

The primary goal is not to build a teaching app first. The primary goal is to let two people connect and send Morse code to each other in a way that feels intuitive, modern, and flexible.

Teaching, drills, coaching, and AI-assisted practice are important, but secondary to communication in the MVP.

## Top Product Priorities

In descending order of practical importance:

1. Intuitive
2. Modern
3. Aesthetic
4. Flexible

Interpretation:

- Simplicity and clarity beat visual cleverness.
- The UI should feel modern and pleasant, but never at the expense of usability.
- The system should be designed so practice, review, AI coaching, and more advanced learning features can be added later without redesigning the core interaction model.

## Core Product Vision

### Phase 0 / MVP

Allow two people to:

- connect reliably
- join the same session
- send Morse to each other
- chat in a shared session

The MVP should feel like a communication workspace, not a lesson app.

### Phase 1

Add lightweight practice and coaching around the communication workflow:

- character drills
- word drills
- confidence feedback
- mistake highlights
- gentle coaching hints

### Later Phase

Introduce an LLM-powered Morse practice partner that can:

- hold a conversation in Morse
- adjust WPM
- explain likely mistakes in plain English
- generate prompts
- adapt difficulty

The LLM should behave like a constrained practice partner, not a general chatbot bolted into the interface.

## Non-Negotiables

- Cross-platform support: macOS, Windows, and ideally Linux
- Encrypted communication
- Intuitive and modern user experience
- Flexible enough to support teaching mode later
- Communication-first product direction
- Room for AI practice partner in a later phase

## User Profile

Primary initial user:

- complete beginner

Important nuance:

- although the initial user may be a beginner, the product should not feel like a toy
- the user should be able to succeed quickly without needing to understand the full theory of Morse timing up front

## Primary Job To Be Done

In the first five minutes, the app should help two people connect and start sending Morse/chat messages to one another.

That means the interface should heavily prioritize:

- connection setup
- clear session state
- obvious input affordances
- immediate feedback
- visible shared history

## Design Direction

### Product Character

The product should feel like a modern communication tool with learning built in.

It should not feel like:

- an over-complicated ham radio dashboard
- a child-focused edutainment app
- a dense enterprise admin panel

It should feel closer to:

- a focused productivity app
- a calm communication workspace
- a tool for practice with just enough guidance

### Visual Direction

Chosen direction:

- modern productivity app
- balanced information density
- task-focused interface

Desired qualities:

- clean layout
- strong visual hierarchy
- calm but polished styling
- minimal clutter
- subtle identity rooted in Morse rhythm, signal, and timing

### Information Density

Balanced.

Show the current task and a small amount of context, but avoid a crowded dashboard.

## Core Interaction Model

The GUI should be centered around a single main workspace.

This workspace should support both communication and future teaching overlays.

### Main Workspace Model

The primary screen should have three functional zones:

1. Connection zone
2. Conversation zone
3. Send zone

#### 1. Connection Zone

Purpose:

- set signaling server URL
- host a session
- join a session
- view connection state
- view session ID
- eventually display encryption or peer state

Behavior:

- visible and prominent before connection
- compact after connection
- should not disappear completely once connected

Rationale:

Users need reassurance about current session state, especially during testing and networking issues.

#### 2. Conversation Zone

Purpose:

- show session activity in one continuous timeline
- support both chat and Morse exchange
- act as both conversation view and lightweight scratch pad

Each message or event row may include:

- sender
- timestamp or session order
- raw Morse representation
- decoded English text
- system status
- optional confidence or coaching detail

Important design decision:

The conversation view can double as a scratch pad to save space and reduce UI fragmentation.

#### 3. Send Zone

Purpose:

- let users send Morse in multiple ways
- support live sending and assisted sending

Desired input methods:

- keyboard press-and-hold key
- on-screen paddle or button
- mouse click or tap
- automatic text-to-Morse sender

Likely controls:

- primary send surface or keying control
- text field for assisted send or notes
- send button
- WPM control
- mode toggle for live keying vs assisted send

## MVP Screen Structure

### Top Bar

Contents:

- app title
- connection state
- mode label
- settings entry point

### Connection Card

Contents:

- signaling server URL field
- host session button
- join session input
- join session button
- status text
- session ID once created

Notes:

- before connection, this card is prominent
- after connection, it should collapse to a smaller persistent status strip or compact card

### Main Conversation Pane

Contents:

- session timeline
- system events
- sent/received Morse
- decoded text
- optional message detail expansion

### Input Dock

Contents:

- key/paddle interaction area
- optional text input for assisted send
- send button
- WPM setting
- mode indicators

## Practice And Teaching Layer

Teaching features should be additive, not structurally separate from the communication model.

The same message/event model should be able to support later overlays such as:

- decoded assist
- confidence scoring
- mistake highlighting
- coaching hints
- timing breakdowns

This suggests a message design where each item can optionally expand into more detailed diagnostic information.

### Priority Practice Modes

The most important future practice modes are:

- character drills
- word drills
- two-person live practice

These are important, but still secondary to person-to-person communication.

## Feedback Model

The most useful feedback types identified so far are:

- decoded text
- mistake highlights
- gentle coaching hints
- confidence meter

Additional feedback that may become useful later:

- timing accuracy
- WPM estimate
- progress over time
- session score

Guidance:

- feedback should help, not overwhelm
- avoid turning the communication UI into a grading dashboard
- feedback should usually be layered or optional

## LLM Direction

### Role

The future LLM is a Morse-capable practice partner, not a general-purpose assistant UI.

### Ideal Behaviors

- converse in Morse-based practice sessions
- receive Morse input from the human
- interpret incoming code into English
- generate English responses
- convert those responses back into Morse
- adjust WPM and difficulty
- explain errors after interaction rather than interrupting constantly

### Product Constraint

The LLM should likely be presented as a dedicated mode or partner type within the same conversation UI, rather than as a separate assistant pane that competes with the main task.

## Technical/Product Constraints That Affect Design

- the product must cross-compile and remain practical across macOS, Windows, and ideally Linux
- encryption matters and should eventually be made visible enough to create trust
- networking may involve local development, LAN use, and later internet use
- signaling configuration should stay runtime-based and separate from committed code

## Development-Time Configuration Principle

Machine-specific config should not be committed into the repository.

Current design implication:

- the app can accept the signaling URL via the UI
- the backend can fall back to runtime environment variables
- the CLI can accept runtime flags and environment variables

This supports development flexibility without requiring source edits.

## UX Principles

### Principle 1: Connection First

If people cannot connect quickly, nothing else matters.

The connection flow must be obvious, fast, and easy to recover from.

### Principle 2: One Main Screen

The product should avoid too many separate modes early on.

Prefer one main workspace that can deepen over time.

### Principle 3: Progressive Disclosure

Keep the first view simple.

Show extra analysis, hints, or controls only when useful.

### Principle 4: Communication Over Ornament

The interface can be attractive, but aesthetics should reinforce clarity rather than distract from it.

### Principle 5: Practice Without Fragmentation

Teaching features should reuse the conversation and input model rather than becoming a disconnected side system.

## Suggested Next Design Pass

The next design work should define the main GUI in concrete terms.

Recommended next output:

1. a screen-by-screen spec for phase 0
2. a wireframe for the main communication screen
3. a component list for connection, timeline, and send controls
4. interaction states for disconnected, hosting, joining, connected, and error

## Draft Layout Direction

This is the current best-fit layout concept based on the discussion.

### Layout

- top bar across the full width
- connection card near the top of the main view
- conversation timeline as the dominant center panel
- fixed input dock at the bottom

### Mobile/Small Window Strategy

- keep the same mental model
- stack the connection card above the conversation
- keep the send dock pinned and easy to reach
- avoid sidebars as primary navigation in small layouts

### Desktop Strategy

- use generous spacing and clear grouping
- maintain a strong central timeline
- allow compact secondary details rather than a second full panel where possible

## Open Questions

These decisions still need refinement:

1. How prominent should decoded English be compared to raw Morse in the conversation timeline?
2. Should the default sending experience emphasize keying/paddle interaction or assisted text-to-Morse?
3. What level of visual signal representation is most useful: simple dots/dashes, pulse bars, or waveform-style timing rails?
4. How much of the teaching feedback should appear live during communication versus only after a message is sent?
5. How visible should encryption and peer/session metadata be in the main UI?

## Continuation Note For Future LLM Work

If future work resumes from this file, preserve these assumptions unless the user changes them explicitly:

- communication-first product strategy
- intuitive above modern/aesthetic when tradeoffs appear
- single-workspace UI model
- balanced density, not dashboard-heavy
- teaching as an overlay or extension of communication
- future LLM as a constrained Morse practice partner

The next logical step after this document is to produce a concrete wireframe and interaction-state design for the main GUI.