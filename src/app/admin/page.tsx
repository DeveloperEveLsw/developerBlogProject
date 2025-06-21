"use client"

import MarkDownRender from '@/components/MarkdownRender/MarkDownRender';
import React, { useState } from 'react'
import styles from './page.module.css'


const PostPage = () => {
    const [text, setText] = useState(""); // 입력 값 상태
    const [title, setTitle] = useState("");

    const changeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
    };

    const changeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle);
    }

    const upload = async ()=>{
        const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
        

        const response = await fetch(`http://${hostUrl}/api/posts`,{
            method: "POST",
            body: JSON.stringify({title: title, content: text })
        }
        )
    }

  return (
    <div>
        <div className={styles.editorBox}>
            <textarea onChange={changeTitle}></textarea>
            <div className={styles.contentBox}>
                <div className={styles.textBox}>
                    <textarea onChange={changeText} className={styles.text}></textarea>
                </div>
                <div className={styles.markdownBox}>
                    <MarkDownRender markdown={text}></MarkDownRender>
                </div>
            </div>
        </div>
        <div className={styles.uploadBox}>
            <button>임시저장</button>
            <button onClick={upload}>업로드</button>
        </div>
    </div>
  )
}

export default PostPage