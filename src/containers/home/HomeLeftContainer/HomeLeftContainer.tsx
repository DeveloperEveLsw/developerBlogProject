import Category from '@/components/Category/Category'
import React from 'react'
import styles from "./HomeLeftContainer.module.css"

interface category_list {
  id:string,
  text:string
}
const props: category_list[] = [ { id : '1', text : '벡엔드'},
  { id : '2', text : '프론트엔드'},
  { id : '3', text : '알고리즘'}
 ]
const HomeLeftContainer = async () => {
  
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL 
    
  const response = await fetch(`http://${hostUrl}/api/category`).then((res)=> res.json())
  return (
    <div className={styles["container"]}>
        <Category prop ={props}></Category>
    </div>
  )
}

export default HomeLeftContainer