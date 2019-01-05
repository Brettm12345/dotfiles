local awful = require("awful")
local gears = require("gears")
local wibox = require("wibox")
local beautiful = require("beautiful")
--local xresources = require("beautiful.xresources")
--local xrdb = xresources.get_current_theme()

local helpers = require("helpers")
local keys = require("keys")

-- {{{ Widgets
local desktop_mode_widget = require("noodle.desktop_mode_widget")
local minimal_tasklist = require("noodle.minimal_tasklist")

-- Create a textclock widget that shows date
date_prefix = wibox.widget.textbox(" ", { font = "monospace" })
date_prefix.markup = helpers.colorize_text(date_prefix.text, beautiful.prefix_fg)
--mytextdate = wibox.widget.textclock("%a %d %B")
mytextdate = wibox.widget.textclock("%j days around the sun") --HAHA very useful
-- Create a textclock widget
clock_prefix = wibox.widget.textbox(" ", { font = "monospace" })
clock_prefix.markup = helpers.colorize_text(clock_prefix.text, beautiful.prefix_fg)
mytextclock = wibox.widget.textclock("%l:%M %P")
   
-- Create item separator
textseparator = wibox.widget.textbox()
textseparator.font = "monospace"
textseparator.text = beautiful.separator_text
textseparator.markup = helpers.colorize_text(textseparator.text, beautiful.separator_fg)

-- Create padding
pad = wibox.widget.textbox(" ", { font = "monospace" })

-- Create a wibox for each screen and add it
local taglist_buttons = gears.table.join(
                    awful.button({ }, 1, function(t) t:view_only() end),
                    awful.button({ modkey }, 1, function(t)
                                              if client.focus then
                                                  client.focus:move_to_tag(t)
                                              end
                                          end),
                    awful.button({ }, 3, awful.tag.viewtoggle),
                    awful.button({ modkey }, 3, function(t)
                                              if client.focus then
                                                  client.focus:toggle_tag(t)
                                              end
                                          end),
                    awful.button({ }, 4, function(t) awful.tag.viewprev(t.screen) end),
                    awful.button({ }, 5, function(t) awful.tag.viewnext(t.screen) end)
                )

local tasklist_buttons = gears.table.join(
                     awful.button({ }, 1, 
                        function (c)
                            if c == client.focus then
                                c.minimized = true
                            else
                                -- Without this, the following
                                -- :isvisible() makes no sense
                                c.minimized = false
                                if not c:isvisible() and c.first_tag then
                                    c.first_tag:view_only()
                                end
                                -- This will also un-minimize
                                -- the client, if needed
                                client.focus = c
                                c:raise()
                            end
                        end),
                     -- Middle mouse button closes the window
                     awful.button({ }, 2, function (c) c:kill() end),
                     awful.button({ }, 3, helpers.client_menu_toggle()),
                     awful.button({ }, 4, function ()
                                              awful.client.focus.byidx(-1)
                                          end),
                     awful.button({ }, 5, function ()
                                              awful.client.focus.byidx(1)
                    end)
)
-- }}}

awful.screen.connect_for_each_screen(function(s)
    -- Create a promptbox for each screen
    s.mypromptbox = awful.widget.prompt({prompt = " Run: ", fg = beautiful.prompt_fg})
    -- Create an imagebox widget which will contain an icon indicating which layout we're using.
    -- We need one layoutbox per screen.
    s.mylayoutbox = awful.widget.layoutbox(s)
    s.mylayoutbox:buttons(gears.table.join(
               awful.button({ }, 1, function () awful.layout.inc( 1) end),
               awful.button({ }, 3, function () awful.layout.inc(-1) end),
               awful.button({ }, 4, function () awful.layout.inc( 1) end),
               awful.button({ }, 5, function () awful.layout.inc(-1) end)))
    -- Create a taglist widget
    s.mytaglist = awful.widget.taglist(s, awful.widget.taglist.filter.all, taglist_buttons, { font = "monospace" })

    -- Outer gaps
    awful.screen.padding(awful.screen.focused(),{left = 28, right = 28, top = 28, bottom = 28})

    -- Create a system tray widget
    s.systray = wibox.widget.systray()
    s.systray.visible = false -- can be toggled by a keybind

    -- Wibar detached - Method: Transparent useless bar
    -- Requires compositor
    if beautiful.wibar_detached then
        s.useless_wibar = awful.wibar({ position = beautiful.wibar_position, screen = s, height = beautiful.screen_margin * 2, opacity = 0 })
        --TODO
        --s.useless_wibar:buttons(keys.desktopbuttons)
    end
    -- Create the wibox
    s.mywibox = awful.wibar({ position = beautiful.wibar_position, screen = s, width = beautiful.wibar_width, height = beautiful.wibar_height, shape = helpers.rrect(beautiful.wibar_border_radius)})
    -- Wibar items
    -- Add or remove widgets here
    s.mywibox:setup {
        layout = wibox.layout.align.horizontal,
        { -- Left widgets
            layout = wibox.layout.fixed.horizontal,
            s.mytaglist,
            textseparator,
            minimal_tasklist
        },
        { -- Middle widgets
            layout = wibox.layout.fixed.horizontal,
        },
        { -- Right widgets
            layout = wibox.layout.fixed.horizontal,
            s.systray,
            textseparator,
            mytextdate,
            textseparator,
            mytextclock,
            textseparator,
            desktop_mode_widget,
            pad,
            pad
        },
    }
    
    -- Second (alternate panel)
    if beautiful.wibar_alt_enabled then
        if beautiful.wibar_alt_detached then
            s.useless_wibar_alt = awful.wibar({ position = beautiful.wibar_alt_position, screen = s, height = beautiful.screen_margin * 2, opacity = 0 })
            s.useless_wibar_alt:buttons(gears.table.join(
                --TODO
                --keys.desktopbuttons
            ))
        end
        s.mywibox_alt = awful.wibox({ position = beautiful.wibar_alt_position, screen = s, width = beautiful.wibar_alt_width, height = beautiful.wibar_alt_height, shape = helpers.rrect(beautiful.wibar_alt_border_radius)})
        -- Only set them if they exist, else they overwrite the position variable
        if beautiful.wibar_alt_x then
            s.mywibox_alt.x = beautiful.wibar_alt_x
        end
        if beautiful.wibar_alt_y then
            s.mywibox_alt.y = beautiful.wibar_alt_y
        end
        -- Second wibar items
        -- Add or remove widgets here
        s.mywibox_alt:setup {
            layout = wibox.layout.align.horizontal,
            { -- Left widgets
                layout = wibox.layout.fixed.horizontal,
            },
            { -- Middle widgets
                layout = wibox.layout.fixed.horizontal,
            },
            { -- Right widgets
                layout = wibox.layout.fixed.horizontal,
                s.systray,
                minimal_tasklist,
                textseparator,
                date_prefix,
                mytextdate,
                textseparator,
                clock_prefix,
                mytextclock,
                textseparator,
                desktop_mode_widget,
                pad
            },
        }
    end

    -- Only set them if they exist, else they overwrite the position variable
    if beautiful.wibar_x then
        s.mywibox.x = beautiful.wibar_x
    end
    if beautiful.wibar_y then
        s.mywibox.y = beautiful.wibar_y
    end

end)

