# Session Handoff

Before ending this session, complete the mandatory handoff:

1. **Run tests**: `npm test`
2. **Commit work**: 
   ```bash
   git add -A
   git commit -m "<type>(<scope>): <description>"
   git push origin main
   ```
3. **Update memory file** at `prompts/agents/memory/[ROLE]_MEMORY.md`

Then provide:
- **Summary**: What was accomplished this session
- **Suggestions**: Recommended next steps
- **Next Agent**: Which role should continue
- **Continuation Prompt**: Ready-to-paste prompt for next agent

