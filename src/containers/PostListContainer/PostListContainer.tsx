
import Post from "@/components/Post/Post"

import { PostInterface } from '@/types/types';
import { SupabasePostsInterface } from '@/types/db';

const PostListContainer = async () => {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL 
    
    const response = await fetch(`http://${hostUrl}/api/posts?is_public=true`).then( (res)=> res.json() ).then( (data)=> {  console.log("data"); console.log(data); return data })
    const posts = response.map( (post: SupabasePostsInterface)=> ({
      ...post,
      id: String(post.id),  
      category: post.category || '',
      created_at: new Date(post.created_at),
      updated_at: new Date(post.updated_at),
      view: post.view_count
    })
  )

  return (
    <div>
        {posts.map( (post: PostInterface)=> (
            <Post {...post} key={String(post.id)}></Post>
        )
        )}
        
    </div>
  )
}

export default PostListContainer