import React from 'react'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { PostContainer } from '@/containers/PostContainer/PostContainer'
import { SupabasePostsInterface } from '@/types/db'


export const dynamicParams = true // or false, to 404 on unknown paths



export async function generateStaticParams() {
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
  const response = await fetch(`${hostUrl}/api/posts`)
  const data = await response.json()
  const params = data.map((post: SupabasePostsInterface) => ({
    post_id: post.id.toString()
  }))
  return params
}


const page = async ( {params}: {params: Promise<{post_id: string}>} ) => {
  const { post_id } = await params
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
  
  try {
    const view = await fetch(`${hostUrl}/api/posts/${post_id}/view`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (view.ok) {
      const viewData = await view.json();
      console.log(viewData);
    } else {
      view.status
      console.error('조회수 업데이트 실패:', view.status, view.statusText);
    }
  } catch (error) {
    console.error('조회수 업데이트 중 오류:', error);
  }
  
  return (
    <ThreeColumnLayout
      center={
        <PostContainer id={post_id}></PostContainer>
      }
      centerMaxWidth={850}
    />
  )
}

export default page