import React from 'react'
import styles from './Post.module.css';
import Link from 'next/link'

const Post = (props: any) => {
  return (
    <div className={styles["post-box"]}>
        <Link href="/post/1">
            <h2 className={styles["title"]}>{props.title}</h2>
        </Link>
        <div className={styles["meta"]}>
            <div>
                <span className={styles["date"]}>{props.date}</span>
                <span className={styles["category"]}>{props.category}</span>
            </div>
            <div>
                <span className={styles["view"]}>조회수 {props.view}</span>
            </div>
        </div>
    </div>
  )
}

export default Post