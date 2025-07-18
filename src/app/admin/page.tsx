"use client"

import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import ErrorPage from '@/components/ErrorPage/ErrorPage'
import {revalidatePage} from '@/app/actions/revalidatePath'

interface Post {
    id: string
    title: string
    content: string
    category?: string
    created_at: Date
    updated_at: Date
    view_count: number
    is_public: boolean
    tags?: string[]
  }
  
  // Supabase 테이블 구조에 맞는 타입
  interface Category {
    category_id: number
    category_text: string
  }
  
  interface Tag {
    tag_id: number
    tag_text: string
  }

  interface Image {
    name: string;
    url: string;
    size: number;
    created_at: string;
    updated_at: string;
  }




const AdminPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [posts, setPosts] = useState<Post[]>([])
    const [stats, setStats] = useState({
    totalPosts: 0,
    publicPosts: 0,
    totalViews: 0,
    recentPosts: 0
    })
    const [categories, setCategories] = useState<string[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [newCategory, setNewCategory] = useState("")
    const [newTag, setNewTag] = useState("")
    const [activeTab, setActiveTab] = useState<'posts' | 'categories' | 'tags' | 'images'>('posts')
    const [images, setImages] = useState<Image[]>([])

    // Supabase 테이블 구조에 맞는 타입
    const [categoriesData, setCategoriesData] = useState<Category[]>([])
    const [tagsData, setTagsData] = useState<Tag[]>([])

    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL

    // 토큰 검증 함수
    const verifyToken = async () => {
    try {
        const response = await fetch(`${hostUrl}/api/auth/verify`, {
        method: "GET",
        credentials: 'include'
        })
        
        if (response.ok) {
        setIsAuthenticated(true)
        return true
        } else {
        const errorData = await response.json()
        return { error: errorData.error, status: response.status }
        }
    } catch (error) {
        return { error: "토큰 검증 중 오류가 발생했습니다.", status: 500 }
    }
    }

    // 토큰 갱신 함수
    const refreshToken = async () => {
    try {
        const response = await fetch(`${hostUrl}/api/auth/refresh`, {
        method: "POST",
        credentials: 'include'
        })
        
        if (response.ok) {
        const verifyResult = await verifyToken()
        if (verifyResult === true) {
            setIsAuthenticated(true)
            return true
        } else {
            setError(verifyResult.error)
            return false
        }
        } else {
        const errorData = await response.json()
        setError(errorData.error || "토큰 갱신에 실패했습니다.")
        return false
        }
    } catch (error) {
        setError("토큰 갱신 중 오류가 발생했습니다.")
        return false
    }
    }

    // 포스트 데이터 가져오기
    const fetchPosts = async () => {
    try {
        const response = await fetch(`${hostUrl}/api/posts`)
        if (response.ok) {
        const data = await response.json()
        const formattedPosts = data.map((post: any) => ({
            ...post,
            id: String(post.id),
            created_at: new Date(post.created_at),
            updated_at: new Date(post.updated_at)
        }))
        setPosts(formattedPosts)
        
        // 통계 계산
        const totalPosts = formattedPosts.length
        const publicPosts = formattedPosts.filter((p: Post) => p.is_public).length
        const totalViews = formattedPosts.reduce((sum: number, p: Post) => sum + (p.view_count || 0), 0)
        const recentPosts = formattedPosts.filter((p: Post) => {
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return p.created_at > weekAgo
        }).length
        
        setStats({ totalPosts, publicPosts, totalViews, recentPosts })
        
        // 카테고리와 태그 추출
        const allCategories = [...new Set(formattedPosts.map((p: Post) => p.category).filter(Boolean))] as string[]
        const allTags = [...new Set(formattedPosts.flatMap((p: Post) => p.tags || []).filter(Boolean))] as string[]
        
        setCategories(allCategories)
        setTags(allTags)
        }
    } catch (error) {
        console.error('포스트 데이터 가져오기 실패:', error)
    }
    }

    const refreshHomePage = () => {
        revalidatePage(`/`);
    }

    // 카테고리 데이터 가져오기
    const fetchCategories = async () => {
    try {
        const response = await fetch(`${hostUrl}/api/category`)
        if (response.ok) {
        const data = await response.json()
        setCategoriesData(data)
        }
    } catch (error) {
        console.error('카테고리 데이터 가져오기 실패:', error)
    }
    }

    // 태그 데이터 가져오기 (태그 API가 있다면)
    const fetchTags = async () => {
    try {
        // 태그 API가 있다면 여기에 추가
        const response = await fetch(`${hostUrl}/api/tag`)
        if (response.ok) {
          const data = await response.json()
          setTagsData(data)
        }
    } catch (error) {
        console.error('태그 데이터 가져오기 실패:', error)
    }
    }

    // 이미지 목록 가져오기
    const fetchImages = async () => {
    try {
        const response = await fetch(`${hostUrl}/api/image`);
        if (response.ok) {
        const data = await response.json();
        setImages(data);
        }
    } catch (error) {
        console.error('이미지 목록 가져오기 실패:', error);
    }
    };

    // 인증 체크 함수
    const checkAuth = async () => {
    setIsLoading(true)
    setError(null)

    const verifyResult = await verifyToken()
    
    if (verifyResult === true) {
        setIsAuthenticated(true)
        await fetchPosts()
        await fetchCategories()
        await fetchTags()
        await fetchImages()
    } else if (verifyResult.status === 401) {
        const refreshResult = await refreshToken()
        if (!refreshResult) {
            window.location.href = '/login'
            return
        } else {
            await fetchPosts()
            await fetchCategories()
            await fetchTags()
            await fetchImages()
        }
    } else {
        setError(verifyResult.error)
    }
    
    setIsLoading(false)
    }

    useEffect(() => {
    checkAuth()
    }, [])

    const handleNewPost = () => {
    window.location.href = '/admin/upload'
    }

    const handleEditPost = (postId: string) => {
    window.location.href = `/admin/edit/${postId}`
    }

    const handleDeletePost = async (postId: string) => {
        if (confirm('정말로 이 포스트를 삭제하시겠습니까?')) {
            try {
            const response = await fetch(`${hostUrl}/api/post?id=${postId}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            
            if (response.ok) {
                await fetchPosts() // 목록 새로고침
            } else {
                alert('삭제에 실패했습니다.')
            }
            } catch (error) {
            alert('삭제 중 오류가 발생했습니다.')
            }
        }
        }

    const handleTogglePublic = async (postId: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`${hostUrl}/api/post?id=${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                is_public: !currentStatus 
            }),
            credentials: 'include'
            })
            
            if (response.ok) {
            await fetchPosts() // 목록 새로고침
            } else {
            alert('상태 변경에 실패했습니다.')
            }
        } catch (error) {
            alert('상태 변경 중 오류가 발생했습니다.')
        }
    }

    // 태그 추가
    const handleAddTagToDB = async () => {
        if (!newTag.trim()) return
        
        try {
            const response = await fetch(`${hostUrl}/api/tag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tag_text: newTag.trim() }),
            credentials: 'include'
            })
            
            if (response.ok) {
                setNewTag("")
                await fetchTags() // 목록 새로고침
            } else {
                alert('태그 추가에 실패했습니다.')
            }
        } catch (error) {
            alert('태그 추가 중 오류가 발생했습니다.')
        }
    }

    // 태그 삭제
    const handleDeleteTagFromDB = async (tag_id: number ,tag_text: string) => {
        if (confirm(`태그 "${tag_text}"를 삭제하시겠습니까?`)) {
            try {
            const response = await fetch(`${hostUrl}/api/tag`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tag_id: tag_id }),
                credentials: 'include'
            })
            console.log(await response.json())
            if (response.ok) {
                await fetchTags() // 목록 새로고침
            } else {
                alert('태그 삭제에 실패했습니다.')
            }
            } catch (error) {
            alert('태그 삭제 중 오류가 발생했습니다.')
            }
        }
    }

    // Supabase 카테고리 추가
    const handleAddCategoryToDB = async () => {
        if (!newCategory.trim()) return
        
        try {
            const response = await fetch(`${hostUrl}/api/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category_text: newCategory.trim() }),
            credentials: 'include'
            })
            
            if (response.ok) {
                setNewCategory("")
                await fetchCategories() // 목록 새로고침
            } else {
                alert('카테고리 추가에 실패했습니다.')
            }
        } catch (error) {
            alert('카테고리 추가 중 오류가 발생했습니다.')
        }
    }

    // Supabase 카테고리 삭제
    const handleDeleteCategoryFromDB = async (categoryId: number, categoryName: string) => {
    if (confirm(`카테고리 "${categoryName}"를 삭제하시겠습니까?`)) {
        try {
        const response = await fetch(`${hostUrl}/api/category`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category_id: categoryId }),
            credentials: 'include'
        })
        console.log(await response.json())
        if (response.ok) {
            await fetchCategories() // 목록 새로고침
        } else {
            alert('카테고리 삭제에 실패했습니다.')
        }
        } catch (error) {
        alert('카테고리 삭제 중 오류가 발생했습니다.')
        }
    }
    }

    // 이미지 삭제 함수
    const handleDeleteImage = async (imageName: string) => {
    if (confirm('정말로 이 이미지를 삭제하시겠습니까?')) {
        try {
        const response = await fetch(`${hostUrl}/api/image`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path: imageName }),
            credentials: 'include'
        });

        if (response.ok) {
            await fetchImages(); // 목록 새로고침
        } else {
            alert('이미지 삭제에 실패했습니다.');
        }
        } catch (error) {
        alert('이미지 삭제 중 오류가 발생했습니다.');
        }
    }
    };

    // 파일 크기 포맷팅 함수
    const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) {
    return (
        <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
        }}>
        인증 확인 중...
        </div>
    )
    }

    if (error) {
    return <ErrorPage status={401} message={error} />
    }

    if (!isAuthenticated) {
    return <ErrorPage status={401} message="인증이 필요합니다." />
    }

    return (
    <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
        <h1 className={styles.title}>관리자 대시보드</h1>
        <p className={styles.subtitle}>블로그 관리 및 모니터링</p>
        </div>

        {/* 통계 카드 */}
        <div className={styles.statsGrid}>
        <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.totalPosts}</div>
            <div className={styles.statLabel}>전체 포스트</div>
        </div>
        <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.publicPosts}</div>
            <div className={styles.statLabel}>공개 포스트</div>
        </div>
        <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.totalViews}</div>
            <div className={styles.statLabel}>총 조회수</div>
        </div>
        <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.recentPosts}</div>
            <div className={styles.statLabel}>최근 7일</div>
        </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
            {/* 탭 헤더 */}
            <div className={styles.tabsHeader}>
            <button
                className={`${styles.tabButton} ${activeTab === 'posts' ? styles.active : ''}`}
                onClick={() => setActiveTab('posts')}
            >
                포스트 관리
            </button>
            <button
                className={`${styles.tabButton} ${activeTab === 'categories' ? styles.active : ''}`}
                onClick={() => setActiveTab('categories')}
            >
                카테고리 관리
            </button>
            <button
                className={`${styles.tabButton} ${activeTab === 'tags' ? styles.active : ''}`}
                onClick={() => setActiveTab('tags')}
            >
                태그 관리
            </button>
            <button
                className={`${styles.tabButton} ${activeTab === 'images' ? styles.active : ''}`}
                onClick={() => setActiveTab('images')}
            >
                이미지 관리
            </button>
            </div>

            {/* 포스트 관리 탭 */}
            <div className={`${styles.tabContent} ${activeTab === 'posts' ? styles.active : ''}`}>
            <h2 className={styles.sectionTitle}>포스트 관리
                <button 
                    style={{marginLeft:"10px"}}
                    className={`${styles.smallButton} ${styles.editButton}`}
                    onClick={() => refreshHomePage() }>
                        게시글 캐싱 초기화
                </button>
            </h2>
            <div className={styles.postsList}>
                {posts.map((post) => (
                <div key={post.id} className={styles.postItem}>
                    <div className={styles.postTitle}>{post.title}</div>
                    <div className={styles.postMeta}>
                    <span>카테고리: {post.category || '미분류'}</span>
                    <span>조회수: {post.view_count || 0}</span>
                    <span>상태: {post.is_public ? '공개' : '비공개'}</span>
                    <span>작성일: {post.created_at.toLocaleDateString()}</span>
                    </div>
                    <div className={styles.postActions}>
                    <div className={styles.leftActions}>
                        <button 
                        className={`${styles.smallButton} ${styles.editButton}`}
                        onClick={() => handleEditPost(post.id)}
                        >
                        수정
                        </button>
                        <button 
                        className={`${styles.smallButton} ${styles.toggleButton}`}
                        onClick={() => handleTogglePublic(post.id, post.is_public)}
                        >
                        {post.is_public ? '비공개' : '공개'}
                        </button>
                    </div>
                    <div className={styles.rightActions}>
                        <button 
                        className={`${styles.smallButton} ${styles.deleteButton}`}
                        onClick={() => handleDeletePost(post.id)}
                        >
                        삭제
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* 카테고리 관리 탭 */}
            <div className={`${styles.tabContent} ${activeTab === 'categories' ? styles.active : ''}`}>
            <h2 className={styles.sectionTitle}>카테고리 관리</h2>
            <div className={styles.managementGrid}>
                <div className={styles.managementSection}>
                <h3 className={styles.managementTitle}>카테고리 추가</h3>
                <div className={styles.addItemGroup}>
                    <input
                    type="text"
                    className={styles.addItemInput}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="새 카테고리 이름"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategoryToDB()}
                    />
                    <button
                    className={styles.addItemButton}
                    onClick={() => handleAddCategoryToDB()}
                    disabled={!newCategory.trim()}
                    >
                    추가
                    </button>
                </div>
                </div>
                
                <div className={styles.managementSection}>
                <h3 className={styles.managementTitle}>현재 카테고리</h3>
                <div className={styles.itemsList}>
                    {categoriesData.length > 0 ? (
                    categoriesData.map((category) => (
                        <div key={category.category_id} className={styles.itemCard}>
                        <div className={styles.itemInfo}>
                            <span className={styles.itemId}>{category.category_id}</span>
                            <span className={styles.itemName}>{category.category_text}</span>
                        </div>
                        <button
                            className={styles.deleteItemButton}
                            onClick={() => handleDeleteCategoryFromDB(category.category_id, category.category_text)}
                        >
                            삭제
                        </button>
                        </div>
                    ))
                    ) : (
                    <div className={styles.emptyState}>
                        등록된 카테고리가 없습니다.
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>

            {/* 태그 관리 탭 */}
            <div className={`${styles.tabContent} ${activeTab === 'tags' ? styles.active : ''}`}>
            <h2 className={styles.sectionTitle}>태그 관리</h2>
            <div className={styles.managementGrid}>
                <div className={styles.managementSection}>
                <h3 className={styles.managementTitle}>태그 추가</h3>
                <div className={styles.addItemGroup}>
                    <input
                    type="text"
                    className={styles.addItemInput}
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="새 태그 이름"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTagToDB()}
                    />
                    <button
                    className={styles.addItemButton}
                    onClick={() => handleAddTagToDB()}
                    disabled={!newTag.trim()}
                    >
                    추가
                    </button>
                </div>
                </div>
                
                <div className={styles.managementSection}>
                <h3 className={styles.managementTitle}>현재 태그</h3>
                <div className={styles.itemsList}>
                    {tagsData.length > 0 ? (
                    tagsData.map((tag) => (
                        <div key={tag.tag_id} className={styles.itemCard}>
                        <div className={styles.itemInfo}>
                            <span className={styles.itemId}>{tag.tag_id}</span>
                            <span className={styles.itemName}>{tag.tag_text}</span>
                        </div>
                        <button
                            className={styles.deleteItemButton}
                            onClick={() => handleDeleteTagFromDB(tag.tag_id, tag.tag_text)}
                        >
                            삭제
                        </button>
                        </div>
                    ))
                    ) : (    
                    <div className={styles.emptyState}>
                        등록된 태그가 없습니다.
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>

            {/* 이미지 관리 탭 */}
            <div className={`${styles.tabContent} ${activeTab === 'images' ? styles.active : ''}`}>
              <h2 className={styles.sectionTitle}>이미지 관리</h2>
              <div className={styles.imagesGrid}>
                {images.length > 0 ? (
                  images.map((image) => (
                    <div key={image.name} className={styles.imageCard}>
                      <div className={styles.imagePreview}>
                        <img src={image.url} alt={image.name} className={styles.imageThumbnail} />
                      </div>
                      <div className={styles.imageInfo}>
                        <div className={styles.imageName}>{image.name}</div>
                        <div className={styles.imageMeta}>
                          <span>크기: {formatFileSize(image.size)}</span>
                          <span>업로드: {new Date(image.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className={styles.imageActions}>
                        <button
                          className={styles.copyUrlButton}
                          onClick={() => {
                            navigator.clipboard.writeText(image.url);
                            alert('URL이 클립보드에 복사되었습니다.');
                          }}
                          title="URL 복사"
                        >
                          📋
                        </button>
                        <button
                          className={styles.deleteImageButton}
                          onClick={() => handleDeleteImage(image.name)}
                          title="이미지 삭제"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    업로드된 이미지가 없습니다.
                  </div>
                )}
              </div>
            </div>
        </div>

        {/* 사이드바 */}
        <div className={styles.sidebar}>
            <h2 className={styles.sectionTitle}>빠른 작업</h2>
            <div className={styles.quickActions}>
            <button 
                className={`${styles.actionButton} ${styles.primaryButton}`}
                onClick={() => handleNewPost()}
            >
                ✏️ 새 포스트 작성
            </button>
            <button 
                className={`${styles.actionButton} ${styles.secondaryButton}`}
                onClick={() => window.location.href = '/'}
            >
                🏠 블로그 보기
            </button>
            <button 
                className={`${styles.actionButton} ${styles.secondaryButton}`}
                onClick={() => window.location.href = '/admin/settings'}
            >
                ⚙️ 설정
            </button>
            </div>
        </div>
        </div>
    </div>
    )
}

export default AdminPage