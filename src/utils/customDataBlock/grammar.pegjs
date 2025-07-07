  start 
    = ":::array" _ data:data _ style:style? _ ":::" {
      return { type:"arrayBlock" ,data, style, children:[] }
    }
  Integer "integer"
    = _ [0-9]+ { return parseInt(text(), 10); }

  dataType
    = chars:[a-zA-Z\-]+ { return chars.join(""); }

  data
    = "[" _ head:Integer _ tail:(_ "," _ Integer _)* "]" {
      return [head, ...tail.map((t)=>t[3])] }

  style
    = ":style" _ "{" _ tail:(_ selecters _ "{" _ styleProperty* _ "}")* _ "}" { 
      return tail.map(t=> {
        return { index:t[1],value:t[5].reduce((acc, text)=> acc+" "+text) }
        })
    }

  selecters
    = head:selecter _ tail:(_ "," _ selecter)*  {
      const all = [head,...tail.map(t=>t[3])];
      return all.flat();
  }

  selecter  
    = from:Integer _ "~" _ to:Integer {
        const start = Math.min(from, to);
        const end = Math.max(from, to);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
    / n:Integer { return [n]; }
  styleProperty
    = _ name:propertyName _ ":" _ value:propertyValue _ ";" _ {
        return name+": "+value+";";
      }

  propertyName
    = chars:[a-zA-Z\-]+ { return chars.join(""); }

  propertyValue
    = chars:[^;]+ { return chars.join("").trim(); }

  _ "whitespace" = [ \t\n\r]*