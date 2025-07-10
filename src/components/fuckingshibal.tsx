"use client"

import React from 'react'
import PostListContainer from '@/containers/PostListContainer/PostListContainer'
import { PostInterface } from '@/types/types';

const Fuckingshibal = ({initialPosts}: {initialPosts: PostInterface[]}) => {
  return (
    <PostListContainer initialPosts={initialPosts} />
  )
}

export default Fuckingshibal