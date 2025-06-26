import PostEditor from '@/components/PostEditor/PostEditor'
import React from 'react'

const EditPage = async ({ params }: { params: { postId: string } }) => {
  const { postId } = params

  return (
    <PostEditor 
      mode="edit" 
      postId={postId}
    />
  )
}

export default EditPage 