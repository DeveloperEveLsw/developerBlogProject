"use client"

import React from 'react'
import styles from '@/components/MarkdownRender/MarkDownRender.module.css'
import markdownHtmlStringify from '@/utils/markdownHtmlStringify'
import { useEffect, useState } from 'react'
import MermaidRenderer from '@/components/MarkdownRender/MermaidRenderer'

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
        <div>
            <div dangerouslySetInnerHTML={{ __html: file }}
            className={styles.markdownContent} />
            <MermaidRenderer file={file}/>
        </div>
    )
}





export default ClientMarkdownRender