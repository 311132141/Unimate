// Type definitions for Unimate modular system

declare global {
  interface Window {
    MapManager: typeof MapManager;
    WebSocketManager: typeof WebSocketManager;
    AuthManager: typeof AuthManager;
    TimetableManager: typeof TimetableManager;
    AppManager: typeof AppManager;
    
    // Instance references
    mapManagerInstance?: MapManager;
    webSocketManagerInstance?: WebSocketManager;
    authManagerInstance?: AuthManager;
    timetableManagerInstance?: TimetableManager;
    appManagerInstance?: AppManager;
  }
}

// Module class definitions
declare class MapManager {
  scene: any;
  camera: any;
  renderer: any;
  currentRoute: any;
  
  constructor();
  init(): void;
  animate(): void;
  visualizeRoute(routeData: any): void;
  clearRoute(): void;
  fitCameraToRoute(points: any[]): void;
  handleResize(): void;
}

declare class WebSocketManager {
  ws: WebSocket | null;
  reconnectInterval: number;
  
  constructor();
  init(): void;
  handleMessage(data: any): void;
  send(message: any): void;
  close(): void;
}

declare class AuthManager {
  idleTimer: NodeJS.Timeout | null;
  idleTimeout: number;
  
  constructor();
  init(): void;
  setupEventListeners(): void;
  handleFormLogin(e: Event): Promise<void>;
  handleUserLogin(data: any): void;
  logout(): void;
  checkExistingSession(): void;
  autoLogin(token: string): Promise<void>;
  showDemoMode(): void;
  startIdleTimer(): void;
  resetIdleTimer(): void;
  getToken(): string | null;
  isAuthenticated(): boolean;
}

declare class TimetableManager {
  events: any[];
  
  constructor();
  init(): void;
  renderTimetable(events: any[]): void;
  createEventElement(event: any): HTMLElement;
  addActionButtons(container: HTMLElement): void;
  showEventDetails(event: any): void;
  getRouteToRoom(roomNumber: string): void;
  refreshTimetable(): Promise<void>;
  clearTimetable(): void;
  getEvents(): any[];
}

declare class AppManager {
  webSocketManager: WebSocketManager | null;
  mapManager: MapManager | null;
  authManager: AuthManager | null;
  timetableManager: TimetableManager | null;
  
  constructor();
  init(): void;
  setupEventListeners(): void;
  getModules(): {
    webSocket: WebSocketManager | null;
    map: MapManager | null;
    auth: AuthManager | null;
    timetable: TimetableManager | null;
  };
  destroy(): void;
}

export {};