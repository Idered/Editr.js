# Editr

## About

Editr is HTML, CSS and JavaScript playground that you can host on your server.

* easy setup
* based on ACE Editor
* supports multiple instances on one page
* configuration via JS object or HTML attributes

## Demo

You can see it [here](http://idered.pl/editr/)

## Structure

```
.
|---. editr
|   |--- editr.js
|   |--- editr.css
|   |--- items
|   |---. parsers
|       |--- less.js
|       |--- coffeescript.js
```

**editr**
Folder containing Editr script, style and projects folder

**editr.js**
Editr main script. It's quite clean and have some comments so have fun with changing it.

**editr.css**
Editr style, it contains only some basic style so you can easily customize it.

**items**
Folder containing all your projects.

**parsers**
Put here your HTML, CSS, JS preprocessors. Contains LESS and CoffeeScript by default.

## Dependencies

* jQuery `//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js`
* ACE Editor `//d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js`

## Installation

Copy `editr` folder to root of your website.

Add this in `<head>`:

```html
<link rel="stylesheet" href="/editr/editr.css">
```

and this before `</body>`:

```html
<script src="//d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js"></script>
<script src="/editr/editr.js"></script>
```

Additionally you can add LESS and CoffeeScript compilers if you're going to use them:

```html
<script src="/parsers/coffeescript.js"></script>
<script src="/parsers/less.js"></script>
```

## How to embed Editr

To embed Editr on your site, create a div with this attributes:

```html
<div class="editr" data-item="flat-ui" data-files="switch.html; radio.html; !normalize.css; radio.css; switch.css; main.less script.coffee"></div>
```

and start Editr with jQuery:

```js
$('.editr').editr();
```

This will load `/editr/items/flat-ui/` project. This path is based on data-path and data-item or values passed in JS object. Default path is: `/editr/items`.

First html file(`switch.html` in this case) is used as main preview.

In this example, `normalize.css` will be added to preview but it won't be visible or editable.

## Options

### Passed in HTML attributes

* `data-item` Name of project folder inside projects folder(js `path` or html attr `data-path` value).
* `data-path`(optional) Path to folder with projects.
* `data-theme`(optional) ACE Editor theme
* `data-hide`(optional) This attribute allows you to hide elements from Editr toolbar. Values: `all, result, html, css, js`.
* `data-files` List of files names separated by `;` which you want to show inside editor. If file name(or path) is preceeded with `!` then this file will be loaded inside editor but it won't be visible and editable. You an also put here paths to files e.g. `js/script.js`.

### Passed in JavaScript

* `theme` ACE Editor theme
* `callback` A function that is called after files are loaded.
* `path` This is used as default path for projects so you don't have to add it as html attribute. HTML attribute `data-path` will overwrite this default.
* `parsers` Used to add custom HTML, CSS, JS preprocessors:

```js
parsers: {
	'less': {
		type: 'css',
		filetype: 'less',
		fn: function(str) {
			var parser = new(less.Parser),
				parsed = '';

			parser.parse(str, function (err, tree) {
				if (err) { return console.error(err) }
				parsed = tree.toCSS();
			});

			return parsed;
		}
	}
}
```


## License

~~MIT Licensing~~~

**GPL v3 Licensing--

Copyright (c) 2013 Kasper Mikiewicz
