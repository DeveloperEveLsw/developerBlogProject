import React from 'react'
import { PostCenterContainer } from '@/containers/post/PostCenterContainer/PostCenterContainer'
import PostLeftContainer from '@/containers/post/PostLeftContainer/PostLeftContainer'
import PostRightContainer from '@/containers/post/PostRightContainer/PostRightContainer'

const page = async ( {params}: {params: {post_id: String}} ) => {
  const { post_id } = await params
  return (
    <div className='container-box'>
        <PostLeftContainer></PostLeftContainer>
        <PostCenterContainer id={post_id}></PostCenterContainer>
        <PostRightContainer></PostRightContainer>
    </div>
  )
}

export default page