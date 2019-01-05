//META{"name":"BetterFormattingRedux","displayName":"BetterFormattingRedux","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterFormattingRedux","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js"}*//

var BetterFormattingRedux = (() => {
    const config = {"info":{"name":"BetterFormattingRedux","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"2.3.1","description":"Enables different types of formatting in standard Discord chat. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterFormattingRedux","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js"},"defaultConfig":[{"type":"category","id":"toolbar","name":"Toolbar Buttons","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"bold","name":"Bold","value":true},{"type":"switch","id":"italic","name":"Italic","value":true},{"type":"switch","id":"underline","name":"Underline","value":true},{"type":"switch","id":"strikethrough","name":"Strikethrough","value":true},{"type":"switch","id":"code","name":"Code","value":true},{"type":"switch","id":"codeblock","name":"Codeblock","value":true},{"type":"switch","id":"superscript","name":"Superscript","value":true},{"type":"switch","id":"smallcaps","name":"Smallcaps","value":true},{"type":"switch","id":"fullwidth","name":"Full Width","value":true},{"type":"switch","id":"upsidedown","name":"Upsidedown","value":true},{"type":"switch","id":"varied","name":"Varied Caps","value":true},{"type":"switch","id":"leet","name":"Leet (1337)","value":false},{"type":"switch","id":"thicc","name":"Extra Thicc","value":false}]},{"type":"category","id":"formats","name":"Active Formats","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"superscript","name":"Superscript","value":true},{"type":"switch","id":"smallcaps","name":"Smallcaps","value":true},{"type":"switch","id":"fullwidth","name":"Full Width","value":true},{"type":"switch","id":"upsidedown","name":"Upsidedown","value":true},{"type":"switch","id":"varied","name":"Varied Caps","value":true},{"type":"switch","id":"leet","name":"Leet (1337)","value":false},{"type":"switch","id":"thicc","name":"Extra Thicc","value":false}]},{"type":"category","id":"wrappers","name":"Wrapper Options","collapsible":true,"shown":false,"settings":[{"type":"textbox","id":"superscript","name":"Superscript","note":"The wrapper for superscripted text","value":"^^"},{"type":"textbox","id":"smallcaps","name":"Smallcaps","note":"The wrapper to make Smallcaps.","value":"%%"},{"type":"textbox","id":"fullwidth","name":"Full Width","note":"The wrapper for E X P A N D E D  T E X T.","value":"##"},{"type":"textbox","id":"upsidedown","name":"Upsidedown","note":"The wrapper to flip the text upsidedown.","value":"&&"},{"type":"textbox","id":"varied","name":"Varied Caps","note":"The wrapper to VaRy the capitalization.","value":"||"},{"type":"textbox","id":"leet","name":"Leet (1337)","note":"The wrapper to talk in 13375p34k.","value":"++"},{"type":"textbox","id":"thicc","name":"Extra Thicc","note":"The wrapper to get 乇乂下尺卂 下卄工匚匚.","value":"$$"}]},{"type":"category","id":"formatting","name":"Formatting Options","collapsible":true,"shown":false,"settings":[{"type":"dropdown","id":"fullWidthMap","name":"Fullwidth Style","note":"Which style of fullwidth formatting should be used.","value":true,"options":[{"label":"T H I S","value":false},{"label":"ｔｈｉｓ","value":true}]},{"type":"switch","id":"reorderUpsidedown","name":"Reorder Upsidedown Text","note":"Having this enabled reorders the upside down text to make it in-order.","value":true},{"type":"switch","id":"fullwidth","name":"Start VaRiEd Caps With Capital","note":"Enabling this starts a varied text string with a capital.","value":true}]},{"type":"category","id":"plugin","name":"Functional Options","collapsible":true,"shown":false,"settings":[{"type":"dropdown","id":"hoverOpen","name":"Opening Toolbar","note":"Determines when to show the toolbar.","value":true,"options":[{"label":"Click","value":false},{"label":"Hover","value":true}]},{"type":"dropdown","id":"chainFormats","name":"Format Chaining","note":"Swaps priority of wrappers between inner first and outer first. Check the GitHub for more info.","value":true,"options":[{"label":"Inner","value":false},{"label":"Outer","value":true}]},{"type":"switch","id":"closeOnSend","name":"Close On Send","note":"This option will close the toolbar when a message is sent.","value":true}]},{"type":"category","id":"style","name":"Style Options","collapsible":true,"shown":false,"settings":[{"type":"dropdown","id":"icons","name":"Toolbar Style","note":"Switches between icons and text as the toolbar buttons.","value":true,"options":[{"label":"Text","value":false},{"label":"Icons","value":true}]},{"type":"dropdown","id":"rightSide","name":"Toolbar Location","note":"This option enables swapping toolbar location.","value":true,"options":[{"label":"Left","value":false},{"label":"Right","value":true}]},{"type":"slider","id":"toolbarOpacity","name":"Opacity","note":"This allows the toolbar to be partially seethrough.","value":1,"min":0,"max":1},{"type":"slider","id":"fontSize","name":"Font Size","note":"Adjusts the font size between 0 and 100%.","value":85,"min":0,"max":100}]}],"changelog":[{"title":"What's New?","items":["Move to local lib only."]}],"main":"index.js"};

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
    const {DiscordSelectors, PluginUtilities, ContextMenu, Tooltip} = Api;
    return class BetterFormattingRedux extends Plugin {
        constructor() {
            super();
            this.isOpen = false;
            this.replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
            this.smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ{|}";
            this.superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁνᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
            this.upsideDownList = " ¡\"#$%℘,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMXλZ]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz}|{";
            this.fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";
            this.leetList = " !\"#$%&'()*+,-./0123456789:;<=>?@48CD3FG#IJK1MN0PQЯ57UVWXY2[\\]^_`48cd3fg#ijk1mn0pqЯ57uvwxy2{|}";
            this.thiccList = "　!\"#$%&'()*+,-./0123456789:;<=>?@卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙[\\]^_`卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙{|}";
    
            this.toolbarString = `<div id="bfredux" class='bf-toolbar'><div class='bf-arrow'></div></div>`;
            
            this.discordWrappers = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", codeblock: "```"};
                            
            this.customWrappers = Object.keys(this.defaultSettings.wrappers);
            this.buttonOrder = Object.keys(this.defaultSettings.toolbar);
            
            
            this.toolbarData = (() => {return {
    bold: {type: "native-format",
            name: "Bold",
            displayName: "<b>Bold</b>",
            icon: `<img src='data:image/svg+xml;utf8,<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'>`},
    italic: {type: "native-format",
            name: "Italic",
            displayName: "<i>Italic</i>",
            icon: `<img src='data:image/svg+xml;utf8,<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>'>`},
    underline: {type: "native-format",
                name: "Underline",
                displayName: "<u>Underline</u>",
                icon: `<img src='data:image/svg+xml;utf8,<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>'>`},
    strikethrough: {type: "native-format",
                    name: "Strikethrough",
                    displayName: "<s>Strikethrough</s>",
                    icon: `<img src='data:image/svg+xml;utf8,<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>'>`},
    code: {type: "native-format",
            name: "Code",
            displayName: "<span style='font-family:monospace;'>Code</span>",
            icon: `<img src='data:image/svg+xml;utf8,<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>'>`},
    codeblock: {type: "native-format",
                name: "Codeblock",
                displayName: "<span style='font-family:monospace;text-decoration: underline overline;'>|Codeblock|</span>",
                icon: `<img src='data:image/svg+xml;utf8,<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M7.77 6.76L6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24zM7 13h2v-2H7v2zm10-2h-2v2h2v-2zm-6 2h2v-2h-2v2zm6.77-7.52l-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z"/></svg>'>`},
    superscript: {type: "bfr-format",
                name: "Superscript",
                displayName: "ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ",
                icon: "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAC9UlEQVR4nO2av08UQRTH+WFhDDFXUFhcYcKBFMRYWtgLgdLS4go7IHAJBYl2FJb8UOsrLC0sjJyGPwMTf5xWJFhYUFBcYfRjsUOczL1d9sfczuwyn+Sa2/fefWdu33ffwI2NBQKBQIUBFoBdoA+cA7+Ad8AO0HStb2QAN4Bt4JR4PgEd4KZrvVYBrgNvExZu8tq1ZqsATzMs/oIt17qtADSJel2nDzxS16aBJ0ReoDMAFlzrLwzwXFh8Q4hrAj+N2F0Xmq0C9IxFPU6IbRuxn8vUOhKAL8ai7iTE3jViT8vU6hzgvrEBZ641lQZwCzgxNuDIta5SIJoOzcUDrLjWNnKU8ZmPSYCdvAW7QrG2XdmiYwN0M+TfJjoDSLwBruUVNgUcGwXPsThUqFvW/NaOgakUuQ2i2WAgLPw3sO1UYIrauTaY6DywBZzFfOsnwIOi+vQPLHSLJtTtCnXbCfEN4BnDU55OD5guqq2w2BT1Mm8q8q2emrxaLz68BRwaNb8BizlqLapcnUOgdUleIfKv/r+AJaIDiM57YCZDjZbK0ekDSyly3W6AErEu1N7PkL8v5K+nzHW/AUrIgVH7L7CWIm9NxeocWBNWFsh+8JUEPwAeqhidS/veW8jgB8AMOfvea5D9YE+I2xPiUvW99zDsB3+AVe36qnpPp3p9HwcJ4ywjHKO9ImGhIz1IeUWMH9Sz7+MQ/KCefR8H8nwAVX7eZyFswFVugSttgsiPwT7Do3L9HoPIg9AAuKde5l9x6jUIxfR9R7veEa7Xww+Q+/4VMKnFTKr3TKrtB8jH4Y/AvBA7r67pVPc4jPy8/0HC/9+AFRWjU835ALnvN1PkbQp51fID5L5/CUykyJ1QsSbV8APkvv8AzGWoMadydPz3A+S+/w4s56i1rHJ1/PYD5L7fKFBvQ6jnpx8g9/0LYLxAzXFVw8QvP0Du+x4wa6H2LMM/ffPHD5D73qrAmA32ww+Q+976LRrTYn76QSAQCAQCgUAgEKg8/wD8huCrKK8/kQAAAABJRU5ErkJggg=='>"},
    smallcaps: {type: "bfr-format",
                name: "Smallcaps",
                displayName: "SᴍᴀʟʟCᴀᴘs",
                icon: `<img src='data:image/svg+xml;utf8,<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M24 24H0V0h24v24z" id="a"/></defs><clipPath id="b"><use overflow="visible" xlink:href="#a"/></clipPath><path clip-path="url(#b)" d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>'>`},
    fullwidth: {type: "bfr-format",
                name: "Fullwidth",
                displayName: "Ｆｕｌｌｗｉｄｔｈ",
                icon: "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA80lEQVR4nO3XzQ2CMBxAcQ4MwcFFHIRBWIQF2MBBZBAGeV5ogkSj1JQife9s0n9/Uj6qyszMzMzMLCIyl3v/AghQOkBsp9lIbAIIIIAAAggggAACCCCAAAIIIIAAuefZPQEEEEAAAQQQQIDTAAA1MGz4fRQAMAB13JSJAhpg3OOfnL1GoEm91lcBLXDf61JeXDR3oE293qdhOmDa8yyvTs4EdKnXfDXEBejX5zgDQKgHLqnXDgNcgdubQXJ2A66pN/903g9Y2vsCpQPMCOUegQVCuTfB1TBlPgZXA5X7IhSi5FfhEBs/hn5Y53gfQ2ZmZv/ZAxEIe1ZZ+BlyAAAAAElFTkSuQmCC'>"},
    upsidedown: {type: "bfr-format",
                name: "Upsidedown",
                displayName: "uʍopǝpᴉsd∩",
                icon: `<img src='data:image/svg+xml;utf8,<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'>`},
    varied: {type: "bfr-format",
            name: "Varied",
            displayName: "VaRiEd CaPs",
            icon: `<img src='data:image/svg+xml;utf8,<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l-4 4h3v7c0 1.1-.9 2-2 2s-2-.9-2-2V8c0-2.21-1.79-4-4-4S5 5.79 5 8v7H2l4 4 4-4H7V8c0-1.1.9-2 2-2s2 .9 2 2v7c0 2.21 1.79 4 4 4s4-1.79 4-4V8h3l-4-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'>`},
    leet: {type: "bfr-format",
            name: "Leet",
            displayName: "1337",
            icon: "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABnklEQVRoge2YL1MCQRiHCRf8EATCBZwhEPwARILR4DeQaDDeDIFgMPAhDAQDgaDdYDAQcMYZMThDNBgIBsJj2GXmXFdub937g/M+kfe3w+/ZeQ8YGg1BEITaAbSAa2BF9ayACRDnKb+utrOVNS4SqJuvK1MXgUXVLXfw4iLwDae9K5DcfUQgMCKQev3OnBXIrAiB81KqK86KEDgE3kooPweawQX0zPYl1wNGwDJnyQQ4sswuXfv4CPQsb9hJzbs7ZLal41S+Y2Q2pG4/uICePxuRgSXTtAg0LbmBkZnk7eMj0DciCyAyMolFYGhkIuAxNf8EWoUL6MzUiN0AMermE9QqmGyAoc7E+kyaxLePj0BL31gWc9we7iVwUJqAztnWZMsGONW5CBhnCPT/2sdHIOLnGmzLn1jyV7+UH4fo43VAS4xQq/IB3ALdHflj4F5nH4CLkH38DhSMCJTQMWyf/yDwZB6qEa8uAraPxrowcxGIqe8fW23XvWujfu+8V9sZUB1muJYX9p2sfai6XyZ7IxDi6axUTAREQBAEoQ58Aaheq+k8olaNAAAAAElFTkSuQmCC'>"},
    thicc: {type: "bfr-format",
            name: "Extra Thicc",
            displayName: "乇乂下尺卂 下卄工匚匚",
            icon: `<img src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGRpc3BsYXk9Im5vbmUiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNS42LDEwLjc5YzAuOTcxLTAuNjcsMS42NS0xLjc3LDEuNjUtMi43OWMwLTIuMjYtMS43NS00LTQtNEg3djE0aDcuMDQNCgljMi4wOSwwLDMuNzEtMS43LDMuNzEtMy43OUMxNy43NSwxMi42ODksMTYuODkxLDExLjM5LDE1LjYsMTAuNzl6IE0xMCw2LjVoM2MwLjgzLDAsMS41LDAuNjcsMS41LDEuNVMxMy44Myw5LjUsMTMsOS41aC0zVjYuNXoNCgkgTTEzLjUsMTUuNUgxMHYtM2gzLjVjMC44MywwLDEuNSwwLjY3LDEuNSwxLjVTMTQuMzMsMTUuNSwxMy41LDE1LjV6Ii8+DQo8cGF0aCBmaWxsPSJub25lIiBkPSJNMCwwaDI0djI0SDBWMHoiLz4NCjx0ZXh0IHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgNS45MzU1IDE0Ljk5NzEpIiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZm9udC1mYW1pbHk9IidLb3pHb1ByNk4tUmVndWxhci04M3B2LVJLU0otSCciIGZvbnQtc2l6ZT0iMTIuNTY0Ij7kuYc8L3RleHQ+DQo8L3N2Zz4NCg=='>`
            },
        zalgo: {type: "bfr-format",
            name: "Zalgo",
            displayName: "Z͞a̕l͘ǵo͠",
            icon: `<img src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M6 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-3 .5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM6 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm15 5.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zM14 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0-3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zm-11 10c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm7 7c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm0-17c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zM10 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0 5.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm8 .5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3 8.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM14 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 3.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm-4-12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 8.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm4-4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'>`
            }
};})();
            this.allLanguages = (() => {return {
    C: {cpp: "C++", csharp: "C#", coffeescript: "CoffeeScript", css: "CSS"},
    H: {html: "HTML/XML"},
    J: {java: "Java", js: "JavaScript", json: "JSON"},
    M: {markdown: "Markdown"},
    P: {perl: "Perl", php: "PHP", py: "Python"},
    R: {ruby: "Ruby"},
    S: {sql: "SQL"},
    V: {vbnet: "VB.NET", vhdl: "VHDL"}
};})();
            this.mainCSS =  `.bf-toolbar {
	user-select: none;
	white-space: nowrap;
	font-size:85%;
	display:block;
	position: absolute;
	color: rgba(255, 255, 255, .5);
	width:auto!important;
	right:0;
	bottom:auto;
	border-radius:3px;
	height:27px!important;
	top:0px;
	transform:translate(0,-100%);
	opacity:1;
	overflow: hidden!important;
	pointer-events: none;
	padding:10px 30px 15px 5px;
	margin: 0 5px 0 0;
}

.bf-toolbar.bf-visible,
.bf-toolbar.bf-hover:hover{
	pointer-events: initial;
}

.bf-toolbar:before {
	content:"";
	display: block;
	width:100%;
	height:calc(100% - 15px);
	position: absolute;
	z-index: -1;
	background:#424549;
	pointer-events: initial;
	left:0px;
	top:5px;
	border-radius:3px;
	transform:translate(0,55px);
	transition:all 200ms ease;
}

.bf-toolbar.bf-visible:before,
.bf-toolbar.bf-hover:hover:before {
	transform:translate(0,0px);
	transition:all 200ms cubic-bezier(0,0,0,1);
}

.bf-toolbar .format {
	display: inline;
	padding: 7px 5px;
	cursor: pointer;
	display : inline-flex;
	align-items : center;
	transform:translate(0,55px);
	transition:all 50ms,transform 200ms ease;
	position:relative;
	pointer-events: initial;
	border-radius:2px;
	max-height: 27px;
	box-sizing: border-box;
	vertical-align: middle;
}

.bf-toolbar .format img {
	opacity: 0.6;
	vertical-align: middle;
	max-height: inherit;
}

.bf-toolbar .format .format-border {
	border: 1px solid rgba(255, 255, 255, .5);
	border-radius: inherit;
}

.bf-toolbar .format:hover{
	background:rgba(255,255,255,.1);
	color:rgba(255,255,255,.9);
}

.bf-toolbar .format:active{
	background:rgba(0,0,0,.1)!important;
	transition:all 0ms,transform 200ms ease;
}

.bf-toolbar.bf-visible .format,
.bf-toolbar.bf-hover:hover .format{
	transform:translate(0,0);
	transition:all 50ms,transform 200ms cubic-bezier(0,0,0,1);
}

.bf-toolbar .format.disabled {
	display: none;
}

.bf-toolbar .format.ghost {
	color: transparent;
	background: rgba(0,0,0,.1);
}

.bf-toolbar .format.ghost img {
	opacity: 0;
}

.bf-toolbar .bf-arrow {
	content:"";
	display:block;
	background:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTcuNDEgMTUuNDFMMTIgMTAuODNsNC41OSA0LjU4TDE4IDE0bC02LTYtNiA2eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+);
	height:30px;
	width:30px;
	right:5px;
	position: absolute;
	pointer-events: initial;
	bottom:0;
	background-repeat: no-repeat;
	background-position: 50%;
	transition:all 200ms ease;
	opacity: .3;
	cursor:pointer;
}
.bf-toolbar.bf-visible .bf-arrow,
.bf-toolbar.bf-hover:hover .bf-arrow {
	transform:translate(0,-14px)rotate(-90deg);
	transition:all 200ms cubic-bezier(0,0,0,1);
	opacity: .9;
}

.message-group .bf-toolbar{
	padding: 10px 5px 15px 5px;
	animation:slide-up 300ms cubic-bezier(0,0,0,1), opacity 300ms ease
}
.upload-modal .bf-toolbar {
	position: relative;
	transform: none;
	padding: 5px 0;
	margin-right: 0;
	border-radius: 2px;
	text-align: center;
	background: #424549;
}
.upload-modal .bf-toolbar::before {
	display: none;
}
.upload-modal .bf-toolbar .format:hover{
	background:rgba(255,255,255,.1);
}
.upload-modal .bf-toolbar .format:active{
	background:rgba(0,0,0,.1);
}
.upload-modal .bf-toolbar .format,
.upload-modal .bf-toolbar:before,
.message-group .bf-toolbar .format,
.message-group .bf-toolbar:before{
	transform:translate(0,0);
}
.upload-modal .bf-toolbar .bf-arrow,
.message-group .bf-toolbar .bf-arrow{
	display: none;
}

.bf-toolbar.bf-left {
	left: 0!important;
	right: auto!important;
	margin-right: 0!important;
	margin-left: 5px!important;
	padding: 10px 10px 15px 30px!important;
}

.bf-toolbar.bf-left .bf-arrow {
	left: 5px!important;
	right: auto!important;
}

.bf-toolbar.bf-left.bf-hover:hover .bf-arrow,.bf-toolbar.bf-left.bf-visible .bf-arrow {
	-webkit-transform: translate(0,-14px) rotate(90deg)!important;
	-ms-transform: translate(0,-14px) rotate(90deg)!important;
	transform: translate(0,-14px) rotate(90deg)!important;
}
.bf-languages {
	display: block;
	position: fixed !important;
	transform: scale(1,0);
	transform-origin: 100% 100%!important;
	background: #424549;
	border-radius: 3px;
	color: rgba(255,255,255,.5);
	padding: 3px;
}
.bf-languages.bf-visible {
	height: auto;
	transition: 200ms cubic-bezier(.2,0,0,1);
	transform: scale(1,1);
	transform-origin: 100% 100%!important;
}

.bf-languages div {
	display: block;
	cursor: pointer;
	padding: 5px 7px;
	border-radius: 2px;
}

.bf-languages div:hover {
	background: rgba(255,255,255,.1);
	color: rgba(255,255,255,.9);
}`;
    
        }

        async onStart() {
            await PluginUtilities.addScript("sortableScript", "//rauenzi.github.io/BetterDiscordAddons/Plugins/Sortable.js");
            PluginUtilities.addStyle(this.getName()  + "-style", this.mainCSS);
            this.buttonOrder = PluginUtilities.loadData(this.getName(), "buttonOrder", this.buttonOrder);
            this.setupToolbar();
        }
        
        onStop() {
            $("*").off("." + this.getName());
            $(".bf-toolbar").remove();
            PluginUtilities.removeScript("sortableScript");
            PluginUtilities.removeStyle(this.getName() + "-style");
        }

        observer(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
    
            var elem = e.addedNodes[0];
            var textarea = elem.querySelector(DiscordSelectors.Textarea.textArea);
            if (textarea) this.addToolbar($(textarea));
        }
    
        updateStyle() {
            this.updateSide();
            this.updateOpacity();
            this.updateFontSize();
        }
        
        updateSide() {
            if (this.settings.style.rightSide) { $(".bf-toolbar").removeClass("bf-left"); }
            else { $(".bf-toolbar").addClass("bf-left"); }
        }
        
        updateOpacity() {
            $(".bf-toolbar").css("opacity", this.settings.style.toolbarOpacity);
        }
    
        updateFontSize() {
            $(".bf-toolbar").css("font-size", this.settings.style.fontSize + "%");
        }
        
        openClose() {
            this.isOpen = !this.isOpen;
            $(".bf-toolbar").toggleClass("bf-visible");
        }

        escape(s) {
            return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
        }
        
        doFormat(text, wrapper, offset) {
    
            // If this is not a wrapper, return original
            if (text.substring(offset, offset + wrapper.length) != wrapper) return text;
            
            var returnText = text, len = text.length;
            var begin = text.indexOf(wrapper, offset);
            
            if (text[begin - 1] == "\\") return text; // If the wrapper is escaped, remove the backslash and return the text
            
            var end = text.indexOf(wrapper, begin + wrapper.length);
            if (end != -1) end += wrapper.length - 1;
            
            // Making it to this point means that we have found a full wrapper
            // This block performs inner chaining
            if (this.settings.plugin.chainFormats) {
                for (var w = 0; w < this.customWrappers.length; w++) {
                    var newText = this.doFormat(returnText, this.settings.wrappers[this.customWrappers[w]], begin + wrapper.length);
                    if (returnText != newText) {
                        returnText = newText;
                        end = end - this.settings.wrappers[this.customWrappers[w]].length * 2;
                    }
                }
            }
            
            returnText = returnText.replace(new RegExp(`([^]{${begin}})${this.escape(wrapper)}([^]*)${this.escape(wrapper)}([^]{${len - end - 1}})`), (match, before, middle, after) => {
                var letterNum = 0;
                middle = middle.replace(/./g, letter => {
                    var index = this.replaceList.indexOf(letter);
                    letterNum += 1;
                    if (wrapper == this.settings.wrappers.fullwidth) {
                        if (this.settings.formatting.fullWidthMap) return index != -1 ? this.fullwidthList[index] : letter;
                        return index != -1 ? letterNum == middle.length ? letter.toUpperCase() : letter.toUpperCase() + " " : letter;
                    }
                    else if (wrapper == this.settings.wrappers.superscript) {return index != -1 ? this.superscriptList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.smallcaps) {return index != -1 ? this.smallCapsList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.upsidedown) {return index != -1 ? this.upsideDownList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.leet) {return index != -1 ? this.leetList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.thicc) {return index != -1 ? this.thiccList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.varied) {
                        var compare = this.settings.formatting.startCaps ? 1 : 0;
                        if (letter.toLowerCase() == letter.toUpperCase()) letterNum = letterNum - 1;
                        return index != -1 ? letterNum % 2 == compare ? letter.toUpperCase() : letter.toLowerCase() : letter;
                    }
                    return letter;
                });
                if (wrapper == this.settings.wrappers.upsidedown && this.settings.formatting.reorderUpsidedown) return before + middle.split("").reverse().join("") + after;
                return before + middle + after;
            });
            
            return returnText;
        }
        
        format(e) {
            if (e.shiftKey || e.which != 13) return;
            var textarea = $(e.currentTarget);
            var text = textarea.val();
            const textOriginal = textarea.val();
            for (var i = 0; i < text.length; i++) {
                if (text[i] == "`") {
                    var next = text.indexOf("`", i + 1);
                    if (next != -1) i = next;
                }
                else if (text[i] == "@") {
                    var match = /@.*#[0-9]*/.exec(text.substring(i));
                    if (match && match.index == 0) i += match[0].length - 1;
                }
                else {
                    for (var w = 0; w < this.customWrappers.length; w++) {
                        if (!this.settings.formats[this.customWrappers[w]]) continue;
                        var newText = this.doFormat(text, this.settings.wrappers[this.customWrappers[w]], i);
                        if (text != newText) {
                            text = newText;
                            i = i - this.settings.wrappers[this.customWrappers[w]].length * 2;
                        }
                    }
                }
            }
            if (this.settings.plugin.closeOnSend) $(".bf-toolbar").removeClass("bf-visible");
            if (text == textOriginal) return;
            var txt = textarea[0];
            txt.focus();
            txt.selectionStart = 0;
            txt.selectionEnd = txt.value.length;
            document.execCommand("insertText", false, text);
        }
        
        wrapSelection(textarea, wrapper, language, rightWrapper) {
            var text = textarea.value;
            var start = textarea.selectionStart;
            var len = text.substring(textarea.selectionStart, textarea.selectionEnd).length;
            var lang = language ? language : "";
            var newline = wrapper === "```" ? "\n" : "";
            text = wrapper + lang + newline + text.substring(textarea.selectionStart, textarea.selectionEnd) + newline + (rightWrapper ? rightWrapper : wrapper);
            textarea.focus();
            document.execCommand("insertText", false, text);
            textarea.selectionEnd = (textarea.selectionStart = start + wrapper.length + lang.length + newline.length) + len;
        }
        
        getContextMenu(textarea) {
            var items = [];
            for (var letter in this.allLanguages) {
                var subItems = [];
                for (var language in this.allLanguages[letter]) {
                    ((language) => {
                        subItems.push(new ContextMenu.TextItem(this.allLanguages[letter][language], {callback: () => {this.wrapSelection(textarea[0], "```", language);}}));
                    })(language);
                }
                items.push(new ContextMenu.SubMenuItem(letter, new ContextMenu.Menu(true).addItems(...subItems)));
            }
            return new ContextMenu.Menu().addItems(...items);
        }
    
        buildToolbar(textarea) {
            var toolbar = $(this.toolbarString);
            if (typeof this.settings.toolbar.bold === "boolean") {
                this.settings.toolbar = this.defaultSettings.toolbar;
                this.saveSettings();
            }
            if (window.BdApi.getPlugin("Zalgo")) {
                this.settings.toolbar.zalgo = true;
                if (!this.buttonOrder.includes("zalgo")) this.buttonOrder.push("zalgo");
            }
            var sorted = Object.keys(this.settings.toolbar).sort((a,b) => {return this.buttonOrder.indexOf(a) - this.buttonOrder.indexOf(b);});
            for (var i = 0; i < sorted.length; i++) {
                var button = $("<div>");
                button.addClass("format");
                button.addClass(this.toolbarData[sorted[i]].type);
                new Tooltip(button, this.toolbarData[sorted[i]].name);
                if (!this.settings.toolbar[sorted[i]]) button.addClass("disabled");
                if (sorted[i] === "codeblock") {
                    let contextMenu = this.getContextMenu(textarea);
                    button.on("contextmenu", (e) => {
                        contextMenu.show(e.clientX, e.clientY);
                    });
                }
                button.attr("data-name", sorted[i]);
                if (this.settings.style.icons) button.html(this.toolbarData[sorted[i]].icon);
                else button.html(this.toolbarData[sorted[i]].displayName);
                toolbar.append(button);
            }
            window.Sortable.create(toolbar[0], {
                draggable: ".format", // css-selector of elements, which can be sorted
                ghostClass: "ghost",
                onUpdate: () => {
                    var buttons = toolbar.children(".format");
                    for (var i = 0; i < buttons.length; i++) {
                        this.buttonOrder[i] = $(buttons[i]).data("name");
                    }
                    PluginUtilities.saveData(this.getName(), "buttonOrder", this.buttonOrder);
                }
            });
            if (!this.settings.style.icons) {
                toolbar.on("mousemove." + this.getName(), (e) => {
                    var $this = $(e.currentTarget);
                    var pos = e.pageX - $this.parent().offset().left;
                    var diff = -$this.width();
                    $this.children().each((index, elem) => {
                        diff += $(elem).outerWidth();
                    });
                    $this.scrollLeft(pos / $this.width() * diff);
                });
            }
    
            return toolbar;
        }
        
        setupToolbar() {
            $(".bf-toolbar").remove();
            $(`${DiscordSelectors.Textarea.channelTextArea} textarea`).each((index, elem) => {
                this.addToolbar($(elem));
            });
        }
        
        addToolbar(textarea) {
            var toolbarElement = this.buildToolbar(textarea);
            if (this.settings.plugin.hoverOpen == true) toolbarElement.addClass("bf-hover");
            if (this.isOpen) toolbarElement.addClass("bf-visible");
            
            textarea.on("keypress." + this.getName(), (e) => {this.format(e);})
                .parent().after(toolbarElement)
                .siblings(".bf-toolbar")
                .on("click." + this.getName(), "div", e => {
                    var button = $(e.currentTarget);
                    if (button.hasClass("bf-arrow")) {
                        if (!this.settings.plugin.hoverOpen) this.openClose();
                    }
                    else {
                        var wrapper = "";
                        if (button.hasClass("native-format")) wrapper = this.discordWrappers[button.data("name")];
                        else if (button.data("name") == "zalgo") return this.wrapSelection(textarea[0], "{{", null, "}}");
                        else wrapper = this.settings.wrappers[button.data("name")];
                        this.wrapSelection(textarea[0], wrapper);	
                    }
                });
            this.updateStyle();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.updateSettings.bind(this));
            return panel.getElement();
        }
        
        updateSettings(group, id, value) {

            if (group == "toolbar") this.setupToolbar();
            if (group == "plugin" && id == "hoverOpen") {
                if (value) $(".bf-toolbar").removeClass("bf-visible").addClass("bf-hover");
                else $(".bf-toolbar").removeClass("bf-hover");
            }

            if (group == "style") {
                if (id == "icons") this.setupToolbar();
                if (id == "rightSide") this.updateSide();
                if (id == "toolbarOpacity") this.updateOpacity();
                if (id == "fontSize") this.updateFontSize();
            }
                
            // var resetButton = $("<button>");
            // resetButton.on("click", () => {
            //     this.settings = this.defaultSettings;
            //     this.saveSettings();
            //     this.setupToolbar();
            //     panel.empty();
            //     this.generateSettings(panel);
            // });
            // resetButton.text("Reset To Defaults");
            // resetButton.css("float", "right");
            // resetButton.attr("type","button");
    
            // panel.append(resetButton);
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();