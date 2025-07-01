'use client'

import { useEffect } from 'react'
import { hasViewedPost, addViewedPost } from '@/utils/cookieUtils'

interface ViewCounterProps {
  postId: string
}

const ViewCounter = ({ postId }: ViewCounterProps) => {
  useEffect(() => {
    const incrementView = async () => {
      // 이미 조회한 포스트인지 확인
      if (hasViewedPost(postId)) {
        return // 이미 조회한 포스트면 증가하지 않음
      }

      try {
        const hostUrl = process.env.NEXT_PUBLIC_HOST_URL
        const response = await fetch(`${hostUrl}/api/posts/${postId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const viewData = await response.json()
          console.log('조회수 업데이트 성공:', viewData)
          
          // 조회한 포스트를 쿠키에 저장 (24시간 유효)
          addViewedPost(postId)
        } else {
          console.error('조회수 업데이트 실패:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('조회수 업데이트 중 오류:', error)
      }
    }

    // 페이지 로드 시 조회수 증가
    incrementView()
  }, [postId])

  return null // 이 컴포넌트는 UI를 렌더링하지 않음
}

export default ViewCounter 