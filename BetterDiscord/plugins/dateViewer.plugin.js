//META{"name":"dateViewer"}*//
class dateViewer {
    getName() { return 'Date Viewer'; }
    getShortName() { return 'dateViewer'; }
    getDescription() { return 'Displays current time, date and day of the week on your right side. The way it\'s displayed depends on your locale conventions.' }
    getVersion() { return '0.2.1'; }
    getAuthor() { return 'hammy'; }
    getDownloadLink() { return 'https://raw.githubusercontent.com/hammy1/BDStuff/master/Plugins/dateViewer/dateViewer.plugin.js'; }

    constructor() {
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

            .membersWrap-2h-GB4 .members-1998pB {
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

    //Are we there yet?...
    load() { }

    start() {
        let libraryScript = document.querySelector('#zeresLibraryScript');
        if (!libraryScript) {
            libraryScript = document.createElement('script');
            libraryScript.setAttribute('type', 'text/javascript');
            libraryScript.setAttribute('src', 'https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js');
            libraryScript.setAttribute('id', 'zeresLibraryScript');
            document.head.appendChild(libraryScript);
        }

        if (typeof window.ZeresLibrary !== 'undefined') this.initialize();
        else libraryScript.addEventListener('load', () => this.initialize());
    }

    stop() {
        BdApi.clearCSS(this.getShortName() + '-style');
        this.remove();
    }

    initialize() {
        BdApi.injectCSS(this.getShortName() + '-style', this.style);
        PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), this.getDownloadLink());
        PluginUtilities.showToast(this.getName() + ' ' + this.getVersion() + ' has started.');
        this.append();

        this.initialized = true;
    }

    onSwitch() {
        this.append();
    }

    observer(e) {
        if (e.type === 'childList' && e.addedNodes) {
            for (const node of e.addedNodes) {
                if (node.classList && node.classList.contains('membersWrap-2h-GB4'))
                    this.append();

                break;
            }
        }
    }

    append() {
        const memberList = document.querySelector('.membersWrap-2h-GB4');
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
