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

import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';


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

const rehypeMermaid: Plugin = () => {
  return (tree) => {
    visit(tree, 'element', (node:any, index:number, parent) => {
      if (
        node.tagName === 'code' &&
        node.properties?.className?.includes('language-mermaid') &&
        parent?.tagName === 'pre'
      ) {
        const mermaidCode = node.children?.[0]?.value || '';
        parent.children[index] = {
          type: 'text',
          value: '', // 기존 <code> 제거
        };
        parent.tagName = 'pre';
        parent.properties = { className: ['mermaid'] };
        parent.children = [{ type: 'text', value: mermaidCode }];
      }
    });
  };
};



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
        .use(rehypeMermaid)
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