import React from 'react'
import styles from './Post.module.css';
import Link from 'next/link'

import { PostInterface } from '@/types/types';

const Post = (props: PostInterface & { isAdmin?:boolean }) => {
    const date = new Date(props.created_at)
    const {isAdmin = false} = props
  return (
    <div>
        <div className={styles["post-box"]}>
            <Link href={`/post/${props.id}`}>
                <h2 className={styles["title"]}>{props.title}</h2>
            </Link>
            <div className={styles["meta"]}>
                <div>
                    <span className={styles["date"]}>{`${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`}</span>
                    <span className={styles["category"]}>카테고리 : {props.category}</span>
                </div>
                <div>
                    <span className={styles["view"]}>조회수 {props.view}</span>
                </div>
            </div>  
        {isAdmin && (props.is_public ?
            <div className={styles["admin-box"]}>현재 상태 : 공개<button>비공개 전환</button></div> :
            <div className={styles["admin-box"]}>현재 상태 : 비공개<button>공개 전환</button></div>)}
        </div>
    </div>
  )
}

export default Post