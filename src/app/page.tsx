export const revalidate = 60;

import PostListContainer from "@/containers/PostListContainer/PostListContainer";
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout';
import LogoAnimation from '@/components/LogoAnimation/LogoAnimation'

import styles from "./page.module.css"
// app/page.tsx 또는 app/layout.tsx
export const metadata = {
  title: 'LSW 개발 블로그',
  description: '과정과 ',
  openGraph: {
    title: 'OG 제목',
    description: 'OG 설명',
    images: ['/og-image.png'],
  },
};


export default function Home() {
  return (
      <ThreeColumnLayout
      center={
        <div>
          <LogoAnimation size={200}></LogoAnimation>
          <PostListContainer></PostListContainer>
        </div>
      }
      centerMaxWidth={600}
    />
  );
}
