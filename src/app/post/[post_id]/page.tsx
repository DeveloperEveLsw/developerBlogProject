import React from 'react'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { PostContainer } from '@/containers/PostContainer/PostContainer'
import { SupabasePostsInterface } from '@/types/db'
import ViewCounter from '@/components/ViewCounter/ViewCounter'


export const dynamicParams = true // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
  console.log(`${hostUrl}/api/posts`)
  const response = await fetch(`${hostUrl}/api/posts`, {method: "GET"})
  console.log(response)
  const data = await response.json()
  const params = data.map((post: SupabasePostsInterface) => ({
    post_id: post.id.toString()
  }))
  return params
}


export async function generateMetadata({params}: {params: Promise<{post_id: string}>}) {
  
  const { post_id } = await params
  
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  const alist = await fetch(`${hostUrl}/api/post?id=${post_id}`);
    
  if (alist.ok) {
    const data = await alist.json();
    const post = data[0]

    return {
      title: post.title,
      description: post.description
          ? post.description
          : post.content.length > 100
            ? post.content.substring(0, 100) + "..."
            : post.content,
      openGraph: {
        title: post.title,
        description: post.description
          ? post.description
          : post.content.length > 100
            ? post.content.substring(0, 100) + "..."
            : post.content,
        url: `${hostUrl}/post/${post_id}`,
        images: [
          {
            url: post.cover_image
              ? `${supabaseUrl}/storage/v1/object/blog-image/post/${post.cover_image}`
              : post.images
                ? `${supabaseUrl}/storage/v1/object/blog-image/post/${post.images[0]}`
                : '/LB.png',
            alt: post.title,
          },
        ],
      },
    }
  }
}
  


const page = async ( {params}: {params: Promise<{post_id: string}>} ) => {
  const { post_id } = await params
  
  return (
    <>
      <ThreeColumnLayout
        center={
          <PostContainer id={post_id}></PostContainer>
        }
        centerMaxWidth={850}
      />
      <ViewCounter postId={post_id} />
    </>
  )
}

export default page