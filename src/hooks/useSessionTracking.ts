import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { connectSocket, disconnectSocket, emitStepChanged } from '../services/socket'

const ROUTE_WHITELIST = [
  '/',
  '/vehicle-form',
  '/customer-form',
  '/verify',
  '/offers',
  '/offer-details',
  '/payment',
  '/admin-approval',
  '/payment-result',
  '/privacy',
  '/terms',
  '/cookies',
] as const

export function useSessionTracking() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const socket = connectSocket()
    if (!socket) return

    return () => {
      disconnectSocket()
    }
  }, [])

  useEffect(() => {
    emitStepChanged(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    const socket = connectSocket()
    if (!socket) return

    const handleAdminNavigate = (payload: { route?: string }) => {
      const route = payload?.route
      if (!route || !ROUTE_WHITELIST.includes(route as (typeof ROUTE_WHITELIST)[number])) {
        return
      }
      navigate(route)
    }

    socket.on('admin:navigate', handleAdminNavigate)

    return () => {
      socket.off('admin:navigate', handleAdminNavigate)
    }
  }, [navigate])
}
