/*
 * Editr.js
 *
 * Copyright 2013, Kasper Mikewicz - http://idered.pl/
 * Released under the GPL v3 License
 * http://opensource.org/licenses/GPL-3.0
 *
 * Github:  http://github.com/idered/Editr.js/
 * Version: 2.1.0
 */

(function (w) {

    'use strict';

    var EditrInstances = EditrInstances || [];

    var Editr = function (opts) {

        EditrInstances.push(this);

        var self = this;

        // Editor
        var editor = $(opts.el);

        // Editor elements
        var el = {
            preview: {},
            editor: editor
        };

        // Default settings
        opts = $.extend({
            parsers: {
                'html': {
                    type: 'html',
                    extension: 'html',
                    fn: function (str, isEncoded) {
                        str = str
                            .replace(/body\b[^>]*>/, '<body><div class="body">')
                            .replace('</body>', '</body>');

                        str = __.obj('div').html(str);

                        str.find('script, link, style').remove();

                        if (!isEncoded) {
                            str = str.find('.body').html();

                            str = str
                            // replace multiple empty lines with one empty line
                            .replace(/[\r\n]+/gi, '\n')
                            // remove first and last empty line
                            .replace(/^[\r\n]|[\n\r]$/gi, '');
                        } else {
                            str = str.html();
                        }

                        return str;
                    }
                },
                'css': {
                    type: 'css',
                    extension: 'css',
                    fn: function (str) {
                        return str;
                    }
                },
                'js': {
                    type: 'js',
                    extension: 'js',
                    fn: function (str) {
                        return str;
                    }
                },
                'less': {
                    type: 'css',
                    extension: 'less',
                    fn: function (str) {
                        var parser = new(less.Parser),
                            parsed = '',
                            error;

                        parser.parse(str, function (err, tree) {
                            if (err) {
                                error = err;
                                return err;
                            }
                            parsed = tree.toCSS();
                        });

                        return error || parsed;
                    }
                },
                'coffee': {
                    type: 'js',
                    extension: 'coffee',
                    fn: function (str) {
                        return CoffeeScript.compile(str);
                    }
                }
            },
            view: 'single',
            readonly: false,
            path: 'items',
            loadingText: '',
            theme: 'monokai',
            callback: function () {}
        }, opts);

        var htmlOpts = ['path', 'readonly', 'theme', 'view', 'loadingText'];

        // Extend js options with options from html data- attributes
        for (var i = 0; i < htmlOpts.length; i++) {
            if (editor.data(htmlOpts[i])) {
                opts[htmlOpts[i]] = editor.data(htmlOpts[i]);
            }
        }

        // Remove trailing slash
        opts.path = opts.path.replace(/\/$/, '');

        // Project data - files, name, etc.
        var data = {
            activeItem: -1,
            filesLoaded: []
        };

        var build = {
            /**
             * Compose Editr parts - nav, content, loader
             */
            ui: function () {
                el.editor.addClass('editr-view--' + opts.view);

                // Build bar
                el.bar = __.obj('header', {
                    class: 'editr__bar'
                }).appendTo(editor);

                // Build nav
                el.nav = build.nav().appendTo(el.bar);

                // Build content wrapper
                el.content = __.obj('div', {
                    class: 'editr__content'
                }).appendTo(editor);

                // Build preview iframe
                el.preview.frame = build.preview().appendTo(el.content);
            },

            /**
             * Build Editr nav
             * @return {object}
             */
            nav: function () {
                var navs = [];

                navs.push(build.navList('html', 'Result', 'result'));
                navs.push(build.navList('html', 'HTML'));
                navs.push(build.navList('css', 'CSS'));
                navs.push(build.navList('js', 'JavaScript'));

                return __.obj('ul', {
                    class: 'editr__nav'
                }).append(navs);
            },

            /**
             * Build single nav list
             * @param  {string} type
             * @param  {string} label
             * @return {string}
             */
            navList: function (type, label, pseudoType) {
                var files = data.files[type],
                    nav, subnav;

                // Create nav item with label and add subnav
                nav = __.obj('li', {
                    'data-type': pseudoType || type,
                    class: 'editr__nav-item' + (get.visibleFilesCount(type) > 1 ? ' is-dropped' : '')
                }).append(__.obj('span', {
                    class: 'editr__nav-label',
                    text: label
                })).append(__.obj('ul', {
                    class: 'editr__subnav'
                }));

                subnav = nav.find('.editr__subnav');

                // Add subnav items, exclude hidden
                for (var i = 0; i < files.length; i++) {
                    if (files[i].isHidden) {
                        continue;
                    }

                    subnav.append(__.obj('li', {
                        'data-id': i,
                        'data-type': pseudoType || type,
                        'data-extension': files[i].extension,
                        'data-is-encoded': files[i].isEncoded,
                        class: 'editr__nav-label',
                        text: files[i].name
                    }));
                };

                return nav;
            },

            /**
             * Setup preview iframe, load preview of first html file
             */
            preview: function () {
                var firstFile = data.files.html[0];

                return __.obj('iframe', {
                    class: 'editr__result',
                    name: 'editr_' + get.randomID(),
                    src: firstFile.isEncoded || firstFile.isDefault ? opts.path + '/index.html' : [opts.path, data.item, data.files.html[0].name].join('/')
                }).load(function () {
                    el.preview.result = $(this);
                    el.preview.body = el.preview.result.contents().find('body');
                    el.preview.head = el.preview.result.contents().find('head');

                    // Clean iframe
                    el.preview.result.contents()
                        .find('link, style').remove().end()
                        .find('body').empty();

                    // Build editors
                    el.editors = build.editors();
                });
            },

            /**
             * Compose editors
             */

            editors: function () {
                var editors = {},
                    file;

                // Loop through categories
                for (var extension in data.files) {
                    var files = data.files[extension];
                    for (var i = 0; i < files.length; i++) {
                        file = files[i];

                        if (!editors[extension]) {
                            editors[extension] = [];
                        }

                        // Build editor and push it to file data
                        editors[extension].push(
                            data.files[extension][i].editor = build.editor(file, i)
                        );

                        if (!file.isDefault) {
                            get.fileContent(file);
                        }
                    }
                }

                return editors;
            },

            /**
             * Build ACE editor for file
             * @param  {object} file
             * @return {object}
             */
            editor: function (file, id) {
                var aceEditor,
                    textarea = __.obj('div', {
                        id: 'editr_' + get.randomID(),
                        class: 'editr__editor editr__editor--' + (file.type || file.extension) // + ' editr__editor--' + (file.type || file.extension) + '-' + (id)
                    }).appendTo(el.content);

                aceEditor = ace.edit(textarea.attr('id'));
                aceEditor.setTheme("ace/theme/" + opts.theme);
                aceEditor.getSession().setMode('ace/mode/' + (file.extension === 'js' ? 'javascript' : file.extension));
                aceEditor.getSession().setUseWorker(false);

                require("ace/ext/emmet");
                aceEditor.setOption("enableEmmet", true);

                aceEditor.setReadOnly(opts.readonly);

                aceEditor.on('change', function () {
                    if (data.activeItem !== -1) {
                        __.renderPreview(data.files.html[data.activeItem]);
                    }
                });

                return aceEditor;
            },
        };

        // Utils
        var __ = {
            /**
             * Wrapper for object createion
             * @param  {string}   type
             * @param  {object}   attrs
             * @param  {Function || Object} fn
             * @return {jQuery}
             */
            obj: function (type, attrs, fn) {
                return $('<' + type + '>', attrs).on(fn);
            },

            /**
             * Check if Editr editor is in panel view
             * @return {Boolean}
             */
            isPaneled: function () {
                return ['horizontal', 'vertical'].indexOf(opts.view) != -1;
            },

            /**
             * Wait until all files are loaded and fire passed fn
             * @param  {Function} fn
             * @return {Function}
             */
            debounce: function (fn) {
                var timer = null;

                return function () {
                    var context = this,
                        args = arguments;

                    timer = setInterval(function () {
                        if (data.filesLoaded.length === data.filesTotal) {
                            fn.call(context, args);
                        }
                    }, 50);
                };
            },

            /**
             * Check if fille is hidden
             * @param  {string}  filename
             * @return {Boolean}
             */
            isHidden: function (filename) {
                return filename.indexOf('!') === 0;
            },

            /**
             * Check if string is base64 encoded
             * @param  {string}  str
             * @return {Boolean}
             */
            isEncoded: function (str) {
                return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/.test(str);
            },

            /**
             * Returns base64 decoded data
             * @see http://phpjs.org/functions/base64_decode/
             * @param  {string} data
             * @return {string}
             */
            base64Decode: function (data) {
                var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                    ac = 0,
                    dec = "",
                    tmp_arr = [];

                if (!data) {
                    return data;
                }

                data += '';

                do {
                    h1 = b64.indexOf(data.charAt(i++));
                    h2 = b64.indexOf(data.charAt(i++));
                    h3 = b64.indexOf(data.charAt(i++));
                    h4 = b64.indexOf(data.charAt(i++));

                    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                    o1 = bits >> 16 & 0xff;
                    o2 = bits >> 8 & 0xff;
                    o3 = bits & 0xff;

                    if (h3 == 64) {
                        tmp_arr[ac++] = String.fromCharCode(o1);
                    } else if (h4 == 64) {
                        tmp_arr[ac++] = String.fromCharCode(o1, o2);
                    } else {
                        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                    }
                } while (i < data.length);

                dec = tmp_arr.join('');

                return dec;
            },

            /**
             * Callback for loaded files, parse their content
             * @param  {object} file
             * @param  {string} code
             */
            fileContentCallback: function (file, code) {
                if (file.isEncoded) {
                    code = file.code;
                }

                data.filesLoaded.push(file);

                if (data.filesLoaded.length === data.filesTotal) {
                    onLoaded.init();
                }

                if (file.extension === 'html') {
                    code = opts.parsers[file.extension].fn(code || file.code || '', file.isEncoded);
                }

                file.editor.setValue(code);
                file.editor.clearSelection();
            },

            renderPreview: function (file) {
                var fileCSS, fileJS;
                data.activeItem = file.id;

                if (!file) return;

                // Remove old stylsheet
                el.preview.head.find('style, script').remove();

                // Add css
                for (var i = 0; i < data.files.css.length; i++) {
                    fileCSS = data.files.css[i];

                    // Remove css error flag
                    $(fileCSS.editor.container).removeClass('editr__editor--invalid').removeAttr('data-error');

                    try {
                        var parsed = opts.parsers[fileCSS.extension].fn(fileCSS.editor.getValue());

                        if (typeof parsed === 'object') {
                            throw parsed;
                        }

                        el.preview.head.append(__.obj('style', {
                            text: parsed
                        }));
                    } catch (e) {
                        $(fileCSS.editor.container).addClass('editr__editor--invalid').attr('data-error', e.message);
                    }
                }

                // Add HTML
                el.preview.body.html(
                    file.editor.getValue()
                );

                // Remove js error flag

                // Add js
                for (var j = 0; j < data.files.js.length; j++) {
                    fileJS = data.files.js[j];

                    $(fileJS.editor.container).removeClass('editr__editor--invalid').removeAttr('data-error');

                    try {
                        el.preview.result[0].contentWindow.eval(
                            opts.parsers[fileJS.extension].fn(fileJS.editor.getValue())
                        );
                    } catch (e) {
                        $(fileJS.editor.container).addClass('editr__editor--invalid').attr('data-error', 'Error: ' + e.message);
                    }
                }
            }
        };

        // Getters
        var get = {
            /**
             * Get editr files
             * @param  {string} type
             * @param  {bool} withHidden
             * @return {array}
             */
            files: function (type, withHidden) {
                var files = editor.data('files-' + type) || '',
                    code,
                    filename,
                    preprocessor,
                    hiddenFilesTotal = 0,
                    isEncoded = false,
                    isHidden,
                    result = [];

                // Remove last ';'
                files.replace(/;$/, '');

                if (files) {
                    // Split files list to array
                    files = files.replace(/\s/g, '').split(';');

                    // Create single file object
                    for (var i = 0; i < files.length; i++) {
                        isHidden = __.isHidden(files[i]);

                        if (isHidden) {
                            files[i] = files[i].substr(1);
                        }

                        preprocessor = get.preprocessor(files[i]);

                        filename = preprocessor ? files[i].replace(preprocessor + ':', '') : files[i];

                        isEncoded = __.isEncoded(filename);

                        // Remove hidden files if not allowed
                        if (withHidden || !isHidden) {
                            if (isEncoded) {
                                code = filename;

                                if (preprocessor) {
                                    code = filename.replace(preprocessor + ':');
                                }

                                filename = 'file ' + (i + 1) + '.' + type;
                            }

                            result.push({
                                id: i,
                                name: filename,
                                type: preprocessor ? opts.parsers[preprocessor].type : get.extension(files[i]),
                                code: isEncoded ? __.base64Decode(code) : '',
                                extension: preprocessor || (isEncoded ? type : get.extension(files[i])),
                                preprocessor: preprocessor,
                                isHidden: isHidden,
                                isDefault: false,
                                isEncoded: isEncoded
                            });
                        }
                    }
                }

                // Check if all files are hidden
                for (var i = 0; i < result.length; i++) {
                    if (result[i].isHidden) {
                        hiddenFilesTotal++;
                    }
                }

                // All files hidden? add default empty file
                if (hiddenFilesTotal === result.length) {
                    result.push({
                        name: 'index.' + type,
                        code: '',
                        extension: type,
                        preprocessor: '',
                        isHidden: false,
                        isDefault: true,
                        isEncoded: false
                    });
                }

                return result;
            },

            /**
             * Load file content
             * @param  {ACE Editor} textarea
             * @param  {object} file
             */
            fileContent: function (file) {
                if (file.isEncoded) {
                    __.fileContentCallback(file);
                    return;
                }

                $.ajax({
                    url: [opts.path, data.item, file.name].join('/'),
                    success: function (response) {
                        __.fileContentCallback(file, response);
                    },
                    cache: false
                });
            },

            /**
             * Get preprocessor name based on string
             * @param  {string} str
             * @return {string}
             */
            preprocessor: function (str) {
                // Match base64 extension
                var result = str.match(/^(.*):/) || [];

                result = result[1];

                if (!result) {
                    result = get.extension(str);

                    // Check if extension is preprocessor
                    if (['html', 'css', 'js'].indexOf(result) !== -1) {
                        result = undefined;
                    }
                }
                return result;
            },

            /**
             * Get ACE editor
             * @param  {string} type
             * @param  {int} id
             * @return {ACE }
             */
            editor: function (type, id) {
                return data.files[type][id].editor;
            },

            /**
             * Get hidden files
             * @param  {string} type
             * @return {array}
             */
            hiddenFiles: function (type) {
                var files = [];

                for (var i = 0; i < data.files[type].length; i++) {
                    if (data.files[type][i].isHidden) {
                        files.push(data.files[type][i]);
                    }
                }

                return files;
            },

            /**
             * Count files with isHidden property set to false
             * @param  {string} type
             * @return {int}
             */
            visibleFilesCount: function (type) {
                var count = 0;

                for (var i = 0; i < data.files[type].length; i++) {
                    if (!data.files[type][i].isDefault) {
                        ++count;
                    }
                }

                return count;
            },

            /**
             * Get extension from filename
             * @param  {string} filename
             * @return {string}
             */
            extension: function (filename) {
                if (!filename.length) {
                    return null;
                }

                // Match extension with dot
                filename = filename.match(/\.[0-9a-z]+$/i) || [];

                // Get first occurrence
                filename = filename[0] || '';

                // Remove dot
                filename = filename.substr(1);

                return filename;
            },

            /**
             * Return random ID
             * @return {string}
             */
            randomID: function () {
                var a, b = b || 16;
                return Array(a || 8).join(0).replace(/0/g, function () {
                    return (0 | Math.random() * b).toString(b)
                });
            }
        };

        // Files loaded? Good, fire calback
        var onLoaded = {
            init: function () {
                // Fire user callback
                opts.callback(self);

                editor.addClass('editr--loaded');

                onLoaded.bindNav();
            },

            /**
             * Bind actions for nav items
             */
            bindNav: function () {
                var tabs = el.nav.find('.editr__nav-item'),
                    navItems = tabs.find('.editr__subnav').children();

                tabs.children('.editr__nav-label').on('click', function () {
                    $(this).next().children().first().trigger('click');
                });

                navItems.on('click', function (event) {
                    var item = $(this),
                        file,
                        aceEditor;

                    event.preventDefault();

                    el.nav.find('.active').removeClass('active');

                    item.closest('.editr__nav-item').andSelf().addClass('active');

                    // Render preview
                    if (item.data('type') === 'result') {
                        __.renderPreview(data.files.html[item.data('id')]);

                        if (__.isPaneled()) {
                            el.preview.frame.addClass('active');
                        } else {
                            el.preview.frame.addClass('active').siblings().removeClass('active');
                        }
                    } else { // Show editor
                        aceEditor = get.editor(item.data('type'), item.data('id'));

                        $(aceEditor.container).addClass('active').siblings(__.isPaneled() ? '.editr__editor--' + item.data('type') : '').removeClass('active');

                        aceEditor.focus();

                        aceEditor.resize();
                    }
                }).first().trigger('click');

                if (__.isPaneled()) {
                    var categories = ['html', 'css', 'js'];
                    for (var i = 0; i < categories.length; i++) {
                        $(data.files[categories[i]][0].editor.container).addClass('active');
                    }
                }
            }
        };

        var init = function () {
            // Get project name
            data.item = editor.data('item');

            // Get project files
            data.files = {
                html: get.files('html', true),
                css: get.files('css', true),
                js: get.files('js', true)
            };

            // Count files
            data.filesTotal =
                get.visibleFilesCount('html') +
                get.visibleFilesCount('css') +
                get.visibleFilesCount('js');

            build.ui();
        };

        // Kick it off
        init();

        /**
         * API
         *=================================================*/

        // Bind Editr DOM element
        this.editor = editor;

        /**
         * Check if Editr is fully loaded
         * @return {Boolean}
         */
        this.isReady = function () {
            return data.filesLoaded.length === data.filesTotal;
        };

        // Return all files

        /**
         * Return all files for given type or overall if not passed
         * @param  {String} type File type
         * @return {Object}      File data
         */
        this.getFiles = function (type) {
            return type ? data.files[type] : data.files;
        };

        /**
         * Return single file for given type(extension) and id
         * @param  {String} type File type
         * @param  {Integer} id   File ID
         * @return {Object}      File data
         */
        this.getFile = function (type, id) {
            return data.files[type][id];
        };

        /**
         * Set Editr textareas read state
         * @param  {bool} value State
         */
        this.setReadOnly = __.debounce(function (value) {
            for (var extension in data.files) {
                for (var i = 0; i < data.files[extension].length; i++) {
                    data.files[extension][i].editor.setReadOnly(value);
                }
            }
        });

        // Extend DOM element with this Editr functions
        $.extend(editor[0], this);
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Editr;
        module.exports = EditrInstances;
    }

    if (typeof ender === 'undefined') {
        this.Editr = Editr;
        this.EditrInstances = EditrInstances;
    }

    if (typeof define === "function" && define.amd) {
        define("editr", [], function () {
            return Editr;
        });
    }

}).call(this, window);
