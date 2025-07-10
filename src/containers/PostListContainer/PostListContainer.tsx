"use client"

import { useSearchParams } from 'next/navigation'
import Post from "@/components/Post/Post"

import { PostInterface } from '@/types/types';
import { SupabasePostsInterface } from '@/types/db';
import { useState, useEffect } from 'react';

const PostListContainer = ({initialPosts} : {initialPosts:PostInterface[]}) => {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL 
    
    
    const [posts, setPosts] = useState<PostInterface[] >(initialPosts)

    const params = useSearchParams()
    
    const category = params.get("category")
    const tags =  params.get("tag")

    useEffect(()=> {
        const fetchData = async () => {
            const newParams = new URLSearchParams();
            newParams.append('private', 'false');
            if (params.get("category")) {
                let category = params.get("category") as string
                newParams.append('category', category.split("_")[1] as string);
            }
        
            if (params.get("tag")) {
                newParams.append('tag', params.get("tag") as string);
            }
        
            try {
                const response = await fetch(`${hostUrl}/api/posts?${newParams.toString()}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data.map((post: SupabasePostsInterface) => ({
                        ...post,
                        id: String(post.id),  
                        category: post.category || '',
                        created_at: new Date(post.created_at),
                        updated_at: new Date(post.updated_at),
                        view: post.view_count
                    })));
                } else {
                    console.error('포스트 목록 가져오기 실패:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('포스트 목록 가져오기 중 오류:', error);
            }
        }
        fetchData()
    }, [category, tags])
    
    return (
        <div style={{width: '100%'}}>
            {
            posts.length === 0 ? 
            <div style={{fontSize: "30px", justifySelf: "anchor-center", marginTop: "30px"}}>게시글이 없습니다.</div> : 
            posts.map((post: PostInterface) => (
                <Post {...post} key={String(post.id)}></Post>
            ))
            }
        </div>
    )
}

export default PostListContainer