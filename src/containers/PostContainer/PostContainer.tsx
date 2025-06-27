import React from 'react'
import { PostInterface } from '@/types/types'
import { transformDate } from '@/utils/transformutils'
import styles from './PostContainer.module.css'
import "highlight.js/styles/github.css"; 

import '@/components/MarkdownRender/MarkDownRender'
import MarkDownRender from '@/components/MarkdownRender/MarkDownRender';

export const PostContainer = async (params:any) => {

  const form = [
    ['year',    '%'],
    ['month',   '.%'],
    ['date',    '.%'],
    ['hours',   ' %:'],
    ['minutes', '%:'],
    ['seconds', '%']
  ]

  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
  let post: any = {
    title: '포스트를 불러올 수 없습니다',
    content: '포스트를 불러오는 중 오류가 발생했습니다.',
    created_at: '날짜 없음'
  };
  
  try {
    const alist = await fetch(`${hostUrl}/api/post?id=${params.id}`);
    
    if (alist.ok) {
      const data = await alist.json();
      if (data && data.length > 0) {
        post = data.map((post: any) => ({
          ...post,
          created_at: transformDate(post.created_at, form)
        }))[0];
      }
    } else {
      console.error('포스트 가져오기 실패:', alist.status, alist.statusText);
    }
  } catch (error) {
    console.error('포스트 가져오기 중 오류:', error);
  }
  
  return (
    <div className="container-center">
      <div className={styles['post-head']}>
        <h1 className='title'>{post.title}</h1>
        <div className={styles['meta']}>
          <span>{post.created_at}</span>
          <span>조회수 0</span>
        </div>
      </div>
        <div className={styles['context']}>
          <MarkDownRender markdown={post.content}></MarkDownRender>
        </div>
    </div>
  )
}
