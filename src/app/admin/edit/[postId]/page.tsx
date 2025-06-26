import PostEditor from '@/components/PostEditor/PostEditor'
import React from 'react'

const EditPage = async ( {params}: {params: Promise<{postId: string}>} ) => {
  const { postId } = await params

  return (
    <PostEditor 
      mode="edit" 
      postId={postId}
    />
  )
}

export default EditPage 