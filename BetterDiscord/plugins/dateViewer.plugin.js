//META{"name":"dateViewer","displayName":"Date Viewer","website":"https://github.com/hammy1/BDStuff/tree/master/Plugins/dateViewer","source":"https://raw.githubusercontent.com/hammy1/BDStuff/master/Plugins/dateViewer/dateViewer.plugin.js"}*//

var dateViewer = (() => {
    const config = {"info":{"name":"Date Viewer","authors":[{"name":"hammy","discord_id":"256531049222242304","github_username":"hammy1"}],"version":"0.2.2","description":"Displays current time, date and day of the week on your right side. The way it's displayed depends on your locale conventions.","github":"https://github.com/hammy1/BDStuff/tree/master/Plugins/dateViewer","github_raw":"https://raw.githubusercontent.com/hammy1/BDStuff/master/Plugins/dateViewer/dateViewer.plugin.js"},"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {window.BdApi.alert("Library Missing",`The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {PluginUtilities, DiscordClasses, DiscordSelectors, DOMTools} = Api;

    return class dateViewer extends Plugin {
        constructor() {
            super();
			this.initialized = false;
			this.style = `
				#dv-mount {
					background-color: #2f3136;
					bottom: 0;
					box-sizing: border-box;
					display: flex;
					height: 95px;
					justify-content: center;
					position: absolute;
					width: 240px;
					z-index: 256;
				}

				#dv-main {
					--gap: 20px;
					background-color: transparent;
					border-top: 1px solid hsla(0, 0%, 100%, .04);
					box-sizing: border-box;
					color: #fff;
					display: flex;
					flex-direction: column;
					height: 100%;
					line-height: 20px;
					justify-content: center;
					text-align: center;
					text-transform: uppercase;
					width: calc(100% - var(--gap) * 2);
				}

				#dv-main .dv-date {
					font-size: small;
					opacity: .6;
				}

				.theme-light #dv-mount {
					background-color: #f3f3f3;
				}

				.theme-light #dv-main {
					border-top: 1px solid #e6e6e6;
					color: #737f8d;
				}

				${DiscordSelectors.MemberList.membersWrap} ${DiscordSelectors.MemberList.members} {
					height: calc(100% - 95px);
				}
			`;

			this.markup = `
				<div id="dv-main">
					<span class="dv-time"></span>
					<span class="dv-date"></span>
					<span class="dv-weekday"></span>
				</div>
			`;
        }
		
        onStart() {
            PluginUtilities.addStyle(this.getName()  + "-style", this.style);
			this.append();
			this.initialized = true;
		}
		
        onStop() {
            PluginUtilities.removeStyle(this.getName()  + "-style");
			this.remove();
		}

		onSwitch() {
			this.append();
		}

		observer(e) {
			if (e.type === 'childList' && e.addedNodes) {
				for (const node of e.addedNodes) {
					if (node.classList && DOMTools.hasClass(node, DiscordClasses.MemberList.membersWrap))
						this.append();

					break;
				}
			}
		}

		append() {
			const memberList = document.querySelector(DiscordSelectors.MemberList.membersWrap);
			if (!memberList || document.querySelector('#dv-mount'))
				return;

			const mount = document.createElement('div');
			mount.id = 'dv-mount';
			mount.innerHTML = this.markup;
			memberList.appendChild(mount);
			this.update();

			clearInterval(this.interval);
			this.interval = setInterval(this.update, 1000);
		}

		remove() {
			const header = document.querySelector('#dv-mount');
			if (!header)
				return;

			header.remove();
		}

		update() {
			const header = document.querySelector('#dv-main');
			if (!header)
				return;

			const _date = new Date();
			let lang = document.documentElement.lang;
			let time = _date.toLocaleTimeString(lang);
			let date = _date.toLocaleDateString(lang, { day: '2-digit', month: '2-digit', year: 'numeric' });
			let weekday = _date.toLocaleDateString(lang, { weekday: 'long' });

			header.querySelector('.dv-time').innerText = time;
			header.querySelector('.dv-date').innerText = date;
			header.querySelector('.dv-weekday').innerText = weekday;
		}
	}
}
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
