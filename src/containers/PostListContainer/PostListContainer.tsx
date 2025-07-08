import Post from "@/components/Post/Post"

import { PostInterface } from '@/types/types';
import { SupabasePostsInterface } from '@/types/db';

const PostListContainer = async ({isAdmin=false, searchParams}:{isAdmin?:boolean, searchParams?: { [key: string]: string | string[] | undefined }}) => {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL 
    
    let posts: PostInterface[] = [];
    
    const params = new URLSearchParams();
    params.append('private', 'false');

    if (searchParams?.category) {
        let category = searchParams?.category as string
        params.append('category', category.split("_")[1] as string);
    }



    if (searchParams?.tag) {
        params.append('tag', searchParams.tag as string);
    }

    try {
        const response = await fetch(`${hostUrl}/api/posts?${params.toString()}`, {
            next: { revalidate: 60 }
        });
        
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
        <div style={{width: '100%'}}>
            {
            posts.length === 0 ? 
            <div style={{fontSize: "30px", justifySelf: "anchor-center", marginTop: "30px"}}>게시글이 없습니다.</div> : 
            posts.map((post: PostInterface) => (
                <Post {...post} key={String(post.id)} isAdmin={isAdmin}></Post>
            ))
            }
        </div>
    )
}

export default PostListContainer