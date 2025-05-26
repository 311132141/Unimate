export const siteConfig = {
  name: "Unimate Kiosk",
  description: "Interactive university information kiosk system",
  version: "1.0.0",
  
  // WebSocket configuration for useWebSocket hook
  kioskId: process.env.NEXT_PUBLIC_KIOSK_ID || "kiosk-001",
  wsHost: "localhost",
  wsPort: "8000",
  
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    endpoints: {
      auth: "/api/auth",
      events: "/api/events",
      users: "/api/users",
    }
  },
  
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/kiosk",
    reconnectInterval: 5000,
    maxReconnectAttempts: 3,
  },
  
  kiosk: {
    id: process.env.NEXT_PUBLIC_KIOSK_ID || "kiosk-001",
    location: process.env.NEXT_PUBLIC_KIOSK_LOCATION || "Main Campus",
    timeoutMinutes: 30,
    autoRefresh: true,
  },
  
  ui: {
    theme: "default",
    touchMode: true,
  }
};
    }
  },
  
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/kiosk",
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  },
  
  kiosk: {
    id: process.env.NEXT_PUBLIC_KIOSK_ID || "kiosk-001",
    location: process.env.NEXT_PUBLIC_KIOSK_LOCATION || "Main Campus",
    autoLogoutTime: 300000, // 5 minutes
  },
  
  ui: {
    theme: {
      primary: "hsl(222.2 84% 4.9%)",
      secondary: "hsl(210 40% 98%)",
      accent: "hsl(210 40% 96%)",
    }
  }
};

export type SiteConfig = typeof siteConfig;
