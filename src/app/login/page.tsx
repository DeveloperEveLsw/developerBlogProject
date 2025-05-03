"use client"

import React from 'react'
import { useState } from "react"

const LoginPage = async () => {
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL 
  const response = await fetch(`http://${hostUrl}/api/login`,{
    method:'POST',
    body: JSON.stringify({email:"lws19121@gmail.com", password:"way0120@"})
  }).then((res)=>res.json())
  console.log(response)

  return (
    <div>
      <div>
        <div>
          로그인
        </div>
        <div>
          계정에 로그인하려면 이메일과 비밀번호를 입력하세요.
        </div>
      </div>
      <div>
        <div>

        </div>
        <div>
          <label htmlFor="password">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}>
          </input>
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}>
          </input>
        </div>
      </div>
    </div>
  )
}

export default LoginPage