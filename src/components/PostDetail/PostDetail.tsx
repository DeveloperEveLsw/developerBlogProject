import React from 'react'
import MarkDownRender from '../MarkdownRender/MarkDownRender'
import "highlight.js/styles/github.css"; 
import styles from './PostDetail.module.css'
import { transformDate } from '@/utils/transformutils';

interface PostInterface {
    id? : string,
    title : string,
    content : string,
    created_at : string,
    updated_at? : string,
    user_email? : string,
    tag? : string[],
    category? : string,
    view_count? : string
}


const PostDetail = ( {post}: {post: PostInterface}) => {

  const form = [
    ['year',    '%.'],
    ['month',   '%.'],
    ['date',    '% '],
    ['hours',   '%:'],
    ['minutes', '%']
  ]

  return (
    <div className={styles.postDetail}>
      <div className={styles.postDetailHeader}>
        <h1>{post.title}</h1>
        <div className={styles.meta}>
          <span>{transformDate(post.created_at,form,"%",2)}</span>
          <span>조회수 {post.view_count}</span>
        </div>
      </div>
        <div className={styles.postDetailContent}>
          <MarkDownRender markdown={post.content}></MarkDownRender>
        </div>
    </div>
  )
}

export default PostDetail