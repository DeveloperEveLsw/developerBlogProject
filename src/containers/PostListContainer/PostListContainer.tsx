import Post from "@/components/Post/Post"

import { PostInterface } from '@/types/types';
import { SupabasePostsInterface } from '@/types/db';

const PostListContainer = async ({isAdmin=false}:{isAdmin?:boolean}) => {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL 
    
    let posts: PostInterface[] = [];
    
    try {
        const response = await fetch(`${hostUrl}/api/posts?is_public=true`);
        
        if (response.ok) {
            const data = await response.json();
            posts = data.map((post: SupabasePostsInterface) => ({
                ...post,
                id: String(post.id),  
                category: post.category || '',
                created_at: new Date(post.created_at),
                updated_at: new Date(post.updated_at),
                view: post.view_count
            }));
        } else {
            console.error('포스트 목록 가져오기 실패:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('포스트 목록 가져오기 중 오류:', error);
    }
    
    return (
        <div>
            {posts.map((post: PostInterface) => (
                <Post {...post} key={String(post.id)} isAdmin={isAdmin}></Post>
            ))}
        </div>
    )
}

export default PostListContainer