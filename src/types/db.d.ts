export interface SupabasePostsInterface {
    id: number,
    title: string,
    content: string,
    category: number,
    tag: number[],
    created_at: string,
    updated_at: string,
    user_email: string,
    view_count: number,
    is_public: boolean
}