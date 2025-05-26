'use client'

import React from 'react'
import { X, MapPin, Clock, Calendar, User, BookOpen } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Event } from '@/lib/types'

interface EventDetailsModalProps {
  event: Event | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate?: (event: Event) => void
}

export function EventDetailsModal({ 
  event, 
  open, 
  onOpenChange,
  onNavigate 
}: EventDetailsModalProps) {
  if (!event) return null

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateDuration = () => {
    const start = new Date(event.start_time)
    const end = new Date(event.end_time)
    const durationMs = end.getTime() - start.getTime()
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const handleNavigate = () => {
    if (onNavigate && event.room) {
      onNavigate(event)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-0">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {event.title || 'Event Details'}
                </h2>
                <div className="flex gap-2 mb-3">
                  <Badge 
                    variant={event.event_type === 'exam' ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {event.event_type === 'exam' ? 'EXAM' : 'CLASS'}
                  </Badge>
                  {event.is_urgent && (
                    <Badge variant="destructive" className="text-xs">
                      URGENT
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Schedule Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <Clock className="h-4 w-4" />
                  Time
                </div>
                <p className="text-sm text-gray-900">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
                <p className="text-sm text-gray-900">
                  {formatDate(event.start_time)}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
              <p className="text-sm text-gray-900">{calculateDuration()}</p>
            </div>
            
            {/* Location Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Building</h3>
                <p className="text-sm text-gray-900">
                  {event.room?.building || 'TBA'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Room</h3>
                <p className="text-sm text-gray-900">
                  {event.room?.number || 'TBA'}
                </p>
              </div>
            </div>
            
            {/* Course Information */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                <BookOpen className="h-4 w-4" />
                Course
              </div>
              <p className="text-sm text-gray-900">
                {event.course ? 
                  `${event.course.code}${event.course.name ? ` - ${event.course.name}` : ''}` : 
                  'N/A'
                }
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                <User className="h-4 w-4" />
                Lecturer
              </div>
              <p className="text-sm text-gray-900">
                {event.lecturer || 'Not specified'}
              </p>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-sm text-gray-900">
                {event.description || 
                 event.course?.description || 
                 'No additional information available.'}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              {event.room?.building && event.room?.number && (
                <Button 
                  onClick={handleNavigate}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Navigate to Room
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
