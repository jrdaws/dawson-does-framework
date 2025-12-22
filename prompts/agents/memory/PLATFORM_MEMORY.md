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
| 2024-12-22 | 20min | Session-2 | Added comprehensive API tests: Created tests/api/projects-save.test.mjs (60 tests) and tests/api/projects-fetch.test.mjs (67 tests) covering all success/error cases, response format validation, and API contract compliance. All 127 new tests passing. |
| 2024-12-22 | 15min | Session-3 | Updated CLI pull command for new API format: Modified fetchProject(), generateEnvExample(), generateContext() to handle new camelCase response format with backward compatibility. Added 5 new tests. All 644 tests passing including API and CLI pull tests. |
| 2024-12-22 | 60min | Session-4 | Fixed preview API contracts and added caching: Created lib/preview-cache.ts with Redis+memory fallback, updated /api/preview/generate to use API_CONTRACTS.md format, updated client types in preview-generator.ts, updated AIPreview.tsx component for new response format. Preview now caches all requests (not just seeded), improving speed for repeat configs. |

---

## 💡 Key Decisions

| Decision | Reasoning | Date |
|----------|-----------|------|
| Supabase for storage | Easy setup, good free tier | 2024-12-21 |
| Human-readable tokens | Better UX than UUIDs | 2024-12-21 |
| 30-day expiry | Security, cleanup | 2024-12-21 |
| Centralized API error helpers | Ensure consistent error format across all endpoints, easier to maintain | 2024-12-22 |
| Include recovery guidance in errors | Better DX - users know exactly how to fix issues | 2024-12-22 |
| Backward compatibility in CLI | Support both old and new API formats so CLI works during transition | 2024-12-22 |
| Field name flexibility | Handle both camelCase and snake_case to support API evolution | 2024-12-22 |
| Dedicated preview cache module | Abstraction allows easy Redis integration, reusable, testable | 2024-12-22 |
| Cache all preview requests | Better UX - even non-seeded requests benefit from caching identical configs | 2024-12-22 |

---

## 🔍 Active Context

### Current State
- ✅ Project save API working and API contract compliant
- ✅ Project fetch API working and API contract compliant
- ✅ CLI pull command compatible with new API format
- ✅ Backward compatibility maintained (supports old format)
- ✅ Supabase integration
- ✅ Token generation
- ✅ Standard error responses with recovery guidance
- ✅ Comprehensive test coverage (127 API tests + 5 CLI tests)
- ✅ Preview API contract compliant
- ✅ Preview caching module (Redis + in-memory)
- ✅ Preview generation working (3-6s, <100ms cached)
- ⚠️ Preview tests minimal (only basic Playwright tests)
- ⚠️ Other API endpoints need contract updates (download)
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
- [x] Add API tests for projects endpoints
- [x] Update CLI pull command for new API format
- [x] Update preview API for contract compliance
- [x] Add preview caching
- [ ] Update download API for contract compliance
- [ ] Add comprehensive preview tests
- [ ] Create `packages/deploy-engine/`

### Medium Priority
- [ ] Create `packages/ai-agent/`
- [ ] Add API tests for download endpoint
- [ ] Add comprehensive preview endpoint tests (unit + integration)
- [ ] Add cache metrics dashboard/monitoring
- [ ] Add rate limiting improvements
- [ ] Update CLI error display to show recovery guidance

### Low Priority
- [ ] Create `packages/collaboration/`
- [ ] Add real-time features

---

## 🐛 Known Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| No deploy | High | Manual process |
| Preview tests minimal | Medium | Only basic Playwright tests, need unit tests for caching |
| Download API not contract compliant | Medium | Needs update to use api-errors.ts format |
| No cache metrics dashboard | Low | Stats collected but not visualized |

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
9. **Testing**: Mock external APIs in tests, use Node.js test runner, focus on response format compliance
10. **Test Coverage**: Each endpoint should have tests for all success cases, all error codes, response format validation, and recovery guidance
11. **Test Organization**: Keep API tests in `tests/api/` directory, one file per endpoint
12. **CLI Backward Compatibility**: When updating API formats, ensure CLI handles both old and new formats gracefully
13. **Field Name Handling**: Use fallback pattern: `project.fieldName || project.field_name` to support both naming conventions
14. **Error Recovery**: CLI fetchProject now returns errorCode and recovery fields for better error display
15. **Preview Caching**: Use `lib/preview-cache.ts` - automatically handles Redis/memory fallback, provides stats
16. **Cache Module**: Call `getCachedPreview(key)` and `setCachedPreview(key, entry)` - async operations
17. **Cache Stats**: `getCacheStats()` returns hits, misses, hitRate, memorySize, redisAvailable
18. **Preview Response**: Now uses nested `data` field - clients access `result.data.html`, `result.error.message`
19. **Other Endpoints**: `/api/projects/[token]/download` needs contract update

---

## 🔗 Related Files

| File | Relevance |
|------|-----------|
| `website/app/api/projects/` | Project APIs |
| `website/app/api/preview/generate/route.ts` | Preview generation API (updated Session-4) |
| `website/lib/preview-cache.ts` | Caching module with Redis+memory (NEW Session-4) |
| `website/lib/preview-generator.ts` | Client-side preview helper (updated Session-4) |
| `website/app/components/configurator/AIPreview.tsx` | Preview UI component (updated Session-4) |
| `website/lib/supabase.ts` | DB client |
| `website/lib/api-errors.ts` | Standard error/success helpers |
| `website/lib/rate-limiter.ts` | Rate limiting logic |
| `website/supabase/migrations/` | Schema |
| `docs/standards/API_CONTRACTS.md` | API standards reference |
| `src/dd/pull.mjs` | CLI pull command (updated for new API) |
| `tests/api/projects-save.test.mjs` | Tests for POST /api/projects/save |
| `tests/api/projects-fetch.test.mjs` | Tests for GET /api/projects/[token] |
| `tests/cli/pull.test.mjs` | Tests for CLI pull command |
| `tests/cli/pull-api-mock.test.mjs` | Mock API tests for pull command |

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

