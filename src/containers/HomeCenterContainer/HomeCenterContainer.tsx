import React from 'react'
import Post from "@/components/Post/Post"
const HomeCenterContainer = () => {
    const post_data = {
        title : "제목입니다",
        date : "2025-03-29",
        view : 0,
        category : "첫 카테고리"
    }
return (
    <div>
        <Post {...post_data}>
        </Post>
        <Post {...post_data}>
        </Post>
        <Post {...post_data}>
        </Post>
        <Post {...post_data}>
        </Post>
        <Post {...post_data}>
        </Post>
    </div>
  )
}

export default HomeCenterContainer