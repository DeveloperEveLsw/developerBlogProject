import PostEditor from '@/components/PostEditor/PostEditor'
import React from 'react'

interface EditPageProps {
  params: {
    postId: string
  }
}

const EditPage = async ({ params }: EditPageProps) => {
  const { postId } = await params


  return (
    <PostEditor 
      mode="edit" 
      postId={postId}
    />
  )
}

export default EditPage 