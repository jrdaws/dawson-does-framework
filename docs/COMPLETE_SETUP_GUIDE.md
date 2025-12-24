# Complete Framework Setup & Operations Guide

> **For AI Agents on Fresh Computers**
> Version: 1.2.0 | Last Updated: 2025-12-23
> Estimated Total Setup Time: 30-45 minutes

---

## ⚠️ KEEP THIS FILE UPDATED

**All agents must update this file when:**
- New tools or dependencies are added
- Folder structure changes
- New automation scripts are created
- Workflows or processes change
- New agent types are added

**Update process:**
1. Make your changes to the relevant section
2. Increment the version number (MAJOR.MINOR.PATCH)
3. Add entry to Version History below
4. Commit with message: `docs(setup): update complete setup guide vX.X.X`

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.2.0 | 2025-12-23 | DOC Agent | Added all 13 agents with memory files, renumbered sections |
| 1.1.0 | 2025-12-23 | DOC Agent | Added Section 4.6: Media Generation Pipeline |
| 1.0.1 | 2025-12-23 | DOC Agent | Added Requirements section (internet, repo access) |
| 1.0.0 | 2025-12-23 | DOC Agent | Initial creation - complete setup guide |

---

## Overview

This guide enables a NEW AI agent on a FRESH macOS computer to fully set up and operate the Dawson-Does Framework, including its continuous improvement automation system.

**What you'll set up:**
- Development environment (Node.js, Git, tools)
- Framework codebase
- Automation system (Keyboard Maestro + launchd)
- Continuous improvement cycle (Auditor → Strategist → Curator)

---

## Requirements

### Internet Access: REQUIRED

You will need internet access for:
- Installing Homebrew, Node.js, Git (Sections 1.1-1.4)
- Cloning repository from GitHub (Section 2.1)
- Running `npm install` (Section 2.2)
- Installing Claude CLI (Section 1.5)

### Other Documents: NOT NEEDED INITIALLY

This guide is **self-contained for bootstrap**. After cloning the repository (Section 2.1), all other referenced documents will be available locally.

```
BEFORE CLONE: Only this guide needed
AFTER CLONE: All docs available at /Users/joseph.dawson/Documents/dawson-does-framework/
```

### Repository Access

The repository must be accessible at:
```
https://github.com/jrdaws/dawson-does-framework.git
```

If this is a private repository, you'll need:
- GitHub account with access
- Git credentials configured (SSH key or personal access token)

---

## Section 1: Prerequisites Installation

**Estimated Time: 10 minutes**

### 1.1 Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installation, add to PATH (follow the instructions shown, typically):
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Verify:**
```bash
brew --version
# Expected: Homebrew 4.x.x
```

### 1.2 Install Node.js

```bash
brew install node@20
```

**Verify:**
```bash
node --version
# Expected: v20.x.x

npm --version
# Expected: 10.x.x
```

### 1.3 Install Git

```bash
brew install git
```

Configure Git:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Verify:**
```bash
git --version
# Expected: git version 2.x.x
```

### 1.4 Install Additional Tools

```bash
# File watcher for automation
brew install fswatch

# JSON processor for scripts
brew install jq

# Better notifications
brew install terminal-notifier

# Claude CLI for backup automation
npm install -g @anthropic-ai/claude-cli
```

### 1.5 Configure Claude CLI (Optional - for overnight automation)

```bash
claude config set api_key YOUR_ANTHROPIC_API_KEY
```

**Verify:**
```bash
claude --version
```

### 1.6 Install Keyboard Maestro (Optional - for GUI automation)

Download from: https://www.keyboardmaestro.com/
Or if you have a license:
```bash
brew install --cask keyboard-maestro
```

---

## Section 2: Repository Setup

**Estimated Time: 5 minutes**

### 2.1 Clone Repository

```bash
cd ~/Documents
git clone https://github.com/jrdawson/dawson-does-framework.git
cd dawson-does-framework
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Build Packages

```bash
npm run build -w packages/ai-agent
```

### 2.4 Verify Setup

```bash
npm test
# Expected: 693+ tests passing
```

### 2.5 Environment Variables

Create `.env` file in project root (if needed for local development):
```bash
cp .env.example .env
```

Required variables for full functionality:
```
ANTHROPIC_API_KEY=your_key_here
```

For website development:
```bash
cd website
cp .env.example .env.local
```

---

## Section 3: Architecture Overview

**Project Structure:**

```
/Users/joseph.dawson/Documents/dawson-does-framework/
│
├── bin/framework.js           # CLI entry point
├── src/dd/                    # Core framework modules (.mjs)
│
├── website/                   # Next.js 15 web configurator
│   ├── app/                   # App router pages
│   ├── components/            # React components
│   └── lib/                   # Utilities
│
├── packages/
│   └── ai-agent/              # AI generation engine
│       ├── src/
│       │   ├── prompts/       # AI prompts
│       │   ├── index.ts       # Main export
│       │   └── *.ts           # Generator modules
│       └── dist/              # Compiled output
│
├── templates/                 # Starter templates
│   ├── saas/
│   ├── flagship-saas/
│   ├── seo-directory/
│   └── [others]/
│
├── output/                    # Multi-agent communication
│   ├── shared/
│   │   ├── reports/           # Audit/Strategy/Summary reports
│   │   ├── templates/         # Report templates
│   │   └── metrics/           # Velocity tracking
│   │
│   ├── controller-agents/
│   │   ├── auditor/inbox/
│   │   ├── strategist/inbox/
│   │   └── curator/inbox/
│   │
│   └── [agent]-agent/         # Executor agents
│       ├── inbox/             # Pending tasks
│       ├── done/              # Completed tasks
│       └── outbox/            # Completion reports
│
├── prompts/agents/
│   ├── roles/controllers/     # Controller agent SOPs
│   ├── memory/                # Agent session memories
│   └── AGENT_POLICIES.md
│
├── scripts/                   # Automation scripts
│   ├── smart-auto-cycle.sh    # Primary automation
│   ├── trigger-km-cycle.sh    # Keyboard Maestro trigger
│   ├── run-agent.sh           # Show pending tasks
│   └── watch-inboxes.sh       # File watcher
│
├── docs/                      # Documentation
│   ├── design/                # Design resources
│   ├── standards/             # Coding standards
│   └── api/                   # API documentation
│
├── AGENT_CONTEXT.md           # Required reading for agents
├── CLAUDE.md                  # Claude CLI context
└── .cursorrules               # Cursor IDE rules
```

### Key Files

| File | Purpose |
|------|---------|
| `AGENT_CONTEXT.md` | **READ FIRST** - Project vision, standards, rules |
| `CLAUDE.md` | Bootstrap instructions for new agents |
| `.cursorrules` | Cursor-specific governance |
| `bin/framework.js` | CLI entry point |
| `packages/ai-agent/src/index.ts` | AI generation engine |

### How Components Connect

```
User Request
     │
     ▼
┌─────────────────┐
│  Web UI         │ ──── Configure project
│  (website/)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Agent       │ ──── Generate code
│  (packages/)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Templates      │ ──── Scaffold project
│  (templates/)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CLI            │ ──── Export to local
│  (bin/)         │
└─────────────────┘
```

---

## Section 4: Automation System

**Estimated Time: 10 minutes to understand, 5 minutes to activate**

### 4.1 The Continuous Improvement Cycle

The framework uses a PDCA (Plan-Do-Check-Act) cycle with 3 controller agents:

```
Every 6 Hours:

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   AUDITOR    │────▶│  STRATEGIST  │────▶│   CURATOR    │
│   (Check)    │     │    (Plan)    │     │    (Act)     │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
  audit-*.txt          strategy-*.txt       Tasks in
  (what changed)       (what to do)         agent inboxes
                                                 │
                                                 ▼
                                    ┌──────────────────────┐
                                    │   EXECUTOR AGENTS    │
                                    │   CLI, Website,      │
                                    │   Testing, etc.      │
                                    │       (Do)           │
                                    └──────────────────────┘
```

### 4.2 Controller Agents (3)

| Agent | Code | SOP Location | Memory File | Purpose |
|-------|------|--------------|-------------|---------|
| Auditor | `AUD` | `prompts/agents/roles/controllers/AUDITOR.md` | `AUDITOR_MEMORY.md` | Review state, identify gaps |
| Strategist | `STR` | `prompts/agents/roles/controllers/STRATEGIST.md` | `STRATEGIST_MEMORY.md` | Create task plan |
| Curator | `CUR` | `prompts/agents/roles/controllers/CURATOR.md` | `CURATOR_MEMORY.md` | Quality control, distribute tasks |

**Cycle Flow**: Auditor → Strategist → Curator → (tasks distributed to Executor Agents)

### 4.3 Executor Agents (7)

| Agent | Code | Inbox Location | Memory File | Purpose |
|-------|------|----------------|-------------|---------|
| CLI | `CLI` | `output/agents/cli/inbox/` | `CLI_MEMORY.md` | CLI features |
| Website | `WEB` | `output/agents/website/inbox/` | `WEBSITE_MEMORY.md` | Web UI features |
| Platform | `PLT` | `output/agents/platform/inbox/` | `PLATFORM_MEMORY.md` | Infrastructure |
| Testing | `TST` | `output/agents/testing/inbox/` | `TESTING_MEMORY.md` | Tests, validation |
| Template | `TPL` | `output/agents/template/inbox/` | `TEMPLATE_MEMORY.md` | Template maintenance |
| Documentation | `DOC` | `output/agents/documentation/inbox/` | `DOCS_MEMORY.md` | Docs |
| Integration | `INT` | `output/agents/integration/inbox/` | `INTEGRATION_MEMORY.md` | Integrations |

### 4.4 Media Pipeline Agents (3)

| Agent | Code | Inbox Location | Memory File | Purpose |
|-------|------|----------------|-------------|---------|
| Research | `RES` | `output/agents/research/inbox/` | `RESEARCH_MEMORY.md` | Asset briefs |
| Media | `MED` | `output/agents/media/inbox/` | `MEDIA_MEMORY.md` | Image generation |
| Quality | `QUA` | `output/agents/quality/inbox/` | `QUALITY_MEMORY.md` | Asset review |

**Pipeline Flow**: Research → Media → Quality → Template/Website Agent

**Activation**:
```bash
cat output/shared/media/ACTIVATE_MEDIA_PIPELINE.txt
```

### 4.5 Activate Automation

**Option A: Smart Auto (Cursor primary, CLI backup)**

```bash
/Users/joseph.dawson/Documents/dawson-does-framework/scripts/setup-smart-auto.sh
```

This creates a launchd job that runs every 6 hours.

**Option B: Keyboard Maestro (Manual setup)**

1. Open Keyboard Maestro
2. Create macro group: "Dawson-Does Automation"
3. Create macro: "Run Improvement Cycle"
4. Add Subroutine Trigger
5. Add actions per `automation/keyboard-maestro-setup.md`
6. Optionally add Time of Day triggers (0:00, 6:00, 12:00, 18:00)

**Option C: Manual only**

Run cycles manually as needed (no automation).

### 4.6 Verify Automation Status

```bash
# Check launchd status
launchctl list | grep dawson

# Check pending tasks
/Users/joseph.dawson/Documents/dawson-does-framework/scripts/run-agent.sh all

# View automation logs
tail -f /Users/joseph.dawson/Documents/dawson-does-framework/logs/smart-auto.log
```

### 4.7 Media Generation Pipeline (Extended)

A specialized 3-agent system for generating visual assets (images, icons, graphics).

```
Research Agent → Media Agent → Quality Agent → (Feedback Loop if needed)
```

| Agent | Purpose | SOP |
|-------|---------|-----|
| Research | Analyze app, create asset briefs | `prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md` |
| Media | Generate images with AI (DALL-E, SD) | `prompts/agents/roles/media-pipeline/MEDIA_AGENT.md` |
| Quality | Review, approve, or request revisions | `prompts/agents/roles/media-pipeline/QUALITY_AGENT.md` |

**Activate the pipeline:**
```bash
cat output/shared/media/ACTIVATE_MEDIA_PIPELINE.txt
```

**Full documentation:**
```
output/shared/media/MEDIA_PIPELINE.md
```

---

## Section 5: Daily Operations

### 5.1 Start Your Session

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework
git pull origin main
npm test
```

### 5.2 Check Current Status

```bash
# View pending tasks for all agents
./scripts/run-agent.sh all

# View recent reports
ls -la output/shared/reports/*.txt | tail -5

# Check velocity metrics
cat output/shared/metrics/velocity-log.csv
```

### 5.3 Run a Manual Improvement Cycle

**Step 1: Auditor**
```
Read prompts/agents/roles/controllers/AUDITOR.md and execute a full audit cycle.
```

**Step 2: Strategist** (after Auditor completes)
```
Read prompts/agents/roles/controllers/STRATEGIST.md and execute a strategy cycle.
```

**Step 3: Curator** (after Strategist completes)
```
Read prompts/agents/roles/controllers/CURATOR.md and execute a curation cycle.
```

**Step 4: Execute Tasks**
```bash
./scripts/run-agent.sh all
# Copy task prompts into new Cursor chats
```

### 5.4 Run a Specific Executor Agent

Copy the activation line into a new Cursor chat:

```
Read and execute the task in output/[agent]-agent/inbox/[task-file].txt
```

### 5.5 End Your Session

```bash
npm test
git add -A
git commit -m "type(scope): description"
git push origin main
```

---

## Section 6: Key Commands Reference

### Scripts (All Paths Absolute)

| Command | Purpose |
|---------|---------|
| `/Users/joseph.dawson/Documents/dawson-does-framework/scripts/run-agent.sh all` | Show all pending tasks |
| `/Users/joseph.dawson/Documents/dawson-does-framework/scripts/run-improvement-cycle.sh` | Guided manual cycle |
| `/Users/joseph.dawson/Documents/dawson-does-framework/scripts/smart-auto-cycle.sh` | Run full auto cycle |
| `/Users/joseph.dawson/Documents/dawson-does-framework/scripts/trigger-km-cycle.sh` | Trigger via Keyboard Maestro |
| `/Users/joseph.dawson/Documents/dawson-does-framework/scripts/watch-inboxes.sh` | Watch for new tasks |

### NPM Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests (693+) |
| `npm run lint` | Check linting |
| `npm run build -w packages/ai-agent` | Build AI agent package |

### Git Commands

| Command | Purpose |
|---------|---------|
| `git pull origin main` | Sync with remote |
| `git log --oneline -10` | Recent commits |
| `git status` | Check for changes |

### Automation Control

| Command | Purpose |
|---------|---------|
| `launchctl list \| grep dawson` | Check if automation running |
| `launchctl start dev.dawson.smart-auto` | Manually trigger cycle |
| `launchctl unload ~/Library/LaunchAgents/dev.dawson.smart-auto.plist` | Stop automation |

### Troubleshooting

| Issue | Command |
|-------|---------|
| Tests failing | `npm test 2>&1 \| grep FAIL` |
| Check logs | `tail -f logs/smart-auto.log` |
| Reset to clean state | `git checkout HEAD -- .` |
| Rebuild packages | `npm run build -w packages/ai-agent` |

---

## Section 7: Governance & Standards

### Coding Standards Summary

| Context | Standard |
|---------|----------|
| `.mjs` files (CLI) | No semicolons, 2-space indent |
| `.ts/.tsx` files | Semicolons, 2-space indent |
| Commits | Conventional: `feat:`, `fix:`, `docs:`, `chore:` |
| Functions | camelCase |
| Components | PascalCase |

### Protected Files (NEVER DELETE)

- `AGENT_CONTEXT.md`
- `CLAUDE.md`
- `.cursorrules`
- `prompts/agents/memory/*.md`
- `prompts/agents/roles/*.md`
- `docs/standards/*`

### What NOT To Do

1. ❌ Add features not requested
2. ❌ Refactor unrelated code
3. ❌ Create feature branches (always `main`)
4. ❌ Commit secrets or `.env` files
5. ❌ Delete protected files
6. ❌ Skip reading `AGENT_CONTEXT.md`
7. ❌ Use `console.log` (use `logger.mjs`)

### Agent Identity

Every agent must end responses with their identity:
```
(CLI Agent) | (WEB Agent) | (DOC Agent) | (TST Agent) | (PLT Agent) | (TPL Agent) | (INT Agent)
```

Controller agents:
```
(AUDITOR Agent) | (STRATEGIST Agent) | (CURATOR Agent)
```

---

## Section 8: Quick Start Checklist

For a new agent on a fresh computer:

- [ ] Install Homebrew
- [ ] Install Node.js 20
- [ ] Install Git and configure
- [ ] Install fswatch, jq, terminal-notifier
- [ ] Clone repository to ~/Documents
- [ ] Run `npm install`
- [ ] Run `npm test` (verify 693+ passing)
- [ ] Read `AGENT_CONTEXT.md`
- [ ] Run `./scripts/run-agent.sh all` to see pending tasks
- [ ] (Optional) Set up automation via `./scripts/setup-smart-auto.sh`

---

## Section 9: File Locations Quick Reference

| Need | Location |
|------|----------|
| Project root | `/Users/joseph.dawson/Documents/dawson-does-framework/` |
| Agent context | `AGENT_CONTEXT.md` |
| Controller SOPs | `prompts/agents/roles/controllers/` |
| Agent inboxes | `output/[agent]-agent/inbox/` |
| Cycle reports | `output/shared/reports/` |
| Automation scripts | `scripts/` |
| AI prompts | `packages/ai-agent/src/prompts/` |
| Templates | `templates/` |
| Website | `website/` |
| Logs | `logs/` |

---

## Section 10: Verification Commands

Run these to verify everything is working:

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework

# 1. Check Node
node --version  # Should be v20.x.x

# 2. Check Git
git status  # Should show clean or your changes

# 3. Check Tests
npm test  # Should show 693+ passing

# 4. Check Automation
launchctl list | grep dawson  # Should show dev.dawson.smart-auto

# 5. Check Agent System
./scripts/run-agent.sh all  # Shows pending tasks

# 6. Check Recent Cycle
ls output/shared/reports/*.txt | tail -3  # Shows recent reports
```

**All checks pass? You're ready to operate!**

---

*This guide was created for AI agents. For human users, see `docs/getting-started/QUICK_START.md`.*

