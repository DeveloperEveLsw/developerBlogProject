"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/compat/router'
import { useSearchParams } from 'next/navigation';
import {SelectedTagsStore} from '@/store/SelectedTagsStore'
import styles from './Tags.module.css'
interface Tag {
    tag_id: number
    tag_text: string
  }

const Tags = ({tags} : {tags:Tag[]}) => {

    const router = useRouter();
    const searchParams = useSearchParams();

    const tagsFarams = searchParams.get("tags")
    const {selectedTags, setSelectedTag, toggleSelectedTag} = SelectedTagsStore() 
  
    useEffect(() => {
        console.log(selectedTags)
        console.log(tagsFarams)
        const raw = tagsFarams?.split("_")
        const categoryFromQuery = raw
        ? { category_text: raw[0], category_id: Number(raw[1]) }
        : null;
    
        if (1) {
          //setSelectedCategory(categoryFromQuery); // 쿼리와 상태가 다르면 상태 변경
        }
      }, [tagsFarams]);
    
    
      useEffect(()=> {
        const params = new URLSearchParams(searchParams.toString());
        if (router)
        if (selectedTags) {
          params.set("tags",selectedTags.map(tag=>`${tag.tag_text}_${tag.tag_id}`).join(","));
          router.push(`?${params.toString()}`);
        } else {
          params.delete("tags"); 
          router.push(`?${params.toString()}`);
        }
      }, [selectedTags])

    return (
        <div>
            {tags.map((tag:Tag) => (
        <button
          key={tag.tag_id}
          onClick={()=> toggleSelectedTag(tag)}
          className={`
            ${styles.tagItem}`
        }
          >
          {tag.tag_text}
        </button>
      ))}
        </div>
    )
}

export default Tags