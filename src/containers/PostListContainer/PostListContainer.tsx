"use client"

import { useSearchParams } from 'next/navigation'
import Post from "@/components/Post/Post"

import { PostInterface } from '@/types/types';
import { SupabasePostsInterface } from '@/types/db';
import { useState, useEffect } from 'react';

import {usePostStore} from '@/store/postStore'

const PostListContainer = ({initialPosts} : {initialPosts:PostInterface[]}) => {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL 
    
    const {posts, setPosts} = usePostStore()

    const params = useSearchParams()

    const category = params.get("category")
    const tags =  params.get("tags")

    useEffect(()=> {
        const fetchData = async () => {
            const newParams = new URLSearchParams();
            
            if (category) {
                newParams.append('category', category.split("_")[1]);
            }
        
            if (tags) {
                newParams.append('tags', tags.split(",").map(tag=>tag.split("_")[1]).join(","));
            }

            if (newParams.toString() == '') { setPosts(initialPosts) }

            try {
                const newPosts = initialPosts.filter( (post:PostInterface)=>
                    (category ? post.category == category.split("_")[0] : true)
                    &&
                    (tags ? tags.split(",").map((tag:any)=>tag.tag_text).every(tag=>post.tags) : true) )
                setPosts(newPosts)
                /* 당장엔 게시글 목록에 페이징을 하지 않았기에 이렇게 사용해보도록 하겠습니다 !
                newParams.append('private', 'false')
                
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
                */
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