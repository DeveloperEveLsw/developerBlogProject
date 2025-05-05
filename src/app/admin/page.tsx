"use client"

import MarkDownRender from '@/components/MarkdownRender/MarkDownRender';
import React, { useState } from 'react'
import styles from './page.module.css'


const PostPage = () => {
    const [text, setText] = useState(""); // 입력 값 상태
    const [title, setTitle] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
    };
    const chagneTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle)
    }

  return (
    <div>
        <div className={styles["editor-box"]}>
            <div className={styles["text-box"]}>
                <textarea onChange={chagneTitle}></textarea>
                <textarea onChange={handleChange} className={styles["text"]}></textarea>
            </div>
            <div className={styles["markdown-box"]}>
                <div>{title}</div>
                <MarkDownRender markdown={text}></MarkDownRender>
            </div>
        </div>
    </div>
  )
}

export default PostPage