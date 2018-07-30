const dateFormat = require('dateformat');
const shell = require('electron').shell;

var latest = function() {

  var threads = [];
  var error;

  function clickedThread() {
    shell.openExternal($(this).data('url'));
  }

  return {

    init: (config) => {},

    getDom: () => {
      var container = $('<div></div>');

      var title = $('<p>Latest Threads</p>');
      title.prop('id', 'latest-title');

      container.append(title);

      if (threads.length == 0) {
        var loader = $('<div></div>');
        loader.prop('id', 'latest-loader');

        var spinner = $('<i></i>');
        spinner.addClass('fa fa-spinner fa-spin');

        loader.append(spinner);
        container.append(loader);
        return container;
      }

      for (var i = 0; i < threads.length; i++) {
        var thread = threads[i];

        var div = $('<div></div>');
        div.addClass('news-post');

        var threadTitle = $(`<p>${thread.subject}</p>`);
        threadTitle.addClass('news-title');

        var threadAuthor = $(`<p>Posted ${dateFormat(new Date(thread.dateline * 1000), 'mmmm dS, yyyy')} By ${thread.formattedName}</p>`);
        threadAuthor.addClass('news-author');

        div.append(threadTitle);
        div.append(threadAuthor);

        div.data('url', thread.url);
        div.click(clickedThread);

        container.append(div);
      }

      return container;
    },

    update: () => {
      request({
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
        ui.getWidgets().updateDom('cclient-widget-latest-threads');
      });
    },

    getName: () => {
      return 'cclient-widget-latest-threads';
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