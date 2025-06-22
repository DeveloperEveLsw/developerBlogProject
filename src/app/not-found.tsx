import ErrorPage from '@/components/ErrorPage/ErrorPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 - LSW 개발 블로그',
  description: '요청하신 페이지를 찾을 수 없습니다.',
}

export default function NotFound() {
  return (
    <ErrorPage 
      status={404} 
      message="요청하신 페이지를 찾을 수 없습니다. URL을 다시 확인해주세요." 
    />
  )
} 