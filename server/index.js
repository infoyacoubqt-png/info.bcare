import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const PORT = process.env.PORT || 3000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*'

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
})

const monitoringSockets = new Set()

io.on('connection', (socket) => {
  socket.on('session:join', ({ sessionId }) => {
    if (!sessionId) return
    socket.data.sessionId = sessionId
    socket.join(`session:${sessionId}`)
    broadcastMetrics()
    broadcastClients()
  })

  socket.on('monitor:join', () => {
    monitoringSockets.add(socket.id)
    socket.join('monitors')
    socket.emit('metrics', computeMetrics())
    socket.emit('clients', getClientList())
  })

  socket.on('session:step_changed', (payload) => {
    io.to('monitors').emit('session:step_changed', payload)
  })

  socket.on('submission:created', (payload) => {
    io.to('monitors').emit('submission:created', payload)
  })

  socket.on('admin-action-broadcast', ({ message }) => {
    io.emit('admin:banner', { message, timestamp: new Date().toISOString() })
  })

  socket.on('admin-action-kick', ({ socketId }) => {
    const target = io.sockets.sockets.get(socketId)
    if (target) {
      target.emit('admin:kicked')
      target.disconnect(true)
    }
  })

  socket.on('admin:navigate', ({ sessionId, route }) => {
    if (!sessionId || !route) return
    io.to(`session:${sessionId}`).emit('admin:navigate', { route })
  })

  socket.on('disconnect', () => {
    monitoringSockets.delete(socket.id)
    broadcastMetrics()
    broadcastClients()
  })
})

function computeMetrics() {
  const totalSockets = io.sockets.sockets.size
  const rooms = io.sockets.adapter.rooms
  let activeRooms = 0
  for (const [name] of rooms) {
    if (name.startsWith('session:') && !name.endsWith('#')) activeRooms++
  }
  return { totalSockets, activeRooms }
}

function getClientList() {
  const clients = []
  for (const [id, socket] of io.sockets.sockets) {
    if (monitoringSockets.has(id)) continue
    clients.push({
      id,
      sessionId: socket.data.sessionId || null,
      transport: socket.conn.transport.name,
    })
  }
  return clients
}

function broadcastMetrics() {
  io.to('monitors').emit('metrics', computeMetrics())
}

function broadcastClients() {
  io.to('monitors').emit('clients', getClientList())
}

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})
