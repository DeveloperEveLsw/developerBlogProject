import React from 'react'
import styles from './Post.module.css';
import Link from 'next/link'

import { PostInterface } from '@/types/types';

const Post = (props: PostInterface) => {
    const date = new Date(props.created_at)
  return (
    <div className={styles.postBox}>
        <Link href={`/post/${props.id}`}>
            <h2 className={styles.title}>{props.title}</h2>
        </Link>
        <div className={styles.meta}>
            <div>
                <span className={styles.date}>{`${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`}</span>
                {props.category && props.category.trim() !== '' && (
                    <span className={styles.category}>카테고리 : {props.category}</span>
                )}
            </div>
            <div>
                <span className={styles.view}>조회수 {props.view}</span>
            </div>
        </div>
    </div>
  )
}

export default Post