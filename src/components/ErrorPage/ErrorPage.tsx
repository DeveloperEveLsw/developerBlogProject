'use client'

import React from 'react'
import styles from './ErrorPage.module.css'

interface ErrorPageProps {
  status: number
  message: string
}

const ErrorPage: React.FC<ErrorPageProps> = ({ status, message }) => {
  const getStatusIcon = (status: number) => {
    switch (status) {
      case 401:
        return '🔐'
      case 403:
        return '🚫'
      case 404:
        return '🔍'
      case 500:
        return '⚡'
      default:
        return '❌'
    }
  }

  const getStatusTitle = (status: number) => {
    switch (status) {
      case 401:
        return '인증 필요'
      case 403:
        return '접근 거부'
      case 404:
        return '페이지를 찾을 수 없습니다'
      case 500:
        return '서버 오류'
      default:
        return '오류가 발생했습니다'
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{getStatusIcon(status)}</span>
        </div>
        
        <div className={styles.content}>
          <h1 className={styles.statusCode}>{status}</h1>
          <h2 className={styles.title}>{getStatusTitle(status)}</h2>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <button 
            onClick={() => window.history.back()} 
            className={styles.backButton}
          >
            이전 페이지로
          </button>
          <button 
            onClick={() => window.location.href = '/'} 
            className={styles.homeButton}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage