// Basic type definitions for the application

export interface User {
    id: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role: 'student' | 'staff' | 'admin';
}

export interface Course {
    id: string;
    code: string;
    name: string;
    description?: string;
    credits?: number;
}

export interface Room {
    id: string;
    building: string;
    number: string;
    capacity?: number;
    features?: string[];
}

export interface Event {
    id: string;
    title: string;
    event_type: 'class' | 'exam' | 'meeting' | 'other';
    course?: Course;
    room?: Room;
    start_time: string;
    end_time: string;
    lecturer?: string;
    description?: string;
    is_urgent?: boolean;
}

export interface Building {
    id: string;
    name: string;
    x: number;
    z: number;
    width: number;
    depth: number;
    height: number;
    color: number;
    style?: 'modern' | 'classic' | 'complex' | 'residential';
    floors?: Floor[];
}

export interface Floor {
    index: number;
    rooms: RoomModel[];
}

export interface RoomModel {
    name: string;
    x: number;
    z: number;
    width: number;
    depth: number;
    color: number;
}

export interface Position {
    x: number;
    y?: number;
    z: number;
}

export interface Route {
    id: string;
    from: Position;
    to: Position;
    path: Position[];
    distance: number;
    estimatedTime: number;
}
