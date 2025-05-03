"use client"
import React from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { useEffect } from 'react'
import './MarkDownRender.css'

marked.setOptions({
    highlight: function (code, lang) {
        if (hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        else {
            return hljs.highlightAuto(code).value;
        }
      },
  });

const MarkDownRender = ({markdown}) => {

    useEffect(() => {
        document.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightElement(block);
            block.style.backgroundColor = "#f5f5f5";   
            block.style.borderRadius = "15px";
            block.style.margin = "10px 0px 10px 0px";
        });
    }, []);
    
  return (
    <div dangerouslySetInnerHTML={{ __html: marked.parse(markdown)}}
    className="markdown-content" />
  )
}

export default MarkDownRender