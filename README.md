# Editr

## About

Editr is open source HTML, CSS and JavaScript playgrond that you can host on your server.

*It's still in beta and might be buggy.*

## Usage

To load Editr on your site, create a div with this attributes:

* `class="editr"` Used as hook for loading Editr
* `data-path` Path to folder with projects
* `data-item` Name of project inside projects folder
* `data-files` Coma-separated list of files which you want to show inside editor. If preceede file name with `!` then this file will be loaded inside editor but it won't be visible and editable. You an also put here paths to files e.g. `js/script.js`.

    <div class="editr" data-item="twitter-profile-card" data-path="editr/items" data-files="dark.html, light.html, reset.css, style.css, js/script.js, !js/jquery.js"></div>

And fire it with jQuery:

    $('.editr').editr({
        path: 'editr/items',
        callback: function() {}
    });

This will load `editr/items/twitter-profile-card/dark.html`.

First html file is used as main preview.

There're 2 options:

* `path` this is used as default path for projects so you don't have to add it as html attribute. HTML attribute `data-path` will overwrite this default.
* `callback` A function that is called after files are loaded.

## Demo

You can see it [here](http://5minfork.com/Idered/editr)

## License

**MIT Licensing**

Copyright (c) 2013 Kasper Mikiewicz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
