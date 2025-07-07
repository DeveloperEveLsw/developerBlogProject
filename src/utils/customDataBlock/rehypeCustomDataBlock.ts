import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface arrayBlock_mdast {
    type: string,
    data: number[],
    style: {
        index: number[];
        value: string; // CSS 스타일 문자열
      }[] | null,
    children: []
  }

interface nestedArrayBlock_mdast {
    type: string,
    data: number[][],
    style: {
        index: number[][];
        value: string; // CSS 스타일 문자열
      }[] | null,
    children: []
  }


const rehypeCustomDataBlock: Plugin = () => {
  return (tree) => {
    visit(tree, 'arrayBlock', (node:arrayBlock_mdast, index: any, parent: any) => {
    
        let htmlNode: any= {
            type: 'element',
            tagName: 'table',
            properties: { className: ['array-block'] },
            children: [
                {
                type: 'element',  
                tagName: 'tr',
                properties: {},
                children: node.data.map((n: number) => ({
                    type: 'element',
                    tagName: 'td',
                    properties: { className: ['array-item'] },
                    children: [{ type: 'text', value: String(n) }]
                }))
                }
            ]
            };
        console.log(htmlNode)
        try {
            if (node.style) {
                node.style.forEach(({index, value})=> {
                    index.forEach(x=> htmlNode.children[0].children[x].properties["style"] = value)
                })
            }
        } catch(e) {console.log(e)}
        finally { parent.children[index] = htmlNode; } 
    })



    visit(tree, 'nestedArrayBlock', (node:nestedArrayBlock_mdast, index: any, parent: any) => {
    
        let htmlNode: any= {
            type: 'element',
            tagName: 'table',
            properties: { className: ['array-block'] },
            children: node.data.map(tr=> ({
                type: 'element',  
                tagName: 'tr',
                properties: {},
                children: tr.map((n: number) => ({
                    type: 'element',
                    tagName: 'td',
                    properties: { className: ['array-item'] },
                    children: [{ type: 'text', value: String(n) }]
                }))
            })
        )};

        console.log(htmlNode)
        try {
            if (node.style) {
                node.style.forEach(({index, value})=> {
                    index.forEach(pointer=> htmlNode.children[pointer[1]].children[pointer[0]].properties["style"] = value)
                })
            }
        } catch(e) {console.log(e)}
        finally { parent.children[index] = htmlNode; } 
    })

  }
};

export default rehypeCustomDataBlock; 