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


/*
 CSS Beautifier
---------------

    Written by Harutyun Amirjanyan, (amirjanyan@gmail.com)

    Based on code initially developed by: Einar Lielmanis, <elfz@laacz.lv>
        http://jsbeautifier.org/


    You are free to use this in any way you want, in case you find this useful or working for you.

    Usage:
        css_beautify(source_text);
        css_beautify(source_text, options);

    The options are:
        indent_size (default 4)          â indentation size,
        indent_char (default space)      â character to indent with,

    e.g

    css_beautify(css_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });
*/

// http://www.w3.org/TR/CSS21/syndata.html#tokenization
// http://www.w3.org/TR/css3-syntax/

function css_beautify(f,k){function g(){return a=f.charAt(++c)}function p(b){for(var d=c;g();)if("\\"==a)g(),g();else if(a==b)break;else if("\n"==a)break;return f.substring(d,c+1)}function l(){for(var a=c;m.test(f.charAt(c+1));)c++;return c!=a}function r(){var b=c;for(g();g();)if("*"==a&&"/"==f.charAt(c+1)){c++;break}return f.substring(b,c+1)}k=k||{};var h=k.indent_size||4,n=k.indent_char||" ";"string"==typeof h&&(h=parseInt(h));var m=/^\s+$/,c=-1,a,d=f.match(/^[\r\n]*[\t ]*/)[0],n=Array(h+1).join(n),
q=0,e={"{":function(a){e.singleSpace();b.push(a);e.newLine()},"}":function(a){e.newLine();b.push(a);e.newLine()},newLine:function(a){if(!a)for(;m.test(b[b.length-1]);)b.pop();b.length&&b.push("\n");d&&b.push(d)},singleSpace:function(){b.length&&!m.test(b[b.length-1])&&b.push(" ")}},b=[];for(d&&b.push(d);;){var j;j=c;do;while(m.test(g()));j=c!=j+1;if(!a)break;"{"==a?(q++,d+=n,e["{"](a)):"}"==a?(q--,d=d.slice(0,-h),e["}"](a)):'"'==a||"'"==a?b.push(p(a)):";"==a?b.push(a,"\n",d):"/"==a&&"*"==f.charAt(c+
1)?(e.newLine(),b.push(r(),"\n",d)):"("==a?"url"==b.slice(-4,-1).join("").toLowerCase()?(b.push(a),l(),g()&&(")"!=a&&'"'!=a&&"'"!=a?b.push(p(")")):c--)):(j&&e.singleSpace(),b.push(a),l()):")"==a?b.push(a):","==a?(l(),b.push(a),e.singleSpace()):("]"!=a&&("["==a||"="==a?l():j&&e.singleSpace()),b.push(a))}return b.join("").replace(/[\n ]+$/,"")};

/*
 JS Beautifier
---------------
  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>

  You are free to use this in any way you want, in case you find this useful or working for you.

  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          - indentation size,
    indent_char (default space)      - character to indent with,
    preserve_newlines (default true) - whether existing line breaks should be preserved,
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) - if true, then jslint-stricter mode is enforced.

            jslint_happy   !jslint_happy
            ---------------------------------
             function ()      function()

    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "expand-strict"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.

            expand-strict: put brace on own line even in such cases:

                var a =
                {
                    a: 5,
                    b: 6
                }
            This mode may break your scripts - e.g "return { a: 1 }" will be broken into two lines, so beware.

    space_before_conditional (default true) - should the space before conditional statement be added, "if(true)" vs "if (true)",

    unescape_strings (default false) - should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"

    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });
*/
function js_beautify(D,j){function G(a){for(a="undefined"===typeof a?!1:a;m.length&&(" "===m[m.length-1]||m[m.length-1]===B||m[m.length-1]===H||a&&("\n"===m[m.length-1]||"\r"===m[m.length-1]));)m.pop()}function R(a){return a.replace(/^\s\s*|\s\s*$/,"")}function k(a,c){b.eat_next_space=!1;if(!v||!I(b.mode)){a="undefined"===typeof a?!0:a;if("undefined"===typeof c||c)b.if_line=!1,b.chain_extra_indentation=0;G();if(m.length){if("\n"!==m[m.length-1]||!a)C=!0,m.push("\n");H&&m.push(H);for(var d=0;d<b.indentation_level+
b.chain_extra_indentation;d+=1)m.push(B);b.var_line&&b.var_line_reindented&&m.push(B)}}}function l(){if("TK_COMMENT"===d)return k();if(b.eat_next_space)b.eat_next_space=!1;else{var a=" ";m.length&&(a=m[m.length-1]);" "!==a&&("\n"!==a&&a!==B)&&m.push(" ")}}function n(){C=!1;b.eat_next_space=!1;m.push(q)}function S(){m.length&&m[m.length-1]===B&&m.pop()}function x(a){b&&L.push(b);b={previous_mode:b?b.mode:"BLOCK",mode:a,var_line:!1,var_line_tainted:!1,var_line_reindented:!1,in_html_comment:!1,if_line:!1,
chain_extra_indentation:0,in_case_statement:!1,in_case:!1,case_body:!1,eat_next_space:!1,indentation_level:b?b.indentation_level+(b.var_line&&b.var_line_reindented?1:0):0,ternary_depth:0}}function I(a){return"[EXPRESSION]"===a||"[INDENTED-EXPRESSION]"===a}function J(a){return r(a,["[EXPRESSION]","(EXPRESSION)","(FOR-EXPRESSION)","(COND-EXPRESSION)"])}function M(){N="DO_BLOCK"===b.mode;if(0<L.length){var a=b.mode;b=L.pop();b.previous_mode=a}}function K(a){return r(a,"case return do if throw else".split(" "))}
function r(a,b){for(var d=0;d<b.length;d+=1)if(b[d]===a)return!0;return!1}function U(b){for(var c=a,d=h.charAt(c);r(d,O)&&d!==b;){c++;if(c>=s)return 0;d=h.charAt(c)}return d}function T(){var f;w=0;if(a>=s)return["","TK_EOF"];A=!1;var c=h.charAt(a);a+=1;if(v&&I(b.mode)){for(var e=0;r(c,O);){"\n"===c?(G(),m.push("\n"),C=!0,e=0):"\t"===c?e+=4:"\r"!==c&&(e+=1);if(a>=s)return["","TK_EOF"];c=h.charAt(a);a+=1}if(C)for(f=0;f<e;f++)m.push(" ")}else{for(;r(c,O);){"\n"===c&&(w+=V?w<=V?1:0:1);if(a>=s)return["",
"TK_EOF"];c=h.charAt(a);a+=1}if(P&&1<w)for(f=0;f<w;f+=1)k(0===f),C=!0;A=0<w}if(r(c,Q)){if(a<s)for(;r(h.charAt(a),Q)&&!(c+=h.charAt(a),a+=1,a===s););if(a!==s&&c.match(/^[0-9]+[Ee]$/)&&("-"===h.charAt(a)||"+"===h.charAt(a)))return f=h.charAt(a),a+=1,e=T(),c+=f+e[0],[c,"TK_WORD"];if("in"===c)return[c,"TK_OPERATOR"];A&&("TK_OPERATOR"!==d&&"TK_EQUALS"!==d&&!b.if_line&&(P||"var"!==g))&&k();return[c,"TK_WORD"]}if("("===c||"["===c)return[c,"TK_START_EXPR"];if(")"===c||"]"===c)return[c,"TK_END_EXPR"];if("{"===
c)return[c,"TK_START_BLOCK"];if("}"===c)return[c,"TK_END_BLOCK"];if(";"===c)return[c,"TK_SEMICOLON"];if("/"===c){f="";e=!0;if("*"===h.charAt(a)){a+=1;if(a<s)for(;a<s&&!("*"===h.charAt(a)&&h.charAt(a+1)&&"/"===h.charAt(a+1));){c=h.charAt(a);f+=c;if("\n"===c||"\r"===c)e=!1;a+=1;if(a>=s)break}a+=2;return e&&0===w?["/*"+f+"*/","TK_INLINE_COMMENT"]:["/*"+f+"*/","TK_BLOCK_COMMENT"]}if("/"===h.charAt(a)){for(f=c;"\r"!==h.charAt(a)&&"\n"!==h.charAt(a)&&!(f+=h.charAt(a),a+=1,a>=s););A&&k();return[f,"TK_COMMENT"]}}if("'"===
c||'"'===c||"/"===c&&("TK_WORD"===d&&K(g)||")"===g&&r(b.previous_mode,["(COND-EXPRESSION)","(FOR-EXPRESSION)"])||"TK_COMMA"===d||"TK_COMMENT"===d||"TK_START_EXPR"===d||"TK_START_BLOCK"===d||"TK_END_BLOCK"===d||"TK_OPERATOR"===d||"TK_EQUALS"===d||"TK_EOF"===d||"TK_SEMICOLON"===d)){var e=c,l=!1,j=0,n=0;f=c;if(a<s)if("/"===e)for(c=!1;l||c||h.charAt(a)!==e;){if(f+=h.charAt(a),l?l=!1:(l="\\"===h.charAt(a),"["===h.charAt(a)?c=!0:"]"===h.charAt(a)&&(c=!1)),a+=1,a>=s)return[f,"TK_STRING"]}else for(;l||h.charAt(a)!==
e;){f+=h.charAt(a);if(j&&j>=n){if((j=parseInt(f.substr(-n),16))&&32<=j&&126>=j)j=String.fromCharCode(j),f=f.substr(0,f.length-n-2)+(j===e||"\\"===j?"\\":"")+j;j=0}j?j++:l?(l=!1,X&&("x"===h.charAt(a)?(j++,n=2):"u"===h.charAt(a)&&(j++,n=4))):l="\\"===h.charAt(a);a+=1;if(a>=s)return[f,"TK_STRING"]}a+=1;f+=e;if("/"===e)for(;a<s&&r(h.charAt(a),Q);)f+=h.charAt(a),a+=1;return[f,"TK_STRING"]}if("#"===c){if(0===m.length&&"!"===h.charAt(a)){for(f=c;a<s&&"\n"!==c;)c=h.charAt(a),f+=c,a+=1;m.push(R(f)+"\n");k();
return T()}f="#";if(a<s&&r(h.charAt(a),W)){do c=h.charAt(a),f+=c,a+=1;while(a<s&&"#"!==c&&"="!==c);"#"!==c&&("["===h.charAt(a)&&"]"===h.charAt(a+1)?(f+="[]",a+=2):"{"===h.charAt(a)&&"}"===h.charAt(a+1)&&(f+="{}",a+=2));return[f,"TK_WORD"]}}if("<"===c&&"\x3c!--"===h.substring(a-1,a+3)){a+=3;for(c="\x3c!--";"\n"!==h.charAt(a)&&a<s;)c+=h.charAt(a),a++;b.in_html_comment=!0;return[c,"TK_COMMENT"]}if("-"===c&&b.in_html_comment&&"--\x3e"===h.substring(a-1,a+2))return b.in_html_comment=!1,a+=2,A&&k(),["--\x3e",
"TK_COMMENT"];if("."===c)return[c,"TK_DOT"];if(r(c,E)){for(;a<s&&r(c+h.charAt(a),E)&&!(c+=h.charAt(a),a+=1,a>=s););return","===c?[c,"TK_COMMA"]:"="===c?[c,"TK_EQUALS"]:[c,"TK_OPERATOR"]}return[c,"TK_UNKNOWN"]}var h,m,q,d,g,p,u,b,L,B,O,Q,E,a,y,W,e,F,N,A,C,w,H="";j=j?j:{};var t;void 0!==j.space_after_anon_function&&void 0===j.jslint_happy&&(j.jslint_happy=j.space_after_anon_function);void 0!==j.braces_on_own_line&&(t=j.braces_on_own_line?"expand":"collapse");t=j.brace_style?j.brace_style:t?t:"collapse";
y=j.indent_size?j.indent_size:4;u=j.indent_char?j.indent_char:" ";var P="undefined"===typeof j.preserve_newlines?!0:j.preserve_newlines,Y="undefined"===typeof j.break_chained_methods?!1:j.break_chained_methods,V="undefined"===typeof j.max_preserve_newlines?!1:j.max_preserve_newlines,Z="undefined"===j.jslint_happy?!1:j.jslint_happy,v="undefined"===typeof j.keep_array_indentation?!1:j.keep_array_indentation,$="undefined"===typeof j.space_before_conditional?!0:j.space_before_conditional,X="undefined"===
typeof j.unescape_strings?!1:j.unescape_strings;C=!1;var s=D.length;for(B="";0<y;)B+=u,y-=1;for(;D&&(" "===D.charAt(0)||"\t"===D.charAt(0));)H+=D.charAt(0),D=D.substring(1);h=D;u="";d="TK_START_EXPR";p=g="";m=[];N=!1;O=["\n","\r","\t"," "];Q="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$".split("");W="0123456789".split("");E="+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |= ::";E+=" <%= <% %> <?= <? ?>";E=E.split(" ");
y="continue try throw return var if switch case default for while break function".split(" ");L=[];x("BLOCK");for(a=0;;){F=T();q=F[0];F=F[1];if("TK_EOF"===F)break;switch(F){case "TK_START_EXPR":if("["===q){if("TK_WORD"===d||")"===g){r(g,y)&&l();x("(EXPRESSION)");n();break}"[EXPRESSION]"===b.mode||"[INDENTED-EXPRESSION]"===b.mode?"]"===p&&","===g?("[EXPRESSION]"===b.mode&&(b.mode="[INDENTED-EXPRESSION]",v||(b.indentation_level+=1)),x("[EXPRESSION]"),v||k()):"["===g?("[EXPRESSION]"===b.mode&&(b.mode=
"[INDENTED-EXPRESSION]",v||(b.indentation_level+=1)),x("[EXPRESSION]"),v||k()):x("[EXPRESSION]"):x("[EXPRESSION]")}else"for"===u?x("(FOR-EXPRESSION)"):r(u,["if","while"])?x("(COND-EXPRESSION)"):x("(EXPRESSION)");";"===g||"TK_START_BLOCK"===d?k():"TK_END_EXPR"===d||"TK_START_EXPR"===d||"TK_END_BLOCK"===d||"."===g?A&&k():"TK_WORD"!==d&&"TK_OPERATOR"!==d?l():"function"===u||"typeof"===u?Z&&l():(r(g,y)||"catch"===g)&&$&&l();n();break;case "TK_DOT":if(K(g))l();else if(")"===g&&(Y||A))b.chain_extra_indentation=
1,k(!0,!1);n();break;case "TK_END_EXPR":if("]"===q)if(v){if("}"===g){S();n();M();break}}else if("[INDENTED-EXPRESSION]"===b.mode&&"]"===g){M();k();n();break}M();n();break;case "TK_START_BLOCK":"do"===u?x("DO_BLOCK"):x("BLOCK");"expand"===t||"expand-strict"===t?(p=!1,"expand-strict"===t?(p="}"===U())||k(!0):"TK_OPERATOR"!==d&&("="===g||K(g)&&"else"!==g?l():k(!0)),n(),p||(b.indentation_level+=1)):("TK_OPERATOR"!==d&&"TK_START_EXPR"!==d?"TK_START_BLOCK"===d?k():l():I(b.previous_mode)&&","===g&&("}"===
p?l():k()),b.indentation_level+=1,n());break;case "TK_END_BLOCK":M();"expand"===t||"expand-strict"===t?"{"!==g&&k():"TK_START_BLOCK"===d?C?S():G():I(b.mode)&&v?(v=!1,k(),v=!0):k();n();break;case "TK_WORD":if(N){l();n();l();N=!1;break}e="NONE";if("function"===q){b.var_line&&"TK_EQUALS"!==d&&(b.var_line_reindented=!0);if((C||";"===g)&&"{"!==g&&"TK_BLOCK_COMMENT"!==d&&"TK_COMMENT"!==d){w=C?w:0;P||(w=1);for(u=0;u<2-w;u++)k(!1)}"TK_WORD"===d?"get"===g||"set"===g||"new"===g||"return"===g?l():k():"TK_OPERATOR"===
d||"="===g?l():J(b.mode)||k();n();u=q;break}if("case"===q||"default"===q&&b.in_case_statement){k();b.case_body&&(b.indentation_level--,b.case_body=!1,S());n();b.in_case=!0;b.in_case_statement=!0;break}"TK_END_BLOCK"===d?r(q.toLowerCase(),["else","catch","finally"])?"expand"===t||"end-expand"===t||"expand-strict"===t?e="NEWLINE":(e="SPACE",l()):e="NEWLINE":"TK_SEMICOLON"===d&&("BLOCK"===b.mode||"DO_BLOCK"===b.mode)?e="NEWLINE":"TK_SEMICOLON"===d&&J(b.mode)?e="SPACE":"TK_STRING"===d?e="NEWLINE":"TK_WORD"===
d?("else"===g&&G(!0),e="SPACE"):"TK_START_BLOCK"===d?e="NEWLINE":"TK_END_EXPR"===d&&(l(),e="NEWLINE");r(q,y)&&")"!==g&&(e="else"===g?"SPACE":"NEWLINE");b.if_line&&"TK_END_EXPR"===d&&(b.if_line=!1);if(r(q.toLowerCase(),["else","catch","finally"]))"TK_END_BLOCK"!==d||"expand"===t||"end-expand"===t||"expand-strict"===t?k():(G(!0),l());else if("NEWLINE"===e)if(K(g))l();else if("TK_END_EXPR"!==d){if(("TK_START_EXPR"!==d||"var"!==q)&&":"!==g)"if"===q&&"else"===u&&"{"!==g?l():(b.var_line=!1,b.var_line_reindented=
!1,k())}else r(q,y)&&")"!==g&&(b.var_line=!1,b.var_line_reindented=!1,k());else I(b.mode)&&","===g&&"}"===p?k():"SPACE"===e&&l();n();u=q;"var"===q&&(b.var_line=!0,b.var_line_reindented=!1,b.var_line_tainted=!1);"if"===q&&(b.if_line=!0);"else"===q&&(b.if_line=!1);break;case "TK_SEMICOLON":n();b.var_line=!1;b.var_line_reindented=!1;"OBJECT"===b.mode&&(b.mode="BLOCK");break;case "TK_STRING":"TK_END_EXPR"===d&&r(b.previous_mode,["(COND-EXPRESSION)","(FOR-EXPRESSION)"])?l():"TK_COMMENT"===d||"TK_STRING"===
d||"TK_START_BLOCK"===d||"TK_END_BLOCK"===d||"TK_SEMICOLON"===d?k():"TK_WORD"===d?l():P&&A&&(k(),m.push(B));n();break;case "TK_EQUALS":b.var_line&&(b.var_line_tainted=!0);l();n();l();break;case "TK_COMMA":if(b.var_line){if(J(b.mode)||"TK_END_BLOCK"===d)b.var_line_tainted=!1;if(b.var_line_tainted){n();b.var_line_reindented=!0;b.var_line_tainted=!1;k();break}else b.var_line_tainted=!1;n();l();break}"TK_COMMENT"===d&&k();"TK_END_BLOCK"===d&&"(EXPRESSION)"!==b.mode?(n(),"OBJECT"===b.mode&&"}"===g?k():
l()):"OBJECT"===b.mode?(n(),k()):(n(),l());break;case "TK_OPERATOR":var z=e=!0;if(K(g)){l();n();break}if("*"===q&&"TK_DOT"===d&&!p.match(/^\d+$/)){n();break}if(":"===q&&b.in_case){b.case_body=!0;b.indentation_level+=1;n();k();b.in_case=!1;break}if("::"===q){n();break}r(q,["--","++","!"])||r(q,["-","+"])&&(r(d,["TK_START_BLOCK","TK_START_EXPR","TK_EQUALS","TK_OPERATOR"])||r(g,y)||","==g)?(z=e=!1,";"===g&&J(b.mode)&&(e=!0),"TK_WORD"===d&&r(g,y)&&(e=!0),"BLOCK"===b.mode&&("{"===g||";"===g)&&k()):":"===
q?0===b.ternary_depth?("BLOCK"===b.mode&&(b.mode="OBJECT"),e=!1):b.ternary_depth-=1:"?"===q&&(b.ternary_depth+=1);e&&l();n();z&&l();break;case "TK_BLOCK_COMMENT":p=q;p=p.replace(/\x0d/g,"");e=[];for(z=p.indexOf("\n");-1!==z;)e.push(p.substring(0,z)),p=p.substring(z+1),z=p.indexOf("\n");p.length&&e.push(p);p=e;a:{e=p.slice(1);for(z=0;z<e.length;z++)if("*"!==R(e[z]).charAt(0)){e=!1;break a}e=!0}if(e){k();m.push(p[0]);for(e=1;e<p.length;e++)k(),m.push(" "),m.push(R(p[e]))}else{1<p.length?k():"TK_END_BLOCK"===
d?k():l();for(e=0;e<p.length;e++)m.push(p[e]),m.push("\n")}"\n"!==U("\n")&&k();break;case "TK_INLINE_COMMENT":l();n();J(b.mode)?l():(p=v,v=!1,k(),v=p);break;case "TK_COMMENT":","===g&&!A&&G(!0);"TK_COMMENT"!==d&&(A?k():l());n();k();break;case "TK_UNKNOWN":n()}p=g;d=F;g=q}return H+m.join("").replace(/[\r\n ]+$/,"")};

var Beautifier = {
    js: function(content) {
        return js_beautify(content, {
            indent_size: 4,
            space_before_conditional: true,
            jslint_happy: true,
            max_char: 0
        });
    },
    html: function(content) {
        return style_html(content, {
            indent_size: 4,
            max_char: 0
        });
    },
    css: function(content) {
        return css_beautify(content, {
            indent_size: 4,
            max_char: 0
        });
    }
}
