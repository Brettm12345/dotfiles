//META{"name":"lazyload_patcher"}*//

//jshint esversion: 6

//TODO: somehow reload/redraw the Channels object, for seamless patching
//TODO: find Channels prototype without it being added to the DOM, also for seamless patching

var lazyload_patcher = function() {
	this.pluginName = 'LazyLoad Patcher';

	this.getName = 			function()	{return this.pluginName;};
	this.getDescription = 	function()	{return 'LazyLoad Patcher - Patches Discord\'s lazy loading to allow for themes that modify channel and section heights. Credits to noodlebox#0155, Mydayyy#0344 and Kakkela#6315';};
	this.getVersion = 		function()	{return '1.3.0.1';};
	this.getAuthor = 		function()	{return 'HoLLy#2750';};

	this.patches = [
        {selector: ".scroller-NXV0-d", funcName: "getRowHeight", patchFunction: function(selector, funcName) {this.patchRowHeight(selector, funcName)}.bind(this)},
        {selector: ".scroller-NXV0-d", funcName: "getSectionHeight", patchFunction: function(selector, funcName) {this.patchSectionHeight(selector, funcName)}.bind(this)}
    ];
	
	var ctr = 0;
	
	this.load = function()	{
		this.Log("Loaded");
	};
	
	this.start = function() {
		this.Log("Started");
		//if we start up to the friends page, channels won't be loaded
		if (location.pathname.startsWith('/channels/@me')) {

			//so, we run our patching code once, when we click a guild icon
			$('.guild').has('.avatar-small').on('click.llpPatcher', () => {

				//run after 1000ms, to make sure it is loaded
				setTimeout(() => this.doChatPatch(), 1000);
				$('.guild').off('click.llpPatcher');
			});
		} else {
			setTimeout(() => this.doChatPatch(), 1000);
		}
	};

	this.stop = function()	{ 	this.Log("Stopped");	};
	this.unload = function(){	this.Log("Unloaded");	};

	this.onMessage = function() {};
	
	this.onSwitch = function()  {	
		if (location.pathname.startsWith('/channels/@me')) {
			ctr = 1;
		} else {
			if ($('.containerDefault-1bbItS').height() == null && ctr > 0 ) {
				setTimeout(() => this.doChatPatch(), 1000);
				ctr = 1;
			} else {
				if ($('.containerDefault-1bbItS').height() !== null && ctr > 0 ) {
					setTimeout(() => this.doChatPatch(), 1000);
					ctr = 0;
				} else {
				}
			}
		}	
	};
	
	this.observer = function(e) {};

	this.getSettingsPanel = function () {};

	this.doChatPatch = function() {

		//this.Log('in doChatPatch right now, this is ' + this.constructor.name);
		for (var i = 0; i < this.patches.length; i++) {
			var patch = this.patches[i];
			this.patchSomething(patch.selector, patch.funcName, patch.patchFunction);
		}
		this.Log('finished doChatPatch');
	};

	this.patchSomething = function(selector, funcName, patchFunction) {
		try {
			patchFunction(selector, funcName);
			//success
			this.Log("Patched " + funcName);
		} catch(err) {
			//something went wrong. I should make this more verbose
			this.Log("Failed to patch " + funcName + ": " + err.message, "error");
		}
	};

	this.Log = function(msg, method = "log") {
		console[method]("%c[" + this.pluginName + "]%c " + msg, "color: #DABEEF; font-weight: bold;", "");
	};

	this.patchRowHeight = function(selector, funcName) {
		//get stuff, make stuff
		var instList = $(selector);
		if (instList.length === 0) throw "Could not find selector.";

		var newVar = $('.containerDefault-7RImuF').height();
		var patchedFunc = function() {return newVar;};
		
		const getInternalInstance = e => e[Object.keys(e).find(k => k.startsWith("__reactInternalInstance"))];
		var inst = getInternalInstance(instList[0]);
		inst._currentElement._owner._currentElement._owner._currentElement._owner._instance.getRowHeight =  patchedFunc;
		inst._currentElement._owner._currentElement._owner._currentElement._owner._instance.handleListScroll();

	};
    
    this.patchSectionHeight = function(selector, funcName) {
        //get stuff, make stuff
        var instList = $(selector);
        if (instList.length === 0) throw "Could not find selector.";

        var newVar2 = 0 ;
        var patchedFunc = function() {return newVar2;};
        
        const getInternalInstance = e => e[Object.keys(e).find(k => k.startsWith("__reactInternalInstance"))];
        var inst = getInternalInstance(instList[0]);
        inst._currentElement._owner._currentElement._owner._currentElement._owner._instance.getSectionHeight =  patchedFunc;
        inst._currentElement._owner._currentElement._owner._currentElement._owner._instance.handleListScroll();
    };
};
