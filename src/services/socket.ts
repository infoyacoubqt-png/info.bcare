import { io, type Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string | undefined

const SESSION_KEY = 'becare_socket_session_id'

export interface SessionMetadata {
  sessionId: string
  currentStep: string
  timestamp: string
  device: {
    userAgent: string
    platform: string
    language: string
    viewport: string
  }
}

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function getDeviceMetadata() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  }
}

let socket: Socket | null = null

export function getSocket(): Socket | null {
  return socket
}

export function connectSocket(): Socket | null {
  if (socket?.connected) return socket
  if (!SOCKET_URL) {
    console.warn('[socket] VITE_SOCKET_URL is not set; real-time tracking disabled')
    return null
  }

  const sessionId = getOrCreateSessionId()

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    socket!.emit('session:join', { sessionId })
  })

  socket.on('disconnect', () => {
    // lifecycle event — no action needed; reconnection is automatic
  })

  socket.on('connect_error', () => {
    // silent — reconnection will retry automatically
  })

  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}

export function emitStepChanged(currentStep: string): void {
  if (!socket?.connected) return
  const sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) return
  socket.emit('session:step_changed', {
    sessionId,
    currentStep,
    timestamp: new Date().toISOString(),
  })
}

export function emitSubmissionCreated(submissionType: string): void {
  if (!socket?.connected) return
  const sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) return
  socket.emit('submission:created', {
    sessionId,
    submissionType,
    timestamp: new Date().toISOString(),
    status: 'pending',
  })
}

export function getSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export { SOCKET_URL }
