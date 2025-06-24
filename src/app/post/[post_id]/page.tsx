import React from 'react'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { PostContainer } from '@/containers/PostContainer/PostContainer'
const page = async ( {params}: {params: {post_id: String}} ) => {
  const { post_id } = await params
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
  
  const view = await fetch(`http://${hostUrl}/api/posts/${post_id}/view`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const viewData = await view.json()
  console.log(viewData)
  
  return (
    <ThreeColumnLayout
      center={
        <PostContainer id={post_id}></PostContainer>
      }
    />
  )
}

export default page