import { useEffect, useRef, useState } from 'react'

interface WebSocketMessage {
  type: string
  message: any
}

interface UseWebSocketOptions {
  onMessage?: (data: WebSocketMessage) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  reconnectInterval?: number
  enabled?: boolean
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 5000,
    enabled = true
  } = options

  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeoutId = useRef<NodeJS.Timeout | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const connect = () => {
    if (!enabled || ws.current?.readyState === WebSocket.OPEN) return

    try {
      // Only attempt WebSocket in production or when specifically enabled
      if (typeof window !== 'undefined') {
        const { hostname } = window.location
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          console.log('Development mode - skipping WebSocket initialization')
          return
        }
      }

      console.log('Attempting WebSocket connection...')
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        console.log('WebSocket connection established')
        setIsConnected(true)
        setConnectionError(null)
        onOpen?.()
      }

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('WebSocket message received:', data)
          onMessage?.(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.current.onclose = () => {
        console.log('WebSocket connection closed')
        setIsConnected(false)
        onClose?.()
        
        // Attempt to reconnect after delay
        if (enabled) {
          console.log(`Will retry WebSocket connection in ${reconnectInterval}ms`)
          reconnectTimeoutId.current = setTimeout(connect, reconnectInterval)
        }
      }

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionError('WebSocket connection failed')
        setIsConnected(false)
        onError?.(error)
        ws.current = null // Clear the WebSocket object on error
      }
    } catch (error) {
      console.log('Failed to initialize WebSocket, continuing with REST API only:', error)
      setConnectionError('Failed to initialize WebSocket')
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutId.current) {
      clearTimeout(reconnectTimeoutId.current)
      reconnectTimeoutId.current = null
    }
    
    if (ws.current) {
      ws.current.close()
      ws.current = null
    }
    setIsConnected(false)
  }

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
      return true
    }
    console.warn('WebSocket is not connected, cannot send message')
    return false
  }

  useEffect(() => {
    if (enabled) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [url, enabled])

  return {
    isConnected,
    connectionError,
    sendMessage,
    connect,
    disconnect
  }
}