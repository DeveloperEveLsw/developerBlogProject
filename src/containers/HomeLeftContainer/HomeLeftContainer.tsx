import Category from '@/components/Category'
import React from 'react'
import styles from "./HomeLeftContainer.module.css"


const HomeLeftContainer = () => {
  return (
    <div className={styles["container"]}>
        <Category></Category>
    </div>
  )
}

export default HomeLeftContainer