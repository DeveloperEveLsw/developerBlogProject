
import Post from "@/components/Post/Post"

import { PostInterface } from '@/types/types';
import { SupabasePostsInterface } from '@/types/db';

const PostListContainer = async ({isAdmin=false}:{isAdmin?:boolean}) => {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL 
    
    const response = await fetch(`http://${hostUrl}/api/posts`).then( (res)=> res.json() )
    const posts = await response.map( (post: SupabasePostsInterface)=> ({
      ...post,
      id: String(post.id),  
      category: post.category || '',
      created_at: new Date(post.created_at),
      updated_at: new Date(post.updated_at)
    })
  )
  return (
    <div>
        {posts.map( (post: PostInterface)=> (
            <Post {...post} key={String(post.id)} isAdmin={isAdmin}></Post>
        )
        )}
        
    </div>
  )
}

export default PostListContainer