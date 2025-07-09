"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from './Category.module.css';

interface Category {
  category_id: number,
  category_text: string
}

export const Category = ({ categories }: {categories: Category[]}) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null> () 

  const handleCategoryChange = (category:Category)=> {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedCategory?.category_id == category.category_id) {
      setSelectedCategory(null)
      console.log("삭제!")
      params.delete("category"); // 카테고리 제거
      router.push(`?${params.toString()}`);
      return     
      } 
      else {
        console.log("url 바꿈!")
        setSelectedCategory(category)

        params.set("category", `${category.category_text}_${category.category_id}`);
      
        router.push(`?${params.toString()}`);

    }
  }
  
  return (
    <div className={styles.categoryContainer}>
      {categories.map((category:Category) => (
        <button
          key={category.category_id}
          onClick={()=> handleCategoryChange(category)}
          className={`
            ${styles.categoryItem}
            ${selectedCategory?.category_id == category.category_id
              ? styles.categoryItem_active : ""
            }` }
          >
          {category.category_text}
        </button>
      ))}
    </div>
  );
};

export default Category;