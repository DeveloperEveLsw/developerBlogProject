import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Node } from 'unist';

// remark 플러그인: :::array, :::stack 등 커스텀 데이터 블럭 파싱

function parseStyle(styleText: string) {
    let styleObj: Record<string, string> = {};
    // 오직 0,1{ background: red } 형태만 지원
    const styleRegex = /([\d,~]+)\s*\{([^}]*)\}/g;
    let match;
    while ((match = styleRegex.exec(styleText)) !== null) {
      const key = match[1].trim();
      const cssText = match[2].trim(); // 마지막 ; 제거(선택)
      styleObj[key] = cssText;
    }
    return styleObj;
  }

const dataTypes = ['array', 'nested-array'];
const regex = new RegExp(`^:::(${dataTypes.join('|')})\\s*$`);

export const remarkCustomDataBlock: Plugin = () => {
  return (tree) => {
    visit(tree, 'paragraph', (node: any, index: any, parent: any) => {
      const n = node as any;
      if (!n.children || n.children.length === 0) return;
      const text = n.children[0]?.value;
      if (typeof text !== 'string') return;

      // :::array 블록 감지
      const match = text.match(regex);
      if (match) {
        // 다음 줄이 실제 데이터(예: [1,2,3,4])인지 확인
        const chlidrens = n.children.filter((child: any) => child.type === 'text');
        const nextNode = chlidrens.slice(1, -1);
        const nextText = nextNode?.reduce((acc: string, curr: any) => acc + curr.value, '');
        
        const styleMatch = nextText.match(/:style\s*<<<([\s\S]*?)>>>/m);

        let style = {};
        let value = nextText;

        if (styleMatch) {
          style = parseStyle(styleMatch[1]);
          value = nextText.replace(/:style\s*<<<([\s\S]*?)>>>/m, '').trim();
        }
        
        const endNode = chlidrens[chlidrens.length - 1];
        const isEnd = endNode?.value?.trim() === ':::';
        if (nextText && isEnd) {
          const customNode = {
            type: 'customDataBlock',
            data: {
              dataType: match[1],
              value,
              style
            },
            children: []
          };
          // 3개(paragraph, 데이터, :::)를 customDataBlock 하나로 대체
          parent.children[index] = customNode;
        }
      }
    });
  };
};

export default remarkCustomDataBlock;
