'use client'

import { useEffect } from "react";
import mermaid from 'mermaid';


export default function MermaidRenderer({file}: {file:string}) {
    useEffect(() => {
      (async () => {
        try {
          mermaid.initialize({ startOnLoad: true });
          await mermaid.run(); // 또는 mermaid.init(undefined, '.mermaid');
        } catch(e) { console.log(e) }
      })()
    })
    return null; // 렌더링만 담당, 별도 UI 없음
  }