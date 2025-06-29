import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { getHighlighter } from './highlighter';
import rehypeShiki from '@shikijs/rehype'

const markdownHtmlStringify = async ({markdown}: {markdown: string}) => {
    const highlighter = await getHighlighter();

    const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
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