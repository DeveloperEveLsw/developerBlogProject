'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
    const {selectedTags, setSelectedTag, toggleSelectedTag, getTagsParams, setSelectedTags} = SelectedTagsStore() 
  
    useEffect(() => {
        if (!tagsFarams) {
          setSelectedTag(null)
        } else { setSelectedTags(tagsFarams.split(",").map((tag:string)=> { const parma= tag.split("_");return { tag_id:Number(parma[1]),tag_text:parma[0] }} )) }
      }, [tagsFarams]);
    
    useEffect(()=> {
      const params = new URLSearchParams(searchParams.toString());
      if (selectedTags.length > 0) {
        params.set("tags",getTagsParams());
        router.push(`?${params.toString()}`);
      } else {
        params.delete("tags");
        router.push(`?${params.toString()}`);
      }
    }, [selectedTags])

    return (
      <div className={styles.tagContainer}>
        {tags.map((tag:Tag) => (
          <button
            key={tag.tag_id}
            onClick={()=> toggleSelectedTag(tag)}
            className={`
              ${styles.tagItem}
              ${selectedTags.some((some:Tag)=>some.tag_id===tag.tag_id)
                ? styles.tagItem_selected
                : styles.tagItem_unselected
              }
              `
            }
          >
            {tag.tag_text}
          </button>
      ))}
      </div>
    )
}

export default Tags