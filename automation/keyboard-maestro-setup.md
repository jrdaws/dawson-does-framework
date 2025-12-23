# Keyboard Maestro Setup for Agent Automation

Keyboard Maestro is the most reliable option for automating Cursor.

---

## Quick Setup

### 1. Create Macro Group

1. Open Keyboard Maestro
2. Click **+** at bottom left → "New Macro Group"
3. Name it: `Dawson-Does Automation`

### 2. Import the Trigger Macro

Create a macro that runs the controller agents in sequence:

**Macro: Run Improvement Cycle**

| Setting | Value |
|---------|-------|
| Trigger | Cron (Time of Day) - 0:00, 6:00, 12:00, 18:00 |
| Or | Execute Macro by Name (for manual) |

**Actions:**

```
1. Activate Cursor
2. Pause 2 seconds
3. Type Keystroke: ⌘L (new chat)
4. Pause 1 second
5. Set Clipboard to Text: [AUDITOR PROMPT]
6. Type Keystroke: ⌘V (paste)
7. Pause 0.5 seconds
8. Type Keystroke: Return (submit)
9. Pause 5 minutes (wait for completion)
10. [Repeat steps 2-9 for STRATEGIST]
11. [Repeat steps 2-9 for CURATOR]
12. Display Notification: "Improvement cycle complete"
```

---

## Prompts to Use

### AUDITOR
```
Read prompts/agents/roles/controllers/AUDITOR.md and execute a full audit cycle. Review the last 6 hours of changes, run tests, check agent activity, and produce an audit report.
```

### STRATEGIST
```
Read prompts/agents/roles/controllers/STRATEGIST.md and execute a strategy cycle. Read the latest audit report, create a strategic plan, and draft task prompts for executor agents.
```

### CURATOR
```
Read prompts/agents/roles/controllers/CURATOR.md and execute a curation cycle. Review draft prompts, score them against quality criteria, and distribute final tasks to agent inboxes.
```

---

## Timing Recommendations

| Agent | Wait Time | Notes |
|-------|-----------|-------|
| AUDITOR | 5 min | Mostly file reading |
| STRATEGIST | 7 min | More complex planning |
| CURATOR | 6 min | Quality review |
| Each Executor | 5 min | Task execution |

---

## Pro Tips

1. **Use "Pause Until" instead of fixed pause**
   - Pause Until: Cursor window title changes
   - More reliable than fixed timing

2. **Add error handling**
   - If Cursor not running → Start Cursor first
   - If prompt fails → Retry once

3. **Log to file**
   - Add "Write to File" action after each agent
   - Helps debug issues

---

## Alternative: Shell Script Trigger

You can also trigger from shell and let KM do the GUI work:

```bash
osascript -e 'tell application "Keyboard Maestro Engine" to do script "Run Improvement Cycle"'
```

This lets you use launchd/cron for timing while KM handles the GUI automation.

