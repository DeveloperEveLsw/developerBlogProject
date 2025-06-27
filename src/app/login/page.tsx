"use client"

import React from 'react'
import { useState } from "react"
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import { isError, isSuccess } from '@/utils/isSuccess'

const LoginPage = () => {
  const router = useRouter()
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL 

  const onLogin = async function(email:string, password:string) {
    try {
      const response = await fetch(`${hostUrl}/api/login`,{
        method:'POST',
        body: JSON.stringify({email, password})
      });
      if (!response.ok) {
        throw new Error('로그인 실패: 서버 응답 오류');
      }
      if (isSuccess(response.status)) { return true } 
      else if (isError(response.status)) { return false}
    }
    catch (error){
      return false
    }
}

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // 기본 유효성 검사
      if (!email || !password) {
        throw new Error("이메일과 비밀번호를 모두 입력해주세요.")
      }

      // 이메일 형식 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("유효한 이메일 주소를 입력해주세요.")
      }

      const success = await onLogin(email, password)
      if (!success) {
        throw new Error("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.")
      }
      else {
        // 로그인 성공 시 admin 페이지로 리다이렉트
        router.push('/admin')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>
            계정에 로그인하려면 이메일과 비밀번호를 입력하세요.
          </p>
        </div>
        
        <form className={styles.formBox} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}
          
          <div className={styles.inputBox}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="your@email.com"
            />
          </div>
          
          <div className={styles.inputBox}>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className={styles.buttonBox} disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage