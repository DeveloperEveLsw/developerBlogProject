"use client"

import PostEditor from '@/components/PostEditor/PostEditor'
import React from 'react'

const PostPage = () => {
  const handleSuccess = () => {
    // 성공 시 admin 페이지로 이동
    window.location.href = '/admin'
  }

  return (
    <PostEditor 
      mode="create" 
      onSuccess={handleSuccess}
    />
  )
}

export default PostPage