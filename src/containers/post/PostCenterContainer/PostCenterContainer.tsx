import React from 'react'
import { PostInterface } from '@/types/types'
import { transformDate } from '@/utils/transformutils'
import styles from './PostCenterContainer.module.css'
import "highlight.js/styles/github.css"; 

import '@/components/MarkdownRender/MarkDownRender'
import MarkDownRender from '@/components/MarkdownRender/MarkDownRender';

export const PostCenterContainer = async (params:any) => {

  const form = [
    ['year',    '%'],
    ['month',   '.%'],
    ['date',    '.%'],
    ['hours',   ' %:'],
    ['minutes', '%:'],
    ['seconds', '%']
]




  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
  const alist = await fetch(`http://${hostUrl}/api/post?id=${params.id}`)
  const data = await alist.json()

  const post = data.map( (post: any)=> ({
        ...post,
        created_at: transformDate(post.created_at, form)
      }))[0]
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
          <MarkDownRender markdown={post.context}></MarkDownRender>
        </div>
    </div>
  )
}
