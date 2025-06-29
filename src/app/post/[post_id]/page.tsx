import React from 'react'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { PostContainer } from '@/containers/PostContainer/PostContainer'

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