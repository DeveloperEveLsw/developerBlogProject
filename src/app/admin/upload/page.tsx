"use client"

import MarkDownRender from '@/components/MarkdownRender/MarkDownRender';
import React, { useState } from 'react'
import styles from './page.module.css'

interface PostData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_public: boolean;
}

const PostPage = () => {
  const [postData, setPostData] = useState<PostData>({
    title: "",
    content: "",
    category: "",
    tags: [],
    is_public: false
  });
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setPostData(prev => ({ ...prev, category: e.target.value }));
  };

  // 태그 추가
  const handleAddTag = () => {
    if (newTag.trim() && !postData.tags.includes(newTag.trim())) {
      setPostData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, newTag.trim()] 
      }));
      setNewTag("");
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove: string) => {
    setPostData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
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

  // 임시저장
  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;
      const response = await fetch(`http://${hostUrl}/api/posts`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...postData,
          is_public: false
        }),
        credentials: 'include'
      });

      if (response.ok) {
        alert('임시저장되었습니다.');
      } else {
        alert('임시저장에 실패했습니다.');
      }
    } catch (error) {
      alert('임시저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 포스트 발행
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
      const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;
      const response = await fetch(`http://${hostUrl}/api/posts`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...postData,
          is_public: true
        }),
        credentials: 'include'
      });

      if (response.ok) {
        alert('포스트가 발행되었습니다.');
        // 성공 시 admin 페이지로 이동
        window.location.href = '/admin';
      } else {
        alert('발행에 실패했습니다.');
      }
    } catch (error) {
      alert('발행 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>새 포스트 작성</h1>
        <p className={styles.subtitle}>블로그에 새로운 포스트를 작성하세요</p>
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
            value={postData.category}
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
              onKeyPress={handleTagKeyPress}
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
          {postData.tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {postData.tags.map((tag, index) => (
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

      {/* 에디터 */}
      <div className={styles.editorContainer}>
        <h2 className={styles.sectionTitle}>내용 작성</h2>
        <div className={styles.editorLayout}>
          {/* 마크다운 에디터 */}
          <div className={styles.editorSection}>
            <label className={styles.editorLabel}>마크다운 편집</label>
            <textarea
              className={styles.contentTextarea}
              value={postData.content}
              onChange={handleContentChange}
              placeholder="마크다운으로 포스트 내용을 작성하세요..."
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
            {isLoading ? '발행 중...' : '포스트 발행'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostPage