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
| 2024-12-22 | 25min | Session-1 | Fixed API contract compliance: Created api-errors.ts helper, updated both /api/projects/save and /api/projects/[token] to use standard response format with error codes and recovery guidance |

---

## 💡 Key Decisions

| Decision | Reasoning | Date |
|----------|-----------|------|
| Supabase for storage | Easy setup, good free tier | 2024-12-21 |
| Human-readable tokens | Better UX than UUIDs | 2024-12-21 |
| 30-day expiry | Security, cleanup | 2024-12-21 |
| Centralized API error helpers | Ensure consistent error format across all endpoints, easier to maintain | 2024-12-22 |
| Include recovery guidance in errors | Better DX - users know exactly how to fix issues | 2024-12-22 |

---

## 🔍 Active Context

### Current State
- ✅ Project save API working and API contract compliant
- ✅ Project fetch API working and API contract compliant
- ✅ Supabase integration
- ✅ Token generation
- ✅ Standard error responses with recovery guidance
- ⚠️ Preview generation slow
- ⚠️ No caching
- ⚠️ Other API endpoints need contract updates (download, preview)
- ❌ Deploy engine not started
- ❌ AI agent package not started

### In Progress
- Preview optimization

### Blocked
- None currently

---

## 📋 Task Queue

### High Priority
- [x] Fix API contract compliance for projects endpoints
- [ ] Update other API endpoints for contract compliance (download, preview)
- [ ] Create `packages/deploy-engine/`
- [ ] Add preview caching
- [ ] Optimize preview speed

### Medium Priority
- [ ] Create `packages/ai-agent/`
- [ ] Add API tests for all endpoints
- [ ] Add rate limiting improvements

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

1. **API Format**: Always return `{ success, data/error }` structure using helpers from `website/lib/api-errors.ts`
2. **Error Codes**: Use ErrorCodes constants from api-errors.ts for consistency
3. **Recovery Guidance**: Every error MUST include actionable recovery steps
4. **Supabase**: Client in `website/lib/supabase.ts`
5. **CORS Headers**: All CLI-accessible endpoints need CORS headers
6. **Rate Limiting**: Uses Redis when available, falls back gracefully
7. **Response Format**: Use camelCase in API responses (not snake_case)
8. **Packages**: TypeScript, use proper exports
9. **Testing**: Mock external APIs in tests
10. **Other Endpoints**: `/api/projects/[token]/download` and `/api/preview/generate` need contract updates

---

## 🔗 Related Files

| File | Relevance |
|------|-----------|
| `website/app/api/projects/` | Project APIs |
| `website/app/api/preview/` | Preview API |
| `website/lib/supabase.ts` | DB client |
| `website/lib/api-errors.ts` | Standard error/success helpers |
| `website/lib/rate-limiter.ts` | Rate limiting logic |
| `website/supabase/migrations/` | Schema |
| `docs/standards/API_CONTRACTS.md` | API standards reference |

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

