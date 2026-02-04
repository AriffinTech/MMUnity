export type Role = 'user' | 'counselor' | 'moderator' | 'admin';

export interface Profile {
    id: string;
    email: string;
    role: Role;
    full_name: string;
    counselor_id?: string;
    specialization?: string;
    phone_number?: string;
    date_of_birth?: string; // ISO date string
    points?: number;
    level?: number;
}

export interface Post {
    id: string;
    user_id: string;
    title: string;
    content: string;
    case_status: 'open' | 'pending' | 'resolved';
    created_at: string;
}

export interface MoodLog {
    id: string;
    user_id: string;
    rating: 1 | 2 | 3 | 4 | 5;
    note?: string;
    created_at: string;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export interface Report {
    id: string;
    reporter_id: string;
    post_id?: string;
    comment_id?: string;
    reason: string;
    status: 'pending' | 'reviewed' | 'resolved';
    admin_notes?: string;
    created_at: string;
}

export interface QuizResult {
    id: string;
    user_id: string;
    score: number;
    max_score: number;
    created_at: string;
}


export interface ActivityLog {
    id: string;
    actor_id: string;
    action_type: string;
    description: string;
    target_entity?: string;
    target_id?: string;
    created_at: string;
}
