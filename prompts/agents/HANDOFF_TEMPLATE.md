# Agent Handoff Template

> Copy this template when assigning work to any AI agent (Claude Code CLI, Cursor, etc.)
> Fill in the [BRACKETS] with your specific task details.

---

## 🛑 MANDATORY: Read Context First

Before doing ANY work, execute these commands and read the output:

```bash
cat AGENT_CONTEXT.md
```

You MUST pass the verification test in that file. Include your answers in your first response using this format:

```
## Context Verification ✓
1. Export-first means: [answer]
2. Semicolon rule: [answer]
3. CLI entry point: [answer]
4. Forbidden actions: [answer]
5. Pre-commit command: [answer]

I have read and understood AGENT_CONTEXT.md. Proceeding with task.
```

**DO NOT proceed until you have answered these questions.**

---

## Your Task: [TASK TITLE]

### Context
[Brief background on why this task is needed]

### Objective
[Clear statement of what needs to be accomplished]

### Files to Create/Modify
- `[path/to/file1]` - [what to do]
- `[path/to/file2]` - [what to do]

### Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
- [ ] Tests pass: `npm test`
- [ ] No lint errors

### Technical Requirements
[Any specific technical constraints or patterns to follow]

### Do NOT
- [ ] Touch files outside your scope
- [ ] Add unrequested features
- [ ] Change shared configuration
- [ ] Skip the context verification

### When Complete
1. Run `npm test` and confirm passing
2. Commit with message: `[type](scope): [description]`
3. Follow the Response Rules below

---

## 📋 MANDATORY Response Rules

Your FINAL response MUST end with these three sections:

### Section 1: Summary of Achievements
```markdown
---
## ✅ Summary of Achievements

### Completed
- [What was created/modified]
- [Files changed with brief description]
- [Tests added/passing]

### Metrics
- Files created: X
- Files modified: X
- Tests passing: X/X
```

### Section 2: Suggestions
```markdown
## 💡 Suggestions

### Immediate Improvements
1. [Quick win that could be done next]
2. [Another quick improvement]

### Future Considerations  
1. [Longer-term improvement]
2. [Technical debt to address]

### Potential Issues
1. [Any concerns or edge cases noticed]
```

### Section 3: Continuation Prompt
```markdown
## 🚀 Next Steps Prompt

Copy this expert-level prompt to continue development:

---

# Agent Task: [Next Logical Task Title]

## 🛑 MANDATORY: Read Context First
\`\`\`bash
cat AGENT_CONTEXT.md
\`\`\`
Answer the 5 verification questions before proceeding.

## Context
[What was just completed and why next task matters]

## Your Task
[Specific next task based on suggestions above]

## Files to Create/Modify
- \`[file1]\` - [what to do]
- \`[file2]\` - [what to do]

## Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] Tests pass: \`npm test\`

## Technical Notes
[Any relevant context from current work]

---
```

### Response Rules Summary
- ✅ ALWAYS provide Summary of Achievements
- ✅ ALWAYS provide Suggestions
- ✅ ALWAYS provide a Continuation Prompt
- ❌ NEVER end abruptly without these sections

---

## Reference Information

### Useful Commands
```bash
npm test              # Run tests
npm run lint          # Check linting  
git status            # Check state
framework doctor .    # Health check
```

### Related Files
- [List files the agent should reference]

### Dependencies
- [List any tasks this depends on]
- [List any tasks depending on this]

---

*Template version: 1.0 | Updated: 2024-12-21*

