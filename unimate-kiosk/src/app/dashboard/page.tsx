'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { EventItem } from '@/components/events/EventItem';
import { EventDetailsModal } from '@/components/events/EventDetailsModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { MapContainer } from '@/components/map/MapContainer';
import { WebSocketPanel } from '@/components/websocket/WebSocketPanel';
import { WebSocketIndicator } from '@/components/websocket/WebSocketIndicator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Settings, 
  LogIn,
  RefreshCw,
  Clock,
  AlertCircle
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function Dashboard() {
  // Authentication state
  const { isAuthenticated, user, login, logout, isLoading, error, clearError } = useAuth();
  
  // WebSocket connection
  const {
    isConnected: wsConnected,
    lastMessage,
    sendMessage,
    forceReconnect,
    reconnectAttempts,
  } = useWebSocket({
    onMessage: (message) => {
      console.log('WebSocket message received:', message);
      
      // Handle card scan messages
      if (message.type === 'card_scan' && message.message) {
        setLastScannedCard(message.message);
        if (!isAuthenticated) {
          setIsLoginModalOpen(true);
        }
      }
    }
  });

  // UI state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [lastScannedCard, setLastScannedCard] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('events');

  // Sample events (in a real app, this would come from an API)
  const [events] = useState<Event[]>([
    {
      id: 1,
      title: 'Computer Science Fundamentals',
      event_type: 'class',
      course: {
        code: 'CS101',
        name: 'Introduction to Computer Science'
      },
      room: {
        building: 'Engineering Building',
        number: '201'
      },
      start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      lecturer: 'Dr. Sarah Johnson',
      description: 'Introduction to programming concepts and problem-solving techniques.',
      is_urgent: false
    },
    {
      id: 2,
      title: 'Mathematics Exam',
      event_type: 'exam',
      course: {
        code: 'MATH201',
        name: 'Calculus II'
      },
      room: {
        building: 'Science Building',
        number: 'Hall A'
      },
      start_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
      end_time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
      lecturer: 'Prof. Michael Chen',
      description: 'Final examination covering integration and series.',
      is_urgent: true
    },
    {
      id: 3,
      title: 'Student Orientation',
      event_type: 'event',
      room: {
        building: 'Student Center',
        number: 'Main Hall'
      },
      start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago (ongoing)
      end_time: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // 1.5 hours from now
      description: 'Welcome session for new students including campus tour and resources overview.',
      is_urgent: false
    }
  ]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Auto-logout timer
  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setTimeout(() => {
      logout();
    }, siteConfig.kiosk.autoLogoutTime);

    return () => clearTimeout(timer);
  }, [isAuthenticated, logout]);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      clearError();
      await login(credentials);
      setIsLoginModalOpen(false);
      setLastScannedCard('');
    } catch (error) {
      // Error is handled by the useAuth hook
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setActiveTab('events');
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const getUserEvents = () => {
    if (!user) return events;
    return user.events.length > 0 ? user.events : events;
  };

  const filteredEvents = getUserEvents();
  const upcomingEvents = filteredEvents.filter(event => new Date(event.start_time) > currentTime);
  const ongoingEvents = filteredEvents.filter(event => {
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    return currentTime >= start && currentTime <= end;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header 
        user={user} 
        onLogout={handleLogout}
        isConnected={wsConnected}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isConnected={wsConnected} 
          lastUpdate={lastMessage ? new Date(lastMessage.timestamp || '') : undefined}
        >
          <div className="p-4">
            <WebSocketIndicator
              isConnected={wsConnected}
              reconnectAttempts={reconnectAttempts}
              maxReconnectAttempts={5}
              lastMessageTime={lastMessage ? new Date(lastMessage.timestamp || '') : undefined}
            />
          </div>
        </Sidebar>

        {/* Main Dashboard */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {isAuthenticated ? `Welcome, ${user?.username}` : 'Unimate Kiosk'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} • {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                {!isAuthenticated && (
                  <Button onClick={() => setIsLoginModalOpen(true)} size="lg">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>

              {/* Status Bar */}
              <div className="mt-4 flex items-center space-x-4">
                {ongoingEvents.length > 0 && (
                  <Badge variant="default" className="bg-green-600">
                    <Clock className="w-3 h-3 mr-1" />
                    {ongoingEvents.length} ongoing
                  </Badge>
                )}
                
                {upcomingEvents.length > 0 && (
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {upcomingEvents.length} upcoming
                  </Badge>
                )}

                {!wsConnected && (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="events">
                  <Calendar className="w-4 h-4 mr-2" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="map">
                  <MapPin className="w-4 h-4 mr-2" />
                  Map
                </TabsTrigger>
                <TabsTrigger value="websocket">
                  <Settings className="w-4 h-4 mr-2" />
                  System
                </TabsTrigger>
                <TabsTrigger value="info">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Info
                </TabsTrigger>
              </TabsList>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-6">
                {/* Ongoing Events */}
                {ongoingEvents.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Happening Now
                    </h2>
                    <div className="grid gap-4">
                      {ongoingEvents.map((event) => (
                        <EventItem
                          key={event.id}
                          event={event}
                          onViewDetails={handleEventSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Events */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Upcoming Events
                  </h2>
                  {upcomingEvents.length > 0 ? (
                    <div className="grid gap-4">
                      {upcomingEvents.map((event) => (
                        <EventItem
                          key={event.id}
                          event={event}
                          onViewDetails={handleEventSelect}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No upcoming events
                      </h3>
                      <p className="text-gray-600">
                        {isAuthenticated 
                          ? 'Your schedule is clear for now.' 
                          : 'Login to view your personal schedule.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Map Tab */}
              <TabsContent value="map">
                <MapContainer
                  events={filteredEvents}
                  selectedEvent={selectedEvent}
                  onEventSelect={handleEventSelect}
                />
              </TabsContent>

              {/* WebSocket Tab */}
              <TabsContent value="websocket">
                <WebSocketPanel
                  isConnected={wsConnected}
                  lastMessage={lastMessage}
                  onSendMessage={sendMessage}
                  onReconnect={forceReconnect}
                  reconnectAttempts={reconnectAttempts}
                  maxReconnectAttempts={5}
                />
              </TabsContent>

              {/* Info Tab */}
              <TabsContent value="info">
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Kiosk Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">System Details</h3>
                      <div className="space-y-2 text-sm">
                        <div>Location: {siteConfig.kiosk.location}</div>
                        <div>Kiosk ID: {siteConfig.kiosk.id}</div>
                        <div>Version: {siteConfig.version}</div>
                        <div>Status: {wsConnected ? 'Online' : 'Offline'}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Quick Help</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>• Scan your student card to login</div>
                        <div>• Tap any event to view details</div>
                        <div>• Use the map to find room locations</div>
                        <div>• Contact IT support for assistance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        isLoading={isLoading}
        error={error}
        lastScannedCard={lastScannedCard}
      />

      <EventDetailsModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
      />
    </div>
  );
}
