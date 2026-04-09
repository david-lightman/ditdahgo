# Dit Dah Go GUI Wireframe Spec

## Purpose

This document turns the product direction in [design-spec.md](/Users/a220018178/Documents/personal/dit-dah-go/design-spec.md) into a concrete GUI wireframe spec for phase 0 and early phase 1.

The goal is to define:

- the main screen layout
- exact panels and controls
- key interaction states
- what is visible by default
- what should be deferred or hidden until later

This spec is written for implementation planning, not visual polish.

## Design Target

The GUI should optimize for the first successful session between two people.

If there is tension between beauty and clarity, choose clarity.

## Primary Screen Model

The app should use one main workspace rather than multiple disconnected screens.

### Core Regions

1. Top Bar
2. Connection Card
3. Conversation Timeline
4. Input Dock
5. Optional Detail Drawer

## Desktop Wireframe

```text
+----------------------------------------------------------------------------------+
| Dit Dah Go                    Connected / Waiting / Error          Mode  Settings |
+----------------------------------------------------------------------------------+
| Connection Card                                                                 |
| Signal URL [http://localhost:8080_________________________] [Host] [Join ID___] |
| Status: Waiting for peer...                Session ID: 9F3A2C1D    [Copy]       |
+----------------------------------------------------------------------------------+
| Conversation Timeline                                                            |
|----------------------------------------------------------------------------------|
| System: Session created                                                          |
| You:  ·-   -...   ···          Decoded: ABS                                      |
| Buddy: --   ---   ·-·         Decoded: MOR                                       |
| System: Connected securely                                                       |
| You: Hello there                     Assisted text sent as Morse                  |
| Buddy: ... --- ...                  Decoded: SOS            Confidence: 92%      |
|----------------------------------------------------------------------------------|
| [Optional expanded detail for selected message]                                  |
| Timing notes | Mistake hints | Confidence | Future coaching                      |
+----------------------------------------------------------------------------------+
| Input Dock                                                                       |
| [Press & Hold Key / Paddle Area__________________] [Live / Assisted] [WPM 18]   |
| Text assist [Type plain English here______________________________] [Send]       |
| Hint: Hold space or use on-screen key                                            |
+----------------------------------------------------------------------------------+
```

## Small Window / Narrow Layout Wireframe

```text
+------------------------------------------------------+
| Dit Dah Go                  Status        Settings   |
+------------------------------------------------------+
| Connection Card                                       |
| Signal URL [______________________________]           |
| [Host Session]                                        |
| Join ID [_________________] [Join]                    |
| Status: Waiting for peer                              |
| Session ID: 9F3A2C1D                                  |
+------------------------------------------------------+
| Conversation Timeline                                 |
| System / You / Buddy messages                         |
| Decoded text under each message                       |
+------------------------------------------------------+
| Input Dock                                            |
| [Key / Paddle Surface]                                |
| [Live / Assisted] [WPM]                               |
| Text assist [____________________] [Send]             |
+------------------------------------------------------+
```

## Region Spec

### 1. Top Bar

Purpose:

- persistent orientation
- quick understanding of current app state
- access to settings without crowding the main flow

Required contents:

- app name or mark
- current connection state
- current mode label
- settings button

Recommended labels:

- `Disconnected`
- `Hosting`
- `Joining`
- `Connected`
- `Connection Error`

Mode label options:

- `Chat`
- `Practice`
- later: `AI Partner`

Behavior:

- always visible
- compact height
- never used for dense controls

### 2. Connection Card

Purpose:

- all session setup happens here
- remains visible after connect in compact form

Required controls:

- signaling URL input
- host session button
- join session ID input
- join session button
- status message
- session ID display after hosting
- copy session ID action

Recommended future controls:

- reconnect action
- clear/reset session action
- LAN/internet helper text
- encryption badge

Default behavior:

- prominent when disconnected
- compact when connected
- disabled or partially locked during sensitive transitions

### 3. Conversation Timeline

Purpose:

- primary communication surface
- single shared activity history
- doubles as lightweight scratch pad

Message types supported:

- system event
- outgoing Morse message
- incoming Morse message
- outgoing assisted text message
- incoming decoded message
- future coaching or practice event

Each timeline item should support:

- sender label
- content body
- raw Morse, decoded text, or both
- visual separation by message type
- optional expanded details

Recommended default message structure:

```text
[Sender]
Primary line: raw Morse or human-readable content
Secondary line: decoded text or status
Meta line: confidence / timestamp / note when relevant
```

Timeline behavior:

- auto-scroll by default for new messages
- preserve manual scroll position if user scrolls up
- selection opens detail drawer or inline expansion

### 4. Input Dock

Purpose:

- all outbound interaction lives here
- always easy to find
- should feel immediate and tactile

Required controls for phase 0:

- primary key/paddle interaction surface
- send mode toggle: `Live` vs `Assisted`
- WPM control
- plain text assist input
- send action
- short hint text

Recommended keying hint:

- `Hold space or use the key surface to send Morse.`

Behavior:

- pinned to the bottom of the main workspace
- consistent placement across states
- never hidden behind mode changes in MVP

### 5. Optional Detail Drawer

Purpose:

- preserve clean main UI while making room for richer analysis later

Not required to be fully implemented in phase 0, but the message model should support it.

Potential contents:

- timing breakdown
- likely mistakes
- confidence estimate
- coaching hint
- replay or inspect later

## Controls Inventory

### Always Visible

- app title
- connection state label
- settings entry point
- connection card
- conversation timeline
- input dock

### Visible Only When Relevant

- session ID after host success
- copy session ID action after host success
- decoded secondary line when content can be decoded
- confidence indicator when analysis exists
- detailed coaching when selected or enabled

### Deferred For Later Phases

- deep analytics dashboard
- spaced repetition planning
- advanced lesson browser
- embedded LLM side panel
- encryption detail panel beyond a small badge

## Interaction States

### State A: Disconnected

Goal:

- make starting or joining a session obvious

Visible emphasis:

- connection card is the dominant panel above the timeline
- timeline may show a short welcome or empty state

Controls enabled:

- signaling URL input
- host button
- join field
- join button
- settings

Controls disabled:

- live sending controls
- send button

Suggested empty-state copy:

- `Start a session or join one to begin sending Morse.`

### State B: Hosting

Goal:

- reassure the host that session creation succeeded
- make sharing the session ID obvious

Visible emphasis:

- session ID becomes prominent
- status line shows waiting state

Controls enabled:

- copy session ID
- optional cancel/reset action

Controls reduced or locked:

- avoid editing join-related fields during pending host state

Suggested status copy:

- `Session created. Share the ID with your buddy.`
- `Waiting for peer to join...`

### State C: Joining

Goal:

- confirm the requested session is being joined

Visible emphasis:

- connection card shows in-progress join state
- timeline can show system progress events

Controls reduced or locked:

- host button disabled
- join controls disabled while request is active

Suggested status copy:

- `Joining session 9F3A2C1D...`

### State D: Connected

Goal:

- shift attention from setup to communication

Visible emphasis:

- conversation timeline becomes dominant
- connection card collapses to a compact summary
- input dock is fully enabled

Controls enabled:

- all send controls
- settings
- optional disconnect action later

Suggested status copy:

- `Connected`
- later: `Connected securely`

### State E: Connection Error

Goal:

- show failure clearly and preserve recovery path

Visible emphasis:

- concise error message near the connection card
- keep the recovery controls obvious

Controls enabled:

- signaling URL input
- host button
- join field
- join button

Suggested copy style:

- plain language
- no technical stack dump in the primary UI

Example:

- `Could not reach the signaling server.`
- `Check the server URL and try again.`

## Timeline Item Types

### System Item

Examples:

- session created
- waiting for peer
- joined session
- connected
- error

Visual treatment:

- neutral tone
- smaller visual weight than user messages

### Sent Item

Examples:

- live Morse keyed by user
- assisted text converted to Morse

Visual treatment:

- aligned consistently for the local user
- show source mode when useful

### Received Item

Examples:

- partner Morse
- partner decoded message if available

Visual treatment:

- clearly distinguished from sent items
- decoded line directly beneath raw Morse when available

### Coaching Item

Future use:

- timing hints
- explanation of likely mistake
- confidence estimate

Visual treatment:

- subordinate to the conversation content
- should not dominate the timeline

## Message Detail Rules

Default timeline view should stay light.

Only the most helpful information should be visible immediately:

- sender
- main content
- decoded text if useful

Additional detail should be revealed by:

- click
- selection
- a practice toggle

This preserves clarity while keeping the model extensible.

## Sending Modes

### Live Mode

Purpose:

- user manually keys Morse using keyboard or on-screen control

Primary controls:

- key/paddle surface
- WPM indicator
- live state indicator

### Assisted Mode

Purpose:

- user types plain text and sends a Morse representation

Primary controls:

- text input
- send button
- WPM setting

Guidance:

- the mode toggle should be visible and easy to understand
- do not bury it in settings

## Visual Hierarchy Guidance

Importance order on the main screen:

1. Current session state
2. Conversation timeline
3. Send controls
4. Secondary detail and hints

The screen should visually communicate:

- where I connect
- whether I am connected
- what was just sent or received
- how I send the next message

## Content Guidance

Status and helper text should be plain and human-centered.

Prefer:

- `Start a new session`
- `Join session`
- `Waiting for peer`
- `Connected`

Avoid:

- protocol jargon in the main UI
- unexplained abbreviations
- diagnostic overload

## Phase 0 Build Order

Recommended implementation order:

1. top bar with basic status
2. refined connection card
3. conversation timeline with system/sent/received items
4. bottom input dock layout
5. connected/disconnected/hosting/joining/error states

After that:

6. compact connected-state connection strip
7. inline decoded text presentation
8. expandable detail region

## Future Phase Hooks

This wireframe is intentionally built so later features fit without structural rework.

Later additions should attach to existing surfaces:

- drills reuse the conversation and input model
- coaching reuses timeline details
- AI partner reuses the same conversation layout
- progress summaries can be a post-session view rather than a permanent dashboard

## Recommended Next Step After This Spec

Use this file to define:

- visual style tokens
- component styling rules
- a clickable mockup or frontend prototype

The next concrete artifact should be a styled mockup of the main communication screen, not a multi-screen design system.