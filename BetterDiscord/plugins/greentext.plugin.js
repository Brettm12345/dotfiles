//META{"name":"greentext"}*//

class greentext {
  constructor() {
    this.css = `
      .da-markup > .greentext {
        color: #789922;
      }
    `;

    this.htmlEncode = (s) => {
      return $("<div>").text(s).html();
    };

    this.main = (elem) => {
      if ($(elem).children(".greentext").length > 0) return;
      var self = this;
      var lines = $(elem).text().split("\n");
      lines.forEach((i) => {
        i = self.htmlEncode(i);
        if (i.substr(0, 4) == "&gt;") {
          $(elem).html(function (_, html) {
            return html.replace(i, '<span class="greentext">' + i + '</span>');
          });
        }
      });
    };

    this.allGreen = () => {
      let self = this;
      setTimeout(function () {
        $(".da-markup").each(function () {
          self.main(this);
        });
      }, 100);
    };

    this.noGreen = () => {
      $(".greentext").replaceWith(function () {
        return $(this).text();
      });
    }
  }

  inject(name, options) {
    let element = document.getElementById(options.id);
    if (element) element.parentElement.removeChild(element);
    element = document.createElement(name);
    for (let attr in options)
      element.setAttribute(attr, options[attr]);
    document.head.appendChild(element);
    return element;
  }

  initialize() {
    PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/kaloncpu57/discord-plugins/master/greentext.plugin.js");

    this.allGreen();
  }

  start() {
    let libraryScript = this.inject('script', {
      type: 'text/javascript',
      id: 'zeresLibraryScript',
      src: 'https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js'
    });

    if (typeof window.ZeresLibrary !== "undefined") {
      this.initialize();
    } else {
      libraryScript.addEventListener("load", () => { this.initialize(); });
    }
  }

  stop() {
    this.noGreen();
  }

  load() {
    BdApi.injectCSS("greentext-stylesheet", this.css);
  }

  unload() {
    this.noGreen();
  }

  observer({ addedNodes }) {
    if(addedNodes.length && addedNodes[0].classList && addedNodes[0].classList.contains('da-markup')) {
      this.allGreen();
    }
  }

  onSwitch() {
    this.allGreen();
  }

  getName        () { return "greentext plugin"; }
  getDescription () { return "Make lines that start with \">\" into greentext"; }
  getVersion     () { return "0.2.0"; }
  getAuthor      () { return "kaloncpu57"; }
}
