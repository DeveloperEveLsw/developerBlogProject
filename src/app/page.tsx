export const revalidate = 60;

import PostListContainer from "@/containers/PostListContainer/PostListContainer";
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout';

import styles from "./page.module.css"

export default function Home() {
  return (
      <ThreeColumnLayout
      center={
        <PostListContainer></PostListContainer>
      }
      centerMaxWidth={600}
    />
  );
}
