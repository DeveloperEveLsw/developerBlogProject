"use client"

import styles from './Category.module.css'
import { useRouter } from 'next/navigation';

import React, { useState } from 'react'

interface category_list {
  prop:{
  id:string,
  text:string
}[]
}
interface category_lists {
  id:string,
  text:string
}

export const Category = ({prop}:category_list) => {
  const [category, setCategory] = useState([])
  const router = useRouter()
  const clickHandle = (value:any)=> {
    setCategory(value.target.value)
    console.log(category)
    router.push(`?id=${value.target.value}`)
  }
  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryHead}>카테고리</div>
      <div className={styles.categroyList}>
        { prop.map((category: category_lists)=> ( 
        <div key={category.id}>
          <span className={styles.categoryItem}>
            <input type="radio" id={category.id} name="category" value={category.id} onClick={(value)=>clickHandle(value)} />
            <label htmlFor={category.id}>{category.text}</label>
        </span>
        </div>
        )) }
       </div>
    </div>
  )
}


export default Category