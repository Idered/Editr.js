/** Editr 1.0.1 | MIT License | git.io/editr */

(function($) {

$.fn.editr = function (opts) {

    var i = 0,
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
                    'data-type': klass,
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
                        'data-type': klass,
                        'data-id': ++i
                    })
                ));
            });

            return result;
        },

        randomID: function(a,b) {
            b=b||16;
            return Array(a||32).join(0).replace(/0/g,function(){return(0|Math.random()*b).toString(b)});
        },

        createEditor: function(i, filetype, target, theme) {
            var textarea = __.obj('div', {
                id: 'editr_' + __.randomID(),
                class: 'editr__editor editr__editor--' + filetype + ' editr__editor--' + filetype + '-' + (++i)
            });

            textarea.appendTo(target);

            var aceEditor = ace.edit(textarea.attr('id'));
            aceEditor.setTheme("ace/theme/" + theme);
            aceEditor.getSession().setMode('ace/mode/' + (filetype === 'js' ? 'javascript' : filetype));

            return aceEditor;
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
        if (/\/$/.test(opts.path)) {
            opts.path = opts.path.slice(0, - 1);
        }

        // Split file names into categories by ext type
        $.each(files.all, function() {
            if ( __.isHidden(this) ) {
                files.hidden.push('' + this);
            } else {
                files[__.getExt(this)].push('' + this);
            }
        });

        // Build editor
        editor
        // Add editor bar
        .append( __.obj('header', { class: 'editr__bar' }).append([
            __.buildList(files.html, 'Result', 'result'),
            __.buildList(files.html, 'HTML', 'html'),
            __.buildList(files.css, 'CSS', 'css'),
            __.buildList(files.js, 'JavaScript', 'js')
        ]) )
        // Add content wrapper
        .append( __.obj('div', { class: 'editr__content'} )
        // Add result iframe
        .append(
            __.obj('iframe', { class: 'editr__result', src: [opts.path, item, files.html[0]].join('/'), name: 'editr_' + i } )
        ));

        // Add textareas
        for ( var filetype in files ) {
            if ($.inArray(filetype, ['hidden', 'all']) === -1) {
                // Add textareas for all files
                if (files[filetype].length) {
                    $(files[filetype]).each(function(i) {
                        var strongFiletype = filetype,
                            textarea = __.createEditor(i, strongFiletype, editor.find('.editr__content'), opts.theme);

                        $.get([opts.path, item, this].join('/'), function(response) {
                            ++loadedFiles;

                            if ( loadedFiles === files.all.length - files.hidden.length ) {
                                loadCallback();
                            }

                            if ( strongFiletype === 'html' ) {
                                response = response
                                    .replace(/body\b[^>]*>/, '<body><div class="body">')
                                    .replace('</body>', '</body>');

                                response = __.obj('div').html(response);
                                response.find('script, link, style').remove();
                                response = response.find('.body').html();

                                response = Beautifier.html(response);
                            }

                            textarea.setValue(response);
                            textarea.clearSelection();
                        });
                    });
                // If there's no html,css or js file, add empty textarea for it
                } else if ( files[filetype].length === 0 ) {
                    __.createEditor(i, filetype, editor.find('.editr__content'), opts.theme);
                }
            }
        }

        var loadCallback = function() {
            opts.callback();

            editor.find('.editr__editor').each(function() {
                // new Behave({ textarea: this, softTabs: true });
            });

            var result,
                body,
                head;

            editor.find('.editr__bar').find('a').on('click', function(event) {
                event.preventDefault();

                var $this = $(this);

                $this.closest('.editr__bar').find('.active').removeClass('active');

                if ( $this.closest('.editr__subnav').length ) {
                    $this.closest('.editr__subnav').prev().addClass('active');
                } else {
                    $this.next().find('a').first().addClass('active');
                }

                $this.addClass('active');

                // Show result
                if ($this.data('type') === 'result') {

                    result.fadeIn().siblings().hide();

                    // Add html
                    body.html(ace.edit(editor.find('.editr__editor--html-' + $this.data('id')).attr('id')).getValue());

                    // Remove old css
                    head.find('.editr-stylesheet').remove();

                    // Add css
                    $(editor.find('.editr__editor--css').get().reverse()).each(function() {
                        head.append(__.obj('style', { class: 'editr-stylesheet', text: ace.edit(this.id).getValue() } ));
                    });

                    // Add JS
                    $(editor.find('.editr__editor--js').get().reverse()).each(function() {
                        result[0].contentWindow.eval(ace.edit(this.id).getValue());
                    });

                // Show textarea
                } else {
                    editor.find('.editr__editor--' + $this.data('type') + '-' + $this.data('id')).fadeIn().siblings().hide();
                }
            });

            editor.find('.editr__result').load(function() {
                result = editor.find('.editr__result');
                body = result.contents().find('body');
                head = result.contents().find('head');

                $(this).contents().find('link, style').remove();
                $(this).contents().find('body').empty();

                $(files.hidden).each(function() {
                    if ( __.getExt(this) === 'css' ) {
                        __.obj('link', { rel: 'stylesheet', href: this.slice(1) }).appendTo(head);
                    } else if ( __.getExt(this) === 'js' ) {
                        __.obj('script', { src: this.slice(1) }).appendTo(head);
                    }
                });

                editor.find('.editr__bar').find('a').first().trigger('click');
            });
        };

    };

    $(this).each(function() {
        var settings = $.extend({
            editor: $(this),
            theme: 'monokai',
            path: 'editr/items',
            callback: function() {}
        }, opts);

        if ( $(this).data('path') ) {
            settings.path = $(this).data('path');
        }

        new Editr(settings);
    });

};

})(jQuery);
