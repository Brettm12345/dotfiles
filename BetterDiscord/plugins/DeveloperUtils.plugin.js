//META{"name":"DeveloperUtils"}*//
class DeveloperUtils {
    getName() {
        return 'DeveloperUtilities';
    }
    getShortName() {
        return 'devutils';
    }
    getDescription() {
        return 'allows you to inspect elements with alt + rightclick , and adds shortcut in context menu';
    }
    getVersion() {
        return '0.1.2 ';
    }
    getAuthor() {
        return 'Modder4869';
    }
    getLink() {
        return 'https://raw.githubusercontent.com/Modder4869/LazyStuff/master/LazyPlugins/DeveloperUtils.plugin.js'
    }
    constructor() {

        this.currentWindow = require('electron').remote.getCurrentWindow();
        this.initialized = false;
        this.remote = require('electron').remote;
        this.clipboard = require('electron').clipboard;
        this.defaultSettings = {
            DevUtils: {
                KeyCombinationEnabled: true,
                delay: 3000
            }
        };
        this.settings = this.defaultSettings;
    }
    loadSettings() {
        this.settings = ZLibrary.PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
    }

    saveSettings() {
        ZLibrary.PluginUtilities.saveSettings(this.getName(), this.settings);
    }
    load() {

    }
    start() {
        if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
      this.initialize()
    }

    initialize() {
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), this.getLink());
        this.loadSettings();
        this.addContextMenuEvent()
        this.initialized = true;
    }
    addContextMenuEvent() {
        $(document).on('contextmenu.' + this.getName(), (e) => {process.nextTick(()=> {
            this.addContextMenuItems(e)});
            if (!this.settings.DevUtils.KeyCombinationEnabled) {
                return;
            }
            if (e.altKey) {
                let context = document.querySelector(".contextMenu-HLZMGh");
                $(context).hide();
                this.inspectAt(e);

            }

        })

    }
    stop() {
        this.initialized = false;
        $(document).off('contextmenu.' + this.getName());
    }

    inspectAt(e) {
        let x = parseInt(e.clientX * window.devicePixelRatio);
        let y = parseInt(e.clientY * window.devicePixelRatio);
        this.currentWindow.inspectElement(x, y);
    }


    addContextMenuItems(e) {
        let CSSRules = getMatchedCSSRules(e.toElement);
            let context = document.querySelector('.contextMenu-HLZMGh');
        if (!CSSRules) return;
        let CSSRule = CSSRules.item(CSSRules.length - 1);
        let currentWin = this.currentWindow;
        let subMenu = new ZLibrary.ContextMenu.SubMenuItem("DevUtils", new ZLibrary.ContextMenu.Menu(false).addItems(

            new ZLibrary.ContextMenu.TextItem("Debugger", {
                callback: () => {
                    if (!currentWin.isDevToolsOpened()) {
                        currentWin.openDevTools()
                        setTimeout(() => {
                            debugger
                        }, 3e3)
                    }

                    debugger;
                }
            }),
            new ZLibrary.ContextMenu.TextItem("Copy Selector", {
                callback: () => {
                    this.clipboard.writeText(CSSRule.selectorText);
                    $(context).hide();
                }
            }),
            new ZLibrary.ContextMenu.TextItem("Copy Declaration", {
                callback: () => {
                    this.clipboard.writeText(CSSRule.style.cssText);
                    $(context).hide();
                }
            }),
            new ZLibrary.ContextMenu.TextItem("Copy Rule-Set", {
                callback: () => {
                    this.clipboard.writeText(CSSRule.cssText);
                    $(context).hide();
                }
            }),
            new ZLibrary.ContextMenu.TextItem("Inspect", {
                callback: () => {
                    this.inspectAt(e);
                    $(context).hide();
                }
            }),
            new ZLibrary.ContextMenu.TextItem("Debugger (timeout)", {
                callback: () => {
                    setTimeout(() => {
                        debugger
                    }, this.settings.DevUtils.delay)
                }
            })

        ));

        let testGroup = new ZLibrary.ContextMenu.ItemGroup().addItems(subMenu);
        let newMenu = new ZLibrary.ContextMenu.Menu();

        if (!context) {
            context = newMenu.element;
            newMenu.addGroup(testGroup);

            newMenu.show(e.clientX, e.clientY);
            return;
        }
        if (context.classList.contains("plugin-context-menu")) return;
        $(context).find('.itemGroup-1tL0uz').last().append(testGroup.element);
    }
    getSettingsPanel() {
        var panel = $("<form>").addClass("form").css("width", "100%");
        if (this.initialized) this.generateSettings(panel);
        return panel[0];
    }

    generateSettings(panel) {
        new PluginSettings.ControlGroup("Settings", () => {
            this.saveSettings();
        }, {
            shown: true
        }).appendTo(panel).append(
            new PluginSettings.PillButton("Shortcut", "use shortcut for quick inspect", " Context Menu Only", " Key + rightClick",
                this.settings.DevUtils.KeyCombinationEnabled, (checked) => {
                    this.settings.DevUtils.KeyCombinationEnabled = checked;
                }),
            new PluginSettings.Slider("Timeout", "set value for the delay before it pauses , default is 3000 = 3 sec", 0, 10000, 500,
                this.settings.DevUtils.delay, (val) => {
                    this.settings.DevUtils.delay = val;
                }).setLabelUnit('ms')

        );
    }
}
