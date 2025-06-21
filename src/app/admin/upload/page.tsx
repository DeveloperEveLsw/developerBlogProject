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

    const test = async ()=> {
        const hostUrl = process.env.NEXT_PUBLIC_HOST_URL        
        const response = await fetch(`http://${hostUrl}/api/auth/refresh`,{
            method: "POST"
        }
        )
        console.log(response)       
    }

  return (
    <div>
        <div className={styles["editor-box"]}>
            <textarea onChange={changeTitle}></textarea>
            <div className={styles["content-box"]}>
                <div className={styles["text-box"]}>
                    <textarea onChange={changeText} className={styles["text"]}></textarea>
                </div>
                <div className={styles["markdown-box"]}>
                    <MarkDownRender markdown={text}></MarkDownRender>
                </div>
            </div>
        </div>
        <div className={styles["upload-box"]}>
            <button onClick={test}>임시저장</button>
            <button onClick={upload}>업로드</button>
        </div>
    </div>
  )
}

export default PostPage