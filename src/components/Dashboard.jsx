import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SERVER_URL = 'http://localhost:3000'

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [metrics, setMetrics] = useState({ totalSockets: 0, activeRooms: 0 })
  const [clients, setClients] = useState([])
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [kickTarget, setKickTarget] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io(SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })
    socketRef.current = socket

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))
    socket.on('connect_error', () => setIsConnected(false))

    socket.on('metrics', (data) => {
      setMetrics({
        totalSockets: data.totalSockets ?? 0,
        activeRooms: data.activeRooms ?? 0,
      })
    })

    socket.on('clients', (data) => {
      setClients(Array.isArray(data) ? data : [])
    })

    return () => {
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const handleKick = () => {
    if (!kickTarget) return
    socketRef.current?.emit('admin-action-kick', { socketId: kickTarget })
    setClients((prev) => prev.filter((c) => c.id !== kickTarget))
    setKickTarget(null)
  }

  const handleBroadcast = (e) => {
    e.preventDefault()
    const msg = broadcastMsg.trim()
    if (!msg) return
    socketRef.current?.emit('admin-action-broadcast', { message: msg })
    setBroadcastMsg('')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Connection Status Bar */}
      <header className="sticky top-0 z-40 bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              B
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">BeCare Admin</h1>
              <p className="text-xs text-gray-400">Socket.IO Server Monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/50">
              <span
                className={`relative flex h-3 w-3 ${
                  isConnected ? '' : ''
                }`}
              >
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              </span>
              <span
                className={`text-sm font-bold ${
                  isConnected ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <span className="hidden sm:inline text-xs text-gray-500 font-mono">
              {SERVER_URL}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-primary-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-400">Total Live Sockets</span>
              <div className="w-10 h-10 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400 text-xl">
                🔌
              </div>
            </div>
            <p className="text-4xl font-extrabold text-white">
              {metrics.totalSockets}
            </p>
            <p className="text-xs text-gray-500 mt-1">Currently connected clients</p>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-accent-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-400">Active Rooms</span>
              <div className="w-10 h-10 rounded-lg bg-accent-500/15 flex items-center justify-center text-accent-400 text-xl">
                🚪
              </div>
            </div>
            <p className="text-4xl font-extrabold text-white">
              {metrics.activeRooms}
            </p>
            <p className="text-xs text-gray-500 mt-1">Rooms with active connections</p>
          </div>
        </div>

        {/* Main Content: Table + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Control Center Table */}
          <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="font-bold text-white">Client Control Center</h2>
              <span className="text-xs font-bold text-gray-400 bg-slate-700 px-3 py-1 rounded-full">
                {clients.length} connected
              </span>
            </div>

            {clients.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <p className="text-gray-500 text-sm">
                  {isConnected
                    ? 'No clients currently connected'
                    : 'Waiting for server connection...'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-750 border-b border-slate-700 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="text-right px-5 py-3 font-bold">Socket ID</th>
                      <th className="text-right px-5 py-3 font-bold">Transport</th>
                      <th className="text-right px-5 py-3 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-primary-400 text-xs">
                            {client.id}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                              client.transport === 'websocket'
                                ? 'bg-green-500/15 text-green-400'
                                : 'bg-yellow-500/15 text-yellow-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                client.transport === 'websocket'
                                  ? 'bg-green-400'
                                  : 'bg-yellow-400'
                              }`}
                            />
                            {client.transport || 'polling'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setKickTarget(client.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 font-bold text-xs transition-all duration-200 active:scale-95"
                          >
                            Disconnect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* System Alert Broadcast Panel */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
            <h2 className="font-bold text-white mb-1">System Alert Broadcast</h2>
            <p className="text-xs text-gray-400 mb-4">
              Send a global banner message to all connected clients
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">
                  Alert Message
                </label>
                <textarea
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  rows={5}
                  placeholder="Type your broadcast message here..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border-2 border-slate-600 text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!broadcastMsg.trim() || !isConnected}
                className="w-full py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-gray-900 font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                Emit Global Banner
              </button>
            </form>

            {!isConnected && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-xs text-red-400 font-bold">
                  Server not connected — broadcasting is disabled
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kick Confirmation Modal */}
      {kickTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setKickTarget(null)}
          />
          <div className="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center text-2xl flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">Confirm Disconnection</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Are you sure you want to forcefully disconnect this client?
                </p>
                <p className="text-xs font-mono text-primary-400 mt-2 bg-slate-900 rounded-lg px-3 py-2 break-all">
                  {kickTarget}
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setKickTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-gray-200 font-bold text-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleKick}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all duration-200 active:scale-95"
              >
                Force Kick
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
