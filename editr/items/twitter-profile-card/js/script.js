/* Twitter profile card by @Idered | http://designitcodeit.com/i/12 */
;(function ( $, window, document, undefined ) {

  function tmpl(s,d){
    for(var p in d) s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
    return s;
  }

  function parseLinks(text) {
    var patterns = {
      link: /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
      user: /(^|\s)@(\w+)/g,
      hash: /(^|\s)#(\w+)/g
    };
    return text
      .replace(patterns.link,'<a href="$1" target="_blank">$1</a>')
      .replace(patterns.user, '$1@<a href="http://www.twitter.com/$2" target="_blank">$2</a>')
      .replace(patterns.hash, '$1#<a href="http://search.twitter.com/search?q=%23$2" target="_blank">$2</a>');
  }

  $('.twitter-card').each(function () {
    var $card = $(this),
      username = $card.data('username');

    $.ajax({
      type: 'GET',
      url: 'https://api.twitter.com/1/users/show.json',
      timeout: 5000,
      data: {screen_name: username},
      dataType: 'jsonp',
      success: function(data) {
        var user = {
              url: data.url,
              name: data.name,
              username: data.screen_name,
              description: parseLinks(data.description),
              followers: data.followers_count,
              following: data.friends_count,
              tweets: data.statuses_count,
              status: parseLinks(data.status.text),
              photo: data.profile_image_url.replace('normal', 'reasonably_small')
            },
            $template = $(
              tmpl(''.concat(
                '<div class="twitter-card-inner">',
                  '<div class="header">',
                    '<a href="{url}" class="photo" target="_blank">',
                      '<img src="{photo}" alt="{name}">',
                    '</a>',
                    '<a href="{url}" class="name" target="_blank">{name}</a>',
                    '<a href="http://twitter.com/{username}" class="username" target="_blank">@{username}</a>',
                    '<p class="desc">{description}</p>',
                  '</div>',
                  '<div class="status">{status}</div>',
                  '<div class="stats">',
                    '<span>Tweets: {tweets}</span>',
                    '<span>Followers: {followers}</span>',
                    '<span>Following: {following}</span>',
                  '</div>',
                  '<a href="http://twitter.com/intent/follow?screen_name={username}" class="follow-btn" target="_blank" title="Follow me on Twitter">Follow me</a>',
                '</div>'), user));

        $card.append($template)
          .children().hide()
          .parent().removeClass('preload')
          .children().animate({height: 'toggle'}, 'fast');

      }, error: function() {
        $card.text('An error occurred. Probably this user doesn\'t exist.').removeClass('preload');
      }
    });

  });

})( jQuery, window, document );