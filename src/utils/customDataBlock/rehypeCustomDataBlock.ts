import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);
  

const twoDRange = (xStart: any, xEnd: any, yStart: any, yEnd: any) =>
    Array.from({ length: yEnd - yStart + 1 }, (_, y) =>
      Array.from({ length: xEnd - xStart + 1 }, (_, x) => [x + xStart, y + yStart])
    );


const rehypeCustomDataBlock: Plugin = () => {
  return (tree) => {
    visit(tree, 'customDataBlock', (node: any, index: any, parent: any) => {
      console.log(node)
        if (!parent || index == null) return;
      if (node.data?.dataType === 'array' || node.data?.dataType === 'nested-array') {
        let arr = [];
        try {
          arr = JSON.parse(node.data.value);
        } catch {
          arr = [node.data.value];
        }
        let htmlNode: any
        
        if(node.data.dataType === 'nested-array'){
            htmlNode = {
                type: 'element',
                tagName: 'table',
                properties: { className: ['array-block'] },
                children: arr.map((v: any)=> {
                if (!Array.isArray(v)) v = [v];
                return {
                    type: 'element',
                    tagName: 'tr',
                    properties: {},
                    children: v.map((r: any) => ({
                        type: 'element',
                        tagName: 'td',
                        properties: { className: ['array-item'] },
                        children: [{ type: 'text', value: String(r) }]
                    }))
                    }
                }
                )
            };
        }

        if(node.data.dataType === 'array'){
            htmlNode = {
                type: 'element',
                tagName: 'table',
                properties: { className: ['array-block'] },
                children: [
                    {
                    type: 'element',  
                    tagName: 'tr',
                    properties: {},
                    children: arr.map((v: any) => ({
                        type: 'element',
                        tagName: 'td',
                        properties: { className: ['array-item'] },
                        children: [{ type: 'text', value: String(v) }]
                    }))
                    }
                ]
                };
            try {
                if (node.data.style) {
                    Object.keys(node.data.style).forEach(keys=>{
                        keys.split(",").forEach(key=>{
                            console.log(key)
                            let s_key = key.split("~").map(Number)
                            console.log(s_key)
                            if (s_key.length === 2) {
                                s_key = range(s_key[0], s_key[1])
                                console.log(s_key)
                            }  
                            s_key.forEach(s=>
                                htmlNode.children[0].children[s].properties["style"] = node.data.style[keys]
                            )
                            
                        })
                    })
                }
            } catch(e) { }
            }
        
        console.log(htmlNode)
        
        parent.children[index] = htmlNode;
        }
    });
  };
};

export default rehypeCustomDataBlock; 