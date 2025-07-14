"use client"

import React from 'react'
import styles from './Post.module.css';
import Link from 'next/link'

import { PostInterface } from '@/types/types';
import { Tag } from '@/types/types';

const Post = (props: PostInterface) => {
    const date = new Date(props.created_at)
    
    // category가 존재하고 비어있지 않은 경우에만 표시
    const shouldShowCategory = props.category && 
        (typeof props.category === 'string' ? props.category.trim() !== '' : props.category !== null && props.category !== undefined);

  return (
    <div className={styles.postBox}>
        <Link href={`/post/${props.id}`}>
            <h2 className={styles.title}>{props.title}</h2>
        </Link>
        <div className={styles.meta}>
            <div>
                <span className={styles.date}>{`${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`}</span>
                {shouldShowCategory && (
                    <span className={styles.category}>카테고리 : {props.category}</span>
                )}
            </div>
            <div>
                <span className={styles.view}>조회수 {props.view}</span>
            </div>
        </div>
        {props.tags && (<div className={styles.meta}>태그 : {props.tags.join(", ")}</div>)}
    </div>
  )
}

export default Post