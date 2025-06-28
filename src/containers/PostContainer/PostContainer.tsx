import { SupabasePostsInterface } from '@/types/db'
import { transformDate } from '@/utils/transformutils'

import PostDetail from '@/components/PostDetail/PostDetail'

export const PostContainer = async (params:any) => {

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
    view? : number
}

  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
  let post: PostInterface = {
    title: '포스트를 불러올 수 없습니다',
    content: '포스트를 불러오는 중 오류가 발생했습니다.',
    created_at: '날짜 없음'
  };
  
  try {
    const alist = await fetch(`${hostUrl}/api/post?id=${params.id}`);
    
    if (alist.ok) {
      const data = await alist.json();
      if (data && data.length > 0) {
        post = data.map((post: SupabasePostsInterface) => ({
          ...post,
          created_at: transformDate(post.created_at, form)
        }))[0];
      }
    } else {
      console.error('포스트 가져오기 실패:', alist.status, alist.statusText);
    }
  } catch (error) {
    console.error('포스트 가져오기 중 오류:', error);
  }
  
  return (
    <PostDetail post={post} />
  )
}
