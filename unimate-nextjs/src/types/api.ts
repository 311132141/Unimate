// API response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Auth types
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user: {
        id: string;
        username: string;
        email?: string;
        first_name?: string;
        last_name?: string;
    };
}

export interface RFIDScanRequest {
    rfid_uid: string;
}

// Error types
export interface ApiError {
    message: string;
    code?: string;
    field?: string;
}
