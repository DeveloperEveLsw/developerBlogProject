"use client"

import React from 'react'
import styles from '@/components/MarkdownRender/MarkDownRender.module.css'
import markdownHtmlStringify from '@/utils/markdownHtmlStringify'
import { useEffect, useState } from 'react'

const ClientMarkdownRender = ({markdown}: {markdown: string}) => {
    
    const [file, setFile] = useState<string>('');

    useEffect(() => {
        const fetchFile = async () => {
            const file = await markdownHtmlStringify({markdown});
            setFile(file);
        }
        fetchFile();
    }, [markdown]);

    return (
        <div dangerouslySetInnerHTML={{ __html: file }}
        className={styles.markdownContent} />
    )
}

export default ClientMarkdownRender