/*
 Style HTML
---------------

  Written by Nochum Sossonko, (nsossonko@hotmail.com)

  Based on code initially developed by: Einar Lielmanis, <elfz@laacz.lv>
    http://jsbeautifier.org/


  You are free to use this in any way you want, in case you find this useful or working for you.

  Usage:
    style_html(html_source);

    style_html(html_source, options);

  The options are:
    indent_size (default 4)          â indentation size,
    indent_char (default space)      â character to indent with,
    max_char (default 70)            -  maximum amount of characters per line,
    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.
    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
    indent_scripts (default normal)  - "keep"|"separate"|"normal"

    e.g.

    style_html(html_source, {
      'indent_size': 2,
      'indent_char': ' ',
      'max_char': 78,
      'brace_style': 'expand',
      'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u']
    });
*/
function style_html(l,e){var a,d,f,g,h,j;e=e||{};d=e.indent_size||4;f=e.indent_char||" ";h=e.brace_style||"collapse";g=0==e.max_char?Infinity:e.max_char||70;j=e.unformatted||"a span bdo em strong dfn code samp kbd var cite abbr acronym q sub sup tt i b big small u s strike font ins del pre address dt h1 h2 h3 h4 h5 h6".split(" ");a=new function(){this.pos=0;this.token="";this.current_mode="CONTENT";this.tags={parent:"parent1",parentcount:1,parent1:""};this.token_text=this.last_token=this.last_text=
this.token_type=this.tag_type="";this.Utils={whitespace:["\n","\r","\t"," "],single_token:"br input link meta !doctype basefont base area hr wbr param img isindex ?xml embed ?php ? ?=".split(" "),extra_liners:["head","body","/html"],in_array:function(b,a){for(var c=0;c<a.length;c++)if(b===a[c])return!0;return!1}};this.get_content=function(){for(var b="",a=[],c=!1;"<"!==this.input.charAt(this.pos);){if(this.pos>=this.input.length)return a.length?a.join(""):["","TK_EOF"];b=this.input.charAt(this.pos);
this.pos++;this.line_char_count++;if(this.Utils.in_array(b,this.Utils.whitespace))a.length&&(c=!0),this.line_char_count--;else{if(c){if(this.line_char_count>=this.max_char){a.push("\n");for(c=0;c<this.indent_level;c++)a.push(this.indent_string);this.line_char_count=0}else a.push(" "),this.line_char_count++;c=!1}a.push(b)}}return a.length?a.join(""):""};this.get_contents_to=function(b){if(this.pos==this.input.length)return["","TK_EOF"];var a="";b=RegExp("</"+b+"\\s*>","igm");b.lastIndex=this.pos;b=
(b=b.exec(this.input))?b.index:this.input.length;this.pos<b&&(a=this.input.substring(this.pos,b),this.pos=b);return a};this.record_tag=function(b){this.tags[b+"count"]?this.tags[b+"count"]++:this.tags[b+"count"]=1;this.tags[b+this.tags[b+"count"]]=this.indent_level;this.tags[b+this.tags[b+"count"]+"parent"]=this.tags.parent;this.tags.parent=b+this.tags[b+"count"]};this.retrieve_tag=function(b){if(this.tags[b+"count"]){for(var a=this.tags.parent;a&&b+this.tags[b+"count"]!==a;)a=this.tags[a+"parent"];
a&&(this.indent_level=this.tags[b+this.tags[b+"count"]],this.tags.parent=this.tags[a+"parent"]);delete this.tags[b+this.tags[b+"count"]+"parent"];delete this.tags[b+this.tags[b+"count"]];1==this.tags[b+"count"]?delete this.tags[b+"count"]:this.tags[b+"count"]--}};this.get_tag=function(){var b="",a=[],c=!1,d;do{if(this.pos>=this.input.length)return a.length?a.join(""):["","TK_EOF"];b=this.input.charAt(this.pos);this.pos++;this.line_char_count++;if(this.Utils.in_array(b,this.Utils.whitespace))c=!0,
this.line_char_count--;else{if("'"===b||'"'===b)if(!a[1]||"!"!==a[1])b+=this.get_unformatted(b),c=!0;"="===b&&(c=!1);a.length&&("="!==a[a.length-1]&&">"!==b&&c)&&(this.line_char_count>=this.max_char?(this.print_newline(!1,a),this.line_char_count=0):(a.push(" "),this.line_char_count++),c=!1);"<"===b&&(d=this.pos-1);a.push(b)}}while(">"!==b);b=a.join("");c=-1!=b.indexOf(" ")?b.indexOf(" "):b.indexOf(">");c=b.substring(1,c).toLowerCase();"/"===b.charAt(b.length-2)||this.Utils.in_array(c,this.Utils.single_token)?
this.tag_type="SINGLE":"script"===c?(this.record_tag(c),this.tag_type="SCRIPT"):"style"===c?(this.record_tag(c),this.tag_type="STYLE"):this.Utils.in_array(c,j)?(b=this.get_unformatted("</"+c+">",b),a.push(b),0<d&&this.Utils.in_array(this.input.charAt(d-1),this.Utils.whitespace)&&a.splice(0,0,this.input.charAt(d-1)),d=this.pos-1,this.Utils.in_array(this.input.charAt(d+1),this.Utils.whitespace)&&a.push(this.input.charAt(d+1)),this.tag_type="SINGLE"):"!"===c.charAt(0)?-1!=c.indexOf("[if")?(-1!=b.indexOf("!IE")&&
(b=this.get_unformatted("--\x3e",b),a.push(b)),this.tag_type="START"):-1!=c.indexOf("[endif")?(this.tag_type="END",this.unindent()):(b=-1!=c.indexOf("[cdata[")?this.get_unformatted("]]\x3e",b):this.get_unformatted("--\x3e",b),a.push(b),this.tag_type="SINGLE"):("/"===c.charAt(0)?(this.retrieve_tag(c.substring(1)),this.tag_type="END"):(this.record_tag(c),this.tag_type="START"),this.Utils.in_array(c,this.Utils.extra_liners)&&this.print_newline(!0,this.output));return a.join("")};this.get_unformatted=
function(a,d){if(d&&-1!=d.indexOf(a))return"";var c="",e="",f=!0;do{if(this.pos>=this.input.length)break;c=this.input.charAt(this.pos);this.pos++;if(this.Utils.in_array(c,this.Utils.whitespace)){if(!f){this.line_char_count--;continue}if("\n"===c||"\r"===c){e+="\n";this.line_char_count=0;continue}}e+=c;this.line_char_count++;f=!0}while(-1==e.indexOf(a));return e};this.get_token=function(){var a;if("TK_TAG_SCRIPT"===this.last_token||"TK_TAG_STYLE"===this.last_token){var d=this.last_token.substr(7);
a=this.get_contents_to(d);return"string"!==typeof a?a:[a,"TK_"+d]}if("CONTENT"===this.current_mode)return a=this.get_content(),"string"!==typeof a?a:[a,"TK_CONTENT"];if("TAG"===this.current_mode)return a=this.get_tag(),"string"!==typeof a?a:[a,"TK_TAG_"+this.tag_type]};this.get_full_indent=function(a){a=this.indent_level+a||0;return 1>a?"":Array(a+1).join(this.indent_string)};this.printer=function(a,d,c,e,f){this.input=a||"";this.output=[];this.indent_character=d;this.indent_string="";this.indent_size=
c;this.brace_style=f;this.indent_level=0;this.max_char=e;for(a=this.line_char_count=0;a<this.indent_size;a++)this.indent_string+=this.indent_character;this.print_newline=function(a,b){this.line_char_count=0;if(b&&b.length){if(!a)for(;this.Utils.in_array(b[b.length-1],this.Utils.whitespace);)b.pop();b.push("\n");for(var c=0;c<this.indent_level;c++)b.push(this.indent_string)}};this.print_token=function(a){this.output.push(a)};this.indent=function(){this.indent_level++};this.unindent=function(){0<this.indent_level&&
this.indent_level--}};return this};for(a.printer(l,f,d,g,h);;){d=a.get_token();a.token_text=d[0];a.token_type=d[1];if("TK_EOF"===a.token_type)break;switch(a.token_type){case "TK_TAG_START":a.print_newline(!1,a.output);a.print_token(a.token_text);a.indent();a.current_mode="CONTENT";break;case "TK_TAG_STYLE":case "TK_TAG_SCRIPT":a.print_newline(!1,a.output);a.print_token(a.token_text);a.current_mode="CONTENT";break;case "TK_TAG_END":"TK_CONTENT"===a.last_token&&""===a.last_text&&(d=a.token_text.match(/\w+/)[0],
f=a.output[a.output.length-1].match(/<\s*(\w+)/),(null===f||f[1]!==d)&&a.print_newline(!0,a.output));a.print_token(a.token_text);a.current_mode="CONTENT";break;case "TK_TAG_SINGLE":d=a.token_text.match(/^\s*<([a-z]+)/i);(!d||!a.Utils.in_array(d[1],j))&&a.print_newline(!1,a.output);a.print_token(a.token_text);a.current_mode="CONTENT";break;case "TK_CONTENT":""!==a.token_text&&a.print_token(a.token_text);a.current_mode="TAG";break;case "TK_STYLE":case "TK_SCRIPT":if(""!==a.token_text){a.output.push("\n");
d=a.token_text;if("TK_SCRIPT"==a.token_type)var k="function"==typeof js_beautify&&js_beautify;else"TK_STYLE"==a.token_type&&(k="function"==typeof css_beautify&&css_beautify);g="keep"==e.indent_scripts?0:"separate"==e.indent_scripts?-a.indent_level:1;f=a.get_full_indent(g);k?d=k(d.replace(/^\s*/,f),e):(h=d.match(/^\s*/)[0].match(/[^\n\r]*$/)[0].split(a.indent_string).length-1,g=a.get_full_indent(g-h),d=d.replace(/^\s*/,f).replace(/\r\n|\r|\n/g,"\n"+g).replace(/\s*$/,""));d&&(a.print_token(d),a.print_newline(!0,
a.output))}a.current_mode="TAG"}a.last_token=a.token_type;a.last_text=a.token_text}return a.output.join("")};

var Beautifier = {
    html: function(content) {
        return style_html(content, {
            indent_size: 4,
            max_char: 0
        });
    }
}
