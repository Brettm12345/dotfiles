//META{"name":"kawaiiemotes"}*//

/*@cc_on
@if (@_jscript)
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you mistakenly tried to run me directly. (don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.\nJust reload Discord with Ctrl+R.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!\nJust reload Discord with Ctrl+R.", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();
@else @*/

var kawaiiemotes = function () {};

(function () {
    "use strict";

    // Emote data
    function EmoteSet() {
        this.emoteMap = new Map();
        this.template = "";
        this.caseSensitive = true;
        this.emoteStyle = EmoteSet.emoteStyle.STANDARD;
        this.loaded = false;
    };
    // emoteStyle enum
    EmoteSet.emoteStyle = {
        STANDARD: 0, // Surrounded by ":"
        TWITCH: 1, // Composed of "word characters" (\w)
    };
    // template field names enum
    EmoteSet.templateField = {
        PATH: 0, // The unique path component for this emote name
        SIZE: 1, // emote size, usually a single digit between 1 and 4
    };
    EmoteSet.prototype.load = function(){};
    EmoteSet.prototype.getUrl = function (emoteName) {
        if (!this.caseSensitive) {
            emoteName = emoteName.toLowerCase();
        }
        var path = this.emoteMap.get(emoteName);
        if (path === undefined) {
            return undefined;
        }
        return this.template.replace(/{(\d+)}/g, function (match, field) {
            switch (Number(field)) {
                case EmoteSet.templateField.PATH:
                    return path;
                case EmoteSet.templateField.SIZE:
                    return "1";
                default:
                    return match;
            }
        });
    };
    // Create and return an emote element, or undefined if no match found
    EmoteSet.prototype.createEmote = function (emoteName, options) {
        options = $.extend({allowWide: false}, options);

        var emoteURL = this.getUrl(emoteName);
        if (emoteURL === undefined) {
            return undefined;
        }
        if (this.emoteStyle === EmoteSet.emoteStyle.STANDARD) {
            emoteName = ":"+emoteName+":";
        }
        var emote = $("<img>", {
            src: emoteURL,
            alt: emoteName,
            title: emoteName,
            "class": "emoji kawaii-parseemotes",
        }).attr("draggable", "false");

        // Show a fake favorite button
        emote.css("cursor", "pointer");
        emote.on("mouseover.kawaiiFavorite", function () {
            // Create and insert favorite button
            var fav = $("<div>").addClass("fav")
                .css("display", "block")
                .css("pointer-events", "none")
                .appendTo($(".tooltips"));

            // Position the button
            var position = emote.offset();
            position.top -= fav.height()/2;
            position.left += emote.width() - fav.width()/2;
            fav.offset(position);

            // Set a handler to destroy the button
            emote.on("mouseout.kawaiiFavorite", function () {
                // remove this handler
                emote.off("mouseout.kawaiiFavorite");
                fav.remove();
            });
        });

        emote.on("click.kawaiiFavorite", function () {
            quickEmoteMenu.favorite(emoteName, emoteURL);
        });
        if (options.allowWide) {
            emote.on("load.kawaiiWideEmote", function () {
                var wide = this.naturalWidth > this.naturalHeight;
                $(this).css("width", wide ? "auto" : "");
            });
        }
        return emote;
    };
    EmoteSet.prototype.search = function (query) {
        const score = function (name, query) {
            name = name.toLowerCase();
            query = query.toLowerCase();
            const d = name.length - query.length;
            const i = name.indexOf(query);
            if (i === -1) {
                return 0;
            }
            return 1 + (i+1)*(d-i+2);
        };
        return [...this.emoteMap.keys()]
            .map(e => [e, score(e, query)])
            .filter(e => e[1] !== 0);
    };

    function getCompletionsStandard(emoteSets, text) {
        const match = text.match(/(^|\s):(\w{2,})$/);
        if (match === null) {
            return {completions: [], matchText: null, matchStart: -1};
        }

        const completions = emoteSets
            .filter(s => s.emoteStyle === EmoteSet.emoteStyle.STANDARD)
            .map(s => s.search(match[2]).map(e => [[":"+e[0]+":", s.createEmote.bind(s, e[0])], e[1]]))
            .reduce((a,b) => a.concat(b), []);
        const matchText = ":"+match[2], matchStart = match.index + match[1].length;

        return {completions, matchText, matchStart};
    }

    function getCompletionsTwitch(emoteSets, text) {
        const match = text.match(/(^|\s)(\w{3,})$/);
        if (match === null) {
            return {completions: [], matchText: null, matchStart: -1};
        }

        const completions = emoteSets
            .filter(s => s.emoteStyle === EmoteSet.emoteStyle.TWITCH)
            .map(s => s.search(match[2])
                    .filter(e => $.inArray(e[0], bemotes) === -1)
                    .map(e => [[e[0], s.createEmote.bind(s, e[0])], e[1]])
                    )
            .reduce((a,b) => a.concat(b), []);
        const matchText = match[2], matchStart = match.index + match[1].length;

        return {completions, matchText, matchStart};
    }

    const emoteComparator = (function () {
        const compare = new Intl.Collator(undefined, {
            usage: "sort",
            sensitivity: "base",
            numeric: true,
        }).compare;

        return (a,b) => ((a[1]===b[1]) ? compare(a[0],b[0]) : (a[1]-b[1]));
    })();

    function getCompletions(emoteSets, text) {
        let {completions, matchText, matchStart} = getCompletionsStandard(emoteSets, text);
        if (matchStart === -1) {
            ({completions, matchText, matchStart} = getCompletionsTwitch(emoteSets, text));
        }

        completions = completions
            .sort(emoteComparator)
            .map(e => e[0]);

        return {completions, matchText, matchStart};
    }

    // Set up event handlers
    function startTabComplete(emoteSets, options={}) {
        // Cached information about possible completions
        // Conflicts should be avoidable, as this is cleared on focus loss
        let cached = {};

        let textarea;

        const {
            completionsMenu: showMenu=true,
            completionsDelay: delay=250,
            completionsWindowSize: windowSize=10,
            completionsPreScroll: preScroll=2
        } = options;

        if (!showMenu) {
            return;
        }

        const shouldCompleteStandard = RegExp.prototype.test.bind(/(?:^|\s):\w{2,}$/);

        const shouldCompleteTwitch = RegExp.prototype.test.bind(/(?:^|\s)\w{3,}$/);

        const shouldComplete = RegExp.prototype.test.bind(/(?:^|\s)(?:\w|:)\w{2,}$/);

        // Show possible completions
        let renderCompletions = _.debounce(function () {
            const channelTextarea = $(textarea).closest(".channelTextArea-1LDbYG > .inner-zqa7da");
            const oldAutocomplete = channelTextarea.children(".kawaii-autocomplete");

            const candidateText = textarea.value.slice(0, textarea.selectionEnd);
            if (!shouldCompleteTwitch(candidateText) || !prepareCompletions()) {
                oldAutocomplete.remove();
                return;
            }

            const {completions, matchText, selectedIndex, windowOffset: firstIndex} = cached;

            const matchList = completions.slice(firstIndex, firstIndex+windowSize);

            const autocomplete = $("<div>")
                .addClass("autocomplete-i9yVHs autocomplete-1vrmpx kawaii-autocomplete")
                .on("wheel.kawaii-complete", e => scrollCompletions(e, {locked: true}));
            // FIXME: clean up this mess of jQuery
            $("<div>", {"class": "autocompleteRowVertical-q1K4ky autocompleteRow-2OthDa"})
                .append($("<div>", {"class": "selector-2IcQBU"})
                    .append($("<div>", {text: "Emotes matching "}).append($("<strong>", {text: matchText}))
                        .addClass("contentTitle-2tG_sM primary400-hm0Rav weightBold-2yjlgw")))
                .appendTo(autocomplete);
            autocomplete
                .append(matchList.map((e,i) => {
                    let row = $("<div>", {"class": "autocompleteRowVertical-q1K4ky autocompleteRow-2OthDa"});
                    let selector = $("<div>", {"class": "selector-2IcQBU selectable-x8iAUj"})
                        .append($("<div>")
                            .addClass("flex-lFgbSz flex-1O1GKY horizontal-3Sq5iO horizontal-2VE-Fw flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-vaXJ4Y content-3JfFJh")
                            .css("flex", "1 1 auto")
                            .append(e[1]().toggleClass("emoji icon-17zDF5"))
                            .append($("<div>", {"class": "marginLeft8-1YseBe", text: e[0]})))
                        .appendTo(row);
                    if (i+firstIndex === selectedIndex) {
                        selector.addClass("selectorSelected-1_M1WV");
                    }
                    row.on("mouseenter.kawaii-complete", e => {
                        cached.selectedIndex = i+firstIndex;
                        row.siblings().children(".selectorSelected-1_M1WV").removeClass("selectorSelected-1_M1WV");
                        row.children().addClass("selectorSelected-1_M1WV");
                    }).on("mousedown.kawaii-complete", e => {
                        cached.selectedIndex = i+firstIndex;
                        insertSelectedCompletion();
                        // Prevent loss of focus
                        e.preventDefault();
                    });
                    return row;
                }));

            oldAutocomplete.remove();

            channelTextarea
                .append(autocomplete);
        }, delay);

        // Scroll through the "window" of completions
        function scrollWindow(delta, {locked=false, clamped=false} = {}) {
            const {completions, selectedIndex: prevSel, windowOffset} = cached;

            if (completions === undefined || completions.length === 0) {
                return;
            }

            // Change selected index
            const num = completions.length;
            let sel = prevSel + delta;
            if (clamped) {
                sel = _.clamp(sel, 0, num-1);
            } else {
                sel = (sel % num) + (sel<0 ? num : 0);
            }
            cached.selectedIndex = sel;

            // Clamp window position to bounds based on new selected index
            const boundLower = _.clamp(sel + preScroll - (windowSize-1), 0, num-windowSize);
            const boundUpper = _.clamp(sel - preScroll, 0, num-windowSize);
            cached.windowOffset = _.clamp(windowOffset + (locked ? delta : 0), boundLower, boundUpper);

            // Render immediately
            renderCompletions();
            renderCompletions.flush();
        }

        function prepareCompletions() {
            const candidateText = textarea.value.slice(0, textarea.selectionEnd);
            const {candidateText: lastText} = cached;

            if (lastText !== candidateText) {
                const {completions, matchText, matchStart} = getCompletions(emoteSets, candidateText);
                cached = {candidateText, completions, matchText, matchStart, selectedIndex: 0, windowOffset: 0};
            }

            const {completions} = cached;
            return (completions !== undefined && completions.length !== 0);
        }

        function destroyCompletions() {
            const channelTextarea = $(textarea).closest(".channelTextArea-1LDbYG > .inner-zqa7da");
            const oldAutocomplete = channelTextarea.children(".kawaii-autocomplete");
            oldAutocomplete.remove();
            cached = {};
            renderCompletions.cancel();
        }

        // Insert selected completion at cursor position
        function insertSelectedCompletion() {
            const {completions, matchStart, selectedIndex} = cached;

            if (completions === undefined) {
                return;
            }

            textarea.focus();
            // Set beginning of selection at start of partial emote text; end of selection end remains where it is
            textarea.selectionStart = matchStart;
            document.execCommand("insertText", false, completions[selectedIndex][0] + " ");

            destroyCompletions();
        }

        // Check for matches (overrides TextareaAutosize's onClick, onKeyPress, onKeyUp, maybeShowAutocomplete)
        function checkCompletions(e) {
            /* jshint validthis: true */
            textarea = this;

            const candidateText = textarea.value.slice(0, textarea.selectionEnd);
            const {candidateText: lastText} = cached;

            // If an emote match is impossible, don't override default behavior.
            // This allows other completion types (like usernames or channels) to work as usual.
            if (!shouldCompleteTwitch(candidateText)) {
                destroyCompletions();
                return;
            }

            // Don't override enter when there are no actual completions.
            // This allows message sending to work as usual.
            if (e.which === 13) {
                return;
            }

            // For any other key, always override, even when there are no actual completions.
            // This prevents Discord's emoji autocompletion from kicking in intermittently.
            e.stopPropagation();

            if (lastText !== candidateText) {
                renderCompletions();
            }
        }

        // Browse or insert matches (overrides ChannelTextArea's onKeyDown)
        function browseCompletions(e) {
            /* jshint validthis: true */
            textarea = this;

            const candidateText = textarea.value.slice(0, textarea.selectionEnd);
            if (!shouldCompleteTwitch(candidateText)) {
                return;
            }

            let delta = 0, options;

            switch (e.which) {
                // Tab
                case 9:

                    if (!prepareCompletions()) {
                        break;
                    }

                    // Prevent Discord's default behavior (send message)
                    e.stopPropagation();
                    // Prevent adding a tab or line break to text
                    e.preventDefault();

                    insertSelectedCompletion();
                    break;

                // Up
                case 38:
                    delta = -1;
                    break;

                // Down
                case 40:
                    delta = 1;
                    break;

                // Page Up
                case 33:
                    delta = -windowSize;
                    options = {locked: true, clamped: true};
                    break;

                // Page Down
                case 34:
                    delta = windowSize;
                    options = {locked: true, clamped: true};
                    break;
            }

            if (delta !== 0 && prepareCompletions()) {
                // Prevent Discord's default behavior
                e.stopPropagation();
                // Prevent cursor movement
                e.preventDefault();

                scrollWindow(delta, options);
            }
        }

        // Scroll matches
        function scrollCompletions(e, options) {
            /* jshint validthis: true */
            const delta = Math.sign(e.originalEvent.deltaY);
            scrollWindow(delta, options);
        }

        // Check for matches
        $(".app").on({
            "keyup.kawaii-complete keypress.kawaii-complete click.kawaii-complete": checkCompletions,
            "keydown.kawaii-complete": browseCompletions,
            "wheel.kawaii-complete": scrollCompletions,
            "blur.kawaii-complete": destroyCompletions,
        }, ".channelTextArea-1LDbYG textarea");
    }

    // Tear down event handlers and clean up
    function stopTabComplete() {
        $(".app").off(".kawaii-complete", ".channelTextArea-1LDbYG textarea");
    }

    // Filter function for "Twitch-style" emotes, to avoid collisions with common words
    // Check if at least 4 word characters
    function emoteFilter(name) {
        return /^\w{4,}$/.test(name);
    }

    // Global Twitch emotes (emoteset 0), filtered by emoteFilter
    var twitchEmotes = new EmoteSet();
    twitchEmotes.template = "https://static-cdn.jtvnw.net/emoticons/v1/{0}/{1}.0";
    twitchEmotes.emoteStyle = EmoteSet.emoteStyle.TWITCH;
    twitchEmotes.load = function (callbacks) {
        callbacks = $.extend({
            success: $.noop,
            error: $.noop,
        }, callbacks);
        if (this.loaded) {
            callbacks.success(this);
            return;
        }
        var self = this;
        // See: https://github.com/justintv/Twitch-API/blob/master/v3_resources/chat.md#get-chatemoticons
        $.ajax("https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=0", {
            accepts: {json: "application/vnd.twitchtv.v3+json"},
            headers: {'Client-ID': 'a7pwjx1l6tr0ygjrzafhznzd4zgg9md'},
            dataType: "json",
            jsonp: false,
            cache: true,
            success: function (data) {
                var loaded = 0;
                var skipped = 0;
                data.emoticon_sets[0].forEach(function (emoticon) {
                    if (emoteFilter(emoticon.code)) {
                        self.emoteMap.set(emoticon.code, emoticon.id);
                        loaded++;
                    } else {
                        skipped++;
                    }
                });
                console.info("KawaiiEmotes:", "Twitch global emotes loaded:", loaded, "skipped:", skipped);
                self.loaded = true;
                callbacks.success(self);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.warn("KawaiiEmotes:", "Twitch global emotes failed to load:", textStatus, "error:", errorThrown);
                callbacks.error(self);
            }
        });
    };

    // Twitch subscriber emotes, filtered by emoteFilter
    var twitchSubEmotes = new EmoteSet();
    twitchSubEmotes.template = "https://static-cdn.jtvnw.net/emoticons/v1/{0}/{1}.0";
    twitchSubEmotes.emoteStyle = EmoteSet.emoteStyle.TWITCH;
    twitchSubEmotes.load = function (callbacks) {
        callbacks = $.extend({
            success: $.noop,
            error: $.noop,
        }, callbacks);
        if (this.loaded) {
            callbacks.success(this);
            return;
        }
        var self = this;
        // See: https://github.com/justintv/Twitch-API/blob/master/v3_resources/chat.md#get-chatemoticons
        $.ajax("https://api.twitch.tv/kraken/chat/emoticon_images", {
            accepts: {json: "application/vnd.twitchtv.v3+json"},
            headers: {'Client-ID': 'a7pwjx1l6tr0ygjrzafhznzd4zgg9md'},
            dataType: "json",
            jsonp: false,
            cache: true,
            success: function (data) {
                var loaded = 0;
                var skipped = 0;
                data.emoticons.forEach(function (emoticon) {
                    if (emoticon.emoticon_set !== null && emoteFilter(emoticon.code)) {
                        self.emoteMap.set(emoticon.code, emoticon.id);
                        loaded++;
                    } else {
                        skipped++;
                    }
                });
                console.info("KawaiiEmotes:", "Twitch subscriber emotes loaded:", loaded, "skipped:", skipped);
                self.loaded = true;
                callbacks.success(self);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.warn("KawaiiEmotes:", "Twitch subscriber emotes failed to load:", textStatus, "error:", errorThrown);
                callbacks.error(self);
            }
        });
    };

    // BetterTTV global emotes, filtered by emoteFilter
    var bttvEmotes = new EmoteSet();
    bttvEmotes.template = "https://cdn.betterttv.net/emote/{0}/{1}x";
    bttvEmotes.emoteStyle = EmoteSet.emoteStyle.TWITCH;
    bttvEmotes.load = function (callbacks) {
        callbacks = $.extend({
            success: $.noop,
            error: $.noop,
        }, callbacks);
        if (this.loaded) {
            callbacks.success(this);
            return;
        }
        var self = this;
        $.ajax("https://api.betterttv.net/2/emotes", {
            dataType: "json",
            jsonp: false,
            cache: true,
            success: function (data) {
                var loaded = 0;
                var skipped = 0;
                self.template = data.urlTemplate
                    .replace("{{id}}", "{0}")
                    .replace("{{image}}", "{1}x");
                data.emotes.forEach(function (emote) {
                    if (emoteFilter(emote.code)) {
                        self.emoteMap.set(emote.code, emote.id);
                        loaded++;
                    } else {
                        skipped++;
                    }
                });
                console.info("KawaiiEmotes:", "BTTV global emotes loaded:", loaded, "skipped:", skipped);
                self.loaded = true;
                callbacks.success(self);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.warn("KawaiiEmotes:", "BTTV global emotes failed to load:", textStatus, "error:", errorThrown);
                callbacks.error(self);
            }
        });
    };

    // FrankerFaceZ global emotes, filtered by emoteFilter
    var ffzEmotes = new EmoteSet();
    ffzEmotes.template = "https://cdn.frankerfacez.com/emoticon/{0}/{1}";
    ffzEmotes.emoteStyle = EmoteSet.emoteStyle.TWITCH;
    ffzEmotes.load = function (callbacks) {
        callbacks = $.extend({
            success: $.noop,
            error: $.noop,
        }, callbacks);
        if (this.loaded) {
            callbacks.success(this);
            return;
        }
        var self = this;
        // See: https://www.frankerfacez.com/developers
        $.ajax("https://api.frankerfacez.com/v1/set/global", {
            dataType: "json",
            jsonp: false,
            cache: true,
            success: function (data) {
                var loaded = 0;
                var skipped = 0;
                data.default_sets.forEach(function (set) {
                    data.sets[set].emoticons.forEach(function (emoticon) {
                        if (emoteFilter(emoticon.name)) {
                            self.emoteMap.set(emoticon.name, emoticon.id);
                            loaded++;
                        } else {
                            skipped++;
                        }
                    });
                });
                console.info("KawaiiEmotes:", "FFZ global emotes loaded:", loaded, "skipped:", skipped);
                self.loaded = true;
                callbacks.success(self);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.warn("KawaiiEmotes:", "FFZ global emotes failed to load:", textStatus, "error:", errorThrown);
                callbacks.error(self);
            }
        });
    };

    // BD's BTTV2 emote list, unfiltered
    // This is BD's massive set of (more or less) every shared emote from BTTV
    // TODO: Move downloading of this emote set from main thread to this one
    //       Or, at least make it asynchronous
    //       BD's loading should not block on fetching and parsing a 1MB+ JSON file from GitHub
    var bttvLegacyEmotes = new EmoteSet();
    bttvLegacyEmotes.template = "https://cdn.betterttv.net/emote/{0}/{1}x";
    bttvLegacyEmotes.emoteStyle = EmoteSet.emoteStyle.TWITCH;
    bttvLegacyEmotes.load = function (callbacks) {
        callbacks = $.extend({
            success: $.noop,
            error: $.noop,
        }, callbacks);
        if (this.loaded) {
            callbacks.success(this);
            return;
        }
        if (emotesBTTV2 === undefined) {
            console.warn("KawaiiEmotes:", "BetterDiscord legacy BTTV shared emotes failed to load:", "emotesBTTV2 is undefined");
            callbacks.error(this);
        }
        var self = this;
        (function (data) {
            var loaded = 0;
            var skipped = 0;
            Object.keys(data).forEach(function (name) {
                self.emoteMap.set(name, data[name]);
                loaded++;
            });
            console.info("KawaiiEmotes:", "BetterDiscord legacy BTTV shared emotes loaded:", loaded, "skipped:", skipped);
            self.loaded = true;
            callbacks.success(self);
        })(emotesBTTV2);
    };

    // BD's FFZ emote list, unfiltered
    // This is BD's massive set of (more or less) every public emote from FFZ
    // TODO: Move downloading of this emote set from main thread to this one
    //       Or, at least make it asynchronous
    //       BD's loading should not block on fetching and parsing a 1MB+ JSON file from GitHub
    var ffzLegacyEmotes = new EmoteSet();
    ffzLegacyEmotes.template = "https://cdn.frankerfacez.com/emoticon/{0}/{1}";
    ffzLegacyEmotes.emoteStyle = EmoteSet.emoteStyle.TWITCH;
    ffzLegacyEmotes.load = function (callbacks) {
        callbacks = $.extend({
            success: $.noop,
            error: $.noop,
        }, callbacks);
        if (this.loaded) {
            callbacks.success(this);
            return;
        }
        if (emotesFfz === undefined) {
            console.warn("KawaiiEmotes:", "BetterDiscord legacy FFZ public emotes failed to load:", "emotesFfz is undefined");
            callbacks.error(this);
        }
        var self = this;
        (function (data) {
            var loaded = 0;
            var skipped = 0;
            Object.keys(data).forEach(function (name) {
                self.emoteMap.set(name, data[name]);
                loaded++;
            });
            console.info("KawaiiEmotes:", "BetterDiscord legacy FFZ public emotes loaded:", loaded, "skipped:", skipped);
            self.loaded = true;
            callbacks.success(self);
        })(emotesFfz);
    };

    // End emote data

    // Settings panel helpers

    // Create and return a new top-level settings panel
    function topPanel() {
        var panel = $("<form>")
            .addClass("form")
            .css("width", "100%");

        return panel;
    }

    // Create and return a container for control groups
    function controlGroups() {
        return $("<div>").addClass("control-groups");
    }

    // Create and return a flexible control group
    // settings (object)
    //   label
    //     an element or something JQuery-ish
    //     or, if string, use as plain text
    function controlGroup(settings) {
        var group = $("<div>").addClass("control-group");

        if (typeof settings.label === "string") {
            group.append($("<label>").text(settings.label));
        } else if (settings.label !== undefined) {
            group.append($("<label>").append(settings.label));
        }

        return group;
    }

    // Create and return a group of checkboxes
    // settings (object)
    //   items (array)
    //     an array of settings objects to be passed to checkbox()
    //   callback (function(state))
    //     called with the current state, when it changes
    //     state is an array of boolean values
    function checkboxGroup(settings) {
        settings = $.extend({
            items: [],
            callback: $.noop,
        }, settings);

        var state = settings.items.map(item => item.checked === true);
        function onClick(i, itemState) {
            if (settings.items[i].callback !== undefined) {
                settings.items[i].callback(itemState);
            }
            state[i] = itemState;
            settings.callback(state);
        }

        var group = $("<ul>").addClass("checkbox-group");

        group.append(settings.items.map(function (item, i) {
            return checkbox($.extend({}, item, {
                callback: onClick.bind(undefined, i),
            }));
        }));

        return group;
    }

    // Create and return a checkbox
    // settings (object)
    //   label
    //     an element or something JQuery-ish
    //     or, if string, use as plain text
    //   help
    //     an element or something JQuery-ish
    //     or, if string, use as plain text
    //   checked (boolean)
    //   disabled (boolean)
    //   callback (function(state))
    //     called with the current state, when it changes
    //     state is a boolean
    function checkbox(settings) {
        settings = $.extend({
            checked: false,
            disabled: false,
            callback: $.noop,
        }, settings);

        var input = $("<input>").attr("type", "checkbox")
            .prop("checked", settings.checked)
            .prop("disabled", settings.disabled);

        var inner = $("<div>").addClass("checkbox-inner")
            .append(input)
            .append($("<span>"));

        var outer = $("<div>").addClass("checkbox").append(inner);

        if (settings.disabled) {
            outer.addClass("disabled");
        }

        if (typeof settings.label === "string") {
            outer.append($("<span>").text(settings.label));
        } else if (settings.label !== undefined) {
            outer.append($("<span>").append(settings.label));
        }

        outer.on("click.kawaiiSettings", function () {
            if (!input.prop("disabled")) {
                var checked = !input.prop("checked");
                input.prop("checked", checked);
                settings.callback(checked);
            }
        });

        var item = $("<li>").append(outer);

        var help;
        if (typeof settings.help === "string") {
            help = $("<div>").text(settings.help);
        } else if (settings.help !== undefined) {
            help = $("<div>").append(settings.help);
        }

        if (help !== undefined) {
            help.appendTo(item)
                .addClass("help-text")
                .css("margin-top", "-3px")
                .css("margin-left", "27px");
        }

        return item;
    }

    // Generate a random string of alphanumeric characters
    // length
    //   number of characters in output (default: 8)
    function randomString(length) {
        var n = (length !== undefined) ? length : 8;
        var c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        var out = "";
        for (let i = 0; i < n; i++) {
            out += c[Math.floor(Math.random() * c.length)];
        }
        return out;
    }

    // Create and return a group of radio buttons
    // settings (object)
    //   items (array)
    //     an array of settings objects to be passed to checkbox()
    //   callback (function(state))
    //     called with the current state, when it changes
    //     state is the index of the selected element
    function radioGroup(settings) {
        settings = $.extend({
            items: [],
            callback: $.noop,
        }, settings);

        var name = "kawaiiRadio$" + randomString();

        var state = settings.items.findIndex(item => item.checked === true);
        function onClick(i, itemState) {
            if (!itemState) {
                return;
            }
            if (i !== state) {
                if (settings.items[state] !== undefined && settings.items[state].callback !== undefined) {
                    settings.items[state].callback(false);
                }
                if (settings.items[i].callback !== undefined) {
                    settings.items[i].callback(true);
                }
                state = i;
                settings.callback(state);
            }
        }

        var group = $("<ul>").addClass("radio-group");

        group.append(settings.items.map(function (item, i) {
            return radio($.extend({}, item, {
                name: name,
                callback: onClick.bind(undefined, i),
            }));
        }));

        return group;
    }

    // Create and return a radio button
    // settings (object)
    //   label
    //     an element or something JQuery-ish
    //     or, if string, use as plain text
    //   help
    //     an element or something JQuery-ish
    //     or, if string, use as plain text
    //   checked (boolean)
    //   disabled (boolean)
    //   name (string)
    //     name of the radio group this belongs to
    //   callback (function(state))
    //     called with the current state, when it changes
    //     state is a boolean
    function radio(settings) {
        settings = $.extend({
            checked: false,
            disabled: false,
            callback: $.noop,
        }, settings);

        var input = $("<input>").attr("type", "radio")
            .attr("name", settings.name)
            .prop("checked", settings.checked)
            .prop("disabled", settings.disabled);

        var inner = $("<div>").addClass("radio-inner")
            .append(input)
            .append($("<span>"));

        var outer = $("<div>").addClass("radio").append(inner);

        if (settings.disabled) {
            outer.addClass("disabled");
        }

        if (typeof settings.label === "string") {
            outer.append($("<span>").text(settings.label));
        } else if (settings.label !== undefined) {
            outer.append($("<span>").append(settings.label));
        }

        outer.on("click.kawaiiSettings", function () {
            if (!input.prop("disabled")) {
                var checked = true;
                input.prop("checked", checked);
                settings.callback(checked);
            }
        });

        var item = $("<li>").append(outer);

        var help;
        if (typeof settings.help === "string") {
            help = $("<div>").text(settings.help);
        } else if (settings.help !== undefined) {
            help = $("<div>").append(settings.help);
        }

        if (help !== undefined) {
            help.appendTo(item)
                .addClass("help-text")
                .css("margin-top", "-3px")
                .css("margin-left", "41px");
        }

        return item;
    }

    // End settings panel helpers

    function initJQueryPlugins($) {
        // jQuery Plugins

        // Make sure that these are set up after jQuery is available, but before we need any of them
        // Should be fine if it happens to be called more than once

        // Get or set the scroll distance from the bottom of an element
        // Usage identical to scrollTop()
        $.fn.scrollBottom = function (val) {
            var elem = this[0];
            if (val === undefined) {
                if (elem === undefined) {
                    return undefined;
                }
                return elem.scrollHeight - (this.scrollTop() + this.height());
            }
            if (elem === undefined) {
                return this;
            }
            return this.scrollTop(elem.scrollHeight - (val + this.height()));
        };

        // Get the set of text nodes contained within a set of elements
        $.fn.textNodes = function () {
            return this.map(function () {
                const textNodes = [];
                let textNodeWalker, currentNode;

                if ($(this).find("code").length > 0) {
                    // If there are any code blocks, rejecting that whole subtree is a bit faster
                    textNodeWalker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
                        acceptNode: function (node) {
                            if (node.nodeType === Node.TEXT_NODE) {
                                return NodeFilter.FILTER_ACCEPT;
                            }
                            if (node.nodeName.toLowerCase() === "code") {
                                return NodeFilter.FILTER_REJECT;
                            }
                            return NodeFilter.FILTER_SKIP;
                        }
                    });
                } else {
                    textNodeWalker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
                }

                while ((currentNode = textNodeWalker.nextNode()) !== null) {
                    textNodes.push(currentNode);
                }
                return textNodes;
            });
        };

        // Parse for standard emotes in message text
        $.fn.parseEmotesStandard = function (emoteSets, options) {
            if (emoteSets === undefined || emoteSets.length === 0) {
                return this;
            }

            this.textNodes().each(function () {
                var sub = [];
                // separate out potential emotes
                // all standard emotes are composed of characters in [a-zA-Z0-9_], i.e. \w between two colons, :
                // use a regex with a capture group, so that we can preserve separators
                var words = this.data.split(/(:[\w#*]+:)/g);
                // non-emoteable words, for building a new text node if necessary
                var nonEmote = [];
                // whether the text in this node has been modified
                var modified = false;

                for (var i = 0; i < words.length; i += 2) {
                    // words[i] is a separator
                    // words[i+1] is our potential emote, or undefined

                    // Keep the separator
                    nonEmote.push(words[i]);
                    if (words[i+1] === undefined) {
                        break;
                    }

                    var emote;
                    if (emoteSets.some(function (set) {
                        emote = set.createEmote(/^:([^:]+):$/.exec(words[i+1])[1], options);
                        return (emote !== undefined);
                    })) {
                        modified = true;
                        // Create a new text node from any previous text
                        sub.push(document.createTextNode(nonEmote.join("")));
                        // Clear out stored words
                        nonEmote = [];
                        // Add the emote element
                        sub.push(emote);
                    } else {
                        // Unrecognized as emote, keep the word
                        nonEmote.push(words[i+1]);
                    }
                }
                // If no emotes were found, leave this text node unchanged
                if (modified) {
                    // Replace this node's contents with remaining text
                    this.data = nonEmote.join("");
                }
                $(this).before(sub);
            });

            return this;
        };

        var emoteMods = new Set([
            "flip", "flap", "pulse",
            "spin", "spin2", "spin3",
            "1spin", "2spin", "3spin",
            "shake", "shake2", "shake3",
            "tr", "bl", "br",
        ]);

        // Parse for Twitch-style emotes in message text
        $.fn.parseEmotesTwitch = function (emoteSets, options) {
            if (emoteSets === undefined || emoteSets.length === 0) {
                return this;
            }

            var emoteModsEnabled = settingsCookie["bda-es-8"];

            // Find and replace Twitch-style emotes
            this.textNodes().each(function () {
                var sub = [];
                // separate out potential emotes
                // all twitch emotes (that we care about) are composed of characters in [a-zA-Z0-9_], i.e. \w
                // colons (:) are allowed when used for emote modifiers
                // use a regex with a capture group, so that we can preserve separators
                var words = this.data.split(/(\s+)/g);
                // non-emoteable words, for building a new text node if necessary
                var nonEmote = [];
                // whether the text in this node has been modified
                var modified = false;
                for (var i = 0; i < words.length; i += 2) {
                    // words[i] is our potential emote (+modifer)
                    // words[i+1] is a separator, or undefined
                    var res = /^([^:]*)(?::(.*))?$/.exec(words[i]);
                    // word is our potential emote
                    var word = res[1];
                    // modifier is an emote modifier, or undefined
                    var modifier = res[2];
                    var emote;
                    if (($.inArray(word, bemotes) == -1) && emoteSets.some(function (set) {
                        emote = set.createEmote(word, options);
                        return (emote !== undefined);
                    })) {
                        modified = true;
                        // Create a new text node from any previous text
                        sub.push(document.createTextNode(nonEmote.join("")));
                        // Clear out stored words
                        nonEmote = [];
                        // Apply any emote mods, if applicable
                        if (emoteModsEnabled && emoteMods.has(modifier)) {
                            emote.addClass("emote"+modifier);
                        }
                        // Add the emote element
                        sub.push(emote);
                    } else {
                        // Unrecognized as emote, keep the word
                        nonEmote.push(words[i]);
                    }
                    // Keep the separator
                    nonEmote.push(words[i+1]);
                }
                // If no emotes were found, leave this text node unchanged
                if (modified) {
                    // Replace this node's contents with remaining text
                    this.data = nonEmote.join("");
                }
                $(this).before(sub);
            });

            return this;
        };

        // Parse emotes (of any style) in message text
        $.fn.parseEmotes = function (emoteSets, options) {
            if (emoteSets === undefined || emoteSets.length === 0) {
                return this;
            }

            var standardSets = [];
            var twitchSets = [];
            emoteSets.forEach(function (set) {
                if (set.emoteStyle === EmoteSet.emoteStyle.STANDARD) {
                    standardSets.push(set);
                } else if (set.emoteStyle === EmoteSet.emoteStyle.TWITCH) {
                    twitchSets.push(set);
                }
            });

            this.parseEmotesStandard(standardSets, options);
            this.parseEmotesTwitch(twitchSets, options);

            return this;
        };

        // Jumboify emotes/emoji appropriately
        $.fn.jumboify = function (options) {
            options = $.extend({}, $.fn.jumboify.defaults, options);

            if (!options.forceJumbo) {
                // Properly jumboify emotes/emoji in messages with no other text
                this.has(".emoji").each(function () {
                    // Get the "edited" text, if any, regardless of how it's styled or localized
                    var edited = $(this).find(".edited").text();
                    // Get the remaining message text
                    var text = this.textContent.replace(edited, "").trim();
                    if (text.length === 0) {
                        $(this).find(".emoji").addClass("jumboable");
                    } else {
                        $(this).find(".emoji").removeClass("jumboable");
                    }
                });
            } else {
                // Everything is jumboified, similar to old behavior
                this.find(".emoji").addClass("jumboable");
            }

            return this;
        };

        $.fn.jumboify.defaults = {
            forceJumbo: false,
        };

        // Replace title text with fancy tooltips
        $.fn.fancyTooltip = function () {
            return this.filter("[title]").each(function () {
                var title = $(this).attr("title");
                $(this).addClass("kawaii-fancytooltip").removeAttr("title");
                $(this).on("mouseover.fancyTooltip", function () {
                    // Create and insert tooltip
                    var tooltip = $("<div>").append(title).addClass("tooltip tooltip-top tooltip-brand");
                    $(".tooltips").append(tooltip);

                    // Position the tooltip
                    var position = $(this).offset();
                    position.top -= 30;
                    position.left += $(this).width()/2 - tooltip.width()/2 - 10;
                    tooltip.offset(position);

                    // Set a handler to destroy the tooltip
                    $(this).on("mouseout.fancyTooltip", function () {
                        // remove this handler
                        $(this).off("mouseout.fancyTooltip");
                        tooltip.remove();
                    });
                });
            });
        };
    } // initJQueryPlugins

    // Helper function for finding all elements matching selector affected by a mutation
    function mutationFind(mutation, selector) {
        var target = $(mutation.target), addedNodes = $(mutation.addedNodes);
        var mutated = target.add(addedNodes).filter(selector);
        var descendants = addedNodes.find(selector);
        var ancestors = target.parents(selector);
        return mutated.add(descendants).add(ancestors);
    }

    // Helper function for finding all elements matching selector removed by a mutation
    function mutationFindRemoved(mutation, selector) {
        var removedNodes = $(mutation.removedNodes);
        var mutated = removedNodes.filter(selector);
        var descendants = removedNodes.find(selector);
        return mutated.add(descendants);
    }

    // Revert all emotes
    function revertEmotes() {
        // Swap every emote back to its original text
        $(".kawaii-parseemotes").each(function() {
            var emote = $(this);
            emote.replaceWith(document.createTextNode(emote.attr("alt")));
        });
    }

    // Parse the messages for given emote sets
    function parseEmoteSets(messages, sets) {
        // Figure out whether we're scrolled to the bottom
        var messagesContainer = $(".messages");
        var atBottom = messagesContainer.scrollBottom() < 0.5;

        // Process messages
        messages.parseEmotes(sets, {allowWide: settings.allowWide});
        if (settingsCookie["bda-es-6"]) {
            messages.find(".kawaii-parseemotes[title]").fancyTooltip();
        }
        messages.jumboify({forceJumbo: settings.forceJumbo});

        // Ensure we're still scrolled to the bottom if necessary
        if (atBottom) {
            messagesContainer.scrollBottom(0);
        }
    }

    const activeEmoteSets = [];

    // Settings updated, rebuild active emote sets and rescan for emotes if necessary
    function updateSettings() {
        const oldEmoteSets = activeEmoteSets.splice(0);

        if (settingsCookie["bda-es-7"]) {
            activeEmoteSets.push(twitchEmotes);
            activeEmoteSets.push(twitchSubEmotes);
        }

        if (settingsCookie["bda-es-1"]) {
            activeEmoteSets.push(ffzEmotes);
            activeEmoteSets.push(ffzLegacyEmotes);
        }

        if (settingsCookie["bda-es-2"]) {
            activeEmoteSets.push(bttvEmotes);
            activeEmoteSets.push(bttvLegacyEmotes);
        }

        var modified = false;
        if (activeEmoteSets.length !== oldEmoteSets.length) {
            modified = true;
        } else {
            for (var i = 0; i < activeEmoteSets.length; i++) {
                if (activeEmoteSets[i] !== oldEmoteSets[i]) {
                    modified = true;
                    break;
                }
            }
        }
        if (modified) {
            reload();
        }
    }

    function reload() {
        revertEmotes();
        var messages = $(".markup-2BOw-j, .message-content").not(":has(.message-content)");
        parseEmoteSets(messages, activeEmoteSets);
    }

    kawaiiemotes.prototype.observer = function (mutation) {
        // Get the set of messages affected by this mutation
        var messages = mutationFind(mutation, ".markup-2BOw-j, .message-content").not(":has(.message-content)");
        parseEmoteSets(messages, activeEmoteSets);

        // Clean up any remaining tooltips
        mutationFindRemoved(mutation, ".kawaii-fancytooltip").trigger("mouseout");
    };

    // Parse the whole document for a single emote set, if it is active
    function parseEmoteSetIfActive(set) {
        if (activeEmoteSets.indexOf(set) !== -1) {
            var messages = $(".markup-2BOw-j, .message-content").not(":has(.message-content)");
            parseEmoteSets(messages, [set]);
        }
    }

    // Settings
    //   forceJumbo
    //     false - imitate Discord's behavior: emotes only "jumboable" when on a line with no other text
    //     true  - similar to "classic" BD behavior: emotes and emoji are always "jumboable"
    //   allowWide
    //     false - all emotes are forced to a square aspect ratio
    //     true  - wide emotes may expand horizontally to meet their intended aspect ratio
    //   highDpi
    //     false - always use the base emote size
    //     true  - use srcset to specify high-DPI versions
    //   completionsMenu
    //     true  - show tab-completion menu for "Twitch-style" emotes
    //   completionsDelay
    //     delay (ms) after typing has stopped before searching for completions
    //   completionsWindowSize
    //     maximum number of completions to show, and number of items to scroll on Page Up/Down
    //   completionsPreScroll
    //     minimum number of nearby items to show next to selected item when scrolling

    var settings = {}, defaultSettings = {
        forceJumbo: false,
        allowWide: false,
        highDpi: false,
        completionsMenu: true,
    };

    // Load or store settings from localStorage
    function localSettings(settings) {
        if (settings === undefined) {
            var localSettings;

            try {
                localSettings = bdPluginStorage.get("kawaiiemotes", "settings");
            } catch (err) {
                console.warn("KawaiiEmotes:", "unable to load settings:", err);
                localSettings = null;
            }

            if (localSettings === null) {
                // try to fall back to localStorage
                try {
                    localSettings = JSON.parse(localStorage.kawaiiemotes);
                } catch (err) {
                    localSettings = {};
                }
                bdPluginStorage.set("kawaiiemotes", "settings", localSettings);
            }
            return $.extend({}, defaultSettings, localSettings);
        }

        try {
            bdPluginStorage.set("kawaiiemotes", "settings", settings);
        } catch (err) {
            console.warn("KawaiiEmotes:", "unable to save settings:", err);
        }
    }

    kawaiiemotes.prototype.load = function () {
    };

    kawaiiemotes.prototype.unload = function () {
    };

    kawaiiemotes.prototype.start = function () {
        initJQueryPlugins($);
        settings = localSettings();

        // Save these to be restored later
        EmoteModule.prototype.oldObsCallback = EmoteModule.prototype.obsCallback;
        settingsPanel.oldUpdateSettings = settingsPanel.updateSettings;
        // Disable this, because this plugin's mutation observer handles it
        EmoteModule.prototype.obsCallback = $.noop;
        // Hook into these to notify when settings are updated
        settingsPanel.updateSettings = function () {
            this.oldUpdateSettings();
            updateSettings();
        };

        updateSettings();

        // Load the emote sets if necessary, and parse the document as they load
        twitchEmotes.load({success: parseEmoteSetIfActive});
        twitchSubEmotes.load({success: parseEmoteSetIfActive});
        bttvEmotes.load({success: parseEmoteSetIfActive});
        bttvLegacyEmotes.load({success: parseEmoteSetIfActive});
        ffzEmotes.load({success: parseEmoteSetIfActive});
        ffzLegacyEmotes.load({success: parseEmoteSetIfActive});

        startTabComplete(activeEmoteSets, settings);
    };

    kawaiiemotes.prototype.stop = function () {
        // Restore these
        EmoteModule.prototype.obsCallback = EmoteModule.prototype.oldObsCallback;
        settingsPanel.updateSettings = settingsPanel.oldUpdateSettings;

        revertEmotes();

        stopTabComplete();

        localSettings(settings);
    };

    kawaiiemotes.prototype.getSettingsPanel = function () {
        var panel = topPanel();

        var completionControls = controlGroups().appendTo(panel);

        var completionMainControl = controlGroup({label: "Tab-completion"})
            .appendTo(completionControls)
            .append(checkboxGroup({
                callback: state => {
                    localSettings(settings);
                    stopTabComplete();
                    startTabComplete(activeEmoteSets, settings);
                },
                items: [
                    {
                        label: "Show tab-completion menu for BetterDiscord emotes.",
                        checked: settings.completionsMenu,
                        callback: state => { settings.completionsMenu = state; },
                    },
                ],
            }));

        var appearanceControls = controlGroups().appendTo(panel);

        var tweaksControl = controlGroup({label: "Appearance Tweaks (Experimental)"})
            .appendTo(appearanceControls)
            .append(checkboxGroup({
                callback: state => {
                    localSettings(settings);
                    reload();
                },
                items: [
                    {
                        label: "Always Jumboify emotes.",
                        help: "Emotes and emoji are always jumbo-sized, regardless of whether the message contains any other text.",
                        checked: settings.forceJumbo,
                        callback: state => { settings.forceJumbo = state; },
                    },
                    {
                        label: "Allow wide-format emotes.",
                        help: "Let FFZ's wide-format emotes blow up your line lengths.",
                        checked: settings.allowWide,
                        callback: state => { settings.allowWide = state; },
                    },
                    {
                        label: "Use High-DPI Emotes when available. (soon™)",
                        checked: settings.highDpi,
                        callback: state => { settings.highDpi = state; },
                        disabled: true,
                    },
                ],
            }));


        return panel[0];
    };

    kawaiiemotes.prototype.getName = function () {
        return "KawaiiEmotes";
    };

    kawaiiemotes.prototype.getDescription = function () {
        return "Better emote parsing for BetterDiscord";
    };

    kawaiiemotes.prototype.getVersion = function () {
        return "0.4.8";
    };

    kawaiiemotes.prototype.getAuthor = function () {
        return "noodlebox";
    };
})();

/*@end @*/
