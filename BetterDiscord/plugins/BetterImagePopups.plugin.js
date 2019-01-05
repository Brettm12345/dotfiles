//META{"name":"BetterImagePopups","website":"https://github.com/Orrielel/BetterDiscordAddons/tree/master/Plugins/BetterImagePopups","source":"https://raw.githubusercontent.com/Orrielel/BetterDiscordAddons/master/Plugins/BetterImagePopups/BetterImagePopups.plugin.js"}*//

/* global BdApi */

const BetterImagePopups = (function() {
	// plugin settings
	const script = {
		name: "Better Image Popups",
		file: "BetterImagePopups",
		version: "1.4.7",
		author: "Orrie",
		desc: "Improves the image popups with full resolution images (if activated) and zooming from native size when clicking on them",
		url: "https://github.com/Orrielel/BetterDiscordAddons/tree/master/Plugins/BetterImagePopups",
		raw: "https://raw.githubusercontent.com/Orrielel/BetterDiscordAddons/master/Plugins/BetterImagePopups/BetterImagePopups.plugin.js",
		discord: "https://discord.gg/YEZkpkj",
		settings: {fullRes: true, onClick: false, minSize: false, height: "auto", width: "auto", tooltips: false, debug: false},
		settingsMenu: {
			//        localized                  type     description
			fullRes:  ["Full Resolution Images",  "check", "Replaces images with full resolution.<br>NOTE: Zooming is always possible. Default is 25% per click.<br>Use CTRL (100%), SHIFT (50%) and ALT (200%) to manipulate the zooming clicks."],
			onClick:  ["Load on Click",           "check", "Only use full resolution when clicking the image -- disables zoom when not using full resolution"],
			minSize:  ["Minimum Size for Images", "check", "Use a minimum height/width for images (use 'auto' for no minimum limit)"],
			height:   ["Height",                  "text",  "In pixels"],
			width:    ["Width",                   "text",  "In pixels"],
			tooltips: ["Tooltips",                "check", "Hide tooltips"],
			debug:    ["Debug",                   "check", "Displays verbose stuff into the console"]
		},
		css: {
			script:`
.bip-container {text-align: center;}
.bip-container .scrollerWrap-2lJEkd {display: initial; min-height: unset;}
.bip-container .imageWrapper-2p5ogY img {position: static;}
.bip-container .spinner-2enMB9 {position: absolute;}
.bip-container .bip-scroller {margin-bottom: 6px; max-height: calc(100vh - 160px); max-width: calc(100vw - 160px); overflow: auto;}
.bip-container .bip-scroller img {vertical-align: middle;}
.bip-container .bip-scroller::-webkit-scrollbar-corner {background: rgba(0,0,0,0);}
.bip-container .bip-center {max-height: calc(100vh - 160px); max-width: calc(100vw - 160px);}
.bip-container .bip-description {font-size: 16px; line-height: 24px;}
.bip-container .bip-description > span {margin-left: 4px;}
.bip-container .bip-description > span+span:before {content: "–"; font-weight: bold; margin-right: 4px;}
.bip-container .downloadLink-1ywL9o {text-transform: capitalize;}
.bip-container .bip-controls {margin: 0 auto; padding: 10px 25px; visibility: hidden;}
.bip-container.bip-scaling .bip-controls {visibility: visible;}
.bip-container .bip-controls > div:not(.tooltip) {display: inline-block;}
.bip-container .bip-zoom {border-radius: 5px; border: 2px solid; cursor: pointer; line-height: 20px; margin: 0 10px; padding: 0px 5px; text-align: center; width: 10px;}
.bip-toggled {display: none !important;}
.bip-container .orrie-tooltip .tooltip-top {bottom: calc(100% + 10px);}
.bip-container .orrie-tooltip .tooltip-bottom {top: 100%;}
.bip-container.bip-scaling .scrollerWrap-2lJEkd .tooltip {display: none;}
// progress bar
@-webkit-keyframes progress-bar-stripes {from {background-position: 40px 0;} to {background-position: 0 0;}}
@keyframes progress-bar-stripes {from { background-position: 40px 0;} to { background-position: 0 0;}}
.bip-progress {background-color: rgba(0, 0, 0, 0.25); border-radius: 4px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); height: 24px; overflow: hidden; position: absolute; top: 0; width: 100%;}
.bip-progress_bar {animation: progress-bar-stripes 2s linear infinite; background-color: #5CB85C; background-image: linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent); background-size: 40px 40px; box-shadow: inset 0 -1px 0 rgba(0,0,0,0.15); color: #FFFFFF; float: left; font-size: 14px; font-weight: 500; height: 100%; line-height: 24px; opacity: 0.8; text-align: center; transition: width 0.6s ease; width: 0; white-space: nowrap;}
			`,
			shared: `
.orriePluginModal .backdrop-1wrmKB {background-color: #000000; opacity: 0.85;}
.orriePluginModal .modal-1UGdnR {opacity: 1;}
.orriePluginModal .modal-3HD5ck {padding: 0 20px; width: 800px;}
.orriePluginModal .description-3_Ncsb {font-size: 16px; line-height: 24px;}
.orrie-plugin .buttonBrandFilled-3Mv0Ra a {color: #FFFFFF !important;}
.orrie-buttonRed, .bda-slist .orrie-buttonRed {background-color: #F04747 !important;}
.orrie-buttonRed:hover, .bda-slist .orrie-buttonRed:hover {background-color: #FD5D5D !important;}
.orrie-toggled {display: none !important;}
.orrie-relative {position: relative;}
.orrie-centerText {text-align: center;}
.orrie-inputRequired::before {color: #F04747; content: "*"; font-size: 20px; font-weight: 700; margin-left: 2px; position: absolute; z-index: 1;}
.theme-dark .orrie-plugin {color: #B0B6B9;}
/* tooltips */
.orrie-tooltip {overflow: initial;}
.orrie-tooltip:hover > .tooltip {display: initial;}
.orrie-tooltip .tooltip {display: none; margin: 0; text-align: center; width: max-content;}
.orrie-tooltip .tooltip-top {bottom: 135%; left: 50%; transform: translateX(-50%);}
.orrie-tooltip .tooltip-bottom {top: 135%; left: 50%; transform: translateX(-50%);}
.orrie-tooltip .tooltip-right {left: 135%; top: 50%; transform: translateY(-50%);}
.orrie-tooltip .tooltip-left {right: 135%; top: 50%; transform: translateY(-50%);}
.orrie-tooltip .tooltip:hover {display: none;}
			`
		},
		zoom: 100
	},
	settingsLoad = function() {
		// load settings
		const storage = BdApi.loadData(script.file, "settings");
		if (storage) {
			script.settings = storage;
		}
		else {
			BdApi.saveData(script.file, "settings", script.settings);
		}
		if (typeof window.PluginUpdates !== "object" || !window.PluginUpdates) {
			window.PluginUpdates = {plugins:{}};
		}
		window.PluginUpdates.plugins[script.raw] = {name:script.name, raw:script.raw, version:script.version};
		log("info", "Settings Loaded");
	},
	log = function(method, title, data) {
		// logging function
		if (script.settings.debug) {
			console[method](`%c[${script.file}]%c ${title}`, "color: purple; font-weight: bold;", "", new Date().toLocaleTimeString("en-GB"), data ? data : "");
		}
	},
	mediaSize = function(fileSize) {
		let l = 0;
		while(fileSize >= 1024) {
			fileSize = fileSize/1024;
			l++;
		}
		return fileSize ? `${fileSize.toFixed(3)} ${["Bytes","KB","MB","GB"][l]}` : "ERROR";
	},
	imageLoad = function(imageUrl, onprogress) {
		return new Promise(function(resolve, reject) {
			const xhr = new XMLHttpRequest();
			let notifiedNotComputable = false;
			xhr.open("GET", `https://cors-anywhere.herokuapp.com/${imageUrl}`, true);
			xhr.responseType = 'arraybuffer';
			xhr.onprogress = function({lengthComputable, loaded, total}) {
				if (lengthComputable) {
					onprogress(parseInt((loaded / total) * 100));
				}
				else {
					if (!notifiedNotComputable) {
						notifiedNotComputable = true;
						onprogress(-1);
					}
				}
			};
			xhr.onloadend = function() {
				if (!xhr.status.toString().match(/^2/)) {
					reject(xhr);
				}
				else {
					if (!notifiedNotComputable) {
						onprogress(100);
					}
					const type = xhr.getAllResponseHeaders().match(/^Content-Type\:\s*(.*?)$/mi);
					resolve(new Blob([this.response], {type: type && type[1] ? type[1] : ""}));
				}
			};
			xhr.send();
		});
	},
	imagePopHandler = function(wrapper, node) {
		log("info", "imagePop", wrapper);
		const img = wrapper.lastElementChild;
		if (img.src && wrapper.getElementsByTagName("VIDEO").length === 0) {
			const proxy = img.src.split("?")[0],
			container = wrapper.parentNode,
			fullSrc = /\/external\//.test(proxy) ? proxy.match(/http[s\/\.][\w\.\-\/]+/g)[0].replace(/https\/|http\//,"https://") : proxy;
			wrapper.href = fullSrc;
			wrapper.style.cssText = "";
			wrapper.removeAttribute("target");
			img.fullRes = false;
			if (script.settings.fullRes) {
				container.appendChild(_createElement("div", {className: "bip-progress bip-toggled", id: "bip-progress", innerHTML: "<div class='bip-progress_bar' id='bip-progress_bar'>Loading Full Resolution (<span>0%</span>)</div>"}));
				if (!script.settings.onClick) {
					imageLoadHandler(img, fullSrc, proxy);
				}
			}
			node.classList.add("bip-container");
			node.firstElementChild.appendChild(_createElement("div", {className: "bip-controls description-3_Ncsb orrie-tooltip orrie-relative"}, [
				_createElement("div", {className: "bip-zoom downloadLink-1ywL9o", textContent: "-",
					onclick(click) {
						zoomImage(click, "out", img, wrapper);
					}
				}),
				_createElement("div", {className: "bip-zoom-level"}),
				_createElement("div", {className: "bip-zoom downloadLink-1ywL9o", textContent: "+",
					onclick(click) {
						zoomImage(click, "in", img, wrapper);
					}
				}),
				!script.settings.tooltips ? _createElement("div", {className: "tooltip tooltip-brand tooltip-bottom", textContent: "Shift = 50%, Ctrl = 100% and Alt = 200%"}) : ""
			]));
			container.classList.add("orrie-tooltip", "orrie-relative");
			container.insertBefore(_createElement("div", {className: "bip-description description-3_Ncsb userSelectText-1o1dQ7", innerHTML: `<span id='bip-info'></span><span id='bip-size' class='bip-toggled'></span><span id='bip-scale' class='bip-toggled'></span><span id='bip-zoom' class='bip-toggled'>Zoomed to <span class='bip-zoom-width'></span>px × <span class='bip-zoom-height'></span>px</span><span id='bip-error' class='bip-toggled'></span></span>`}), container.lastElementChild);
			if (!script.settings.tooltips) {
				container.appendChild(_createElement("div", {className: "tooltip tooltip-brand tooltip-top", textContent: script.settings.fullRes && script.settings.onClick ? "Click the image to load full resolution, then click the image to zoom": "Click the image to zoom"}));
			}
			img.classList.add("bip-center");
			img.style.cssText = "";
			img.onclick = function() {
				if (img.fullRes) {
					this.classList.toggle("bip-center");
					wrapper.classList.toggle("bip-scroller");
					wrapper.classList.toggle("scroller-2FKFPG");
					container.classList.toggle("scrollerWrap-2lJEkd");
					node.classList.toggle("bip-scaling");
					document.getElementById("bip-zoom").classList.toggle("bip-toggled");
					if (img.scaled) {
						document.getElementById("bip-scale").classList.toggle("bip-toggled");
					}
					BdApi.clearCSS(`${script.file}-zoom`);
					BdApi.injectCSS(`${script.file}-zoom`, `
						.bip-container .imageWrapper-2p5ogY.bip-scroller img {zoom: ${script.zoom}%}
						.bip-zoom-level:after{content: '${script.zoom}%';}
						.bip-zoom-width:after{content: '${img.width*(script.zoom/100)}';}
						.bip-zoom-height:after{content: '${img.height*(script.zoom/100)}';}
					`);
				}
				else {
					if (script.settings.fullRes && script.settings.onClick) {
						imageLoadHandler(img, fullSrc, proxy);
					}
				}
			};
			img.onload = function() {
				const info_id = document.getElementById("bip-info");
				if (info_id) {
					info_id.textContent = `${this.naturalWidth}px × ${this.naturalHeight}px`;
				}
				if (this.naturalHeight > window.innerHeight || this.naturalWidth > window.innerWidth || (script.settings.minSize && this.naturalHeight !== this.height && this.naturalWidth !== this.width)) {
					const scale_id = document.getElementById("bip-scale");
					if (scale_id) {
						scale_id.textContent = `Scaled to ${this.width}px × ${this.height}px`;
						scale_id.classList.remove("bip-toggled");
					}
					img.scaled = true;
				}
			};
		}
	},
	imageLoadHandler = function(img, fullSrc, proxy) {
		const progress_id = document.getElementById("bip-progress");
		progress_id.classList.remove("bip-toggled");
		imageLoad(fullSrc, function(ratio) {
			const progress_id = document.getElementById("bip-progress"),
			progress_bar_id = document.getElementById("bip-progress_bar");
			if (progress_id) {
				progress_id.classList.remove("bip-toggled");
			}
			if (progress_bar_id) {
				if (ratio == -1) {
					progress_bar_id.style.width = 0;
				}
				else {
					progress_bar_id.style.width = `${ratio}%`;
					progress_bar_id.lastElementChild.textContent = `${ratio}%`;
				}
			}
		}).then(function(blob) {
			const progress_id = document.getElementById("bip-progress"),
			size_id = document.getElementById("bip-size");
			if (progress_id) {
				progress_id.classList.add("bip-toggled");
			}
			if (size_id) {
				size_id.textContent = mediaSize(blob.size);
				size_id.classList.remove("bip-toggled");
			}
			if (img) {
				img.src = window.URL.createObjectURL(blob);
				img.fullRes = true;
			}
		}, function(error) {
			const progress_id = document.getElementById("bip-progress"),
			error_id = document.getElementById("bip-error");
			if (progress_id) {
				progress_id.classList.add("bip-toggled");
			}
			if (error_id) {
				error_id.classList.add("bip-toggled");
				error_id.textContent = `${error.status} ${error.statusText}`;
			}
			if (img) {
				img.src = proxy;
				img.fullRes = true;
			}
			log("error", "imageLoad", error);
		});
	},
	zoomImage = function({altKey, ctrlKey, shiftKey}, mode, img, wrapper) {
		let steps = altKey ? 200 : ctrlKey ? 100 : shiftKey ? 50 : 25;
		switch(mode) {
			case "out":
				if (script.zoom > steps) {
					script.zoom -= steps;
				}
				break;
			case "in":
				script.zoom += steps;
				break;
		}
		const width = img.width*(script.zoom/100),
		height = img.height*(script.zoom/100);
		BdApi.clearCSS(`${script.file}-zoom`);
		BdApi.injectCSS(`${script.file}-zoom`, `
			.bip-container .imageWrapper-2p5ogY.bip-scroller img {zoom: ${script.zoom}%}
			.bip-zoom-level:after{content: '${script.zoom}%';}
			.bip-zoom-width:after{content: '${width}';}
			.bip-zoom-height:after{content: '${height}';}
		`);
	},
	minImageSize = function() {
		if (script.settings.minSize) {
			BdApi.clearCSS(`${script.file}-imageSize`);
			BdApi.injectCSS(`${script.file}-imageSize`, `.bip-container .imageWrapper-2p5ogY {min-height: ${isNaN(script.settings.height) ? "auto" : `${script.settings.height}px`}; min-width: ${isNaN(script.settings.width) ? "auto" : `${script.settings.width}px`}`);
		}
		else {
			BdApi.clearCSS(`${script.file}-imageSize`);
		}
	},
	settingsPanel = function() {
		// settings panel creation
		const settingsFragment = document.createDocumentFragment();
		for (let _s_k = Object.keys(script.settingsMenu), _s=0, _s_len=_s_k.length; _s<_s_len; _s++) {
			const setting = script.settingsMenu[_s_k[_s]];
			settingsFragment.appendChild(_createElement("div", {className: "ui-flex flex-vertical flex-justify-start flex-align-stretch flex-nowrap ui-switch-item", style: "margin-top: 0px;"}, [
				_createElement("div", {className: "ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-nowrap plugin-setting-input-row", innerHTML: `<h3 class='ui-form-title h3 marginReset-236NPn ui-flex-child'>${setting[0]}</h3>`},
					_createElement("div", {className: "input-wrapper"}, settingsType(_s_k[_s], setting))
				),
				_createElement("div", {className: "ui-form-text style-description marginTop4-2BNfKC", innerHTML: setting[2]})
			]));
		}
		return _createElement("div", {className: `${script.file} orrie-plugin`}, [
			_createElement("div", {className: "plugin_wrapper"}, [
				_createElement("h2", {className: "h5-18_1nd title-3sZWYQ marginReset-236NPn height16-2Lv3qA weightSemiBold-NJexzi defaultMarginh5-2mL-bP marginBottom8-AtZOdT", textContent: "Settings"}),
				_createElement("div", {className: "plugin-controls"}, settingsFragment)
			]),
			_createElement("div", {className: "flex-1O1GKY justifyAround-1n1pnI"}, [
				_createElement("a", {href: script.discord, target: "_blank", rel:"noreferrer", innerHTML: "<button type='button' class='button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN'>Support (Discord)</button>"}),
				_createElement("a", {href: script.url, target: "_blank", rel:"noreferrer", innerHTML: "<button type='button' class='button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN'>Source (GitHub)</button>"})
			])
		]);
	},
	settingsType = function(key, props) {
		switch(props[1]) {
			case "check":
				const checked = script.settings[key] ? "checked" : "";
				return _createElement("label", {className: "ui-switch-wrapper ui-flex-child", style: "flex: 0 0 auto; right: 0px;"}, [
					_createElement("input", {type: "checkbox", className: "plugin-input ui-switch-checkbox plugin-input-checkbox", checked,
						onchange() {
							settingsSave(key, this.checked);
							settingsAnimate(this, "check", this.checked);
						}
					}),
					_createElement("div", {className: `ui-switch ${checked}`})
				]);
			case "range":
				const value = `${(script.settings[key]*100).toFixed(0)}%`;
				return _createElement("div", {className: "plugin-setting-input-container", innerHTML: `<span class='plugin-setting-label'>${value}</span>`},
					_createElement("input", {className: "plugin-input plugin-input-range", type: "range", max: "1", min: "0", step: "0.01", value: script.settings[key], style: `background: linear-gradient(to right, rgb(114, 137, 218), rgb(114, 137, 218) ${value}, rgb(114, 118, 125) ${value}); margin-left: 10px; float: right;`,
						onchange() {settingsSave(key, this.value);},
						oninput() {settingsAnimate(this, "range", this.value);}
					})
				);
			case "text":
				return _createElement("input", {className: "plugin-input plugin-input-text inputDefault-_djjkz input-cIJ7To size16-14cGz5", placeholder: script.settings[key], type: "text", value: script.settings[key],
					onchange() {settingsSave(key, this.value);}
				});
		}
	},
	settingsSave = function(key, data) {
		// save settings
		script.settings[key] = data;
		BdApi.saveData(script.file, "settings", script.settings);
		log("info", "Settings Saved", [key, data]);
	},
	settingsAnimate = function({nextElementSibling, previousElementSibling, style}, type, data) {
		// animate settings changes
		switch(type) {
			case "check":
				nextElementSibling.classList.toggle("checked");
				break;
			case "range":
				const value = `${(data*100).toFixed(0)}%`;
				previousElementSibling.textContent = value;
				style.background = `linear-gradient(to right, rgb(114, 137, 218), rgb(114, 137, 218) ${value}, rgb(114, 118, 125) ${value})`;
				break;
			// case "text":
		}
	},
	_createElement = function(tag, attributes, children) {
		// element creation
		const element = Object.assign(document.createElement(tag), attributes);
		if (children) {
			if (children.nodeType) {
				element.appendChild(children);
			}
			else {
				for (let _c=0, _c_len=children.length; _c<_c_len; _c++) {
					const child = children[_c];
					if (child && child.nodeType) {
						element.appendChild(child);
					}
				}
			}
		}
		return element;
	};
	return class BetterImagePopups {
		getName() {return script.name;}
		getVersion() {return script.version;}
		getAuthor() {return script.author;}
		getDescription() {return script.desc;}
		constructor() {
			this.script = script;
		}
		// create settings panel
		getSettingsPanel() {
			return settingsPanel();
		}
		// load, start and observer
		load() {}
		start() {
			settingsLoad();
			BdApi.clearCSS("orrie-plugin");
			BdApi.injectCSS("orrie-plugin", script.css.shared);
			BdApi.injectCSS(script.file, script.css.script);
			minImageSize();
			this.active = true;
		}
		observer({addedNodes}) {
			if (addedNodes.length > 0) {
				const node = addedNodes[0];
				if (node.classList && node.classList.contains("modal-1UGdnR")) {
					const wrapper = node.getElementsByClassName("imageWrapper-2p5ogY")[0];
					if (wrapper && !wrapper.classList.contains("embedVideoImageComponent-34z3di") && !node.getElementsByClassName("uploadModal-2ifh8j")[0]) {
						BdApi.clearCSS(`${script.file}-zoom`);
						script.zoom = 100;
						const wrapperObserver = new MutationObserver(function(mutations) {
							if (mutations[1].addedNodes.length) {
								imagePopHandler(wrapper, node);
								wrapperObserver.disconnect();
							}
						});
						if (node.getElementsByClassName("imageWrapperInner-3_dNk0")[0]) {
							wrapperObserver.observe(wrapper,{childList: true});
						}
						else {
							imagePopHandler(wrapper, node);
						}
					}
					minImageSize();
				}
			}
		}
		// stop script
		stop() {
			BdApi.clearCSS(script.file);
			BdApi.clearCSS(`${script.file}-imageSize`);
			BdApi.clearCSS(`${script.file}-zoom`);
			this.active = false;
		}
	};
})();
