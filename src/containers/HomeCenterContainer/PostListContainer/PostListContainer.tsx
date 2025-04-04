import React from 'react'


const PostListContainer = async () => {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
    const alist = await fetch(`http://${hostUrl}/api/posts`)
    const data = await alist.json()
    console.log(data)
  return (
    <div>
        PostListContainer
        
    </div>
  )
}

export default PostListContainer