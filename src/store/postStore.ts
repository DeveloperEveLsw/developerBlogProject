import { create } from 'zustand'

import { PostInterface } from '@/types/types';

interface PostState {
    posts: PostInterface[],
    setPosts: (posts:PostInterface[])=> void
}

export const usePostStore = create<PostState>((set)=>({
    posts: [],
    setPosts: (posts:PostInterface[])=> set({posts})
}))