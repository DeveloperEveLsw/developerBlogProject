export interface SupabasePostsInterface {
    id: number,
    title: string,
    content: string,
<<<<<<< HEAD
    category: Number,
    tag: Number[],
    created_at: string,
    updated_at: string,
    user_email: string,
=======
    category: number,
    tag: number[],
    created_at: string,
    updated_at: string,
    user_email: string,
    view_count: number,
>>>>>>> origin/heads/origin/master
    is_public: boolean
}