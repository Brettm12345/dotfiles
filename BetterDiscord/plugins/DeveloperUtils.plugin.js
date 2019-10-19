//META{"name":"DeveloperUtils","source":"https://github.com/Modder4869/LazyStuff/blob/master/LazyPlugins/DeveloperUtils.plugin.js","website":"https://www.github.com/Modder4869"}*//
class DeveloperUtils {
    getName() {
        return 'DeveloperUtilities';
    }
    getShortName() {
        return 'devutils';
    }
    getDescription() {
        return 'Allows you to inspect elements with alt + rightclick, and adds shortcut in context menu';
    }
    getVersion() {
        return '0.1.3';
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
		this.milliseconds={ //For easy modifiction for the settings panel.
			min:1000,
			max:10000
		}
	}
	get defaultSettings(){ //When regenerating settings, the settings panel likes to change the default settings for some reason. This is the fix.
		return{
			DevUtils: {
                KeyCombinationEnabled: true,
                delay: 3000
            }
		}
	}
    loadSettings() {
        this.settings=window.ZLibrary.PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
    }

    saveSettings() {
        window.ZLibrary.PluginUtilities.saveSettings(this.getName(), this.settings);
    }
    load() {
		let libraryScript=document.getElementById('ZLibraryScript');
		if(!window.ZLibrary&&!libraryScript){
			libraryScript=document.createElement('script');
			libraryScript.setAttribute('type','text/javascript');
			/*In part borrowed from Zere, so it redirects the user to download the Lib if it does not load correctly and the user does not have the plugin version of the lib.*/
			libraryScript.addEventListener("error",function(){if(typeof window.ZLibrary==="undefined"){window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing and could not be loaded.<br /><br /><a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}}.bind(this));
			libraryScript.setAttribute('src','https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js');
			libraryScript.setAttribute('id','ZLibraryScript');
			document.head.appendChild(libraryScript);
		}
    }
    start() {
		let libraryScript=document.getElementById('ZLibraryScript');
		if(typeof window.ZLibrary==="object")this.initialize();
		else libraryScript.addEventListener('load',()=>this.initialize());
    }

    initialize() {
		window.ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), this.getLink());
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
        let x=parseInt(e.clientX * window.devicePixelRatio),y=parseInt(e.clientY * window.devicePixelRatio);
        this.currentWindow.inspectElement(x, y);
    }


    addContextMenuItems(e) {
        let CSSRules=this.getMatchedCSSRules(e.toElement),context=document.querySelector('.contextMenu-HLZMGh');
		if(!CSSRules.length)return;
        let CSSRule=CSSRules[CSSRules.length-1],currentWin=this.currentWindow,
        subMenu = new window.ZLibrary.ContextMenu.SubMenuItem("DevUtils", new window.ZLibrary.ContextMenu.Menu(false).addItems(

            new window.ZLibrary.ContextMenu.TextItem("Debugger", {
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
            new window.ZLibrary.ContextMenu.TextItem("Copy Selector", {
                callback: () => {
                    this.clipboard.writeText(CSSRule.selectorText);
                    $(context).hide();
                }
            }),
            new window.ZLibrary.ContextMenu.TextItem("Copy Declaration", {
                callback: () => {
                    this.clipboard.writeText(CSSRule.style.cssText);
                    $(context).hide();
                }
            }),
            new window.ZLibrary.ContextMenu.TextItem("Copy Rule-Set", {
                callback: () => {
                    this.clipboard.writeText(CSSRule.cssText);
                    $(context).hide();
                }
            }),
            new window.ZLibrary.ContextMenu.TextItem("Inspect", {
                callback: () => {
                    this.inspectAt(e);
                    $(context).hide();
                }
            }),
            new window.ZLibrary.ContextMenu.TextItem("Debugger (timeout)", {
                callback: () => {
                    setTimeout(() => {
                        debugger
                    }, this.settings.DevUtils.delay)
                }
            })

        ));

        let testGroup = new window.ZLibrary.ContextMenu.ItemGroup().addItems(subMenu);
        let newMenu = new window.ZLibrary.ContextMenu.Menu();

        if (!context) {
            context = newMenu.element;
            newMenu.addGroup(testGroup);

            newMenu.show(e.clientX, e.clientY);
            return;
        }
        if (context.classList.contains("plugin-context-menu")) return;
        $(context).find('.itemGroup-1tL0uz').last().append(testGroup.element);
	}

	getMatchedCSSRules(element) {
		let matching=[],sheets=document.styleSheets;
		function loopRules(rules){
			for(let rule of rules){
				if(rule instanceof CSSMediaRule){
					if(window.matchMedia(rule.conditionText).matches){
						loopRules(rule.cssRules);
					}
				}else if(rule instanceof CSSStyleRule){
					if(element.matches(rule.selectorText)){
						matching.push(rule);
					}
				}
			}
		};
		for(let sheet of sheets){
			try{
				loopRules(sheet.cssRules);
			}catch(e){
				//Easiest way to fix an issue of a stylesheet not having a cssRules property; I have yet to find any other solution.
			}
		}
		//console.log(matching); //Debug.
		return matching;
	}//Modified, based on https://stackoverflow.com/questions/2952667/find-all-css-rules-that-apply-to-an-element

	regeneratePanel(panel) {
		if (panel!==undefined) {
			panel.empty();
			this.generateSettings(panel);
		}
	}

    getSettingsPanel() {
        let panel = $("<form>").addClass("form").css("width", "100%");
        if (this.initialized) this.generateSettings(panel);
        return panel[0];
    }

    generateSettings(panel) {
		new window.ZLibrary.Settings.SettingGroup('Settings',{callback:()=>{this.saveSettings();},collapsible:false,shown:true}).appendTo(panel).append(
			new window.ZLibrary.Settings.Switch('Quick Inspect Shortcut','Use the shortcut to quickly inspect an element without opening the context menu. (Alt + rightClick)',this.settings.DevUtils.KeyCombinationEnabled,(i)=>{
				this.settings.DevUtils.KeyCombinationEnabled=i;
			}),
			new window.ZLibrary.Settings.Textbox('Timeout','Timeout pause delay in milliseconds. For a minimum of 1 second and a maximum of 10 seconds.',this.settings.DevUtils.delay,(i)=>{
				let x=parseInt(i,10);
				//Restricts inputs to numbers and limits (min/max) the seconds the user can input.
				if (x!==NaN&&this.milliseconds.min<=x&&x<=this.milliseconds.max){this.settings.DevUtils.delay=i;}
				//Allows the textbox to be empty and below the minimum amount without regenerating the panel, removing a bit of irritation.
				else if(i===''||x<this.milliseconds.min){}
				//Regenerate the panel when on incorrect input, if you have got a better way go for it.
				else{this.regeneratePanel(panel);}
			})
		);

		const resetButton=$('<button>',{type:'button',text:'Reset To Default',style:'float: right;'})
		.click(function(){
			this.settings=this.defaultSettings;
			this.saveSettings();
			this.regeneratePanel(panel);
		}.bind(this));
		panel.append(resetButton);
    }
}
