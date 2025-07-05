import { SupabasePostsInterface } from '@/types/db'
import { transformDate } from '@/utils/transformutils'

import PostDetail from '@/components/PostDetail/PostDetail'
import { notFound } from 'next/navigation'

export const PostContainer = async (params: {id: string}) => {
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
  const { id } = await params;
  
  const form = [
    ['year',    '%'],
    ['month',   '.%'],
    ['date',    '.%'],
    ['hours',   ' %:'],
    ['minutes', '%:'],
    ['seconds', '%']
  ]

  interface PostInterface {
    id? : string,
    title : string,
    content : string,
    created_at : string,
    updated_at? : string,
    user_email? : string,
    tag? : string[],
    category? : string,
    view_count? : string
}

  let post: PostInterface | null = null;

  try {
    const alist = await fetch(`${hostUrl}/api/post?id=${id}`);
    
    if (alist.ok) {
      const data = await alist.json();
      if (data && data.length > 0) {
        post = data.map((post: SupabasePostsInterface) => ({
          ...post,
          created_at: transformDate(post.created_at, form)
        }))[0];
      }
    }
  } catch (error) { 
    console.error('포스트 가져오기 중 오류:', error);
  }
  if (!post) {
    notFound();
  }
  
  return (
    <PostDetail post={post as PostInterface} />
  )
}
