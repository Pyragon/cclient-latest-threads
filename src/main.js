const dateFormat = require('dateformat');

var latest = function(main) {

  var threads = [];
  var error;

  return {

    init: (config) => {},

    getDom: () => {
      var container = document.createElement('div');

      var title = document.createElement('p');
      title.id = 'latest-title';
      title.innerHTML = 'Latest Threads';

      container.appendChild(title);

      if (threads.length == 0) {
        var loader = document.createElement('div');
        loader.id = 'latest-loader';
        var spinner = document.createElement('i');
        spinner.className = 'fa fa-spinner fa-spin';

        loader.appendChild(spinner);
        container.appendChild(loader);
        return container;
      }

      for (var i = 0; i < threads.length; i++) {
        var thread = threads[i];

        var div = document.createElement('div');
        div.className = 'news-post';

        var thread_title = document.createElement('p');
        thread_title.className = 'news-title';
        thread_title.innerHTML = thread.subject;

        var author = document.createElement('p');
        author.className = 'news-author';
        var authorline = 'Posted ';
        authorline += dateFormat(new Date(thread.dateline * 1000), 'mmmm dS, yyyy');
        authorline += ' By ' + thread.formattedName;
        author.innerHTML = authorline;

        div.appendChild(thread_title);
        div.appendChild(author);

        container.appendChild(div);
      }

      return container;
    },

    update: () => {
      var plugin = this;
      main.request({
        path: '/forums/posts',
        method: 'GET'
      }, {
        filter: 'latest',
        limit: 3
      }, (response) => {
        if (response.error) {
          console.error(response.error);
          return;
        }
        threads = response.threads;
        main.getPluginManager().updateDom('cclient-latest-threads');
      });
    },

    getName: () => {
      return 'cclient-latest-threads';
    },

    getDelay: () => {
      return 30000;
    },

    getStylesheets: () => {
      return ['styles/style.css'];
    }

  };

};
module.exports = latest;