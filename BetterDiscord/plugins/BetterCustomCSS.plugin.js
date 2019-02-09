//META{"name":"BetterCustomCSS"}*//
/*globals BdApi*/

class BetterCustomCSS {
  constructor() {
    this.settingsVersion = 1;
  }

  getAuthor() {
    return "kosshi";
  }

  getName() {
    return "BetterCustomCSS";
  }

  getDescription() {
    return "Lets you edit CSS live with your favorite text editor. Like Custom CSS but better.";
  }

  getVersion() {
    return "0.1.0";
  }

  load() {}

  unload() {}

  onMessage() {}

  onSwitch() {}

  start() {
    const settings = this.loadSettings();
    const fs = require("fs");

    if (this.accessSync(settings.direcotry)) {
      let elem = document.createElement("style");
      elem.id = "bettercustomcss";
      document.head.appendChild(elem);

      this.watcher = fs.watch(
        settings.direcotry,
        {},
        this.appendFile.bind(this)
      );
      this.appendFile();
    }
  }

  stop() {
    if (document.getElementById("bettercustomcss")) {
      this.watcher.close();
      document.head.removeChild(document.getElementById("bettercustomcss"));
    }
  }

  appendFile() {
    const settings = this.loadSettings();
    const fs = require("fs");
    fs.readFile(settings.direcotry, "utf8", (err, file) => {
      if (err) {
        BdApi.getCore().alert(
          "BetterCustomCSS Error",
          "Failed to read '" +
            settings.direcotry +
            "'. The plugin will be disabled. Go to the plugin settings and set the path correctly. This usually happens when the file is deleted or renamed."
        );
        this.stop();
        return;
      }
      BdApi.injectCSS("bettercustomcss", file);
    });
  }

  accessSync(dir) {
    const fs = require("fs");
    try {
      fs.accessSync(dir, fs.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  observer() {}

  saveSettings(button) {
    const settings = this.loadSettings();
    const dir = document.getElementById("qs_directory").value;

    const plugin = BdApi.getPlugin("BetterCustomCSS");
    const err = document.getElementById("qs_err");

    if (plugin.accessSync(dir)) {
      settings.direcotry = dir;

      bdPluginStorage.set(this.getName(), "config", JSON.stringify(settings));

      plugin.stop();
      plugin.start();

      err.innerHTML = "";
      button.innerHTML = "Saved and applied!";
    } else {
      err.innerHTML = "Error: Invalid directory!";
      return;
    }
    setTimeout(() => {
      button.innerHTML = "Save and apply";
    }, 1000);
  }
  defaultSettings() {
    return {
      version: this.settingsVersion,
      direcotry: "none"
    };
  }

  resetSettings(button) {
    const settings = this.defaultSettings();
    bdPluginStorage.set(this.getName(), "config", JSON.stringify(settings));
    this.stop();
    this.start();
    button.innerHTML = "Settings resetted!";
    setTimeout(function() {
      button.innerHTML = "Reset settings";
    }, 1000);
  }

  loadSettings() {
    // Loads settings from localstorage
    const settings = bdPluginStorage.get(this.getName(), "config")
      ? JSON.parse(bdPluginStorage.get(this.getName(), "config"))
      : { version: "0" };
    if (settings.version != this.settingsVersion) {
      console.log(
        "[" +
          this.getName() +
          "] Settings were outdated/invalid/nonexistent. Using default settings."
      );
      settings = this.defaultSettings();
      bdPluginStorage.set(this.getName(), "config", JSON.stringify(settings));
    }
    return settings;
  }

  import(string) {
    bdPluginStorage.set(this.getName(), "config", string);
    this.stop();
    this.start();
  }

  getSettingsPanel() {
    const settings = this.loadSettings();
    const html = "<h3>Settings Panel</h3><br>";
    html += "BetterCustomCSS css file directory<br>";
    html +=
      "<input id='qs_directory' type='text' value=" +
      settings.direcotry +
      " style='width:100% !important;'> <br><br>";

    html +=
      "<br><button onclick=BdApi.getPlugin('" +
      this.getName() +
      "').saveSettings(this)>Save and apply</button>";
    html +=
      "<button onclick=BdApi.getPlugin('" +
      this.getName() +
      "').resetSettings(this)>Reset settings</button> <br><br>";

    html += "<p style='color:red' id='qs_err'></p>";

    html += "How to use:";
    html += "<br>1) Create a CSS file that you want to use.";
    html +=
      "<br>2) Set the directory setting to the file. (eg C:/Users/youruser/Desktop/theme.css)";
    html +=
      "<br>3) The file will be now loaded to the DOM. The plugin attempts to reload the file when it is edited.";
    html +=
      "<br>4) You can now open the file in your favorite text editor, edit it, and see the results instantly after saving the file.";

    return html;
  }
}
