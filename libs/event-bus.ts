/**
 * Minimal event bus that bridges the calm cathedral clients to the websocket spine.
 * The helper keeps everything offline-friendly: when WebSocket support is missing the
 * bus still works for local publish/subscribe without throwing errors.
 */
export interface EventPayload {
  [key: string]: unknown;
}

export type EventHandler = (payload: EventPayload) => void;

export interface EventBusOptions {
  /** Optional override for the sacred websocket endpoint. */
  url?: string;
  /** Optional websocket subprotocols; rarely needed but kept for completeness. */
  protocols?: string | string[];
  /** Allow dependency injection for environments that ship their own WebSocket implementation. */
  WebSocketImpl?: typeof WebSocket;
}

const DEFAULT_URL = 'wss://cathedral-core.fly.dev/ws';

const READY_STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
} as const;

function safeParse(message: string): EventPayload | null {
  try {
    const parsed = JSON.parse(message);
    return parsed && typeof parsed === 'object' ? (parsed as EventPayload) : null;
  } catch (_error) {
    return null;
  }
}

/**
 * Create a tiny event bus with ND-safe defaults.
 * - No automatic reconnection loops: callers can decide the cadence that keeps them regulated.
 * - Calm logging: the helper never throws; it simply no-ops when sockets are unavailable.
 */
export function createEventBus(options: EventBusOptions = {}) {
  const {
    url = DEFAULT_URL,
    protocols,
    WebSocketImpl = typeof WebSocket === 'undefined' ? undefined : WebSocket
  } = options;

  type ListenerMap = Map<string, Set<EventHandler>>;
  const listeners: ListenerMap = new Map();

  let socket: WebSocket | null = null;

  const addListener = (event: string, handler: EventHandler) => {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event)!.add(handler);
  };

  const removeListener = (event: string, handler: EventHandler) => {
    const bucket = listeners.get(event);
    if (!bucket) return;
    bucket.delete(handler);
    if (bucket.size === 0) {
      listeners.delete(event);
    }
  };

  const dispatch = (event: string, payload: EventPayload) => {
    const bucket = listeners.get(event);
    if (!bucket) return;
    bucket.forEach((handler) => {
      handler(payload);
    });
  };

  const connect = () => {
    if (!WebSocketImpl || socket) {
      return socket;
    }
    const next = new WebSocketImpl(url, protocols);
    next.onmessage = (evt: MessageEvent<string>) => {
      const payload = typeof evt.data === 'string' ? safeParse(evt.data) : null;
      if (!payload) return;
      const eventName = typeof payload.event === 'string' ? payload.event : 'message';
      dispatch(eventName, payload);
    };
    next.onerror = () => {
      // ND-safe: errors are acknowledged silently to avoid noisy logs during offline rituals.
    };
    socket = next as unknown as WebSocket;
    return socket;
  };

  const close = () => {
    if (!socket) return;
    if (socket.readyState === READY_STATE.CLOSING || socket.readyState === READY_STATE.CLOSED) {
      socket = null;
      return;
    }
    socket.close();
    socket = null;
  };

  const emit = (event: string, payload: EventPayload = {}) => {
    dispatch(event, payload);
    if (!socket || socket.readyState !== READY_STATE.OPEN) {
      return;
    }
    const envelope = JSON.stringify({ event, payload });
    socket.send(envelope);
  };

  const getState = () => {
    if (!socket) return READY_STATE.CLOSED;
    return socket.readyState;
  };

  return {
    connect,
    close,
    emit,
    on: addListener,
    off: removeListener,
    state: getState
  };
}
