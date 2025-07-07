import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { getHighlighter } from './highlighter';
import rehypeShiki from '@shikijs/rehype'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkCustomDataBlock from './customDataBlock/customDataBlock'
import rehypeCustomDataBlock from './customDataBlock/rehypeCustomDataBlock'
// types.d.ts 또는 프로젝트의 타입 정의 파일에 추가
import type { Literal } from 'unist';
import type { ElementContent } from 'hast';
import type { Properties } from 'hast';

declare module 'mdast' {
  interface arrayBlock {
    type: string,
    data: number[],
    style: {
        index: number[];
        value: string; // CSS 스타일 문자열
      }[] | null,
    children: []
  }

  interface nestedArrayBlock {
    type: string,
    data: number[][],
    style: {
        index: number[][];
        value: string; // CSS 스타일 문자열
      }[] | null,
    children: []
  }

  interface RootContentMap {
    arrayBlock: arrayBlock,
    nestedArrayBlock: nestedArrayBlock
  }
}

const markdownHtmlStringify = async ({markdown}: {markdown: string}) => {
    const highlighter = await getHighlighter();

    const file = await unified()
        .use(remarkParse, {
            commonmark: true
        })
        .use(remarkBreaks)
        .use(remarkCustomDataBlock)
        .use(remarkRehype, {
            allowDangerousHtml: true,
            passThrough: ['arrayBlock', 'nestedArrayBlock']
            }
        )
        .use(rehypeCustomDataBlock)
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