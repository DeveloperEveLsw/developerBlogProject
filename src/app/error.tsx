"use client"

import ErrorPage from '@/components/ErrorPage/ErrorPage'


export default function Error() {

  return (
    <ErrorPage 
      status={500} 
      message="예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요." 
    />
  )
} 