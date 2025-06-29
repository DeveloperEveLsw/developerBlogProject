import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { getHighlighter } from './highlighter';
import rehypeShiki from '@shikijs/rehype'
import rehypeRaw from 'rehype-raw'

const markdownHtmlStringify = async ({markdown}: {markdown: string}) => {
    const highlighter = await getHighlighter();

    const file = await unified()
        .use(remarkParse, {
            commonmark: true
        })
        .use(remarkRehype, {
            allowDangerousHtml: true
        })
        .use(rehypeRaw)
        .use(rehypeShiki, {
          highlighter,
          themes: {
            dark: 'github-dark',
            light: 'github-light'
          }
        })
        .use(rehypeStringify)
        .process(markdown);

    return String(file)
}

export default markdownHtmlStringify