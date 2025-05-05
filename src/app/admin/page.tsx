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

  return (
    <div>
        <div className={styles["editor-box"]}>
            <textarea></textarea>
            <div className={styles["content-box"]}>
                <div className={styles["text-box"]}>
                    <textarea onChange={handleChange} className={styles["text"]}></textarea>
                </div>
                <div className={styles["markdown-box"]}>
                    <MarkDownRender markdown={text}></MarkDownRender>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PostPage