import { Event } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Calendar,
  Building,
  Info,
  X
} from 'lucide-react';

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  if (!event) return null;

  const formatDateTime = (timeString: string) => {
    const date = new Date(timeString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const getDuration = () => {
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-100 text-blue-800';
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'event':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isCurrentlyActive = () => {
    const now = new Date();
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    return now >= start && now <= end;
  };

  const startDateTime = formatDateTime(event.start_time);
  const endDateTime = formatDateTime(event.end_time);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
                {event.title}
              </DialogTitle>
              {event.course && (
                <p className="text-base text-gray-600">
                  {event.course.code} - {event.course.name}
                </p>
              )}
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className="flex space-x-2">
                <Badge className={getEventTypeColor(event.event_type)}>
                  {event.event_type}
                </Badge>
                {event.is_urgent && (
                  <Badge variant="destructive">
                    Urgent
                  </Badge>
                )}
                {isCurrentlyActive() && (
                  <Badge className="bg-green-100 text-green-800">
                    Live Now
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Time Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
              <Clock className="w-5 h-5 mr-2" />
              Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700">Start</div>
                <div className="text-base text-gray-900">{startDateTime.time}</div>
                <div className="text-sm text-gray-600">{startDateTime.date}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700">End</div>
                <div className="text-base text-gray-900">{endDateTime.time}</div>
                <div className="text-sm text-gray-600">{endDateTime.date}</div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Duration: {getDuration()}
                </span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          {event.room && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-base text-gray-900">
                    {event.room.building}
                  </span>
                </div>
                
                <div className="text-lg font-semibold text-blue-700">
                  Room {event.room.number}
                </div>
              </div>
            </div>
          )}

          {/* Instructor Information */}
          {event.lecturer && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <User className="w-5 h-5 mr-2" />
                Instructor
              </h3>
              
              <div className="text-base text-gray-900">
                {event.lecturer}
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <Info className="w-5 h-5 mr-2" />
                Description
              </h3>
              
              <div className="text-base text-gray-900 leading-relaxed">
                {event.description}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
              <BookOpen className="w-5 h-5 mr-2" />
              Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Event ID:</span>
                <span className="ml-2 text-gray-900">#{event.id}</span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-900 capitalize">{event.event_type}</span>
              </div>
              
              {event.course && (
                <div>
                  <span className="font-medium text-gray-700">Course Code:</span>
                  <span className="ml-2 text-gray-900">{event.course.code}</span>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 text-gray-900">
                  {isCurrentlyActive() ? 'In Progress' : 'Scheduled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {event.room && (
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Show on Map
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
