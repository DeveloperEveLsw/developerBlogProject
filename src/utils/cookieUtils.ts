// 쿠키에서 값 가져오기
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null // SSR 환경에서는 null 반환
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

// 쿠키 설정하기
export const setCookie = (name: string, value: string, days: number = 1): void => {
  if (typeof document === 'undefined') return // SSR 환경에서는 실행하지 않음
  
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

// 쿠키 삭제하기
export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

// 조회한 포스트 ID 목록 가져오기
export const getViewedPosts = (): string[] => {
  const viewedPosts = getCookie('viewedPosts')
  return viewedPosts ? viewedPosts.split(',').filter(Boolean) : []
}

// 조회한 포스트 ID 추가하기
export const addViewedPost = (postId: string): void => {
  const viewedPosts = getViewedPosts()
  if (!viewedPosts.includes(postId)) {
    const newViewedPosts = [...viewedPosts, postId]
    setCookie('viewedPosts', newViewedPosts.join(','), 1) // 24시간 유효
  }
}

// 특정 포스트를 조회했는지 확인하기
export const hasViewedPost = (postId: string): boolean => {
  const viewedPosts = getViewedPosts()
  return viewedPosts.includes(postId)
} 