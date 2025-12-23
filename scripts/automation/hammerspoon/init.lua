-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Dawson Does Framework - Hammerspoon Automation
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- Installation:
--   1. Install Hammerspoon: brew install --cask hammerspoon
--   2. Copy this file to ~/.hammerspoon/init.lua
--   3. Reload Hammerspoon config (⌘⇧R in Hammerspoon console)
--
-- Hotkeys:
--   ⌘⇧D - Daily Dev (run startup script)
--   ⌘⇧E - Quick Export (open export wizard)
--   ⌘⇧T - Run Tests
--   ⌘⇧C - Inject Context (copy context to clipboard)
--   ⌘⇧M - Memory Dashboard (show agent memory status)
--   ⌘⇧G - Grid Windows (tile Cursor windows)
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Configuration
local projectPath = os.getenv("HOME") .. "/Documents/dawson-does-framework"
local configDir = os.getenv("HOME") .. "/.config/dawson-automation"
local defaultRole = os.getenv("AGENT_ROLE") or "CLI"

-- Ensure config directory exists
os.execute("mkdir -p " .. configDir .. "/logs")

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 1. Window Management for Multi-Agent
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Auto-tile Cursor windows in a grid
hs.hotkey.bind({"cmd", "shift"}, "G", function()
    local wins = hs.window.filter.new("Cursor"):getWindows()
    local screen = hs.screen.mainScreen()
    local frame = screen:frame()
    
    local layouts = {
        [1] = {{x=0, y=0, w=1, h=1}},
        [2] = {{x=0, y=0, w=0.5, h=1}, {x=0.5, y=0, w=0.5, h=1}},
        [3] = {{x=0, y=0, w=0.5, h=0.5}, {x=0.5, y=0, w=0.5, h=0.5}, {x=0, y=0.5, w=1, h=0.5}},
        [4] = {{x=0, y=0, w=0.5, h=0.5}, {x=0.5, y=0, w=0.5, h=0.5}, 
               {x=0, y=0.5, w=0.5, h=0.5}, {x=0.5, y=0.5, w=0.5, h=0.5}}
    }
    
    local layoutCount = math.min(#wins, 4)
    local layout = layouts[layoutCount] or layouts[4]
    
    for i, win in ipairs(wins) do
        if layout[i] then
            local l = layout[i]
            win:setFrame({
                x = frame.x + (frame.w * l.x),
                y = frame.y + (frame.h * l.y),
                w = frame.w * l.w,
                h = frame.h * l.h
            })
        end
    end
    
    hs.alert.show("Tiled " .. #wins .. " Cursor window(s)")
end)

-- Cycle through Cursor windows (4-finger swipe alternative)
local cursorWindowIndex = 1
hs.hotkey.bind({"cmd", "shift"}, "N", function()
    local wins = hs.window.filter.new("Cursor"):getWindows()
    if #wins > 0 then
        cursorWindowIndex = (cursorWindowIndex % #wins) + 1
        wins[cursorWindowIndex]:focus()
        hs.alert.show("Cursor window " .. cursorWindowIndex .. "/" .. #wins)
    end
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 2. Daily Dev Startup
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hs.hotkey.bind({"cmd", "shift"}, "D", function()
    hs.alert.show("Starting Daily Dev...")
    
    local script = projectPath .. "/scripts/automation/daily-dev.sh"
    local task = hs.task.new("/bin/bash", function(exitCode, stdOut, stdErr)
        if exitCode == 0 then
            hs.alert.show("Daily Dev complete - context in clipboard")
            -- Auto-focus Cursor after a delay
            hs.timer.doAfter(2, function()
                hs.application.launchOrFocus("Cursor")
            end)
        else
            hs.alert.show("Daily Dev failed - check logs")
        end
    end, {script, defaultRole})
    
    task:setWorkingDirectory(projectPath)
    task:start()
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 3. Context Injection
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hs.hotkey.bind({"cmd", "shift"}, "C", function()
    local script = projectPath .. "/scripts/automation/context-pipeline.sh"
    local task = hs.task.new("/bin/bash", function(exitCode, stdOut, stdErr)
        if exitCode == 0 then
            hs.alert.show("Context copied for " .. defaultRole .. " Agent")
            -- Optionally auto-paste into Cursor
            hs.timer.doAfter(0.5, function()
                local app = hs.application.get("Cursor")
                if app and app:isFrontmost() then
                    hs.eventtap.keyStroke({"cmd"}, "l")  -- Open composer
                    hs.timer.doAfter(0.3, function()
                        hs.eventtap.keyStroke({"cmd"}, "v")  -- Paste
                    end)
                end
            end)
        else
            hs.alert.show("Context generation failed")
        end
    end, {script, defaultRole, projectPath, "clipboard"})
    
    task:setWorkingDirectory(projectPath)
    task:start()
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 4. Quick Export
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hs.hotkey.bind({"cmd", "shift"}, "E", function()
    local script = projectPath .. "/scripts/automation/quick-export.sh"
    -- Open in Terminal for interactive selection
    hs.execute("open -a Terminal " .. script)
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 5. Run Tests
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hs.hotkey.bind({"cmd", "shift"}, "T", function()
    hs.alert.show("Running tests...")
    
    local task = hs.task.new("/usr/local/bin/npm", function(exitCode, stdOut, stdErr)
        -- Save results for other tools to read
        local file = io.open("/tmp/test-results.txt", "w")
        if file then
            file:write(stdOut or "")
            file:write(stdErr or "")
            file:close()
        end
        
        if exitCode == 0 then
            local passMatch = (stdOut or ""):match("pass (%d+)")
            local passCount = passMatch or "all"
            hs.notify.new({
                title = "Tests Passed ✅",
                informativeText = passCount .. " tests passing",
                withdrawAfter = 5
            }):send()
        else
            local failMatch = (stdOut or ""):match("fail (%d+)")
            local failCount = failMatch or "some"
            hs.notify.new({
                title = "Tests Failed ❌",
                informativeText = failCount .. " tests failing",
                withdrawAfter = 10
            }):send()
        end
    end, {"test"})
    
    task:setWorkingDirectory(projectPath)
    task:start()
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 6. Agent Memory Sync
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

local memoryPath = projectPath .. "/prompts/agents/memory"
local memoryStates = {}

-- Watch for memory file changes
local memoryWatcher = hs.pathwatcher.new(memoryPath, function(paths)
    for _, path in ipairs(paths) do
        local filename = path:match("([^/]+)$")
        if filename and filename:match("_MEMORY%.md$") then
            local role = filename:gsub("_MEMORY%.md$", "")
            local attrs = hs.fs.attributes(path)
            local mtime = attrs and attrs.modification
            
            if mtime and mtime ~= memoryStates[filename] then
                memoryStates[filename] = mtime
                hs.notify.new({
                    title = "Memory Updated",
                    subTitle = role .. " Agent",
                    informativeText = os.date("%H:%M:%S", mtime),
                    withdrawAfter = 5
                }):send()
            end
        end
    end
end)

-- Only start watcher if directory exists
if hs.fs.attributes(memoryPath) then
    memoryWatcher:start()
    print("✅ Memory watcher active: " .. memoryPath)
end

-- Memory Dashboard
hs.hotkey.bind({"cmd", "shift"}, "M", function()
    local roles = {"CLI", "WEB", "DOC", "TST", "TPL", "PLT"}
    local lines = {"Agent Memory Status:", ""}
    
    for _, role in ipairs(roles) do
        local memFile = memoryPath .. "/" .. role .. "_MEMORY.md"
        local attrs = hs.fs.attributes(memFile)
        if attrs then
            local mtime = os.date("%H:%M", attrs.modification)
            table.insert(lines, role .. ": ✅ " .. mtime)
        else
            table.insert(lines, role .. ": ⚪ No memory")
        end
    end
    
    hs.alert.show(table.concat(lines, "\n"), 5)
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 7. Self-Documenting Watcher
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

local changeBuffer = {}
local bufferTimeout = nil
local SIGNIFICANT_CHANGES = 5

local function triggerDocUpdate()
    if #changeBuffer < SIGNIFICANT_CHANGES then
        changeBuffer = {}
        return
    end
    
    local changedFiles = table.concat(changeBuffer, "\n")
    local taskPath = projectPath .. "/output/documentation-agent/inbox/auto-doc-" .. 
                     os.date("%Y%m%d-%H%M%S") .. ".txt"
    
    local content = string.format([[
================================================================================
TASK ASSIGNMENT: Auto-Documentation Update
================================================================================
Priority: P3 (LOW)
Target Agent: Documentation Agent
Created By: Hammerspoon (Self-Documenting System)
Date: %s

## Task Description

Significant code changes detected (%d files). Review and update documentation.

## Files Changed

%s

## Suggested Actions

1. Check if API signatures changed → update docs/api/
2. Check if CLI behavior changed → update docs/cli/
3. Check if new patterns → update docs/patterns/
4. Update FRAMEWORK_MAP.md if structure changed

================================================================================
END OF TASK
================================================================================
]], os.date("%Y-%m-%d %H:%M"), #changeBuffer, changedFiles)

    local file = io.open(taskPath, "w")
    if file then
        file:write(content)
        file:close()
        hs.notify.new({
            title = "Self-Doc Task Created",
            informativeText = #changeBuffer .. " files changed",
            withdrawAfter = 5
        }):send()
    end
    
    changeBuffer = {}
end

local function onSrcChange(paths)
    for _, path in ipairs(paths) do
        -- Only track significant source files
        if path:match("%.mjs$") or path:match("%.ts$") or path:match("%.tsx$") then
            local relativePath = path:gsub(projectPath .. "/", "")
            table.insert(changeBuffer, relativePath)
        end
    end
    
    if bufferTimeout then
        bufferTimeout:stop()
    end
    
    -- Wait 30 seconds for more changes before triggering
    bufferTimeout = hs.timer.doAfter(30, triggerDocUpdate)
end

-- Watch source directories
local srcDirs = {
    projectPath .. "/src",
    projectPath .. "/bin",
    projectPath .. "/website/app"
}

local srcWatchers = {}
for _, dir in ipairs(srcDirs) do
    if hs.fs.attributes(dir) then
        table.insert(srcWatchers, hs.pathwatcher.new(dir, onSrcChange):start())
        print("✅ Source watcher active: " .. dir)
    end
end

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 8. Test-Fix Loop Trigger
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hs.hotkey.bind({"cmd", "shift"}, "F", function()
    local script = projectPath .. "/scripts/automation/test-fix-loop.sh"
    hs.execute("open -a Terminal " .. script)
    hs.alert.show("Test-Fix Loop started in Terminal")
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Startup
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hs.alert.show("🚀 Dawson Automation Loaded", 2)

print("")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("  Dawson Does Framework - Hammerspoon Automation")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("")
print("Hotkeys:")
print("  ⌘⇧D - Daily Dev startup")
print("  ⌘⇧E - Quick Export wizard")
print("  ⌘⇧T - Run tests")
print("  ⌘⇧C - Inject context")
print("  ⌘⇧M - Memory dashboard")
print("  ⌘⇧G - Grid Cursor windows")
print("  ⌘⇧N - Cycle Cursor windows")
print("  ⌘⇧F - Test-Fix loop")
print("")
print("Project: " .. projectPath)
print("Default role: " .. defaultRole)
print("")

