import React from 'react'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { PostContainer } from '@/containers/PostContainer/PostContainer'
import { SupabasePostsInterface } from '@/types/db'
import ViewCounter from '@/components/ViewCounter/ViewCounter'


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
  
  return (
    <>
      <ThreeColumnLayout
        center={
          <PostContainer id={post_id}></PostContainer>
        }
        centerMaxWidth={850}
      />
      <ViewCounter postId={post_id} />
    </>
  )
}

export default page