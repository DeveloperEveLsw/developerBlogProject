export interface SupabasePostsInterface {
    id: Number,
    title: string,
    content: string,
    category: Number,
    tag: Number[],
    created_at: string,
    updated_at: string,
    user_email: string,
    is_public: boolean
}