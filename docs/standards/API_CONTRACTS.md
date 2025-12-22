# API Contracts

> **Version 1.0** | Standard formats for all API responses, errors, and contracts.

---

## 🎯 Purpose

This document defines the standard contracts for:
- API response formats
- Error handling patterns
- Status codes
- Request/response types

All agents working on APIs must follow these contracts.

---

## 📦 Response Format

### Standard Success Response

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  };
}
```

**Example:**
```json
{
  "success": true,
  "data": {
    "token": "abc-def-123",
    "projectName": "my-saas-app"
  },
  "meta": {
    "timestamp": "2024-12-22T10:30:00Z"
  }
}
```

### Standard Error Response

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Machine-readable code
    message: string;        // Human-readable message
    details?: unknown;      // Additional context
    recovery?: string;      // How to fix it
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}
```

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "The project token has expired",
    "details": { "expiredAt": "2024-12-20T00:00:00Z" },
    "recovery": "Generate a new token from the configurator"
  },
  "meta": {
    "timestamp": "2024-12-22T10:30:00Z"
  }
}
```

---

## 🔢 Status Codes

### Success Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST that creates resource |
| `204` | No Content | Successful DELETE |

### Client Error Codes

| Code | Meaning | Error Code | Example |
|------|---------|------------|---------|
| `400` | Bad Request | `VALIDATION_ERROR` | Invalid input format |
| `401` | Unauthorized | `UNAUTHORIZED` | Missing or invalid auth |
| `403` | Forbidden | `FORBIDDEN` | Valid auth but not allowed |
| `404` | Not Found | `NOT_FOUND` | Resource doesn't exist |
| `409` | Conflict | `CONFLICT` | Resource already exists |
| `422` | Unprocessable | `INVALID_DATA` | Valid format but invalid data |
| `429` | Too Many Requests | `RATE_LIMITED` | Rate limit exceeded |

### Server Error Codes

| Code | Meaning | Error Code | When to Use |
|------|---------|------------|-------------|
| `500` | Internal Error | `INTERNAL_ERROR` | Unexpected server error |
| `502` | Bad Gateway | `UPSTREAM_ERROR` | External service failed |
| `503` | Unavailable | `SERVICE_UNAVAILABLE` | Temporarily down |

---

## 📝 Error Codes Reference

### Authentication Errors

| Code | Message | Recovery |
|------|---------|----------|
| `UNAUTHORIZED` | Authentication required | Provide valid API key |
| `TOKEN_INVALID` | Invalid token format | Check token format |
| `TOKEN_EXPIRED` | Token has expired | Generate new token |
| `TOKEN_NOT_FOUND` | Token does not exist | Verify token value |

### Validation Errors

| Code | Message | Recovery |
|------|---------|----------|
| `VALIDATION_ERROR` | Invalid request format | Check request body |
| `MISSING_FIELD` | Required field missing | Add missing field |
| `INVALID_FORMAT` | Field format invalid | Check field format |
| `INVALID_VALUE` | Field value invalid | Check allowed values |

### Resource Errors

| Code | Message | Recovery |
|------|---------|----------|
| `NOT_FOUND` | Resource not found | Check resource ID |
| `ALREADY_EXISTS` | Resource already exists | Use existing or rename |
| `CONFLICT` | Resource conflict | Resolve conflict |

### Rate Limiting

| Code | Message | Recovery |
|------|---------|----------|
| `RATE_LIMITED` | Too many requests | Wait and retry |

---

## 🛠️ Implementation Patterns

### API Route Handler (Next.js)

```typescript
// website/app/api/example/route.ts
import { NextRequest } from "next/server";

interface RequestBody {
  name: string;
  template: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request
    const body: RequestBody = await request.json();
    
    if (!body.name) {
      return Response.json({
        success: false,
        error: {
          code: "MISSING_FIELD",
          message: "Name is required",
          details: { field: "name" },
          recovery: "Provide a name field in the request body"
        }
      }, { status: 400 });
    }

    // 2. Process request
    const result = await processRequest(body);

    // 3. Return success response
    return Response.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    // 4. Handle unexpected errors
    console.error("API Error:", error);
    
    return Response.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        recovery: "Try again or contact support"
      }
    }, { status: 500 });
  }
}
```

### Error Helper Function

```typescript
// website/lib/api-errors.ts
export function apiError(
  code: string,
  message: string,
  status: number,
  details?: unknown,
  recovery?: string
) {
  return Response.json({
    success: false,
    error: { code, message, details, recovery },
    meta: { timestamp: new Date().toISOString() }
  }, { status });
}

// Usage:
return apiError(
  "TOKEN_EXPIRED",
  "The project token has expired",
  400,
  { expiredAt: token.expiresAt },
  "Generate a new token from the configurator"
);
```

---

## 📡 Endpoint Patterns

### Naming Convention

| Pattern | Example | Notes |
|---------|---------|-------|
| Resource collection | `/api/projects` | Plural nouns |
| Single resource | `/api/projects/[id]` | With ID param |
| Sub-resource | `/api/projects/[id]/integrations` | Nested |
| Action | `/api/projects/[id]/export` | Verb for actions |

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `GET` | Read | Get project details |
| `POST` | Create | Create new project |
| `PUT` | Replace | Replace entire project |
| `PATCH` | Update | Update specific fields |
| `DELETE` | Delete | Delete project |

---

## 📋 API Documentation Format

Every API endpoint must be documented with:

```markdown
## POST /api/projects/save

Create or update a project configuration.

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| template | string | Yes | Template ID |
| projectName | string | Yes | Name of project |
| integrations | object | No | Integration config |

### Success Response (201)
| Field | Type | Description |
|-------|------|-------------|
| token | string | Project access token |
| expiresAt | string | Token expiration date |

### Error Responses
| Code | Status | When |
|------|--------|------|
| VALIDATION_ERROR | 400 | Invalid input |
| TEMPLATE_NOT_FOUND | 404 | Unknown template |
```

---

## ✅ Checklist for New APIs

- [ ] Uses standard response format
- [ ] Returns appropriate status codes
- [ ] Includes error codes with recovery guidance
- [ ] Validates input before processing
- [ ] Handles unexpected errors gracefully
- [ ] Documented in this file or linked
- [ ] Has tests covering success and error cases

---

*Version 1.0 | All APIs must follow these contracts.*
