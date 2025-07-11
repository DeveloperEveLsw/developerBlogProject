export const dynamic = "force-static";

import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout';
import LogoAnimation from '@/components/LogoAnimation/LogoAnimation'
import Category from '@/components/Category/Category'
import SafeClientSuspense from '@/containers/PostListContainer/SafeClientSuspense'

import { Suspense } from 'react'

import { PostInterface } from '@/types/types';
import { SupabasePostsInterface } from '@/types/db';

export const metadata = {
  title: 'LSW 개발 블로그',
  description: '즐기면서 성장하는 개발 블로그 입니다. 성장과정과 사고 과정을 기록하고 있습니다. 문제가 발생하였을때 해결하는것을 좋아하며 그러한 과정을 출력으로써 남기기위해 블로그를 운영합니다',
  openGraph: {
    title: 'LSW 개발 블로그',
    description: '즐기면서 성장하는 개발 블로그',
    images: ['/LB.png'],
  },
};

export default async function Home() {

  let initialCategoryData
  let initialPostsData

  try {
    const posts = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/posts`);

    if (!posts.ok) {
      throw new Error('Failed to fetch categories'+posts.status.toString()+posts.statusText.toString());
    }
    const category = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/category`);

    if (!category.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch categories');
    }
    initialCategoryData = await category.json();
    initialPostsData = await posts.json()
          .then(data => data.map((post: SupabasePostsInterface) => ({
            ...post,
            id: String(post.id),  
            category: post.category || '',
            created_at: new Date(post.created_at),
            updated_at: new Date(post.updated_at),
            view: post.view_count
        })))
  } catch (error) {
    console.error('포스트 목록 가져오기 중 오류:', error);
  }
  
  return (
      <ThreeColumnLayout
      left= {
        <Category categories={initialCategoryData}></Category>
      }
      center={
        <div>
          <LogoAnimation size={200}></LogoAnimation>
          <Suspense fallback={<div>로딩 중...</div>}>
            <SafeClientSuspense initialPosts={initialPostsData}></SafeClientSuspense>
          </Suspense>
        </div>
      }
      centerMaxWidth={600}
    />
  );
}

