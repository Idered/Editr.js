/** Editr 1.0.2 | MIT License | git.io/editr */

(function($) {
$.fn.editr = function (opts) {

    var editrID = 0,
    __ = {

        /**
         * Wrapper for easier object creation
         */
        obj: function (type, attrs, fn) {
            return $('<'+type+'>', attrs  ).on(fn);
        },

        /**
         * Build navigation
         */
        buildList: function(names, type, klass) {
            var result = __.obj('ul', {
                    class: 'editr__link--' + klass + (names.length > 1 ? ' has-many' : '')
                });

            result.append( __.obj('li').append(
                __.obj('a', {
                    href: '#',
                    text: type
                }).attr({
                    'data-type': klass === 'result' ? klass : __.getExt('' + $(names).last()[0]),
                    'data-id': 1
                })
            ).append( __.obj('ul', { class:'editr__subnav' }) ));

            if ( klass === 'css') {
                names = names.reverse();
            }

            $(names).each(function(i) {
                result.find('ul').append( __.obj('li').append(
                    __.obj('a', {
                        href: '#',
                        text: this
                    }).attr({
                        'data-type': klass === 'result' ? klass : __.getExt('' + this),
                        'data-id': ++i
                    })
                ));
            });

            return result;
        },

        /**
         * @return {string} Random ID
         */
        randomID: function(a,b) {
            b=b||16;
            return Array(a||32).join(0).replace(/0/g,function(){return(0|Math.random()*b).toString(b)});
        },

        /**
         * Create ACE Editor and append it to target
         * @return {object} ACE Editor
         */
        createEditor: function(i, filetype, target, theme) {
            var aceEditor,
                textarea = __.obj('div', {
                    id: 'editr_' + __.randomID(),
                    class: 'editr__editor editr__editor--' + filetype + ' editr__editor--' + filetype + '-' + (++i)
                }).appendTo(target);

            aceEditor = ace.edit(textarea.attr('id'));
            aceEditor.setTheme("ace/theme/" + theme);
            aceEditor.getSession().setMode('ace/mode/' + (filetype === 'js' ? 'javascript' : filetype));

            return aceEditor;
        },

        /**
         * Get editor by type and(optionaly) id
         * @return {jQuery} Editor jQuery object
         */
        getEditor: function(editor, type, id) {
            return editor.find(id ? '.editr__editor--' + type + '-' + id : '.editr__editor--' + type);
        },

        /**
         * Get extension of file name
         * @return {string} File extension
         */
        getExt: function(str) {
            return str.match(/\.[0-9a-z]+$/i)[0].substr(1);
        },

        /**
         * Check if file should be hidden in editor, has preceding '!'
         * @return {bool} Is file hidden
         */
        isHidden: function(str) {
            return str.indexOf('!') === 0;
        }
    },

    Editr = Editr || function (opts) {

        var editor = opts.editor,
            // Reference variable to check when all files are loaded
            loadedFiles = 0,

            // Item/project id
            item = editor.data('item'),

            files = {
                all: editor.data('files').replace(/\s/g, '').split(';'),
                hidden: [],
                html: [],
                css: [],
                js: []
            };

        // Remove trailing slash in path
        opts.path = opts.path.replace(/\/$/, '');

        // Split file names into categories by ext type
        $.each(files.all, function() {
            var ext = __.getExt('' + this);

            if ( __.isHidden(this) ) {
                files['hidden'].push('' + this);
            } else if ( $.isArray(files[ext]) ) {
                files[ext].push('' + this);
            } else if ( EditrParsers[ext] ) {
                files[EditrParsers[ext].type].push('' + this);
            } else {
                var filename = this + '';
                console.log("Editr: Parser for " + filename + " isn't definied.");
                files.all = files.all.filter(function(file) { return file != filename; });
            }
        });

        // Build editor
        editor

        // Add editor bar
        .append( __.obj('header', { class: 'editr__bar' } ).append([
            __.buildList(files.html, 'Result', 'result'),
            __.buildList(files.html, 'HTML', 'html'),
            __.buildList(files.css, 'CSS', 'css'),
            __.buildList(files.js, 'JavaScript', 'js')
        ]))

        // Add content wrapper
        .append( __.obj('div', { class: 'editr__content'} )

        // Add result iframe
        .append( __.obj('iframe', {
            class: 'editr__result',
            name: 'editr_' + (++editrID),
            src: [opts.path, item, files.html[0]].join('/')
        })));

        // Loop throught files
        for ( var filetype in files ) {

            // Omit hiden and all arrays
            if ($.inArray(filetype, ['hidden', 'all']) === -1) {

                if (files[filetype].length) {

                    // Add textareas for all files
                    $(files[filetype]).each(function(i) {

                        var strongFiletype = __.getExt(this + ''),
                            textarea = __.createEditor(i, strongFiletype, editor.find('.editr__content'), opts.theme);

                        // Load file content
                        $.get([opts.path, item, this].join('/'), function(response) {

                            // Track num of loaded files
                            ++loadedFiles;

                            if ( loadedFiles === files.all.length - files.hidden.length ) {
                                loadCallback();
                            }

                            if ( strongFiletype === 'html' ) {
                                response = EditrParsers[strongFiletype].fn(response);
                            }

                            textarea.setValue(response);
                            textarea.clearSelection();

                        });

                    });

                // If there's no html, css or js file, add empty textarea for it
                } else if ( !files[filetype].length ) {

                    __.createEditor(0, filetype, editor.find('.editr__content'), opts.theme);

                }
            }
        }

        var loadCallback = function() {
            opts.callback();

            var result, body, head, aceEditor;

            editor.find('.editr__bar').find('a').on('click', function(event) {

                var $this = $(this);

                event.preventDefault();

                // Remove active class from nav items
                $this.closest('.editr__bar').find('.active').removeClass('active');

                // Clicked on sub nav item
                if ( $this.closest('.editr__subnav').length ) {

                    // Add class for main nav item
                    $this.closest('.editr__subnav').prev().addClass('active');

                // Clicked on main nav item with sub items
                } else {

                    // Add class for first sub nav item
                    $this.next().find('a').first().addClass('active');

                }

                $this.addClass('active');

                // Show result
                if ($this.attr('data-type') === 'result') {

                    // Add html
                    body.html(
                        ace.edit( __.getEditor(editor, 'html', $this.attr('data-id')).attr('id') ).getValue()
                    );

                    // Remove old css
                    head.find('.editr-stylesheet').remove();

                    for ( var parser in EditrParsers ) {

                        // Add css
                        if (EditrParsers[parser].type === 'css') {
                            $( __.getEditor(editor, parser).get().reverse() ).each(function() {
                                var val = EditrParsers[parser].fn(ace.edit(this.id).getValue());
                                head.append(__.obj('style', {
                                    class: 'editr-stylesheet',
                                    text: val
                                }));

                            });
                        }

                        // Add JS
                        if (EditrParsers[parser].type === 'js') {
                            $( __.getEditor(editor, parser).get().reverse() ).each(function() {

                                var val = EditrParsers[parser].fn(ace.edit(this.id).getValue());

                                result[0].contentWindow.eval( val );

                            });
                        }

                    }

                    // Show result iframe
                    result.show().siblings().hide();

                // Show textarea
                } else {

                    aceEditor = __.getEditor(editor, $this.attr('data-type'), $this.attr('data-id'));

                    aceEditor.show().siblings().hide();
                    ace.edit(aceEditor.attr('id')).resize();

                }
            });

            // Preload result iframe
            editor.find('.editr__result').load(function() {

                result = $(this);
                body   = result.contents().find('body');
                head   = result.contents().find('head');

                // Clean iframe
                result.contents().find('link, style').remove().end().find('body').empty();

                // Add hidden stylesheets and scripts
                $(files.hidden).each(function() {

                    if ( __.getExt(this) === 'css' ) {

                        __.obj('link', {
                            rel: 'stylesheet',
                            href: this.slice(1)
                        }).appendTo(head);

                    } else if ( __.getExt(this) === 'js' ) {

                        __.obj('script', {
                            src: this.slice(1)
                        }).appendTo(head);

                    }
                });

                editor.find('.editr__bar').find('a').first().trigger('click');

            });
        };

    },

    EditrParsers = EditrParsers || {};

    $(this).each(function() {

        var settings = $.extend({
                editor: $(this),
                theme: 'monokai',
                path: 'editr/items',
                parsers: {},
                callback: function() {}
            }, opts),

            parsers = {
                'html': {
                    type: 'html',
                    filetype: 'html',
                    fn: function(str) {
                        str = str
                            .replace(/body\b[^>]*>/, '<body><div class="body">')
                            .replace('</body>', '</body>');

                        str = __.obj('div').html(str);

                        str.find('script, link, style').remove();
                        str = str.find('.body').html();

                        str = str
                            // replace multiple empty lines with one empty line
                            .replace(/[\r\n]+/gi, '\n')
                            // remove first and last empty line
                            .replace(/^[\r\n]|[\n\r]$/gi, '');

                        return str;
                    }
                }, 'css': {
                    type: 'css',
                    filetype: 'css',
                    fn: function(str) { return str; }
                }, 'js': {
                    type: 'js',
                    filetype: 'js',
                    fn: function(str) { return str; }
                }, 'less': {
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
                }, 'coffee': {
                    type: 'js',
                    filetype: 'coffee',
                    fn: function(str) {
                        return CoffeeScript.compile(str);
                    }
                }
            };

        if ( $(this).data('path') ) {
            settings.path = $(this).data('path');
        }

        if ( $(this).data('theme') ) {
            settings.theme = $(this).data('theme');
        }

        settings.parsers = $.extend(settings.parsers, parsers);

        EditrParsers = settings.parsers;

        new Editr(settings);

    });
};
})(jQuery);
