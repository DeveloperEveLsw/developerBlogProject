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
  interface customDataBlock extends Literal {
    type: 'customDataBlock';
    data?: {
      hName?: string;
      hProperties?: Properties;
      hChildren?: ElementContent[]; // ⬅️ 여기 타입 바꿔주기!
    };
  }

  interface RootContentMap {
    customDataBlock: customDataBlock;
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
            passThrough: ['customDataBlock']
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