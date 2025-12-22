# Integration Agent Memory

> **Persistent memory for Integration Agent sessions. Update this file at the end of EVERY session.**

---

## 🧠 Persistent Context

### Core Responsibilities
- Integrations in `templates/*/integrations/`
- Integration validation (`src/dd/integrations.mjs`)
- Provider implementations (Supabase, Stripe, Clerk, etc.)
- Integration documentation

### Critical Knowledge
- Each integration needs `integration.json`
- Dependencies merged into project's package.json
- Env vars documented in integration.json
- Files copied to project maintaining same structure

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
| Per-template integrations | Flexibility, template-specific needs | 2024-12-19 |
| integration.json manifest | Declarative, easy validation | 2024-12-19 |
| | *Add your decisions here* | |

---

## 🔍 Active Context

### Current State
- ✅ Supabase Auth integration complete
- ✅ Supabase DB integration complete
- ✅ Integration validation system
- ⚠️ Stripe integration incomplete
- ❌ Clerk auth not started
- ❌ Resend email not started
- ❌ PostHog analytics not started

### In Progress
- Stripe completion

### Blocked
- None currently

---

## 📋 Task Queue

### High Priority
- [ ] Complete Stripe integration (webhooks, portal)
- [ ] Add Clerk auth integration
- [ ] Add Resend email integration

### Medium Priority
- [ ] Add PostHog analytics
- [ ] Add LemonSqueezy payments
- [ ] Add OpenAI integration

### Low Priority
- [ ] Add SendGrid email
- [ ] Add S3/R2 storage
- [ ] Add Paddle payments

---

## 🐛 Known Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| Stripe incomplete | High | Missing webhooks and portal |
| Only Supabase auth | High | Need alternatives |
| No email integration | High | Critical for SaaS |

---

## 💭 Insights for Next Agent

1. **Integration Structure**: Always include integration.json, may include package.json, files/directories
2. **Testing**: Use `framework export saas ./test --auth supabase` to test
3. **Env Vars**: Always document required env vars in integration.json
4. **Conflicts**: Mark conflicting providers in integration.json
5. **Post-install**: Include setup instructions in postInstallInstructions

---

## 🔗 Related Files

| File | Relevance |
|------|-----------|
| `templates/saas/integrations/auth/supabase/` | Reference auth integration |
| `src/dd/integrations.mjs` | Integration application logic |
| `src/dd/integration-schema.mjs` | Schema definitions |
| `docs/patterns/INTEGRATION_PATTERNS.md` | Pattern documentation |

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

