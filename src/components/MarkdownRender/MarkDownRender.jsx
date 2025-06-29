import React from 'react'
import 'highlight.js/styles/github.css'
import styles from './MarkDownRender.module.css'
import markdownHtmlStringify from '@/utils/markdownHtmlStringify'


const MarkDownRender = async ({markdown}) => {
    const file = await markdownHtmlStringify({markdown});

    return (
        <div dangerouslySetInnerHTML={{ __html: file }}
        className={styles.markdownContent} />
    )
}

export default MarkDownRender