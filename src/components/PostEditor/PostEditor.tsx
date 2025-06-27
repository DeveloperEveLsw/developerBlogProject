"use client"

import MarkDownRender from '@/components/MarkdownRender/MarkDownRender';
import React, { useState, useEffect, useRef } from 'react'
import styles from './PostEditor.module.css'

interface PostData {
  title: string;
  content: string;
  category: number | null;
  tag: string[] | null;
  is_public: boolean;
}

interface PostEditorProps {
  mode: 'create' | 'edit';
  postId?: string;
  initialData?: PostData;
}

const onSuccess = () => {
    // 성공 시 admin 페이지로 이동
    window.location.href = '/admin'
  }


const PostEditor = ({ mode, postId, initialData }: PostEditorProps) => {
  const [postData, setPostData] = useState<PostData>({
    title: "",
    content: "",
    category: null,
    tag: null,
    is_public: false
  });
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(mode === 'edit');
  const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;

  // 카테고리 옵션
  const categories = [
    { value: "", label: "카테고리 선택" },
    { value: "javascript", label: "JavaScript" },
    { value: "react", label: "React" },
    { value: "nextjs", label: "Next.js" },
    { value: "typescript", label: "TypeScript" },
    { value: "css", label: "CSS" },
    { value: "html", label: "HTML" },
    { value: "nodejs", label: "Node.js" },
    { value: "database", label: "Database" },
    { value: "algorithm", label: "Algorithm" },
    { value: "project", label: "Project" },
    { value: "etc", label: "기타" }
  ];

  // Edit 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (mode === 'edit' && postId) {
      loadPostData();
    } else if (initialData) {
      setPostData(initialData);
    }
  }, [mode, postId, initialData]);

  // 기존 포스트 데이터 로드
  const loadPostData = async () => {
    try {
      console.log('포스트 데이터 로드 시작:', postId);
      const response = await fetch(`${hostUrl}/api/post?id=${postId}`, {
        credentials: 'include'
      });

      console.log('API 응답 상태:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('로드된 데이터:', data);
        if (data.length > 0) {
          const post = data[0];
          console.log('포스트 정보:', post);
          setPostData({
            title: post.title || "",
            content: post.content || "",
            category: post.category || null,
            tag: post.tags || null,
            is_public: post.is_public || false
          });
          console.log('PostData 설정 완료');
        } else {
          console.log('데이터가 없습니다');
        }
      } else {
        console.error('API 응답 오류:', response.status, response.statusText);
        const errorData = await response.json();
        alert(errorData.error || '포스트 데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      alert('포스트 데이터 로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoadingData(false);
    }
  };

  // 제목 변경
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData(prev => ({ ...prev, title: e.target.value }));
  };

  // 내용 변경
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData(prev => ({ ...prev, content: e.target.value }));
  };

  // 카테고리 변경
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPostData(prev => ({ 
      ...prev, 
      category: value === "" ? null : Number(value)
    }));
  };

  // 태그 추가
  const handleAddTag = () => {
    if (newTag.trim()) {
      const currentTags = postData.tag || [];
      if (!currentTags.includes(newTag.trim())) {
        setPostData(prev => ({ 
          ...prev, 
          tag: [...(prev.tag || []), newTag.trim()] 
        }));
        setNewTag("");
      }
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove: string) => {
    setPostData(prev => ({ 
      ...prev, 
      tag: prev.tag ? prev.tag.filter(tag => tag !== tagToRemove) : null
    }));
  };

  // 이미지 제거 함수 추가
  const handleRemoveImage = async (imageUrl: string) => {
    try {
      // URL에서 파일명 추출
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      console.log('삭제할 파일명:', fileName);
      
      const response = await fetch(`http://${hostUrl}/api/image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: fileName }),
        credentials: 'include'
      });

      if (response.ok) {
        console.log('이미지 삭제 성공');
        // DB에서 삭제가 성공한 후에만 UI에서 제거
        setUploadedImages(prev => prev.filter(url => url !== imageUrl));
      } else {
        const errorData = await response.json();
        console.error('이미지 삭제 실패:', errorData);
        alert(errorData.error || '이미지 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('이미지 삭제 중 오류:', error);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  // 엔터키로 태그 추가
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // 공개 상태 토글
  const handlePublicToggle = () => {
    setPostData(prev => ({ ...prev, is_public: !prev.is_public }));
  };

  // 마크다운 가이드 토글
  const toggleMarkdownGuide = () => {
    setShowMarkdownGuide(prev => !prev);
  };

  // 이미지 업로드 토글
  const toggleImageUpload = () => {
    setShowImageUpload(prev => !prev);
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`http://${hostUrl}/api/image`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedImages(prev => [...prev, data.url]);
      } else {
        const errorData = await response.json();
        alert(errorData.error || '이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile);
    } else {
      alert('이미지 파일만 업로드 가능합니다.');
    }
  };

  // 임시저장
  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const url = mode === 'create' 
        ? `http://${hostUrl}/api/posts`
        : `http://${hostUrl}/api/post`;

      const body = mode === 'create' 
        ? { ...postData, is_public: false }
        : { id: Number(postId), ...postData, is_public: false };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      if (response.ok) {
        alert('임시저장되었습니다.');
        if (onSuccess) onSuccess();
        // admin 페이지로 리다이렉트
        window.location.href = '/admin';
      } else {
        alert('임시저장에 실패했습니다.');
      }
    } catch (error) {
      alert('임시저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 포스트 발행/수정
  const handlePublish = async () => {
    if (!postData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!postData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const url = mode === 'create' 
        ? `http://${hostUrl}/api/posts`
        : `http://${hostUrl}/api/post?id=${postId}`;

      const body = mode === 'create' 
        ? { ...postData, is_public: true }
        : { id: Number(postId), ...postData, is_public: true };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      if (response.ok) {
        const message = mode === 'create' ? '포스트가 발행되었습니다.' : '포스트가 수정되었습니다.';
        alert(message);
        if (onSuccess) onSuccess();
        // admin 페이지로 리다이렉트
        window.location.href = '/admin';
      } else {
        const message = mode === 'create' ? '발행에 실패했습니다.' : '수정에 실패했습니다.';
        alert(message);
      }
    } catch (error) {
      const message = mode === 'create' ? '발행 중 오류가 발생했습니다.' : '수정 중 오류가 발생했습니다.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        fontSize: '18px'
      }}>
        포스트 데이터를 불러오는 중...
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          {mode === 'create' ? '새 포스트 작성' : '포스트 수정'}
        </h1>
        <p className={styles.subtitle}>
          {mode === 'create' 
            ? '블로그에 새로운 포스트를 작성하세요' 
            : '포스트 내용을 수정하세요'
          }
        </p>
      </div>

      {/* 포스트 정보 입력 */}
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>포스트 정보</h2>
        
        {/* 제목 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>제목 *</label>
          <textarea
            className={styles.titleInput}
            value={postData.title}
            onChange={handleTitleChange}
            placeholder="포스트 제목을 입력하세요"
          />
        </div>

        {/* 카테고리 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>카테고리</label>
          <select 
            className={styles.categorySelect}
            value={postData.category || ""}
            onChange={handleCategoryChange}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* 태그 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>태그</label>
          <div className={styles.tagInputGroup}>
            <input
              type="text"
              className={styles.tagInput}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleTagKeyPress}
              placeholder="태그를 입력하고 Enter 또는 추가 버튼을 클릭하세요"
            />
            <button
              className={styles.addTagButton}
              onClick={handleAddTag}
              disabled={!newTag.trim()}
            >
              추가
            </button>
          </div>
          {postData.tag && postData.tag.length > 0 && (
            <div className={styles.tagsContainer}>
              {postData.tag.map((tag, index) => (
                <div key={index} className={styles.tagItem}>
                  <span>{tag}</span>
                  <button
                    className={styles.removeTagButton}
                    onClick={() => handleRemoveTag(tag)}
                    title="태그 제거"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 마크다운 가이드 */}
      <div className={styles.markdownGuideSection}>
        <button 
          className={styles.guideToggleButton}
          onClick={toggleMarkdownGuide}
        >
          <span>마크다운 문법 가이드</span>
          <span className={`${styles.toggleIcon} ${showMarkdownGuide ? styles.expanded : ''}`}>
            ▼
          </span>
        </button>
        
        <div className={`${styles.markdownGuide} ${showMarkdownGuide ? styles.show : ''}`}>
          <div className={styles.guideContent}>
            <div className={styles.guideItem}>
              <h4>제목</h4>
              <code># 제목1</code><br/>
              <code>## 제목2</code><br/>
              <code>### 제목3</code>
            </div>
            
            <div className={styles.guideItem}>
              <h4>강조</h4>
              <code>**굵게**</code> 또는 <code>__굵게__</code><br/>
              <code>*기울임*</code> 또는 <code>_기울임_</code><br/>
              <code>~~취소선~~</code>
            </div>
            
            <div className={styles.guideItem}>
              <h4>링크</h4>
              <code>[텍스트](URL)</code><br/>
              <code>[Google](https://google.com)</code>
            </div>
            
            <div className={styles.guideItem}>
              <h4>이미지</h4>
              <code>![대체텍스트](이미지URL)</code><br/>
              <code>![로고](https://example.com/logo.png)</code>
            </div>
            
            <div className={styles.guideItem}>
              <h4>코드</h4>
              <code>`인라인 코드`</code><br/>
              <code>```</code><br/>
              <code>코드 블록</code><br/>
              <code>```</code>
            </div>
            
            <div className={styles.guideItem}>
              <h4>목록</h4>
              <code>- 순서없는 목록</code><br/>
              <code>1. 순서있는 목록</code><br/>
              <code>2. 두 번째 항목</code>
            </div>
            
            <div className={styles.guideItem}>
              <h4>인용</h4>
              <code>&gt; 인용문</code><br/>
              <code>&gt; 여러 줄 인용</code>
            </div>
            
            <div className={styles.guideItem}>
              <h4>구분선</h4>
              <code>---</code> 또는 <code>***</code>
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 업로드 섹션 */}
      <div className={styles.imageUploadSection}>
        <button 
          className={styles.guideToggleButton}
          onClick={toggleImageUpload}
        >
          <span>이미지 삽입</span>
          <span className={`${styles.toggleIcon} ${showImageUpload ? styles.expanded : ''}`}>
            ▼
          </span>
        </button>
        
        <div className={`${styles.imageUploadContent} ${showImageUpload ? styles.show : ''}`}>
          <div className={styles.imageUploadArea}>
            <div className={styles.imageUploadInfo}>
              <p className={styles.imageUploadDescription}>
                포스트에 이미지를 삽입하세요. 이미지 파일을 선택하거나 드래그 앤 드롭하세요.
              </p>
              <div className={styles.imageUploadControls}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className={styles.imageUploadButton}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? '업로드 중...' : '이미지 선택'}
                </button>
                <span className={styles.imageUploadHint}>
                  또는 이미지를 아래 영역에 드래그하세요
                </span>
              </div>
            </div>
            <div
              className={`${styles.imageDropZone} ${dragOver ? styles.dragOver : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {dragOver ? (
                <div className={styles.dragMessage}>
                  이미지를 여기에 드롭하세요
                </div>
              ) : (
                <div className={styles.dropZoneContent}>
                  <div className={styles.dropZoneIcon}>📷</div>
                  <p className={styles.dropZoneText}>
                    이미지를 여기에 드래그하거나<br/>
                    위의 '이미지 선택' 버튼을 클릭하세요
                  </p>
                  <p className={styles.dropZoneHint}>
                    지원 형식: JPG, PNG, GIF, WebP (최대 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 업로드된 이미지 썸네일 리스트 */}
          {uploadedImages.length > 0 && (
            <div className={styles.uploadedImagesList}>
              {uploadedImages.map((url, idx) => (
                <div
                  key={url}
                  className={styles.uploadedImageThumb}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData(
                      'text/plain',
                      `<img src='${url}' alt='업로드 이미지' width='300' />`
                    );
                  }}
                >
                  <img src={url} alt={`업로드 이미지 ${idx + 1}`} className={styles.uploadedImage} />
                  <button
                    className={styles.removeImageButton}
                    onClick={() => handleRemoveImage(url)}
                    title="이미지 제거"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 에디터 */}
      <div className={styles.editorContainer}>
        <h2 className={styles.sectionTitle}>내용 작성</h2>
        <div className={styles.editorLayout}>
          {/* 마크다운 에디터 */}
          <div className={styles.editorSection}>
            <label className={styles.editorLabel}>마크다운 편집</label>
            <textarea
              ref={textareaRef}
              className={styles.contentTextarea}
              value={postData.content}
              onChange={handleContentChange}
              placeholder="마크다운으로 포스트 내용을 작성하세요..."
              onDrop={e => {
                e.preventDefault();
                const html = e.dataTransfer.getData('text/plain');
                if (html) {
                  const textarea = textareaRef.current;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const currentContent = postData.content;
                    const newContent = currentContent.substring(0, start) + html + currentContent.substring(end);
                    setPostData(prev => ({ ...prev, content: newContent }));
                    setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(start + html.length, start + html.length);
                    }, 0);
                  }
                }
              }}
            />
          </div>

          {/* 미리보기 */}
          <div className={styles.previewSection}>
            <label className={styles.previewLabel}>미리보기</label>
            <div className={styles.previewContent}>
              <MarkDownRender markdown={postData.content} />
            </div>
          </div>
        </div>
      </div>
      
      {/* 액션 버튼 */}
      <div className={styles.actionsContainer}>
        <div className={styles.leftActions}>
          <button 
            className={`${styles.actionButton} ${styles.saveButton}`}
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '임시저장'}
          </button>
        </div>
        <div className={styles.rightActions}>
          <button 
            className={`${styles.actionButton} ${styles.publishButton}`}
            onClick={handlePublish}
            disabled={isLoading || !postData.title.trim() || !postData.content.trim()}
          >
            {isLoading 
              ? (mode === 'create' ? '발행 중...' : '수정 중...') 
              : (mode === 'create' ? '포스트 발행' : '포스트 수정')
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostEditor 