import ErrorPage from '@/components/ErrorPage/ErrorPage'
import PostListContainer from '@/containers/home/HomeCenterContainer/PostListContainer/PostListContainer'
import { NextResponse } from 'next/server'
import React from 'react'



const adminPage = async () => {
  try {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL        
    const response = await fetch(`http://${hostUrl}/api/auth/verify`, {
      method: "GET"
    })
    console.log(response)
    if (!response.ok) {   
      const msg = await response.json().then( (r)=> r.error)
      return <ErrorPage status={response.status} message={msg}></ErrorPage>
     }
  } catch(e) {}
  return (
<<<<<<< HEAD
    <div className='container-box'>
        <div></div>
        <PostListContainer isAdmin={true}>
        </PostListContainer>
        <div></div>
=======
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
>>>>>>> origin/heads/origin/master
    </div>
  ) 
}

export default adminPage