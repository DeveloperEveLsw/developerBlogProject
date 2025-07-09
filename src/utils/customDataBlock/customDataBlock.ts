import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Node } from 'unist';

import {parse as arrayParse} from './arrayParser.mjs';
import {parse as nestedArrayParse} from './nestedArrayParser.mjs';

const safeParse = (parser: Function, text: string) => {
  try {
    return parser(text)
  } catch {
    return false;
  }
};

export const remarkCustomDataBlock: Plugin = () => {
  return (tree) => {
    visit(tree, 'paragraph', (node: any, index: any, parent: any) => {
      if (!node.children || node.children.length === 0) return;
      try {
        const text = node.children.filter((c:any)=>c.type === 'text').reduce((acc:string,text:any)=>{return acc+text.value}, "")
        if (typeof text !== 'string') return;
        
        if (/^:::/.test(text)) {
          let parse
          if (parse = safeParse(arrayParse, text)) {
            parent.children[index] = parse
            //console.log(parse)
            return      
          }
          else if (parse = safeParse(nestedArrayParse, text)) {
            parent.children[index] = parse
            //console.log(parse)
            return
          }
        }

      } catch(e) {  }
      })
    }
  }

export default remarkCustomDataBlock;
