# Editr

## About

Editr is a HTML, CSS and JavaScript playground that you can host on your server. it is based on ACE Editor. It’s super easy to setup and supports multiple instances on one page. Configurations are available via JS object or HTML attributes.

You can check demo and read more about features [here](http://lab.idered.pl/editr).

## Files structure

```
.
|---. editr
|   |--- editr.js
|   |--- editr.css
|   |--- items
|   |---. items
|       |--- index.html
|   |---. parsers
|       |--- less.js
|       |--- coffeescript.js
```

**editr**
Folder containing Editr script, style and projects folder

**editr.js**
Editr main script. It's quite clean and have some comments so have fun with digging it.

**editr.css**
Editr style, it contains only some basic style so you can easily customize it.

**items**
Folder containing all your projects(can be configured).

**index.html**
Required file with basic html, used as default file when no files were added for html, css or js.

**parsers**
Put here your HTML, CSS, JS preprocessors. Contains LESS and CoffeeScript by default.

## Dependencies

* jQuery `//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js`
* ACE Editor `https://rawgithub.com/ajaxorg/ace-builds/master/src/ace.js`
* Emmet extension for ACE `https://rawgithub.com/ajaxorg/ace-builds/master/src/ext-emmet.js`
* Emmet core `https://rawgithub.com/nightwing/emmet-core/master/emmet.js`

You also have to add parsers if you want to support preprocessors:

* Coffescript `editr/parsers/coffeescript.js`
* LESS `editr/parsers/less.js`

## Installation

Copy `editr` folder to root of your website.

Add this in `<head>`:

```html
<link rel="stylesheet" href="/editr/editr.css">
```

and this before `</body>`:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="https://rawgithub.com/ajaxorg/ace-builds/master/src/ace.js"></script>
<script src="https://rawgithub.com/ajaxorg/ace-builds/master/src/ext-emmet.js"></script>
<script src="https://rawgithub.com/nightwing/emmet-core/master/emmet.js"></script>
<script src="/editr/editr.js"></script>
```

Additionally you can add(before Editr script) LESS and CoffeeScript compilers if you're going to use them:

```html
<script src="/editr/parsers/coffeescript.js"></script>
<script src="/editr/parsers/less.js"></script>
```

Embed single editor:

```html
<div class="editr" data-item="PROJECT-NAME" data-files-html="index-1.html;index-2.html" data-files-css="!normalize.css;style.css" data-files-js="!jquery.js;script.js"></div>
```

Run it:

```javascript
$('.editr').each(function() {
    new Editr({ el: this });
});
```

This will load project named 'PROJECT-NAME' from 'items/' folder(Editr default value). Files passed in data-files-[html/css/js] will be loaded in a queue. Files with '!' before name will be hidden from Editr navigation bar.


## Options

### Via HTML data- attribute

Name | Default | Description
--- |:---:| ---
item | `null` | Name of project folder inside projects folder('path' option).
view | `single` | Editr layout view. Other options: `horizontal`, `vertical`, `cartesian`.
path | `items` | Path to folder with projects.
theme | `monokai` | ACE Editor theme.
hide | `null` | This attribute allows you to hide elements from Editr toolbar. Values: `all result html css js`.
readonly | `false` | Make Editr textarea read-only.
files-html | `null` | HTML Files. Base64 and Gists are supported.
files-css | `null` | CSS Files. LESS is supported. Base64 and Gists are supported.
files-js | `null` | JavaScript Files. CoffeeScript is supported. Base64 and Gists are supported.

**Notes:**

 * `data-` attributes overwrites options passed via JS.
 * Files passed in files-[html,css,js] should be separated by `;`.

#### Valid ways to add files

Desciption | Code | Note
--- | --- | ---
Single file | `index.html`
Multiple files | `index.html; other-page.html` | Separated by `;`
Hide file from nav| `!index.html` | Add `!` before name
Read base64 string | `Ym9keSB7IHdpZHRoOiA1MCU7IH0=` | Separate multiple strings like normal files
Hide base64 content from nav | `!Ym9keSB7IHdpZHRoOiA1MCU7IH0=`
Use preprocessor on base64 string | `less:Ym9keSB7IHdpZHRoOiA1MCU7IH0=;` | You can hide it from nav by adding `!` before preprocessor name
Github Gist single file | `$4631473,jquery.js;script.js` | Template: `$GIST_ID,FILE-1,...,FILE-N`. Preceded by `$`. Files separated by `,`. Add `!` before file name to hide it, not before GIST_ID.


### Via JavaScript

Name | Default | Description
--- |:---:| ---
view | `single` | Editr layout view. Other options: `horizontal`, `vertical`, `cartesian`.
path | `items` | Path to folder with projects.
theme | `monokai` | ACE Editor theme.
readonly | `false` | Make Editr textarea read-only.
callback | `function (editor) {}` | Callback triggered after all files are loaded and Editr is ready. Editr object is passed as an argument, use wisely.
parsers | Check source | You can add custom parsers for preprocessors. Check source for more info.

## API

Please keep in mind that using API functions is most stable in callback which you can configure in JS options. Editr object is passed for it as an argument.

In case, you want to use API functions outside of callback, use them on pure JS objects, not jQuery.

Here's how to make jQuery object a pure js object:

```javascript
$('.editr')[0]
```

On that object you can use any of API methods:

Name | Arguments | Description
--- | --- | ---
isReady | None | Check if Editr is fully loaded
getFiles | `type` - html, css, js, null | Return all files for given type or overall if not passed
getFile | `type` - html, css, js, null <br> `id` - File ID| Return single file for given type(extension) and id
setReadOnly | `value` - boolean | Set Editr textareas read state

## License

**GPL v3 Licensing**

http://choosealicense.com/licenses/gpl-v3

Copyright (c) 2013 Kasper Mikiewicz

