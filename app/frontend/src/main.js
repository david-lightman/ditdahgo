import './style.css';

// Import our auto-generated Go functions!
import { HostSession, JoinSession, SendMessage } from '../wailsjs/go/main/App';
import { EventsOn, Quit } from '../wailsjs/runtime/runtime';

const appShell = document.getElementById('app');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsDrawer = document.getElementById('settings-drawer');
const btnHost = document.getElementById('btn-host');
const btnJoin = document.getElementById('btn-join');
const btnCopySession = document.getElementById('btn-copy-session');
const btnCloseSettings = document.getElementById('btn-close-settings');
const btnOpenKeyingSettings = document.getElementById('btn-open-keying-settings');
const btnOpenGlossary = document.getElementById('btn-open-glossary');
const btnCollapseGlossary = document.getElementById('btn-collapse-glossary');
const panelResizer = document.getElementById('panel-resizer');
const glossaryTabs = document.getElementById('glossary-tabs');
const glossaryMeta = document.getElementById('glossary-meta');
const glossarySections = document.getElementById('glossary-sections');
const btnBindStraight = document.getElementById('btn-bind-straight');
const btnBindDit = document.getElementById('btn-bind-dit');
const btnBindDah = document.getElementById('btn-bind-dah');
const btnBindShortcutFocusKeyer = document.getElementById('btn-bind-shortcut-focus-keyer');
const btnBindShortcutFocusChat = document.getElementById('btn-bind-shortcut-focus-chat');
const btnBindShortcutToggleMode = document.getElementById('btn-bind-shortcut-toggle-mode');
const btnBindShortcutSettings = document.getElementById('btn-bind-shortcut-settings');
const btnBindShortcutQuit = document.getElementById('btn-bind-shortcut-quit');
const btnResetShortcuts = document.getElementById('btn-reset-shortcuts');
const btnToggleLocalAudio = document.getElementById('btn-toggle-local-audio');
const btnToggleRemoteAudio = document.getElementById('btn-toggle-remote-audio');
const inputJoinId = document.getElementById('input-join-id');
const inputSignalUrl = document.getElementById('input-signal-url');
const inputDisplayName = document.getElementById('input-display-name');
const inputWpm = document.getElementById('input-wpm');
const inputLocalFrequency = document.getElementById('input-local-frequency');
const inputLocalVolume = document.getElementById('input-local-volume');
const inputRemoteFrequency = document.getElementById('input-remote-frequency');
const inputRemoteVolume = document.getElementById('input-remote-volume');
const inputChatFontSize = document.getElementById('input-chat-font-size');
const inputCWChatPauseMs = document.getElementById('input-cw-chat-pause-ms');
const selectKeyingMode = document.getElementById('select-keying-mode');
const statusSpan = document.getElementById('connection-status');
const sessionInfoDiv = document.getElementById('session-info');
const displaySessionId = document.getElementById('display-session-id');
const topbarConnectionBadge = document.getElementById('topbar-connection-badge');
const connectionSummaryBadge = document.getElementById('connection-summary-badge');
const chatStatusLine = document.getElementById('chat-status-line');
const chatEmptyState = document.getElementById('chat-empty-state');
const composerHint = document.getElementById('composer-hint');
const btnKeySurface = document.getElementById('btn-key-surface');
const keyLightDit = document.getElementById('key-light-dit');
const keyLightDah = document.getElementById('key-light-dah');
const keyingModeBadge = document.getElementById('keying-mode-badge');
const keyingSummary = document.getElementById('keying-summary');
const keyingStatus = document.getElementById('keying-status');
const displayStraightKey = document.getElementById('display-straight-key');
const displayDitKey = document.getElementById('display-dit-key');
const displayDahKey = document.getElementById('display-dah-key');
const displayShortcutFocusKeyer = document.getElementById('display-shortcut-focus-keyer');
const displayShortcutFocusChat = document.getElementById('display-shortcut-focus-chat');
const displayShortcutToggleMode = document.getElementById('display-shortcut-toggle-mode');
const displayShortcutSettings = document.getElementById('display-shortcut-settings');
const displayShortcutQuit = document.getElementById('display-shortcut-quit');
const displayWpm = document.getElementById('display-wpm');
const displayLocalFrequency = document.getElementById('display-local-frequency');
const displayLocalVolume = document.getElementById('display-local-volume');
const displayRemoteFrequency = document.getElementById('display-remote-frequency');
const displayRemoteVolume = document.getElementById('display-remote-volume');
const displayChatFontSize = document.getElementById('display-chat-font-size');
const displayCWChatPauseMs = document.getElementById('display-cw-chat-pause-ms');
const wpmPill = document.getElementById('wpm-pill');
const iambicBindings = document.getElementById('iambic-bindings');
const keyPreview = document.getElementById('key-preview');
const audioStatus = document.getElementById('audio-status');
const btnToggleActivityLog = document.getElementById('btn-toggle-activity-log');
const activityLogMeta = document.getElementById('activity-log-meta');
const activityLogWrapper = document.getElementById('activity-log-wrapper');
const activityLog = document.getElementById('activity-log');
const btnToggleDecodeCW = document.getElementById('btn-toggle-decode-cw');
const btnToggleStreamLocalCW = document.getElementById('btn-toggle-stream-local-cw');
const btnToggleStreamRemoteCW = document.getElementById('btn-toggle-stream-remote-cw');
const displayStatus = document.getElementById('display-status');
const shortcutStatus = document.getElementById('shortcut-status');
const sessionChip = document.getElementById('session-chip');
const sessionChipValue = document.getElementById('session-chip-value');

const chatLog = document.getElementById('chat-log');
const chatWorkbench = document.getElementById('chat-workbench');
const glossaryShell = document.querySelector('.glossary-shell');
const inputChat = document.getElementById('input-chat');
const btnSend = document.getElementById('btn-send');
const isMacOS = navigator.platform.toLowerCase().includes('mac');

const defaultSignalUrl = 'http://localhost:8080';
const peerMetadataPrefix = '__peer_meta__:';
const defaultKeyConfig = {
    mode: 'straight',
    straightKey: 'ShiftRight',
    ditKey: 'KeyF',
    dahKey: 'KeyJ',
    wpm: 18,
};
const defaultShortcutConfig = {
    focusKeyer: { key: 'k', shift: false, alt: false },
    focusChat: { key: 'c', shift: true, alt: false },
    toggleMode: { key: 'm', shift: true, alt: false },
    openSettings: { key: ',', shift: false, alt: false },
    quitApp: { key: 'q', shift: false, alt: false },
};
const defaultAudioConfig = {
    localMuted: false,
    remoteMuted: false,
    localFrequency: 650,
    remoteFrequency: 650,
    localVolume: 18,
    remoteVolume: 18,
};
const defaultDisplayConfig = {
    decodeCWStream: true,
    streamLocalCWToChat: false,
    streamRemoteCWToChat: false,
    chatFontSize: 15,
    cwChatPauseMs: 3000,
};
const defaultGlossaryWidth = 390;
const minGlossaryWidth = 320;
const maxGlossaryWidth = 560;
const cwUnknownToken = '<?>';
const iambicModeBehavior = 'A';
const morseAlphabet = {
    '.-': 'A',
    '-...': 'B',
    '-.-.': 'C',
    '-..': 'D',
    '.': 'E',
    '..-.': 'F',
    '--.': 'G',
    '....': 'H',
    '..': 'I',
    '.---': 'J',
    '-.-': 'K',
    '.-..': 'L',
    '--': 'M',
    '-.': 'N',
    '---': 'O',
    '.--.': 'P',
    '--.-': 'Q',
    '.-.': 'R',
    '...': 'S',
    '-': 'T',
    '..-': 'U',
    '...-': 'V',
    '.--': 'W',
    '-..-': 'X',
    '-.--': 'Y',
    '--..': 'Z',
    '-----': '0',
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9',
    '.-.-.-': '.',
    '--..--': ',',
    '..--..': '?',
    '.----.': "'",
    '-..-.': '/',
    '-.--.': '(',
    '-.--.-': ')',
    '.-...': '&',
    '---...': ':',
    '-.-.-.': ';',
    '-...-': '=',
    '.-.-.': '+',
    '-....-': '-',
    '..--.-': '_',
    '.-..-.': '"',
    '...-..-': '$',
    '.--.-.': '@',
    '-.-.--': '!',
};
const morseByCharacter = buildMorseByCharacterMap();
const defaultGlossarySections = createDefaultGlossarySections();
const savedSignalUrl = window.localStorage.getItem('signalServerURL');
const savedDisplayName = window.localStorage.getItem('displayName') || '';
const savedKeyConfig = readKeyConfig();
const savedAudioConfig = readAudioConfig();
const savedDisplayConfig = readDisplayConfig();
const savedGlossaryMnemonics = readGlossaryMnemonics();
inputSignalUrl.value = savedSignalUrl || defaultSignalUrl;
inputDisplayName.value = savedDisplayName;
selectKeyingMode.value = savedKeyConfig.mode;
inputWpm.value = String(savedKeyConfig.wpm);
inputLocalFrequency.value = String(savedAudioConfig.localFrequency);
inputLocalVolume.value = String(savedAudioConfig.localVolume);
inputRemoteFrequency.value = String(savedAudioConfig.remoteFrequency);
inputRemoteVolume.value = String(savedAudioConfig.remoteVolume);
inputChatFontSize.value = String(savedDisplayConfig.chatFontSize);
inputCWChatPauseMs.value = String(savedDisplayConfig.cwChatPauseMs);

let currentState = 'disconnected';
let currentSessionId = '';
let pendingKeyBind = '';
let pendingShortcutBind = '';
let straightKeyDownAt = 0;
let lastPreview = '';
let shortcutNotice = '';
let remotePeerName = 'Buddy';
let iambicLoopTimer = 0;
let iambicPressed = { dit: false, dah: false };
let iambicMemory = { dit: false, dah: false };
let iambicLastSent = '';
let iambicLastPressed = '';
let iambicCycleSymbol = '';
let audioContext = null;
let localOscillator = null;
let localGainNode = null;
let activityLogCount = 0;
let activeGlossarySectionId = 'alphabet';
let glossaryVisible = true;
let glossaryWidth = readGlossaryWidth();
let localPlaybackQueue = Promise.resolve();
let remotePlaybackQueue = Promise.resolve();
const cwStreams = {
    local: createCWStreamState(),
    remote: createCWStreamState(),
};
const savedShortcutConfig = readShortcutConfig();

setConnectionState('disconnected', 'Not connected');
setComposerEnabled(true);
renderKeyConfig();
renderShortcutConfig();
renderAudioConfig();
renderDisplayConfig();
renderGlossaryPanel();
applyGlossaryWidth();
addSystemEntry('App ready. Open Settings when you want to connect.');

// --- Button Event Listeners ---

btnHost.addEventListener('click', async () => {
    const signalURL = getSignalUrl();

    setConnectionState('hosting', 'Creating session via ' + signalURL + '...');
    setConnectionControlsDisabled(true);
    
    try {
        const id = await HostSession(signalURL);
        currentSessionId = id;
        displaySessionId.innerText = id;
        sessionChipValue.innerText = id;
        sessionChip.classList.remove('hidden');
        sessionInfoDiv.classList.remove('hidden');
        setConnectionState('hosting', 'Waiting for buddy to join...');
        setConnectionControlsDisabled(false);
        addSystemEntry('Session created. Share session ID ' + id + ' with your buddy.');
        addSystemEntry('If you want a fresh session ID, click Host Session again.');
        chatStatusLine.innerText = 'Waiting for someone to join this session.';
    } catch (err) {
        setConnectionState('error', 'Could not create session. ' + err);
        setConnectionControlsDisabled(false);
        addSystemEntry('Error creating session: ' + err);
    }
});

btnJoin.addEventListener('click', async () => {
    const id = inputJoinId.value.trim();
    const signalURL = getSignalUrl();
    if (!id) return;

    currentSessionId = id;
    displaySessionId.innerText = id;
    sessionChipValue.innerText = id;
    sessionChip.classList.remove('hidden');
    sessionInfoDiv.classList.remove('hidden');
    setConnectionState('joining', 'Joining session ' + id + ' via ' + signalURL + '...');
    setConnectionControlsDisabled(true);
    addSystemEntry('Attempting to join session ' + id + '.');

    try {
        await JoinSession(id, signalURL);
    } catch (err) {
        setConnectionState('error', 'Could not join session. ' + err);
        setConnectionControlsDisabled(false);
        addSystemEntry('Error joining session ' + id + ': ' + err);
    }
});

btnSend.addEventListener('click', async () => {
    const msg = inputChat.value.trim();
    if (!msg) return;

    addLogEntry({
        sender: 'You',
        text: msg,
        kind: 'local',
    });
    inputChat.value = '';

    if (!isConnected()) {
        return;
    }

    try {
        await SendMessage(msg);
    } catch (err) {
        addSystemEntry('Failed to send: ' + err, 'error');
    }
});

btnCopySession.addEventListener('click', async () => {
    if (!currentSessionId) {
        return;
    }

    try {
        await navigator.clipboard.writeText(currentSessionId);
        addSystemEntry('Copied session ID ' + currentSessionId + ' to the clipboard.');
    } catch (err) {
        addSystemEntry('Could not copy session ID automatically. Copy it manually instead.', 'warning');
    }
});

btnCloseSettings.addEventListener('click', closeSettingsDrawer);
btnOpenKeyingSettings.addEventListener('click', openSettingsDrawer);
btnOpenGlossary.addEventListener('click', () => setGlossaryVisible(true));
btnCollapseGlossary.addEventListener('click', () => setGlossaryVisible(false));
panelResizer.addEventListener('pointerdown', beginGlossaryResize);
settingsOverlay.addEventListener('click', closeSettingsDrawer);
btnToggleActivityLog.addEventListener('click', toggleActivityLog);
glossaryTabs.addEventListener('click', handleGlossaryTabClick);
glossarySections.addEventListener('click', handleGlossaryClick);
glossarySections.addEventListener('change', handleGlossaryMnemonicChange);
btnToggleDecodeCW.addEventListener('click', () => {
    savedDisplayConfig.decodeCWStream = !savedDisplayConfig.decodeCWStream;
    persistDisplayConfig();
    renderDisplayConfig();
    renderKeyPreview();
});
btnToggleStreamLocalCW.addEventListener('click', () => {
    savedDisplayConfig.streamLocalCWToChat = !savedDisplayConfig.streamLocalCWToChat;
    persistDisplayConfig();
    renderDisplayConfig();
});
btnToggleStreamRemoteCW.addEventListener('click', () => {
    savedDisplayConfig.streamRemoteCWToChat = !savedDisplayConfig.streamRemoteCWToChat;
    persistDisplayConfig();
    renderDisplayConfig();
});

inputChatFontSize.addEventListener('input', () => {
    savedDisplayConfig.chatFontSize = Number(inputChatFontSize.value);
    persistDisplayConfig();
    renderDisplayConfig();
});

inputCWChatPauseMs.addEventListener('input', () => {
    savedDisplayConfig.cwChatPauseMs = Number(inputCWChatPauseMs.value);
    persistDisplayConfig();
    renderDisplayConfig();
});

inputDisplayName.addEventListener('change', async () => {
    persistDisplayName();
    if (!isConnected()) {
        return;
    }

    try {
        await sendPeerMetadata();
    } catch (err) {
        addSystemEntry('Failed to update your peer name: ' + err, 'warning');
    }
});

btnBindStraight.addEventListener('click', () => beginKeyBinding('straightKey'));
btnBindDit.addEventListener('click', () => beginKeyBinding('ditKey'));
btnBindDah.addEventListener('click', () => beginKeyBinding('dahKey'));
btnBindShortcutFocusKeyer.addEventListener('click', () => beginShortcutBinding('focusKeyer'));
btnBindShortcutFocusChat.addEventListener('click', () => beginShortcutBinding('focusChat'));
btnBindShortcutToggleMode.addEventListener('click', () => beginShortcutBinding('toggleMode'));
btnBindShortcutSettings.addEventListener('click', () => beginShortcutBinding('openSettings'));
btnBindShortcutQuit.addEventListener('click', () => beginShortcutBinding('quitApp'));
btnResetShortcuts.addEventListener('click', () => {
    Object.assign(savedShortcutConfig, cloneShortcutConfig(defaultShortcutConfig));
    pendingShortcutBind = '';
    shortcutNotice = 'Shortcut defaults restored.';
    persistShortcutConfig();
    renderShortcutConfig();
});

selectKeyingMode.addEventListener('change', () => {
    savedKeyConfig.mode = selectKeyingMode.value;
    persistKeyConfig();
    stopIambicLoop();
    renderKeyConfig();
});

inputWpm.addEventListener('input', () => {
    savedKeyConfig.wpm = Number(inputWpm.value);
    persistKeyConfig();
    renderKeyConfig();
});

btnToggleLocalAudio.addEventListener('click', async () => {
    savedAudioConfig.localMuted = !savedAudioConfig.localMuted;
    if (savedAudioConfig.localMuted) {
        stopContinuousLocalTone();
    } else {
        await ensureAudioContext(true);
    }
    persistAudioConfig();
    renderAudioConfig();
});

btnToggleRemoteAudio.addEventListener('click', async () => {
    savedAudioConfig.remoteMuted = !savedAudioConfig.remoteMuted;
    if (!savedAudioConfig.remoteMuted) {
        await ensureAudioContext(true);
    }
    persistAudioConfig();
    renderAudioConfig();
});

inputLocalFrequency.addEventListener('input', async () => {
    savedAudioConfig.localFrequency = Number(inputLocalFrequency.value);
    persistAudioConfig();
    renderAudioConfig();
    syncContinuousLocalTone();
    await ensureAudioContext(true);
});

inputLocalVolume.addEventListener('input', async () => {
    savedAudioConfig.localVolume = Number(inputLocalVolume.value);
    persistAudioConfig();
    renderAudioConfig();
    syncContinuousLocalTone();
    await ensureAudioContext(true);
});

inputRemoteFrequency.addEventListener('input', async () => {
    savedAudioConfig.remoteFrequency = Number(inputRemoteFrequency.value);
    persistAudioConfig();
    renderAudioConfig();
    await ensureAudioContext(true);
});

inputRemoteVolume.addEventListener('input', async () => {
    savedAudioConfig.remoteVolume = Number(inputRemoteVolume.value);
    persistAudioConfig();
    renderAudioConfig();
    await ensureAudioContext(true);
});

window.addEventListener('keydown', handleGlobalKeyDown, true);
window.addEventListener('keyup', handleGlobalKeyUp, true);
document.addEventListener('focusin', handleDocumentFocusIn, true);

btnKeySurface.addEventListener('pointerdown', (event) => {
    if (savedKeyConfig.mode !== 'straight') {
        return;
    }
    event.preventDefault();
    btnKeySurface.focus();
});

btnKeySurface.addEventListener('pointerup', async (event) => {
    event.preventDefault();
});

btnKeySurface.addEventListener('pointerleave', () => {
    if (savedKeyConfig.mode === 'straight') {
        setKeySurfaceActive(false);
    }
});

// Allow hitting Enter to send
inputChat.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        btnSend.click();
    }
});

// --- Listen for Events from Go ---

EventsOn("onConnected", () => {
    setConnectionState('connected', 'Connected');
    setComposerEnabled(true);
    chatStatusLine.innerText = 'Connected';
    addSystemEntry('Connected to peer.', 'success');
    void sendPeerMetadata();
});

EventsOn("onMessage", (msg) => {
    const peerMetadata = parsePeerMetadata(msg);
    if (peerMetadata) {
        const nextPeerName = peerMetadata.name || 'Buddy';
        remotePeerName = nextPeerName;
        addSystemEntry('Peer identified as ' + nextPeerName + '.');
        return;
    }

    const cwWordPacket = parseCWWordPacket(msg);
    if (cwWordPacket) {
        handleIncomingCWWordPacket(cwWordPacket);
        return;
    }

    const cwPayload = parseCWSymbol(msg);
    if (cwPayload) {
        appendCWSymbol(getRemotePeerName(), cwPayload.symbol, 'remote', cwPayload.duration, performance.now());
        void playRemoteSymbol(cwPayload.symbol, cwPayload.duration);
        return;
    }

    addLogEntry({
        sender: getRemotePeerName(),
        text: msg,
        kind: 'remote',
    });
});

EventsOn("onConnectionError", (msg) => {
    straightKeyDownAt = 0;
    stopIambicLoop();
    stopContinuousLocalTone();
    remotePeerName = 'Buddy';
    setConnectionState('error', msg);
    setConnectionControlsDisabled(false);
    setComposerEnabled(true);
    chatStatusLine.innerText = 'Connection problem';
    addSystemEntry(msg, 'error');
});

function getSignalUrl() {
    const signalURL = (inputSignalUrl.value || '').trim().replace(/\/$/, '') || defaultSignalUrl;
    inputSignalUrl.value = signalURL;
    window.localStorage.setItem('signalServerURL', signalURL);
    return signalURL;
}

function persistDisplayName() {
    window.localStorage.setItem('displayName', inputDisplayName.value.trim());
}

function getLocalPeerName() {
    return inputDisplayName.value.trim();
}

function getRemotePeerName() {
    return remotePeerName || 'Buddy';
}

async function sendPeerMetadata() {
    const name = getLocalPeerName();
    if (!name) {
        return;
    }
    await SendMessage(encodePeerMetadata({ name }));
}

function encodePeerMetadata(metadata) {
    return peerMetadataPrefix + JSON.stringify(metadata);
}

function parsePeerMetadata(value) {
    if (!value.startsWith(peerMetadataPrefix)) {
        return null;
    }

    try {
        const metadata = JSON.parse(value.slice(peerMetadataPrefix.length));
        if (!metadata || typeof metadata.name !== 'string') {
            return null;
        }
        return { name: metadata.name.trim().slice(0, 32) };
    } catch {
        return null;
    }
}

function setConnectionState(state, message) {
    currentState = state;
    appShell.classList.remove('state-disconnected', 'state-hosting', 'state-joining', 'state-connected', 'state-error');
    appShell.classList.add('state-' + state);

    statusSpan.innerText = message;
    topbarConnectionBadge.innerText = summaryLabelForState(state);
    connectionSummaryBadge.innerText = summaryLabelForState(state);

    topbarConnectionBadge.className = 'status-badge ' + badgeClassForState(state);
    connectionSummaryBadge.className = 'status-badge ' + badgeClassForState(state);
}

function setConnectionControlsDisabled(disabled) {
    btnHost.disabled = disabled;
    btnJoin.disabled = disabled;
    inputJoinId.disabled = disabled;
    inputSignalUrl.disabled = disabled;
}

function setComposerEnabled(enabled) {
    inputChat.disabled = false;
    btnSend.disabled = false;
    btnKeySurface.disabled = !enabled;
    composerHint.innerText = isConnected() ? 'Connected' : 'Local only';
}

function addSystemEntry(text, tone = 'neutral') {
    activityLogCount += 1;

    const article = document.createElement('article');
    article.className = 'activity-item timeline-tone-' + tone;
    article.innerHTML = '<p class="timeline-system-label">System</p>' +
        '<p class="timeline-system-copy">' + escapeHtml(text) + '</p>';

    activityLog.appendChild(article);
    activityLog.scrollTop = activityLog.scrollHeight;
    activityLogMeta.innerText = activityLogCount + (activityLogCount === 1 ? ' entry' : ' entries');

    if (tone === 'error') {
        addLogEntry({
            sender: 'System',
            text,
            kind: 'system',
            tone,
        });
    }
}

function addLogEntry({ sender, text, detail = '', kind, tone = 'neutral' }) {
    chatEmptyState.classList.add('hidden');

    const article = document.createElement('article');
    article.className = 'timeline-item timeline-item-' + kind;

    if (kind === 'system') {
        article.classList.add('timeline-tone-' + tone);
        article.innerHTML = '<p class="timeline-system-label">' + escapeHtml(sender) + '</p>' +
            '<p class="timeline-system-copy">' + escapeHtml(text) + '</p>';
    } else {
        article.innerHTML = '<div class="timeline-item-header">' +
                '<span class="timeline-sender">' + escapeHtml(sender) + '</span>' +
                '<span class="timeline-meta">' + escapeHtml(formatTimestamp()) + '</span>' +
            '</div>' +
            '<p class="timeline-body">' + escapeHtml(text) + '</p>' +
            (detail ? '<p class="timeline-detail">' + escapeHtml(detail) + '</p>' : '');
    }

    chatLog.appendChild(article);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function appendCWSymbol(sender, symbol, kind, duration = 0, eventTime = performance.now(), invalid = false) {
    const stream = cwStreams[kind];
    const actualDuration = duration > 0 ? duration : (symbol === '.' ? getDitMs() : getDahMs());

    if (stream.wordReadyToClear) {
        flushCompletedCWWord(stream, kind, sender, eventTime, false);
        resetCWWord(stream);
    }

    applyCWGapTransitions(stream, eventTime, kind, sender);

    stream.currentCharacter += symbol;
    stream.currentCharacterEvents.push({
        symbol,
        duration: actualDuration,
        invalid,
    });

    if (stream.currentWordEvents.length > 0) {
        const previousEvent = stream.currentWordEvents[stream.currentWordEvents.length - 1];
        previousEvent.gapAfter = Math.max(0, eventTime - (stream.lastEventStartAt + stream.lastDuration));
    }

    stream.currentWordEvents.push({
        symbol,
        duration: actualDuration,
        gapAfter: 0,
        invalid,
    });
    stream.lastEventStartAt = eventTime;
    stream.lastDuration = actualDuration;
    const nextEstimatedUnit = blendEstimatedUnit(stream.estimatedUnit, estimateUnitMs(symbol, actualDuration));
    stream.estimatedUnit = kind === 'local' && savedKeyConfig.mode === 'straight'
        ? Math.max(getDitMs(), nextEstimatedUnit)
        : nextEstimatedUnit;

    scheduleCWBoundaries(stream, kind, sender);

    if (kind === 'local') {
        renderKeyPreview();
    }
}

function createCWStreamState() {
    return {
        currentCharacter: '',
        currentCharacterEvents: [],
        currentWordRaw: '',
        currentWordDecoded: '',
        currentWordEvents: [],
        lastEventStartAt: 0,
        lastDuration: 0,
        estimatedUnit: 0,
        characterTimer: 0,
        wordTimer: 0,
        flushTimer: 0,
        wordReadyToClear: false,
        phraseTimer: 0,
        pendingChatRaw: '',
        pendingChatDecoded: '',
        pendingChatSender: '',
        pendingChatKind: '',
        pendingChatUnit: 0,
    };
}

function badgeClassForState(state) {
    switch (state) {
        case 'hosting':
        case 'joining':
            return 'status-pending';
        case 'connected':
            return 'status-success';
        case 'error':
            return 'status-danger';
        default:
            return 'status-offline';
    }
}

function summaryLabelForState(state) {
    switch (state) {
        case 'hosting':
            return 'Waiting for peer';
        case 'joining':
            return 'Joining session';
        case 'connected':
            return 'Session active';
        case 'error':
            return 'Connection error';
        default:
            return 'Not connected';
    }
}

function toTitle(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function readKeyConfig() {
    try {
        const raw = window.localStorage.getItem('cwKeyConfig');
        if (!raw) {
            return { ...defaultKeyConfig };
        }
        return { ...defaultKeyConfig, ...JSON.parse(raw) };
    } catch {
        return { ...defaultKeyConfig };
    }
}

function readShortcutConfig() {
    try {
        const raw = window.localStorage.getItem('cwShortcutConfig');
        if (!raw) {
            return cloneShortcutConfig(defaultShortcutConfig);
        }
        return mergeShortcutConfig(JSON.parse(raw));
    } catch {
        return cloneShortcutConfig(defaultShortcutConfig);
    }
}

function readAudioConfig() {
    try {
        const raw = window.localStorage.getItem('cwAudioConfig');
        if (!raw) {
            return { ...defaultAudioConfig };
        }
        return { ...defaultAudioConfig, ...JSON.parse(raw) };
    } catch {
        return { ...defaultAudioConfig };
    }
}

function readDisplayConfig() {
    try {
        const raw = window.localStorage.getItem('cwDisplayConfig');
        if (!raw) {
            return { ...defaultDisplayConfig };
        }
        return { ...defaultDisplayConfig, ...JSON.parse(raw) };
    } catch {
        return { ...defaultDisplayConfig };
    }
}

function readGlossaryMnemonics() {
    try {
        const raw = window.localStorage.getItem('cwGlossaryMnemonics');
        if (!raw) {
            return {};
        }
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
            return {};
        }

        const sanitized = {};
        for (const [key, value] of Object.entries(parsed)) {
            if (typeof value !== 'string') {
                continue;
            }

            const trimmed = value.trim();
            if (trimmed) {
                sanitized[key] = trimmed;
            }
        }

        return sanitized;
    } catch {
        return {};
    }
}

function readGlossaryWidth() {
    try {
        const raw = Number(window.localStorage.getItem('cwGlossaryWidth'));
        if (!Number.isFinite(raw)) {
            return defaultGlossaryWidth;
        }
        return Math.max(minGlossaryWidth, Math.min(maxGlossaryWidth, raw));
    } catch {
        return defaultGlossaryWidth;
    }
}

function persistKeyConfig() {
    window.localStorage.setItem('cwKeyConfig', JSON.stringify(savedKeyConfig));
}

function persistShortcutConfig() {
    window.localStorage.setItem('cwShortcutConfig', JSON.stringify(savedShortcutConfig));
}

function persistAudioConfig() {
    window.localStorage.setItem('cwAudioConfig', JSON.stringify(savedAudioConfig));
}

function persistDisplayConfig() {
    window.localStorage.setItem('cwDisplayConfig', JSON.stringify(savedDisplayConfig));
}

function persistGlossaryMnemonics() {
    window.localStorage.setItem('cwGlossaryMnemonics', JSON.stringify(savedGlossaryMnemonics));
}

function persistGlossaryWidth() {
    window.localStorage.setItem('cwGlossaryWidth', String(Math.round(glossaryWidth)));
}

function renderKeyConfig() {
    displayStraightKey.innerText = humanizeCode(savedKeyConfig.straightKey);
    displayDitKey.innerText = humanizeCode(savedKeyConfig.ditKey);
    displayDahKey.innerText = humanizeCode(savedKeyConfig.dahKey);
    displayWpm.innerText = savedKeyConfig.wpm + ' WPM';
    wpmPill.innerText = savedKeyConfig.wpm + ' WPM';
    keyingModeBadge.innerText = savedKeyConfig.mode === 'straight' ? 'Straight key' : 'Iambic';
    keyingSummary.innerText = savedKeyConfig.mode === 'straight'
        ? humanizeCode(savedKeyConfig.straightKey)
        : humanizeCode(savedKeyConfig.ditKey) + ' / ' + humanizeCode(savedKeyConfig.dahKey);
    keyingStatus.innerText = pendingKeyBind
        ? 'Press a key to bind ' + bindingLabel(pendingKeyBind) + '.'
        : savedKeyConfig.mode === 'straight'
            ? 'Straight key is mapped to ' + humanizeCode(savedKeyConfig.straightKey) + '.'
            : 'Iambic mode is mapped to ' + humanizeCode(savedKeyConfig.ditKey) + ' and ' + humanizeCode(savedKeyConfig.dahKey) + '.';
    iambicBindings.classList.toggle('hidden', savedKeyConfig.mode !== 'iambic');
    updatePreview(lastPreview || '');
}

function renderShortcutConfig() {
    displayShortcutFocusKeyer.innerText = humanizeShortcut(savedShortcutConfig.focusKeyer);
    displayShortcutFocusChat.innerText = humanizeShortcut(savedShortcutConfig.focusChat);
    displayShortcutToggleMode.innerText = humanizeShortcut(savedShortcutConfig.toggleMode);
    displayShortcutSettings.innerText = humanizeShortcut(savedShortcutConfig.openSettings);
    displayShortcutQuit.innerText = isMacOS ? 'System Cmd+Q' : humanizeShortcut(savedShortcutConfig.quitApp);
    btnBindShortcutQuit.disabled = isMacOS;
    shortcutStatus.innerText = pendingShortcutBind
        ? 'Press Cmd/Ctrl plus a key to bind ' + shortcutBindingLabel(pendingShortcutBind) + '.'
        : (shortcutNotice || 'Use Cmd on macOS and Ctrl on Windows/Linux.');
}

function renderAudioConfig() {
    displayLocalFrequency.innerText = savedAudioConfig.localFrequency + ' Hz';
    displayRemoteFrequency.innerText = savedAudioConfig.remoteFrequency + ' Hz';
    displayLocalVolume.innerText = savedAudioConfig.localVolume + '%';
    displayRemoteVolume.innerText = savedAudioConfig.remoteVolume + '%';
    btnToggleLocalAudio.innerText = savedAudioConfig.localMuted ? 'Muted' : 'On';
    btnToggleRemoteAudio.innerText = savedAudioConfig.remoteMuted ? 'Muted' : 'On';
    audioStatus.innerText = audioContext
        ? 'Audio ready. Local and incoming CW playback use your settings below.'
        : 'Audio will unlock after your first interaction.';
}

function renderDisplayConfig() {
    btnToggleDecodeCW.innerText = savedDisplayConfig.decodeCWStream ? 'On' : 'Off';
    btnToggleStreamLocalCW.innerText = savedDisplayConfig.streamLocalCWToChat ? 'On' : 'Off';
    btnToggleStreamRemoteCW.innerText = savedDisplayConfig.streamRemoteCWToChat ? 'On' : 'Off';
    displayChatFontSize.innerText = savedDisplayConfig.chatFontSize + ' px';
    displayCWChatPauseMs.innerText = formatCWChatPause(savedDisplayConfig.cwChatPauseMs);
    displayStatus.innerText = displaySummary();
    document.documentElement.style.setProperty('--chat-font-size', savedDisplayConfig.chatFontSize + 'px');
}

function renderGlossaryPanel() {
    const totalEntries = defaultGlossarySections.reduce((count, section) => count + section.entries.length, 0);
    const activeSection = getActiveGlossarySection();
    glossaryMeta.innerText = totalEntries + ' sendable entries';
    glossaryTabs.innerHTML = defaultGlossarySections.map((section) => renderGlossaryTab(section)).join('');
    glossarySections.innerHTML = activeSection.entries.map((entry, entryIndex) => renderGlossaryEntry(activeSection, entry, entryIndex)).join('');
    renderGlossaryVisibility();
}

function renderGlossaryTab(section) {
    const active = section.id === activeGlossarySectionId;
    return '<button class="glossary-tab-button' + (active ? ' is-active' : '') + '" type="button" role="tab" aria-selected="' + (active ? 'true' : 'false') + '" data-section-id="' + escapeHtml(section.id) + '">' + escapeHtml(section.title) + '</button>';
}

function renderGlossaryEntry(section, entry, entryIndex) {
    const mnemonic = getGlossaryMnemonic(section, entry);
    return '<article class="glossary-entry">' +
        '<button class="glossary-send" type="button" data-section-id="' + escapeHtml(section.id) + '" data-entry-index="' + entryIndex + '">' +
            '<span class="glossary-entry-symbol">' + escapeHtml(entry.text) + '</span>' +
        '</button>' +
        '<div class="glossary-entry-code">' + escapeHtml(entry.code) + '</div>' +
        (section.editable
            ? '<input class="glossary-mnemonic-input" type="text" data-section-id="' + escapeHtml(section.id) + '" data-entry-text="' + escapeHtml(entry.text) + '" value="' + escapeHtml(mnemonic) + '" placeholder="Mnemonic cue" autocomplete="off">'
            : '<div class="glossary-note-pill" title="' + escapeHtml(entry.note || mnemonic || 'Click to send at current WPM.') + '">' + escapeHtml(mnemonic || entry.note || 'Click to send at current WPM.') + '</div>') +
    '</article>';
}

function getGlossaryMnemonic(section, entry) {
    const key = glossaryMnemonicKey(section.id, entry.text);
    const savedMnemonic = savedGlossaryMnemonics[key];
    if (typeof savedMnemonic === 'string' && savedMnemonic.trim()) {
        return savedMnemonic.trim();
    }
    return entry.mnemonic ?? '';
}

function glossaryMnemonicKey(sectionId, entryText) {
    return sectionId + ':' + entryText;
}

function getActiveGlossarySection() {
    return defaultGlossarySections.find((section) => section.id === activeGlossarySectionId) || defaultGlossarySections[0];
}

function setGlossaryVisible(visible) {
    glossaryVisible = visible;
    renderGlossaryVisibility();
}

function renderGlossaryVisibility() {
    chatWorkbench.classList.toggle('glossary-hidden', !glossaryVisible);
    btnOpenGlossary.classList.toggle('hidden', glossaryVisible);
}

function applyGlossaryWidth() {
    chatWorkbench.style.setProperty('--glossary-width', Math.round(glossaryWidth) + 'px');
}

function beginGlossaryResize(event) {
    if (!glossaryVisible || window.innerWidth <= 900) {
        return;
    }

    event.preventDefault();

    const handlePointerMove = (moveEvent) => {
        const bounds = chatWorkbench.getBoundingClientRect();
        const maxWidth = Math.min(maxGlossaryWidth, Math.max(minGlossaryWidth, bounds.width - 320));
        glossaryWidth = Math.max(minGlossaryWidth, Math.min(maxWidth, bounds.right - moveEvent.clientX));
        applyGlossaryWidth();
    };

    const finishResize = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', finishResize);
        document.body.style.cursor = '';
        persistGlossaryWidth();
    };

    document.body.style.cursor = 'col-resize';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', finishResize);
}

function beginKeyBinding(target) {
    pendingShortcutBind = '';
    shortcutNotice = '';
    pendingKeyBind = target;
    renderShortcutConfig();
    renderKeyConfig();
}

function handleGlossaryTabClick(event) {
    const button = event.target.closest('.glossary-tab-button');
    if (!button) {
        return;
    }

    activeGlossarySectionId = button.dataset.sectionId || 'alphabet';
    renderGlossaryPanel();
}

function handleGlossaryClick(event) {
    const button = event.target.closest('.glossary-send');
    if (!button) {
        return;
    }

    const sectionId = button.dataset.sectionId || activeGlossarySectionId;
    const entryIndex = Number(button.dataset.entryIndex);
    const section = defaultGlossarySections.find((item) => item.id === sectionId);
    const entry = section?.entries?.[entryIndex];
    if (!section || !entry) {
        return;
    }

    void sendGlossaryEntry(section, entry);
}

function handleGlossaryMnemonicChange(event) {
    const input = event.target.closest('.glossary-mnemonic-input');
    if (!input) {
        return;
    }

    const value = input.value.trim();
    const key = glossaryMnemonicKey(input.dataset.sectionId || '', input.dataset.entryText || '');
    if (value) {
        savedGlossaryMnemonics[key] = value;
    } else {
        delete savedGlossaryMnemonics[key];

        const section = defaultGlossarySections.find((candidate) => candidate.id === (input.dataset.sectionId || ''));
        const entry = section?.entries.find((candidate) => candidate.text === (input.dataset.entryText || ''));
        input.value = entry?.mnemonic || '';
    }

    persistGlossaryMnemonics();
}

function beginShortcutBinding(target) {
    if (target === 'quitApp' && isMacOS) {
        shortcutNotice = 'macOS keeps Cmd+Q as the system quit shortcut.';
        pendingShortcutBind = '';
        renderShortcutConfig();
        return;
    }
    pendingKeyBind = '';
    shortcutNotice = '';
    pendingShortcutBind = target;
    renderKeyConfig();
    renderShortcutConfig();
}

function handleGlobalKeyDown(event) {
    if (pendingShortcutBind) {
        if (captureShortcutBinding(event)) {
            event.preventDefault();
        }
        return;
    }

    if (pendingKeyBind) {
        event.preventDefault();
        savedKeyConfig[pendingKeyBind] = event.code;
        pendingKeyBind = '';
        persistKeyConfig();
        renderKeyConfig();
        return;
    }

    if (handleAppShortcut(event)) {
        return;
    }

    if (shouldSuppressKeyingForEvent(event)) {
        cancelActiveKeying();
        return;
    }

    if (savedKeyConfig.mode === 'straight' && event.code === savedKeyConfig.straightKey) {
        event.preventDefault();
        if (!event.repeat && !straightKeyDownAt) {
            straightKeyDownAt = performance.now();
            clearCWBoundaryTimers(cwStreams.local);
            void ensureAudioContext(true);
            startContinuousLocalTone();
            setKeySurfaceActive(true, 'straight', 'Sending from ' + humanizeCode(savedKeyConfig.straightKey) + '...');
        }
        return;
    }

    if (savedKeyConfig.mode === 'iambic') {
        if (event.code === savedKeyConfig.ditKey) {
            event.preventDefault();
            if (!iambicPressed.dit && iambicCycleSymbol === '-') {
                iambicMemory.dit = true;
            }
            iambicPressed.dit = true;
            iambicLastPressed = '.';
            void ensureAudioContext(true);
            setKeySurfaceActive(true, 'dit', 'Sending dits...');
            ensureIambicLoop();
            return;
        }
        if (event.code === savedKeyConfig.dahKey) {
            event.preventDefault();
            if (!iambicPressed.dah && iambicCycleSymbol === '.') {
                iambicMemory.dah = true;
            }
            iambicPressed.dah = true;
            iambicLastPressed = '-';
            void ensureAudioContext(true);
            setKeySurfaceActive(true, 'dah', 'Sending dahs...');
            ensureIambicLoop();
        }
    }
}

async function handleGlobalKeyUp(event) {
    if (shouldSuppressKeyingForEvent(event)) {
        cancelActiveKeying();
        return;
    }

    if (savedKeyConfig.mode === 'straight' && event.code === savedKeyConfig.straightKey && straightKeyDownAt) {
        event.preventDefault();
        const startedAt = straightKeyDownAt;
        const duration = Math.max(1, performance.now() - startedAt);
        straightKeyDownAt = 0;
        await sendStraightDuration(duration, startedAt);
        return;
    }

    if (savedKeyConfig.mode === 'iambic') {
        if (event.code === savedKeyConfig.ditKey) {
            event.preventDefault();
            iambicPressed.dit = false;
        }
        if (event.code === savedKeyConfig.dahKey) {
            event.preventDefault();
            iambicPressed.dah = false;
        }
    }
}

function handleDocumentFocusIn(event) {
    if (isTextEntryTarget(event.target)) {
        cancelActiveKeying();
    }
}

function shouldSuppressKeyingForEvent(event) {
    return isTextEntryTarget(event.target) || isTextEntryTarget(document.activeElement);
}

function cancelActiveKeying() {
    straightKeyDownAt = 0;
    iambicPressed.dit = false;
    iambicPressed.dah = false;
    iambicMemory.dit = false;
    iambicMemory.dah = false;
    stopIambicLoop();
    stopContinuousLocalTone();
    setKeySurfaceActive(false);
}

async function sendStraightDuration(duration, startedAt = performance.now() - duration) {
    setKeySurfaceActive(false);
    stopContinuousLocalTone();
    const symbol = duration >= getDahThresholdMs() ? '-' : '.';
    await sendCWSymbol(symbol, duration, startedAt, isInvalidStraightDuration(duration));
}

function ensureIambicLoop() {
    if (iambicLoopTimer) {
        return;
    }
    runIambicLoop();
}

function stopIambicLoop() {
    if (iambicLoopTimer) {
        window.clearTimeout(iambicLoopTimer);
        iambicLoopTimer = 0;
    }
    iambicCycleSymbol = '';
    iambicMemory.dit = false;
    iambicMemory.dah = false;
    if (!straightKeyDownAt) {
        setKeySurfaceActive(false);
    }
}

async function runIambicLoop() {
    if (!iambicPressed.dit && !iambicPressed.dah && !iambicMemory.dit && !iambicMemory.dah) {
        stopIambicLoop();
        return;
    }

    const symbol = chooseIambicSymbol();
    const duration = symbol === '.' ? getDitMs() : getDahMs();
    iambicLastSent = symbol;
    iambicCycleSymbol = symbol;
    if (symbol === '.') {
        iambicMemory.dit = false;
    } else {
        iambicMemory.dah = false;
    }
    const startedAt = performance.now();

    try {
        await ensureAudioContext(true);
        playLocalOneShotTone(duration);
        await sendCWSymbol(symbol, duration, startedAt);
    } finally {
        iambicLoopTimer = window.setTimeout(() => {
            runIambicLoop();
        }, duration + getInterElementGapMs());
    }
}

function chooseIambicSymbol() {
    const ditRequested = iambicPressed.dit || iambicMemory.dit;
    const dahRequested = iambicPressed.dah || iambicMemory.dah;

    if (ditRequested && dahRequested) {
        if (!iambicLastSent) {
            return iambicLastPressed || '.';
        }
        return iambicLastSent === '.' ? '-' : '.';
    }
    if (ditRequested) {
        return '.';
    }
    return '-';
}

async function sendCWSymbol(symbol, duration = 0, eventTime = performance.now(), invalid = false) {
    appendCWSymbol('You', symbol, 'local', duration, eventTime, invalid);
}

function isConnected() {
    return currentState === 'connected';
}

function setKeySurfaceActive(active, tone = '', message = '') {
    btnKeySurface.classList.toggle('is-active', active);
    keyLightDit.classList.toggle('is-active', active && (tone === 'dit' || tone === 'straight'));
    keyLightDah.classList.toggle('is-active', active && (tone === 'dah' || tone === 'straight'));
    if (message) {
        keyingStatus.innerText = message;
    } else if (!pendingKeyBind) {
        renderKeyConfig();
    }
}

function getDitMs() {
    return Math.round(1200 / savedKeyConfig.wpm);
}

function getDahMs() {
    return getDitMs() * 3;
}

function getInterElementGapMs() {
    return getDitMs();
}

function getDahThresholdMs() {
    return getDitMs() * 2;
}

function isCWSymbol(msg) {
    return msg === '.' || msg === '-';
}

function symbolToGlyph(symbol) {
    return symbol;
}

function humanizeCode(code) {
    if (!code) {
        return 'Unbound';
    }
    if (code === 'ShiftRight') {
        return 'Right Shift';
    }
    if (code === 'ShiftLeft') {
        return 'Left Shift';
    }
    if (code.startsWith('Key')) {
        return code.slice(3);
    }
    if (code.startsWith('Digit')) {
        return code.slice(5);
    }
    return code
        .replaceAll('Arrow', 'Arrow ')
        .replaceAll('Bracket', 'Bracket ')
        .replaceAll('Backquote', 'Backquote');
}

function cloneShortcutConfig(config) {
    return {
        focusKeyer: { ...config.focusKeyer },
        focusChat: { ...config.focusChat },
        toggleMode: { ...config.toggleMode },
        openSettings: { ...config.openSettings },
        quitApp: { ...config.quitApp },
    };
}

function mergeShortcutConfig(rawConfig) {
    const merged = cloneShortcutConfig(defaultShortcutConfig);
    if (!rawConfig || typeof rawConfig !== 'object') {
        return merged;
    }

    for (const action of Object.keys(merged)) {
        if (!rawConfig[action] || typeof rawConfig[action] !== 'object') {
            continue;
        }
        const next = rawConfig[action];
        if (typeof next.key === 'string' && next.key) {
            merged[action] = {
                key: next.key.toLowerCase(),
                shift: Boolean(next.shift),
                alt: Boolean(next.alt),
            };
        }
    }

    return merged;
}

function bindingLabel(target) {
    if (target === 'straightKey') {
        return 'the straight key';
    }
    if (target === 'ditKey') {
        return 'the dit key';
    }
    return 'the dah key';
}

function shortcutBindingLabel(target) {
    if (target === 'focusKeyer') {
        return 'Focus keyer';
    }
    if (target === 'focusChat') {
        return 'Focus chat';
    }
    if (target === 'toggleMode') {
        return 'Toggle keyer mode';
    }
    if (target === 'openSettings') {
        return 'Open settings';
    }
    return 'Quit app';
}

function humanizeShortcut(shortcut) {
    const parts = [isMacOS ? 'Cmd' : 'Ctrl'];
    if (shortcut.alt) {
        parts.push('Alt');
    }
    if (shortcut.shift) {
        parts.push('Shift');
    }
    parts.push(humanizeShortcutKey(shortcut.key));
    return parts.join('+');
}

function humanizeShortcutKey(key) {
    if (key === ',') {
        return ',';
    }
    if (key.length === 1) {
        return key.toUpperCase();
    }
    return humanizeCode(key);
}

function normalizeShortcutKey(key) {
    if (!key) {
        return '';
    }
    return key.length === 1 ? key.toLowerCase() : key;
}

function isPrimaryModifierPressed(event) {
    return isMacOS ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
}

function isModifierOnlyKey(key) {
    return key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta';
}

function shortcutEquals(left, right) {
    return left.key === right.key && left.shift === right.shift && left.alt === right.alt;
}

function isReservedShortcut(shortcut) {
    if (!shortcut || shortcut.alt) {
        return false;
    }

    const blockedPlain = ['a', 'c', 'f', 'n', 'p', 's', 't', 'v', 'w', 'x', 'z'];
    if (!shortcut.shift && blockedPlain.includes(shortcut.key)) {
        return true;
    }

    if (isMacOS && !shortcut.shift && (shortcut.key === 'm' || shortcut.key === 'q')) {
        return true;
    }

    return false;
}

function findShortcutConflict(target, shortcut) {
    for (const action of Object.keys(savedShortcutConfig)) {
        if (action === target) {
            continue;
        }
        if (isMacOS && action === 'quitApp') {
            continue;
        }
        if (shortcutEquals(savedShortcutConfig[action], shortcut)) {
            return action;
        }
    }
    return '';
}

function captureShortcutBinding(event) {
    if (pendingShortcutBind === 'quitApp' && isMacOS) {
        pendingShortcutBind = '';
        shortcutNotice = 'macOS keeps Cmd+Q as the system quit shortcut.';
        renderShortcutConfig();
        return true;
    }

    if (isModifierOnlyKey(event.key)) {
        return true;
    }

    if (!isPrimaryModifierPressed(event)) {
        shortcutNotice = 'Shortcut bindings must include Cmd on macOS or Ctrl on Windows/Linux.';
        renderShortcutConfig();
        return true;
    }

    const nextShortcut = {
        key: normalizeShortcutKey(event.key),
        shift: event.shiftKey,
        alt: event.altKey,
    };

    if (isReservedShortcut(nextShortcut)) {
        shortcutNotice = humanizeShortcut(nextShortcut) + ' is reserved by the app or operating system.';
        renderShortcutConfig();
        return true;
    }

    const conflict = findShortcutConflict(pendingShortcutBind, nextShortcut);
    if (conflict) {
        shortcutNotice = humanizeShortcut(nextShortcut) + ' is already bound to ' + shortcutBindingLabel(conflict) + '.';
        renderShortcutConfig();
        return true;
    }

    savedShortcutConfig[pendingShortcutBind] = nextShortcut;
    shortcutNotice = shortcutBindingLabel(pendingShortcutBind) + ' is now ' + humanizeShortcut(nextShortcut) + '.';
    pendingShortcutBind = '';
    persistShortcutConfig();
    renderShortcutConfig();
    return true;
}

function handleAppShortcut(event) {
    const key = normalizeShortcutKey(event.key);
    const inTextEntry = isTextEntryTarget(event.target);
    const keyerFocused = document.activeElement === btnKeySurface;

    if (matchesShortcut(event, savedShortcutConfig.openSettings)) {
        event.preventDefault();
        openSettingsDrawer();
        return true;
    }

    if (!isMacOS && matchesShortcut(event, savedShortcutConfig.quitApp)) {
        event.preventDefault();
        Quit();
        return true;
    }

    if (matchesShortcut(event, savedShortcutConfig.focusKeyer)) {
        event.preventDefault();
        focusKeyerSurface();
        return true;
    }

    if (matchesShortcut(event, savedShortcutConfig.focusChat)) {
        event.preventDefault();
        focusChatInput();
        return true;
    }

    if (matchesShortcut(event, savedShortcutConfig.toggleMode)) {
        event.preventDefault();
        toggleKeyerMode();
        return true;
    }

    const primaryModifier = isPrimaryModifierPressed(event);
    const allowArrowHotkeys = keyerFocused || (!inTextEntry && !primaryModifier && !event.altKey && !event.shiftKey);
    const allowAltArrowHotkeys = event.altKey && !primaryModifier && !event.shiftKey;
    if (!allowArrowHotkeys && !allowAltArrowHotkeys) {
        return false;
    }

    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            adjustWPM(1);
            return true;
        case 'ArrowDown':
            event.preventDefault();
            adjustWPM(-1);
            return true;
        case 'ArrowLeft':
            event.preventDefault();
            adjustKeyerFrequency(-10);
            return true;
        case 'ArrowRight':
            event.preventDefault();
            adjustKeyerFrequency(10);
            return true;
        default:
            return false;
    }
}

function matchesShortcut(event, shortcut) {
    return isPrimaryModifierPressed(event)
        && !isModifierOnlyKey(event.key)
        && normalizeShortcutKey(event.key) === shortcut.key
        && event.shiftKey === shortcut.shift
        && event.altKey === shortcut.alt;
}

function isTextEntryTarget(target) {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable === true;
}

function focusChatInput() {
    inputChat.focus();
    inputChat.select();
}

function focusKeyerSurface() {
    btnKeySurface.focus();
}

function adjustWPM(delta) {
    const nextValue = Math.max(5, Math.min(35, savedKeyConfig.wpm + delta));
    if (nextValue === savedKeyConfig.wpm) {
        return;
    }
    savedKeyConfig.wpm = nextValue;
    inputWpm.value = String(nextValue);
    persistKeyConfig();
    renderKeyConfig();
}

function adjustKeyerFrequency(delta) {
    const nextValue = Math.max(300, Math.min(1100, savedAudioConfig.localFrequency + delta));
    if (nextValue === savedAudioConfig.localFrequency) {
        return;
    }
    savedAudioConfig.localFrequency = nextValue;
    inputLocalFrequency.value = String(nextValue);
    persistAudioConfig();
    renderAudioConfig();
    syncContinuousLocalTone();
}

function toggleKeyerMode() {
    savedKeyConfig.mode = savedKeyConfig.mode === 'straight' ? 'iambic' : 'straight';
    selectKeyingMode.value = savedKeyConfig.mode;
    persistKeyConfig();
    stopIambicLoop();
    renderKeyConfig();
}

function updatePreview(value) {
    lastPreview = value;
    keyPreview.textContent = value;
}

function renderKeyPreview() {
    const stream = cwStreams.local;
    const raw = buildCurrentCWCharacterRaw(stream);
    const decoded = buildCurrentCWCharacterDecoded(stream);

    if (!raw && !decoded) {
        updatePreview('');
        return;
    }

    if (savedDisplayConfig.decodeCWStream && decoded) {
        updatePreview(raw + '    ' + decoded);
        return;
    }

    updatePreview(raw || decoded);
}

function buildCurrentCWCharacterRaw(stream) {
    if (stream.currentCharacter) {
        return stream.currentCharacter;
    }

    const parts = String(stream.currentWordRaw || '').trim().split(/\s+/).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : '';
}

function buildCurrentCWCharacterDecoded(stream) {
    if (stream.currentCharacter) {
        return '';
    }

    const decoded = String(stream.currentWordDecoded || '').trim();
    return decoded ? decoded.slice(-1) : '';
}

function buildCurrentCWWordRaw(stream) {
    const parts = [];
    if (stream.currentWordRaw) {
        parts.push(stream.currentWordRaw);
    }
    if (stream.currentCharacter) {
        parts.push(stream.currentCharacter);
    }
    return parts.join(' ');
}

function applyCWGapTransitions(stream, eventTime, kind, sender) {
    if (!stream.lastEventStartAt) {
        return;
    }

    const unit = resolveCWUnit(stream, kind);
    const thresholds = getCWGapThresholds(stream, unit, kind);
    const silenceGap = Math.max(0, eventTime - (stream.lastEventStartAt + stream.lastDuration));

    if (silenceGap >= thresholds.wordGap) {
        finalizeCWWord(stream, kind, sender);
        return;
    }

    if (silenceGap >= thresholds.characterGap) {
        finalizeCWCharacter(stream);
    }
}

function scheduleCWBoundaries(stream, kind, sender) {
    clearCWBoundaryTimers(stream);

    const unit = resolveCWUnit(stream, kind);
    const now = performance.now();
    const thresholds = getCWGapThresholds(stream, unit, kind);
    const characterDeadline = stream.lastEventStartAt + stream.lastDuration + thresholds.characterGap;
    const wordDeadline = stream.lastEventStartAt + stream.lastDuration + thresholds.wordGap;
    const wordDelay = Math.max(0, wordDeadline - now);

    if (!isLocalStraightMode(kind)) {
        const characterDelay = Math.max(0, characterDeadline - now);

        stream.characterTimer = window.setTimeout(() => {
            finalizeCWCharacter(stream);
            if (kind === 'local') {
                renderKeyPreview();
            }
        }, characterDelay);
    }

    stream.wordTimer = window.setTimeout(() => {
        finalizeCWWord(stream, kind, sender);
    }, wordDelay);
}

function getCWGapThresholds(stream, unit, kind) {
    if (!isLocalStraightMode(kind)) {
        return {
            characterGap: unit * 3,
            wordGap: unit * 7,
        };
    }

    const observedShortGap = getObservedStraightElementGap(stream, unit);
    return {
        characterGap: Math.max(unit * 2.2, observedShortGap * 2.4),
        wordGap: Math.max(unit * 4.6, observedShortGap * 4),
    };
}

function getObservedStraightElementGap(stream, unit) {
    const gaps = stream.currentWordEvents
        .map((event) => event.gapAfter)
        .filter((gap) => gap > 0 && gap <= unit * 2.5)
        .sort((left, right) => left - right);

    if (gaps.length === 0) {
        return unit;
    }

    return gaps[Math.floor(gaps.length / 2)];
}

function isLocalStraightMode(kind) {
    return kind === 'local' && savedKeyConfig.mode === 'straight';
}

function clearCWBoundaryTimers(stream) {
    if (stream.characterTimer) {
        window.clearTimeout(stream.characterTimer);
        stream.characterTimer = 0;
    }
    if (stream.wordTimer) {
        window.clearTimeout(stream.wordTimer);
        stream.wordTimer = 0;
    }
}

function finalizeCWCharacter(stream) {
    if (!stream.currentCharacter) {
        return;
    }

    const rawCharacter = stream.currentCharacter;
    const decodedCharacter = decodeCWCharacter(stream.currentCharacterEvents, rawCharacter);
    const rawDisplay = decodedCharacter === cwUnknownToken ? cwUnknownToken : rawCharacter;
    stream.currentWordRaw = stream.currentWordRaw ? stream.currentWordRaw + ' ' + rawDisplay : rawDisplay;
    stream.currentWordDecoded += decodedCharacter;
    stream.currentCharacter = '';
    stream.currentCharacterEvents = [];
}

function finalizeCWWord(stream, kind, sender) {
    finalizeCWCharacter(stream);
    if (!stream.currentWordRaw && !stream.currentWordDecoded) {
        return;
    }

    queueCWChatSegment(stream, kind, sender, stream.currentWordRaw, stream.currentWordDecoded, resolveCWUnit(stream, kind));

    stream.wordReadyToClear = true;
    scheduleCWWordFlush(stream, kind, sender);
    if (kind === 'local') {
        renderKeyPreview();
    }
}

function resetCWWord(stream) {
    stream.currentCharacter = '';
    stream.currentCharacterEvents = [];
    stream.currentWordRaw = '';
    stream.currentWordDecoded = '';
    stream.currentWordEvents = [];
    stream.lastEventStartAt = 0;
    stream.lastDuration = 0;
    if (stream.characterTimer) {
        window.clearTimeout(stream.characterTimer);
        stream.characterTimer = 0;
    }
    if (stream.wordTimer) {
        window.clearTimeout(stream.wordTimer);
        stream.wordTimer = 0;
    }
    if (stream.flushTimer) {
        window.clearTimeout(stream.flushTimer);
        stream.flushTimer = 0;
    }
    stream.wordReadyToClear = false;
}

function decodeCWCharacter(events, rawCharacter) {
    if (!rawCharacter || !Array.isArray(events) || events.length === 0) {
        return cwUnknownToken;
    }

    const hasInvalidEvent = events.some((event) => event.invalid);
    if (hasInvalidEvent || events.length > 6) {
        return cwUnknownToken;
    }

    return morseAlphabet[rawCharacter] || cwUnknownToken;
}

function isInvalidStraightDuration(duration) {
    return duration >= Math.max(getDitMs() * 24, 4000);
}

function shouldStreamCWToChat(kind) {
    return kind === 'local' ? savedDisplayConfig.streamLocalCWToChat : savedDisplayConfig.streamRemoteCWToChat;
}

function queueCWChatSegment(stream, kind, sender, raw, decoded, unit) {
    if (!shouldStreamCWToChat(kind)) {
        return;
    }

    const rawText = String(raw || '').trim();
    const decodedText = String(decoded || '').trim();
    if (!rawText && !decodedText) {
        return;
    }

    stream.pendingChatRaw = stream.pendingChatRaw ? stream.pendingChatRaw + ' ' + rawText : rawText;
    if (decodedText) {
        stream.pendingChatDecoded = stream.pendingChatDecoded ? stream.pendingChatDecoded + ' ' + decodedText : decodedText;
    }
    stream.pendingChatSender = sender;
    stream.pendingChatKind = kind;
    stream.pendingChatUnit = Math.max(stream.pendingChatUnit || 0, unit || 0);
    scheduleCWChatFlush(stream);
}

function scheduleCWChatFlush(stream) {
    if (stream.phraseTimer) {
        window.clearTimeout(stream.phraseTimer);
    }

    stream.phraseTimer = window.setTimeout(() => {
        flushCWChatSegment(stream);
    }, savedDisplayConfig.cwChatPauseMs);
}

function flushCWChatSegment(stream) {
    if (!stream.pendingChatRaw && !stream.pendingChatDecoded) {
        return;
    }

    addLogEntry({
        sender: stream.pendingChatSender || 'CW',
        text: stream.pendingChatRaw || cwUnknownToken,
        detail: savedDisplayConfig.decodeCWStream ? (stream.pendingChatDecoded || cwUnknownToken) : 'CW',
        kind: stream.pendingChatKind || 'local',
    });

    stream.pendingChatRaw = '';
    stream.pendingChatDecoded = '';
    stream.pendingChatSender = '';
    stream.pendingChatKind = '';
    stream.pendingChatUnit = 0;
    if (stream.phraseTimer) {
        window.clearTimeout(stream.phraseTimer);
        stream.phraseTimer = 0;
    }
}

async function sendBufferedCWWord(stream) {
    const payload = encodeCWWordPacket({
        raw: stream.currentWordRaw,
        decoded: stream.currentWordDecoded,
        unit: Math.round(resolveCWUnit(stream, 'local')),
        events: stream.currentWordEvents,
    });

    try {
        await SendMessage(payload);
    } catch (err) {
        addSystemEntry('Failed to send buffered CW word: ' + err, 'error');
    }
}

async function sendGlossaryEntry(section, entry) {
    const packets = buildCWWordPacketsFromText(entry.text);
    if (!packets.length) {
        addSystemEntry('Could not send glossary entry ' + entry.text + ' because it contains unsupported characters.', 'warning');
        return;
    }

    const mnemonic = getGlossaryMnemonic(section, entry);
    addLogEntry({
        sender: 'You',
        text: entry.text,
        detail: 'Glossary · ' + packets.map((packet) => packet.raw).join(' / ') + (mnemonic ? ' · ' + mnemonic : ''),
        kind: 'local',
    });

    await ensureAudioContext(true);
    localPlaybackQueue = localPlaybackQueue
        .then(async () => {
            for (const packet of packets) {
                await playCWPacket(packet, savedAudioConfig.localFrequency, savedAudioConfig.localVolume, savedAudioConfig.localMuted);
            }
        })
        .catch(async () => {
            for (const packet of packets) {
                await playCWPacket(packet, savedAudioConfig.localFrequency, savedAudioConfig.localVolume, savedAudioConfig.localMuted);
            }
        });

    if (!isConnected()) {
        return;
    }

    try {
        for (const packet of packets) {
            await SendMessage(encodeCWWordPacket(packet));
        }
    } catch (err) {
        addSystemEntry('Failed to send glossary CW: ' + err, 'error');
    }
}

function handleIncomingCWWordPacket(packet) {
    queueCWChatSegment(cwStreams.remote, 'remote', getRemotePeerName(), packet.raw, packet.decoded, Number(packet.unit) || getDitMs());

    remotePlaybackQueue = remotePlaybackQueue
        .then(() => playBufferedCWWord(packet))
        .catch(() => playBufferedCWWord(packet));
}

function scheduleCWWordFlush(stream, kind, sender) {
    if (stream.flushTimer) {
        window.clearTimeout(stream.flushTimer);
    }

    const unit = resolveCWUnit(stream, kind);
    stream.flushTimer = window.setTimeout(() => {
        flushCompletedCWWord(stream, kind, sender, performance.now());
        resetCWWord(stream);
        if (kind === 'local') {
            renderKeyPreview();
        }
    }, unit * 14);
}

function flushCompletedCWWord(stream, kind, sender, eventTime) {
    if (!stream.wordReadyToClear || stream.currentWordEvents.length === 0) {
        return;
    }

    const lastEvent = stream.currentWordEvents[stream.currentWordEvents.length - 1];
    const lastEndAt = stream.lastEventStartAt + stream.lastDuration;
    const silenceGap = Math.max(0, eventTime - lastEndAt);
    lastEvent.gapAfter = silenceGap;

    if (kind === 'local' && isConnected()) {
        void sendBufferedCWWord(stream);
    }
}

async function playBufferedCWWord(packet) {
    await playCWPacket(packet, savedAudioConfig.remoteFrequency, savedAudioConfig.remoteVolume, savedAudioConfig.remoteMuted);
}

async function playCWPacket(packet, frequency, volumePercent, muted) {
    if (muted || !Array.isArray(packet.events)) {
        return;
    }

    for (const event of packet.events) {
        if (!isCWSymbol(event.symbol)) {
            continue;
        }
        await playTone(event.duration, frequency, volumePercent, muted);
        await waitMs((event.duration || 0) + (event.gapAfter || 0));
    }
}

function waitMs(duration) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, Math.max(0, duration));
    });
}

function openSettingsDrawer() {
    settingsOverlay.classList.remove('hidden');
    settingsDrawer.classList.remove('hidden');
    requestAnimationFrame(() => {
        settingsOverlay.classList.add('is-visible');
        settingsDrawer.classList.add('is-visible');
    });
}

function closeSettingsDrawer() {
    settingsOverlay.classList.remove('is-visible');
    settingsDrawer.classList.remove('is-visible');
    window.setTimeout(() => {
        settingsOverlay.classList.add('hidden');
        settingsDrawer.classList.add('hidden');
    }, 180);
}

function toggleActivityLog() {
    const expanded = btnToggleActivityLog.getAttribute('aria-expanded') === 'true';
    btnToggleActivityLog.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    activityLogWrapper.classList.toggle('hidden', expanded);
}

async function ensureAudioContext(userInitiated = false) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) {
        audioStatus.innerText = 'Web Audio is not available in this runtime.';
        return null;
    }

    if (!audioContext) {
        audioContext = new AudioCtor();
    }

    if (userInitiated && audioContext.state === 'suspended') {
        try {
            await audioContext.resume();
        } catch {
            audioStatus.innerText = 'Audio is blocked until the app is interacted with again.';
            return audioContext;
        }
    }

    renderAudioConfig();
    return audioContext;
}

function startContinuousLocalTone() {
    if (savedAudioConfig.localMuted || !audioContext || audioContext.state !== 'running' || localOscillator) {
        return;
    }

    const gainNode = audioContext.createGain();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = savedAudioConfig.localFrequency;
    gainNode.gain.value = savedAudioConfig.localVolume / 100;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    localOscillator = oscillator;
    localGainNode = gainNode;
}

function stopContinuousLocalTone() {
    if (!localOscillator || !audioContext) {
        return;
    }

    const stopAt = audioContext.currentTime + 0.01;
    localGainNode.gain.cancelScheduledValues(audioContext.currentTime);
    localGainNode.gain.setValueAtTime(localGainNode.gain.value, audioContext.currentTime);
    localGainNode.gain.linearRampToValueAtTime(0, stopAt);
    localOscillator.stop(stopAt);
    localOscillator = null;
    localGainNode = null;
}

function syncContinuousLocalTone() {
    if (!localOscillator || !localGainNode) {
        return;
    }
    localOscillator.frequency.value = savedAudioConfig.localFrequency;
    localGainNode.gain.value = savedAudioConfig.localVolume / 100;
}

function playLocalOneShotTone(duration) {
    void playTone(duration, savedAudioConfig.localFrequency, savedAudioConfig.localVolume, savedAudioConfig.localMuted);
}

async function playRemoteSymbol(symbol, duration) {
    const playbackDuration = duration || (symbol === '.' ? getDitMs() : getDahMs());
    await playTone(playbackDuration, savedAudioConfig.remoteFrequency, savedAudioConfig.remoteVolume, savedAudioConfig.remoteMuted);
}

async function playTone(duration, frequency, volumePercent, muted) {
    if (muted || duration <= 0) {
        return;
    }

    const context = await ensureAudioContext(false);
    if (!context || context.state !== 'running') {
        return;
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    const now = context.currentTime;
    const durationSeconds = duration / 1000;
    const attack = 0.004;
    const release = 0.01;
    const peak = Math.max(0.001, volumePercent / 100);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(peak, now + attack);
    gainNode.gain.setValueAtTime(peak, now + Math.max(attack, durationSeconds - release));
    gainNode.gain.linearRampToValueAtTime(0, now + durationSeconds);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + durationSeconds + 0.01);
}

function estimateUnitMs(symbol, duration) {
    if (duration > 0) {
        return symbol === '-' ? Math.max(1, duration / 3) : duration;
    }
    return symbol === '-' ? getDahMs() / 3 : getDitMs();
}

function blendEstimatedUnit(previousUnit, nextUnit) {
    if (!previousUnit) {
        return nextUnit;
    }
    return ((previousUnit * 3) + nextUnit) / 4;
}

function buildCWWordPacketsFromText(text) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    const unit = getDitMs();
    const packets = [];

    for (const word of words) {
        const characters = Array.from(word);
        const rawCharacters = [];
        const events = [];

        for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
            const code = resolveMorseCode(characters[charIndex]);
            if (!code) {
                return [];
            }
            rawCharacters.push(code);

            for (let symbolIndex = 0; symbolIndex < code.length; symbolIndex += 1) {
                const symbol = code[symbolIndex];
                const isLastSymbol = symbolIndex === code.length - 1;
                const isLastCharacter = charIndex === characters.length - 1;
                events.push({
                    symbol,
                    duration: symbol === '.' ? unit : unit * 3,
                    gapAfter: isLastSymbol ? (isLastCharacter ? unit * 7 : unit * 3) : unit,
                    invalid: false,
                });
            }
        }

        packets.push({
            raw: rawCharacters.join(' '),
            decoded: word.toUpperCase(),
            unit,
            events,
        });
    }

    return packets;
}

function resolveMorseCode(character) {
    const normalized = String(character || '').toUpperCase();
    return morseByCharacter[normalized] || morseByCharacter[character] || '';
}

function buildMorseByCharacterMap() {
    const output = {};
    for (const [code, character] of Object.entries(morseAlphabet)) {
        output[character] = code;
    }
    return output;
}

function createDefaultGlossarySections() {
    return [
        {
            id: 'alphabet',
            title: 'Alphabet',
            description: 'A through Z with editable cue phrases stored only on this device.',
            editable: true,
            openByDefault: true,
            entries: [
                createGlossaryEntry('A', 'an A'),
                createGlossaryEntry('B', 'BOB is the man'),
                createGlossaryEntry('C', 'CO - ca   CO - la'),
                createGlossaryEntry('D', 'DOG did it'),
                createGlossaryEntry('E', 'eh'),
                createGlossaryEntry('F', 'fetch a FIRE man'),
                createGlossaryEntry('G', 'GOOD GRA - vy'),
                createGlossaryEntry('H', 'hip - i - ty - hop'),
                createGlossaryEntry('I', 'I  bid'),
                createGlossaryEntry('J', 'in JAWS JAWS JAW'),
                createGlossaryEntry('K', 'KANG - a - ROO'),
                createGlossaryEntry('L', 'los - AN - ge - les'),
                createGlossaryEntry('M', 'MMM MMM'),
                createGlossaryEntry('N', 'NUD - ist'),
                createGlossaryEntry('O', 'OH MY GOD'),
                createGlossaryEntry('P', 'a POO - PY smell'),
                createGlossaryEntry('Q', 'GOD SAVE the QUEEN'),
                createGlossaryEntry('R', 'ro - TA - tion'),
                createGlossaryEntry('S', 'si si si'),
                createGlossaryEntry('T', 'TALL'),
                createGlossaryEntry('U', 'u - ni - FORM'),
                createGlossaryEntry('V', 'vic - to - ry   VEE'),
                createGlossaryEntry('W', 'the WORLD WAR'),
                createGlossaryEntry('X', 'X marks the SPOT'),
                createGlossaryEntry('Y', 'YOURE a COOL DUDE'),
                createGlossaryEntry('Z', 'ZINC ZOO keep - er'),
            ],
        },
        {
            id: 'numbers',
            title: 'Numbers',
            description: 'Digits 0 through 9 for callsigns, reports, and shorthand.',
            editable: false,
            openByDefault: true,
            entries: [
                createGlossaryEntry('0', 'five dahs'),
                createGlossaryEntry('1', 'dit then four dahs'),
                createGlossaryEntry('2', 'two dits then three dahs'),
                createGlossaryEntry('3', 'three dits then two dahs'),
                createGlossaryEntry('4', 'four dits then one dah'),
                createGlossaryEntry('5', 'five dits'),
                createGlossaryEntry('6', 'dah then four dits'),
                createGlossaryEntry('7', 'two dahs then three dits'),
                createGlossaryEntry('8', 'three dahs then two dits'),
                createGlossaryEntry('9', 'four dahs then one dit'),
            ],
        },
        {
            id: 'punctuation',
            title: 'Punctuation',
            description: 'Common punctuation you may want during practice or short messages.',
            editable: false,
            openByDefault: false,
            entries: [
                createGlossaryEntry('.', 'Period'),
                createGlossaryEntry(',', 'Comma'),
                createGlossaryEntry('?', 'Question mark'),
                createGlossaryEntry('/', 'Slash'),
                createGlossaryEntry('=', 'BT or separator'),
                createGlossaryEntry('+', 'AR or end of message'),
            ],
        },
        {
            id: 'abbreviations',
            title: 'Ham Abbreviations',
            description: 'Common on-air shorthand for quick exchanges.',
            editable: false,
            openByDefault: false,
            entries: [
                createGlossaryEntry('CQ', 'Calling any station'),
                createGlossaryEntry('DE', 'This is'),
                createGlossaryEntry('BK', 'Back to you'),
                createGlossaryEntry('KN', 'Over to named station only'),
                createGlossaryEntry('R', 'Received'),
                createGlossaryEntry('TU', 'Thank you'),
                createGlossaryEntry('73', 'Best regards'),
                createGlossaryEntry('88', 'Love and kisses'),
                createGlossaryEntry('OM', 'Old man'),
                createGlossaryEntry('YL', 'Young lady'),
            ],
        },
        {
            id: 'qcodes',
            title: 'Q-Codes',
            description: 'A starter set of common Q-signals for casual operating.',
            editable: false,
            openByDefault: false,
            entries: [
                createGlossaryEntry('QRL', 'Are you busy?'),
                createGlossaryEntry('QRM', 'Interference'),
                createGlossaryEntry('QRN', 'Static or noise'),
                createGlossaryEntry('QRP', 'Low power'),
                createGlossaryEntry('QRO', 'Increase power'),
                createGlossaryEntry('QRT', 'Stop sending'),
                createGlossaryEntry('QRZ', 'Who is calling me?'),
                createGlossaryEntry('QSB', 'Fading'),
                createGlossaryEntry('QSL', 'Acknowledged'),
                createGlossaryEntry('QSO', 'Contact'),
                createGlossaryEntry('QSY', 'Change frequency'),
                createGlossaryEntry('QTH', 'Location'),
            ],
        },
    ];
}

function createGlossaryEntry(text, mnemonic = '', note = '') {
    return {
        text,
        code: encodeGlossaryText(text),
        mnemonic,
        note,
    };
}

function encodeGlossaryText(text) {
    return Array.from(String(text || ''))
        .map((character) => resolveMorseCode(character))
        .filter(Boolean)
        .join(' ');
}

function encodeCWSymbol(symbol, duration) {
    return '__cw__:' + symbol + ':' + Math.round(duration || 0);
}

function encodeCWWordPacket(packet) {
    return '__cw_word__:' + JSON.stringify(packet);
}

function parseCWSymbol(value) {
    if (value === '.' || value === '-') {
        return { symbol: value, duration: 0 };
    }

    if (!value.startsWith('__cw__:')) {
        return null;
    }

    const parts = value.split(':');
    if (parts.length !== 3) {
        return null;
    }

    const symbol = parts[1];
    const duration = Number(parts[2]);
    if (!isCWSymbol(symbol)) {
        return null;
    }

    return {
        symbol,
        duration: Number.isFinite(duration) ? duration : 0,
    };
}

function parseCWWordPacket(value) {
    if (!value.startsWith('__cw_word__:')) {
        return null;
    }

    try {
        const packet = JSON.parse(value.slice('__cw_word__:'.length));
        if (!packet || !Array.isArray(packet.events)) {
            return null;
        }
        return packet;
    } catch {
        return null;
    }
}

function displaySummary() {
    return 'CW chat lines flush after ' + formatCWChatPause(savedDisplayConfig.cwChatPauseMs) + ' of silence.';
}

function formatCWChatPause(durationMs) {
    return (durationMs / 1000).toFixed(1) + ' s';
}

function resolveCWUnit(stream, kind) {
    if (kind === 'local' && savedKeyConfig.mode === 'straight') {
        return Math.max(getDitMs(), stream.estimatedUnit || 0);
    }
    return stream.estimatedUnit || getDitMs();
}

function formatTimestamp() {
    return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
