import React from 'react'
import 'highlight.js/styles/github.css'
import styles from './MarkDownRender.module.css'
import markdownHtmlStringify from '@/utils/markdownHtmlStringify'
import MermaidRenderer from './MermaidRenderer'

const MarkDownRender = async ({markdown}) => {
    const file = await markdownHtmlStringify({markdown});

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: file }}
            className={styles.markdownContent} />
            <MermaidRenderer />
        </div>
    )
}

export default MarkDownRender