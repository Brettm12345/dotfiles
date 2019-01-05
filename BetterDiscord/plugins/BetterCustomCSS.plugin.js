//META{"name":"BetterCustomCSS"}*//
/*globals BdApi*/

'use strict';
var BetterCustomCSS = function () {};
BetterCustomCSS.prototype.getAuthor = function () {
	return "kosshi";
};
BetterCustomCSS.prototype.getName = function () {
	return "BetterCustomCSS";
};
BetterCustomCSS.prototype.getDescription = function () {
	return "Lets you edit CSS live with your favorite text editor. Like Custom CSS but better.";
};
BetterCustomCSS.prototype.getVersion = function () {
	return "0.1.0";
};

BetterCustomCSS.prototype.start = function () {
	let settings = this.loadSettings();
	let fs = require('fs');

	if(this.accessSync(settings.direcotry)){
		let elem = document.createElement("style");
		elem.id = "bettercustomcss";
		document.head.appendChild(elem);

		this.watcher = fs.watch(settings.direcotry, {}, this.appendFile.bind(this));
		this.appendFile();
	}
};
BetterCustomCSS.prototype.stop = function () {
	if( document.getElementById('bettercustomcss') ){
		this.watcher.close();
		document.head.removeChild( document.getElementById('bettercustomcss') );
	}
};

BetterCustomCSS.prototype.appendFile = function () {
	let settings = this.loadSettings();
	let fs = require('fs');
	fs.readFile(settings.direcotry, "utf8", (err, file)=>{
		if(err){
			BdApi.getCore().alert(
				"BetterCustomCSS Error",
				"Failed to read '"+settings.direcotry+"'. The plugin will be disabled. Go to the plugin settings and set the path correctly. This usually happens when the file is deleted or renamed."
			); 
			this.stop();
			return;
		}
		document.getElementById('bettercustomcss').innerHTML = file;
	});
};

BetterCustomCSS.prototype.load = function () {};
BetterCustomCSS.prototype.unload = function () {};
BetterCustomCSS.prototype.onMessage = function () {};
BetterCustomCSS.prototype.onSwitch = function () {};

BetterCustomCSS.prototype.accessSync = function(dir){
	var fs = require('fs');
	try {
		fs.accessSync(dir, fs.F_OK);
		return true;
	} catch (e) {
		return false;
	}
};


BetterCustomCSS.prototype.observer = function () {};
BetterCustomCSS.prototype.saveSettings = function (button) {
	var settings = this.loadSettings();
	var dir = document.getElementById('qs_directory').value;
	
	var plugin = BdApi.getPlugin('BetterCustomCSS');
	var err = document.getElementById('qs_err');
	
	if( plugin.accessSync(dir) ){

		settings.direcotry = dir;
		
		bdPluginStorage.set(this.getName(), 'config', JSON.stringify(settings));

		plugin.stop();
		plugin.start();
		
		err.innerHTML = "";
		button.innerHTML = "Saved and applied!";
	} else {
		err.innerHTML = "Error: Invalid directory!";
		return;
	}
		setTimeout(()=>{button.innerHTML = "Save and apply";},1000);
};

BetterCustomCSS.prototype.settingsVersion = 1;
BetterCustomCSS.prototype.defaultSettings = function () {
	return {
		version: this.settingsVersion,
		direcotry: "none"
	};
};

BetterCustomCSS.prototype.resetSettings = function (button) {
	var settings = this.defaultSettings();
	bdPluginStorage.set(this.getName(), 'config', JSON.stringify(settings));
	this.stop();
	this.start();
	button.innerHTML = "Settings resetted!";
	setTimeout(function(){button.innerHTML = "Reset settings";},1000);
};

BetterCustomCSS.prototype.loadSettings = function() {
	// Loads settings from localstorage
	var settings = (bdPluginStorage.get(this.getName(), 'config')) ? JSON.parse(bdPluginStorage.get(this.getName(), 'config')) : {version:"0"};
	if(settings.version != this.settingsVersion){
		console.log('['+this.getName()+'] Settings were outdated/invalid/nonexistent. Using default settings.');
		settings = this.defaultSettings();
		bdPluginStorage.set(this.getName(), 'config', JSON.stringify(settings));
	}
	return settings;
};
BetterCustomCSS.prototype.import = function (string) {
	bdPluginStorage.set(this.getName(), 'config', string);
	this.stop();
	this.start();
}

BetterCustomCSS.prototype.getSettingsPanel = function () {
	var settings = this.loadSettings();
	var html = "<h3>Settings Panel</h3><br>";
	html += "BetterCustomCSS css file directory<br>";
	html +=	"<input id='qs_directory' type='text' value=" + (settings.direcotry) + " style='width:100% !important;'> <br><br>";

	html +="<br><button onclick=BdApi.getPlugin('"+this.getName()+"').saveSettings(this)>Save and apply</button>";
	html +="<button onclick=BdApi.getPlugin('"+this.getName()+"').resetSettings(this)>Reset settings</button> <br><br>";

	html += "<p style='color:red' id='qs_err'></p>";

	html += "How to use:";
	html += "<br>1) Create a CSS file that you want to use.";
	html += "<br>2) Set the directory setting to the file. (eg C:/Users/youruser/Desktop/theme.css)";
	html += "<br>3) The file will be now loaded to the DOM. The plugin attempts to reload the file when it is edited.";
	html += "<br>4) You can now open the file in your favorite text editor, edit it, and see the results instantly after saving the file.";

	return html;
};


