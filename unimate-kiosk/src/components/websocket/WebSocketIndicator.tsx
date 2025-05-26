import { Wifi, WifiOff, Activity, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WebSocketIndicatorProps {
  isConnected: boolean;
  isConnecting?: boolean;
  reconnectAttempts?: number;
  maxReconnectAttempts?: number;
  lastMessageTime?: Date;
  className?: string;
}

export function WebSocketIndicator({
  isConnected,
  isConnecting = false,
  reconnectAttempts = 0,
  maxReconnectAttempts = 5,
  lastMessageTime,
  className = ''
}: WebSocketIndicatorProps) {
  const getStatusColor = () => {
    if (isConnecting) return 'text-yellow-500';
    if (isConnected) return 'text-green-500';
    return 'text-red-500';
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    if (reconnectAttempts >= maxReconnectAttempts) return 'Connection Failed';
    if (reconnectAttempts > 0) return `Reconnecting (${reconnectAttempts}/${maxReconnectAttempts})`;
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (isConnecting) {
      return <Activity className={`w-4 h-4 animate-pulse ${getStatusColor()}`} />;
    }
    if (isConnected) {
      return <Wifi className={`w-4 h-4 ${getStatusColor()}`} />;
    }
    if (reconnectAttempts >= maxReconnectAttempts) {
      return <AlertCircle className={`w-4 h-4 ${getStatusColor()}`} />;
    }
    return <WifiOff className={`w-4 h-4 ${getStatusColor()}`} />;
  };

  const getLastMessageText = () => {
    if (!lastMessageTime) return null;
    
    const now = new Date();
    const diffMs = now.getTime() - lastMessageTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else {
      return lastMessageTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getStatusIcon()}
      
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        
        {lastMessageTime && isConnected && (
          <span className="text-xs text-gray-500">
            Last message: {getLastMessageText()}
          </span>
        )}
        
        {!isConnected && reconnectAttempts > 0 && reconnectAttempts < maxReconnectAttempts && (
          <span className="text-xs text-yellow-600">
            Retrying connection...
          </span>
        )}
      </div>
      
      <Badge 
        variant={isConnected ? "default" : isConnecting ? "secondary" : "destructive"}
        className="text-xs"
      >
        {isConnected ? 'ONLINE' : isConnecting ? 'CONNECTING' : 'OFFLINE'}
      </Badge>
    </div>
  );
}
