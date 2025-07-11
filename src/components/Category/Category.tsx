"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from './Category.module.css';
import {SelectedCategoryStore} from '@/store/SelectedCategoryStore'

interface Category {
  category_id: number,
  category_text: string
}


export const Category = ({ categories }: {categories: Category[]}) => {

  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryFarams = searchParams.get("category")

  const{selectedCategory, setSelectedCategory, toggleSelectedCategory} = SelectedCategoryStore() 

  useEffect(() => {
    const raw = categoryFarams?.split("_")
    const categoryFromQuery = raw
    ? { category_text: raw[0], category_id: Number(raw[1]) }
    : null;

    if (categoryFromQuery !== selectedCategory) {
      setSelectedCategory(categoryFromQuery); // 쿼리와 상태가 다르면 상태 변경
    }
  }, [categoryFarams]);


  useEffect(()=> {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategory) {
      params.set("category", `${selectedCategory.category_text}_${selectedCategory.category_id}`);
      router.push(`?${params.toString()}`);
    } else {
      params.delete("category"); 
      router.push(`?${params.toString()}`);
    }
  }, [selectedCategory])
  
  return (
    <div className={styles.categoryContainer}>
      {categories.map((category:Category) => (
        <button
          key={category.category_id}
          onClick={()=> toggleSelectedCategory(category)}
          className={`
            ${styles.categoryItem}
            ${selectedCategory?.category_id === category.category_id
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