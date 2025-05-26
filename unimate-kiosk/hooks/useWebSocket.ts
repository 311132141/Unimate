import { useEffect, useState, useRef, useCallback } from 'react';
import { WebSocketMessage, LoginResponse } from '@/lib/types';
import { siteConfig } from '@/config/site';
import { AuthService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketLog {
  timestamp: Date;
  type: 'sent' | 'received' | 'info' | 'error';
  message: string;
}

export const useWebSocket = () => {
  const router = useRouter();
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [logs, setLogs] = useState<WebSocketLog[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 2;

  const addLog = useCallback((type: WebSocketLog['type'], message: string) => {
    setLogs(prev => [...prev, {
      timestamp: new Date(),
      type,
      message
    }]);
  }, []);

  const connect = useCallback(() => {
    const kioskId = siteConfig.kioskId;
    const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? siteConfig.wsHost
      : '192.168.20.22';
    const wsUrl = `ws://${host}:${siteConfig.wsPort}/ws/kiosk/${kioskId}/`;

    console.log("Connecting to WebSocket at:", wsUrl);
    addLog('info', `Connecting to ${wsUrl}`);

    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("%cWebSocket connection established successfully", "color: green; font-weight: bold");
      setStatus('connected');
      reconnectAttemptsRef.current = 0;
      addLog('info', 'Connection established successfully');

      const registerMsg = JSON.stringify({
        type: 'register_kiosk',
        kiosk_id: kioskId
      });
      ws.send(registerMsg);
      addLog('sent', registerMsg);
    };

    ws.onmessage = (event) => {
      console.log("%cWebSocket message received:", "color: blue; font-weight: bold", event.data);
      addLog('received', event.data);

      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        if (data.type === "user.login" && data.message) {
          console.log("%cLogin event detected", "color: green; font-weight: bold");
          AuthService.handleCardScanLogin(data.message as LoginResponse);
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        addLog('error', `Error parsing message: ${error}`);
      }
    };

    ws.onerror = (error) => {
      console.warn("WebSocket error:", error);
      setStatus('error');
      addLog('error', 'WebSocket connection failed - RFID features disabled');
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setStatus('disconnected');
      wsRef.current = null;

      reconnectAttemptsRef.current++;
      if (reconnectAttemptsRef.current <= maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        console.log(`Reconnecting in ${delay / 1000}s (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
        setTimeout(connect, delay);
      } else {
        console.log("WebSocket unavailable - RFID features disabled");
        addLog('info', 'RFID Offline (Local Mode)');
      }
    };
  }, [router, addLog]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const msgStr = JSON.stringify(message);
      wsRef.current.send(msgStr);
      addLog('sent', msgStr);
    } else {
      addLog('error', 'WebSocket not connected');
    }
  }, [addLog]);

  const simulateCardScan = useCallback(() => {
    const mockLoginData: WebSocketMessage = {
      type: 'user.login',
      message: {
        access: `mock_access_token_${Math.random()}`,
        refresh: `mock_refresh_token_${Math.random()}`,
        user: {
          id: 8,
          username: "john",
          events: []
        }
      }
    };

    addLog('info', 'Simulating card scan...');
    AuthService.handleCardScanLogin(mockLoginData.message as LoginResponse);
    router.push('/dashboard');
  }, [router, addLog]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    status,
    logs,
    sendMessage,
    simulateCardScan,
    clearLogs: () => setLogs([])
  };
};
  const reconnectAttemptsRef = useRef(0);

  // Update refs when props change
  useEffect(() => {
    shouldReconnectRef.current = shouldReconnect;
  }, [shouldReconnect]);

  const connect = useCallback(() => {
    if (state.socket?.readyState === WebSocket.OPEN || state.isConnecting) {
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const ws = new WebSocket(url, protocols);

      ws.onopen = (event) => {
        console.log('WebSocket connected');
        reconnectAttemptsRef.current = 0;
        setState(prev => ({
          ...prev,
          socket: ws,
          readyState: ws.readyState,
          isConnected: true,
          isConnecting: false,
          error: null,
          reconnectAttempts: 0,
        }));
        onOpen?.(event);
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          setState(prev => ({
            ...prev,
            lastMessage: data,
          }));
          onMessage?.(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setState(prev => ({
          ...prev,
          error: event,
          isConnecting: false,
        }));
        onError?.(event);
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setState(prev => ({
          ...prev,
          socket: null,
          readyState: WebSocket.CLOSED,
          isConnected: false,
          isConnecting: false,
        }));

        onClose?.(event);

        // Attempt to reconnect if enabled and under max attempts
        if (
          shouldReconnectRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts &&
          !event.wasClean
        ) {
          reconnectAttemptsRef.current += 1;
          setState(prev => ({
            ...prev,
            reconnectAttempts: reconnectAttemptsRef.current,
          }));

          console.log(
            `Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      setState(prev => ({ ...prev, socket: ws }));
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error as Event,
      }));
    }
  }, [url, protocols, onOpen, onMessage, onError, onClose, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (state.socket) {
      state.socket.close(1000, 'Manual disconnect');
    }
  }, [state.socket]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (state.socket?.readyState === WebSocket.OPEN) {
      try {
        state.socket.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    }
    console.warn('WebSocket is not open. Message not sent:', message);
    return false;
  }, [state.socket]);

  const forceReconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    shouldReconnectRef.current = true;
    disconnect();
    setTimeout(connect, 100);
  }, [connect, disconnect]);

  // Connect on mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (state.socket) {
        state.socket.close(1000, 'Component unmount');
      }
    };
  }, []);

  // Update ready state when socket changes
  useEffect(() => {
    if (state.socket) {
      setState(prev => ({
        ...prev,
        readyState: state.socket!.readyState,
      }));
    }
  }, [state.socket]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    forceReconnect,
  };
};
