# Platform Agent Memory

> **Persistent memory for Platform Agent sessions. Update this file at the end of EVERY session.**

---

## 🧠 Persistent Context

### Core Responsibilities
- Platform APIs in `website/app/api/`
- Shared packages in `packages/`
- Supabase schema and data
- Preview, deploy, collaboration systems

### Critical Knowledge
- APIs return `{ success: true/false, data/error }`
- Supabase handles project storage
- Tokens expire after 30 days
- Preview runs on edge for speed

---

## 📅 Session History

| Date | Duration | Session ID | Summary |
|------|----------|------------|---------|
| 2024-12-22 | Initial | Setup | Created memory file, established baseline |
| | | | *Add your session here* |

---

## 💡 Key Decisions

| Decision | Reasoning | Date |
|----------|-----------|------|
| Supabase for storage | Easy setup, good free tier | 2024-12-21 |
| Human-readable tokens | Better UX than UUIDs | 2024-12-21 |
| 30-day expiry | Security, cleanup | 2024-12-21 |
| | *Add your decisions here* | |

---

## 🔍 Active Context

### Current State
- ✅ Project save API working
- ✅ Project fetch API working
- ✅ Supabase integration
- ✅ Token generation
- ⚠️ Preview generation slow
- ⚠️ No caching
- ❌ Deploy engine not started
- ❌ AI agent package not started

### In Progress
- Preview optimization

### Blocked
- None currently

---

## 📋 Task Queue

### High Priority
- [ ] Create `packages/deploy-engine/`
- [ ] Add preview caching
- [ ] Optimize preview speed

### Medium Priority
- [ ] Create `packages/ai-agent/`
- [ ] Enhance pull API response
- [ ] Add rate limiting

### Low Priority
- [ ] Create `packages/collaboration/`
- [ ] Add real-time features

---

## 🐛 Known Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| Preview slow | High | 5+ seconds |
| No caching | High | Regenerates every time |
| No deploy | High | Manual process |
| Rate limits weak | Medium | Could be abused |

---

## 💭 Insights for Next Agent

1. **API Format**: Always return `{ success, data/error }` structure
2. **Error Codes**: Use proper HTTP status codes
3. **Supabase**: Client in `website/lib/supabase.ts`
4. **Packages**: TypeScript, use proper exports
5. **Testing**: Mock external APIs in tests

---

## 🔗 Related Files

| File | Relevance |
|------|-----------|
| `website/app/api/projects/` | Project APIs |
| `website/app/api/preview/` | Preview API |
| `website/lib/supabase.ts` | DB client |
| `website/supabase/migrations/` | Schema |

---

## ✏️ How to Update This File

At the end of your session, add:

1. **Session Entry**: Date, duration, what you did
2. **Decisions**: Any choices you made and why
3. **Task Updates**: Mark done, add new tasks
4. **Issues**: Any bugs found
5. **Insights**: Tips for the next agent

---

*Last Updated: 2024-12-22 by governance setup*

