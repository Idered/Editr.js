/** Editr 1.0.0 | MIT License | git.io/editr */

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

        buildList: function(names, type, klass) {
            var result = __.obj('ul', { class: (names.length > 1 ? ' has-many' : '') });

            result.append( __.obj('li').append(
                __.obj('a', {
                    href: '#',
                    text: type
                }).attr({
                    'data-type': klass,
                    'data-id': 1
                }).append( __.obj('span') )
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
        }
    },

    Editr = Editr || function (opts) {

        var editor = opts.editor,

            // Reference variable to check when all files are loaded
            loadedFiles = 0,

            filesToLoad = 0,

            // Result iframe
            result = editor.find('.result'),

            // Item/project id
            item = editor.data('item'),

            files = {
                all: editor.data('files').replace(/\s/g, '').split(','),
                hidden: [],
                html: [],
                css: [],
                js: []
            };
        opts = $.extend({
            path: 'editr/source'
        }, opts);

        // Remove trailing slash in path
        if (/\/$/.test(opts.path)) {
            opts.path = opts.path.slice(0, - 1);
        }

        // Split file names into categories by ext type
        $.each(files.all, function() {
            if ( this.indexOf('!') === 0 ) {
                files.hidden.push('' + this);
            } else {
                files[this.match(/\.[0-9a-z]+$/i)[0].substr(1)].push('' + this);
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
            if (filetype !== 'all' && filetype !== 'hidden') {
                // Add textareas for all files
                if (files[filetype].length) {
                    $(files[filetype]).each(function(i) {
                        var strongFiletype = filetype;

                        $.get([opts.path, item, this].join('/'), function(response) {
                            ++loadedFiles;

                            if ( loadedFiles === files.all.length - files.hidden.length ) {
                                loadCallback();
                            }

                            if ( strongFiletype === 'html' ) {
                                response = response
                                    .replace('<body>', '<body><div class="body">')
                                    .replace('</body>', '</body>');

                                response = __.obj('div').html(response);
                                response.find('script, link, style').remove();
                                response = response.find('.body').html();
                            }

                            var textarea = __.obj('textarea', {
                                    spellcheck: false,
                                    class: 'editr__editor editr__editor--' + strongFiletype + '-' + (++i)
                                }).val( Beautifier[strongFiletype](response) )


                            editor.find('.editr__content').append(textarea);
                        });
                    });
                // If there's no html,css or js file, add empty textarea for it
                } else {
                    if ( files[filetype].length === 0 ) {
                        editor.find('.editr__content').append(
                            __.obj('textarea', {
                                class: 'editr__editor editr__editor--' + filetype + '-1'
                            })
                        );
                    }
                }
            }
        }

        var loadCallback = function() {
            opts.callback();

            editor.find('.editr__editor').each(function() {
                new Behave({ textarea: this, softTabs: true });
            });

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

                    var result = editor.find('.editr__result');

                    result.fadeIn().siblings().hide();

                    var body = editor.find('.editr__result').contents().find('body'),
                        head = editor.find('.editr__result').contents().find('head');

                    // Add html
                    body.html(editor.find('.editr__editor--html-' + $this.data('id')).val());

                    // Remove old css
                    head.find('.editr-stylesheet').remove();

                    // Add css
                    $(editor.find('[class*="editr__editor--css"]').get().reverse()).each(function() {
                        head.append(__.obj('style', { class: 'editr-stylesheet', text: $(this).val()} ));
                    });

                    // Add JS
                    $(editor.find('[class*="editr__editor--js"]').get().reverse()).each(function() {
                        result[0].contentWindow.eval($(this).val());
                    });

                // Show textarea
                } else {
                    editor.find('.editr__editor--' + $this.data('type') + '-' + $this.data('id')).fadeIn().focus().siblings().hide();
                }
            });

            editor.find('.editr__result').load(function() {
                $(this).contents().find('script, link, style').remove();
                $(this).contents().find('body').empty();
                editor.find('.editr__bar').find('a').first().trigger('click');
            });
        };

    };

    $(this).each(function() {
        var settings = $.extend({
            editor: $(this),
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
