'use client'

import ErrorPage from '@/components/ErrorPage/ErrorPage'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로깅 (선택사항)
    console.error('Global error:', error)
  }, [error])

  return (
    <ErrorPage 
      status={500} 
      message="예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요." 
    />
  )
} 