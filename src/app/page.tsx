import PostListContainer from "@/containers/PostListContainer/PostListContainer";
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout';
import LogoAnimation from '@/components/LogoAnimation/LogoAnimation'
import Category from '@/components/Category/Category'
import styles from "./page.module.css"

// app/page.tsx 또는 app/layout.tsx
export const metadata = {
  title: 'LSW 개발 블로그',
  description: '즐기면서 성장하는 개발 블로그 입니다. 성장과정과 사고 과정을 기록하고 있습니다. 문제가 발생하였을때 해결하는것을 좋아하며 그러한 과정을 출력으로써 남기기위해 블로그를 운영합니다',
  openGraph: {
    title: 'LSW 개발 블로그',
    description: '즐기면서 성장하는 개발 블로그',
    images: ['/LB.png'],
  },
};

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/category`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch categories');
  }
  const data = await res.json();
  return data
}

export default async function Home({ searchParams }: { searchParams :Promise<{ [key: string]: string | string[] | undefined }>}) {

  const categories:{category_id:number, category_text:string}[] | [] = await getCategories();
  const resolvedParams = await searchParams

  return (
      <ThreeColumnLayout
      left= {
        <Category categories={categories}></Category>
      }
      center={
        <div>
          <LogoAnimation size={200}></LogoAnimation>
          <PostListContainer searchParams={resolvedParams}></PostListContainer>
        </div>
      }
      centerMaxWidth={600}
    />
  );
}
