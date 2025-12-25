# Governance Changelog

> Moved from AGENT_POLICIES.md to reduce bootstrap token consumption.
> Reference this only when investigating governance changes.

---

## Version History

### Version 3.0 (2025-12-24)
- Added **Auto-Continuation Protocol** for multi-step unattended tasks
- Created `scripts/auto-continue/` with trigger, cancel, check scripts
- Keyboard Maestro integration for automatic prompt pasting
- Safety features: max 5 continues, timeout, logging, auditor verification

### Version 2.9 (2025-12-24)
- Enhanced **Permission Probing Protocol** - agents probe specific paths upfront
- Fire ALL permission triggers at session start with dummy operations
- Added permission prediction matrix for common task types
- Probe target directories before creating files there

### Version 2.8 (2025-12-24)
- Added **Checkpoint Protocol** - mandatory progress offloading every 15-20 min
- Created `docs/sops/CHECKPOINT_SOP.md` with full protocol
- Added checkpoint to MINDFRAME.md Reply Rules section
- Ensures work is saved incrementally, not just at session end

### Version 2.7 (2025-12-23)
- Made **Permission Request BLOCKING** - must request upfront in first response
- Added **Reply Rules section to MINDFRAME.md** for quick reference
- Identity declaration now uses FULL ROLE NAME in ALL CAPS
- Auto-continue timer set to 35 minutes

### Version 2.6 (2025-12-23)
- Made **Quick Actions section a BLOCKING requirement** for EVERY response
- Users can reply with a number for quick selection
- Must include DEFAULT option and auto-continue timer

### Version 2.5 (2025-12-23)
- Made **Handoff Prompt a BLOCKING requirement** - sessions cannot end without one
- Fixed format: Both "Confirm you are..." AND "cd && cat" go INSIDE fenced block
- Added validation check reference (Check 8 in validate-agent-work.sh)
- Will become a blocking error in future versions

### Version 2.4 (2025-12-23)
- Added **SOP Proposal Process** - any agent can propose SOPs
- Created `docs/sops/SOP_PROPOSAL_PROCESS.md`
- Workflow: Any Agent → Documentation → Auditor → Published
- Proposal folder: `output/shared/sop-proposals/`

### Version 2.3 (2025-12-23)
- Added **Sequence Verification Protocol** - agents must check order before work
- Expanded **SOP Guardian** to Testing and Auditor (3-agent responsibility)
- Added **Certification Requirements Matrix**
- Agents must notify user if sequence is wrong and offer redirect

### Version 2.2 (2025-12-23)
- Standardized **Handoff Prompt Format** with role identity
- Prompts must start with "Confirm you are the [Role] Agent."
- Removed "Copy this to activate:" text
- Added Step 4e for handoff format

### Version 2.1 (2025-12-23)
- Added **Shared Mindframe & Certification System**
- Agents read MINDFRAME.md at session start
- Agents certify their domain at session end
- Trust inheritance between agents
- Created certify.sh script

### Version 2.0 (2025-12-23)
- Enhanced **File Path Rule** - must include `cd` command for directory safety
- Full absolute paths required for all file references
- Commands work regardless of current terminal location

### Version 1.9 (2025-12-23)
- Added **Context Freshness Verification** system
- File tier classification (Critical/Role-Specific/Reference)
- Freshness thresholds (2hr/4hr/24hr)
- Pre-work verification checklist
- Created check-context-freshness.sh script

### Version 1.8 (2025-12-23)
- Added **Auto-Continuation Rule** - agents continue from inbox on minimal input
- User can just press Enter or say "continue" to proceed
- Agents auto-execute Option 1 (default) when idle
- Added inbox check command for self-directed work

### Version 1.7 (2025-12-23)
- Added **Numbered Quick-Select Options** for easy handoff
- User can reply with just a number (1, 2, 3...) to continue
- Option 3 always points to latest handoff file
- Option 4 always shows project priorities

### Version 1.6 (2025-12-23)
- Added **Smart Handoff System** with agent selection matrix
- Agents must analyze urgency, sequence, and dependencies
- Added PROJECT_PRIORITIES.md check to session start
- Session end must update project priorities

### Version 1.5 (2025-12-23)
- Added **Quality Agent SOP Guardian** responsibility
- Quality Agent must track all SOPs in SOP_REGISTRY.md
- Quality Agent must identify and propose new SOPs from feedback patterns

### Version 1.4 (2025-12-23)
- Made **"Output Next Agent Prompt"** mandatory for ALL agents
- Added next-agent routing table by role
- Updated Session End Checklist with handoff requirement

### Version 1.3 (2025-12-23)
- Added **Standard Operating Procedures** section
- Added Bug Triage, Doc Sync, Deployment SOP references
- Added documentation freshness check command

### Version 1.2 (2025-12-22)
- Added **AI Prompt Forbidden Patterns** section
- Added prompt writing to Required Actions
- Referenced `docs/standards/PROMPT_STANDARDS.md` for full prompt guidelines
- Agents must write token-optimized prompts from the start

### Version 1.1 (2025-12-22)
- Added **Fenced Output Integrity** standards
- Added Output Formatting Standards section
- Updated forbidden actions to include output splitting
- Added pre-output verification checklist
- Added anti-pattern and correct pattern examples

### Version 1.0 (2025-12-22)
- Initial release
- Defined 7 agent roles
- Established session protocols
- Created memory system
- Documented handoff procedures
