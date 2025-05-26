import { useState, useEffect } from 'react';
import { WebSocketMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  Send, 
  Trash2, 
  Activity,
  MessageCircle,
  CreditCard,
  AlertCircle
} from 'lucide-react';

interface WebSocketPanelProps {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  onSendMessage: (message: WebSocketMessage) => boolean;
  onReconnect: () => void;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

export function WebSocketPanel({
  isConnected,
  lastMessage,
  onSendMessage,
  onReconnect,
  reconnectAttempts,
  maxReconnectAttempts
}: WebSocketPanelProps) {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [testMessage, setTestMessage] = useState('');
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  // Add new messages to the list
  useEffect(() => {
    if (lastMessage) {
      setMessages(prev => [...prev, { ...lastMessage, timestamp: new Date().toISOString() }].slice(-50)); // Keep last 50 messages
    }
  }, [lastMessage]);

  const handleSendTestMessage = () => {
    if (!testMessage.trim()) return;

    const message: WebSocketMessage = {
      type: 'test',
      message: testMessage,
      timestamp: new Date().toISOString()
    };

    const sent = onSendMessage(message);
    if (sent) {
      setTestMessage('');
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'card_scan':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'system':
        return <Activity className="w-4 h-4 text-green-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'card_scan':
        return 'border-blue-200 bg-blue-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'system':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            {isConnected ? (
              <Wifi className="w-5 h-5 mr-2 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 mr-2 text-red-500" />
            )}
            WebSocket Connection
          </h3>
          
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            
            {!isConnected && reconnectAttempts < maxReconnectAttempts && (
              <Button variant="outline" size="sm" onClick={onReconnect}>
                Reconnect
              </Button>
            )}
          </div>
        </div>
        
        {!isConnected && (
          <div className="mt-2 text-sm text-red-600">
            {reconnectAttempts >= maxReconnectAttempts 
              ? 'Maximum reconnection attempts reached' 
              : `Reconnecting... Attempt ${reconnectAttempts}/${maxReconnectAttempts}`
            }
          </div>
        )}
      </div>

      {/* Test Message Form */}
      {isConnected && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex space-x-2">
            <Input
              placeholder="Send test message..."
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendTestMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendTestMessage}
              disabled={!testMessage.trim()}
              size="sm"
            >
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-80 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">
              Recent Messages ({messages.length})
            </h4>
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearMessages}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages received yet</p>
              <p className="text-xs mt-1">Messages will appear here when the kiosk receives data</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all ${getMessageColor(message.type)}`}
                >
                  <div className="flex items-start space-x-2">
                    {getMessageIcon(message.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {message.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp && formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      
                      {typeof message.message === 'string' ? (
                        <p className="text-sm text-gray-700 mt-1">
                          {message.message}
                        </p>
                      ) : (
                        <div className="mt-2">
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => setExpandedMessage(
                              expandedMessage === `${index}` ? null : `${index}`
                            )}
                            className="p-0 h-auto text-xs text-blue-600"
                          >
                            {expandedMessage === `${index}` ? 'Hide' : 'Show'} Details
                          </Button>
                          
                          {expandedMessage === `${index}` && (
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(message.message, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                      
                      {message.kiosk_id && (
                        <div className="text-xs text-gray-500 mt-1">
                          Kiosk ID: {message.kiosk_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
