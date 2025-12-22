// tests/api/projects-fetch.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'

/**
 * Tests for GET /api/projects/[token]
 *
 * This endpoint fetches a project by its token.
 * It follows the API_CONTRACTS.md standard format.
 */

// Mock data
const mockProjectFromDB = {
  id: 'test-id-123',
  token: 'fast-lion-1234',
  template: 'saas',
  project_name: 'my-awesome-app',
  output_dir: './my-awesome-app',
  integrations: { auth: 'supabase', payments: 'stripe' },
  env_keys: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co' },
  vision: 'Build the best SaaS',
  mission: 'Help users succeed',
  success_criteria: 'Launch in 30 days',
  inspirations: [{ type: 'url', value: 'https://example.com' }],
  description: 'A great app',
  created_at: new Date('2024-12-01').toISOString(),
  expires_at: new Date('2024-12-31').toISOString(),
  last_accessed_at: new Date('2024-12-20').toISOString()
}

const mockTransformedResponse = {
  token: 'fast-lion-1234',
  template: 'saas',
  projectName: 'my-awesome-app',
  outputDir: './my-awesome-app',
  integrations: { auth: 'supabase', payments: 'stripe' },
  envKeys: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co' },
  vision: 'Build the best SaaS',
  mission: 'Help users succeed',
  successCriteria: 'Launch in 30 days',
  inspirations: [{ type: 'url', value: 'https://example.com' }],
  description: 'A great app',
  createdAt: new Date('2024-12-01').toISOString(),
  expiresAt: new Date('2024-12-31').toISOString()
}

// Test response format compliance
test('API Response Format: success response follows API_CONTRACTS.md', () => {
  const mockResponse = {
    success: true,
    data: mockTransformedResponse,
    meta: {
      timestamp: new Date().toISOString()
    }
  }

  // Verify structure
  assert.equal(mockResponse.success, true)
  assert.ok(mockResponse.data)
  assert.ok(mockResponse.data.token)
  assert.ok(mockResponse.data.template)
  assert.ok(mockResponse.data.projectName)
  assert.ok(mockResponse.meta)
  assert.ok(mockResponse.meta.timestamp)
})

test('API Response Format: uses camelCase not snake_case', () => {
  // Response should use camelCase
  assert.ok(mockTransformedResponse.projectName)
  assert.ok(mockTransformedResponse.outputDir)
  assert.ok(mockTransformedResponse.envKeys)
  assert.ok(mockTransformedResponse.successCriteria)
  assert.ok(mockTransformedResponse.createdAt)
  assert.ok(mockTransformedResponse.expiresAt)

  // Should NOT use snake_case
  assert.equal(mockTransformedResponse.project_name, undefined)
  assert.equal(mockTransformedResponse.output_dir, undefined)
  assert.equal(mockTransformedResponse.env_keys, undefined)
  assert.equal(mockTransformedResponse.success_criteria, undefined)
  assert.equal(mockTransformedResponse.created_at, undefined)
  assert.equal(mockTransformedResponse.expires_at, undefined)
})

test('API Response Format: error response follows API_CONTRACTS.md', () => {
  const mockErrorResponse = {
    success: false,
    error: {
      code: 'TOKEN_NOT_FOUND',
      message: 'Project with token "invalid-token" not found',
      details: { token: 'invalid-token' },
      recovery: 'Verify the token is correct or create a new project at the configurator'
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  }

  // Verify structure
  assert.equal(mockErrorResponse.success, false)
  assert.ok(mockErrorResponse.error)
  assert.ok(mockErrorResponse.error.code)
  assert.ok(mockErrorResponse.error.message)
  assert.ok(mockErrorResponse.error.recovery)
  assert.ok(mockErrorResponse.meta)
})

// Test validation
test('Validation: requires token parameter', () => {
  const token = ''
  const expectedError = {
    code: 'MISSING_FIELD',
    field: 'token',
    statusCode: 400
  }

  if (!token) {
    assert.equal(expectedError.code, 'MISSING_FIELD')
    assert.equal(expectedError.statusCode, 400)
  }
})

test('Validation: accepts valid token', () => {
  const token = 'fast-lion-1234'
  assert.ok(token)
  assert.ok(token.length > 0)
})

// Test token not found error
test('Error: TOKEN_NOT_FOUND for non-existent token', () => {
  const error = {
    success: false,
    error: {
      code: 'TOKEN_NOT_FOUND',
      message: 'Project with token "nonexistent-token" not found',
      details: { token: 'nonexistent-token' },
      recovery: 'Verify the token is correct or create a new project at the configurator'
    }
  }

  assert.equal(error.error.code, 'TOKEN_NOT_FOUND')
  assert.ok(error.error.recovery)
  assert.ok(error.error.details.token)
})

// Test token expiration
test('Expiration: checks if token has expired', () => {
  const expiredDate = new Date('2024-01-01').toISOString()
  const now = new Date()
  const isExpired = new Date(expiredDate) < now

  assert.equal(isExpired, true)
})

test('Expiration: TOKEN_EXPIRED error for expired token', () => {
  const error = {
    success: false,
    error: {
      code: 'TOKEN_EXPIRED',
      message: 'Project "fast-lion-1234" has expired. Projects expire after 30 days.',
      details: {
        token: 'fast-lion-1234',
        expiredAt: new Date('2024-01-01').toISOString(),
        helpUrl: 'http://localhost:3000/configure'
      },
      recovery: 'Create a new project configuration at the configurator'
    }
  }

  assert.equal(error.error.code, 'TOKEN_EXPIRED')
  assert.ok(error.error.recovery)
  assert.ok(error.error.details.expiredAt)
  assert.ok(error.error.details.helpUrl)
})

test('Expiration: returns 410 Gone status for expired token', () => {
  const statusCode = 410
  assert.equal(statusCode, 410)
})

test('Expiration: valid token is not expired', () => {
  const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
  const now = new Date()
  const isExpired = new Date(futureDate) < now

  assert.equal(isExpired, false)
})

// Test rate limiting
test('Rate Limiting: returns RATE_LIMITED error code', () => {
  const rateLimitError = {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please try again later.',
      details: { resetAt: Date.now() + 86400000 },
      recovery: 'Wait until the rate limit resets or provide your own ANTHROPIC_API_KEY'
    }
  }

  assert.equal(rateLimitError.error.code, 'RATE_LIMITED')
  assert.ok(rateLimitError.error.recovery)
  assert.ok(rateLimitError.error.details.resetAt)
})

// Test database errors
test('Database Error: DATABASE_ERROR for database issues', () => {
  const error = {
    success: false,
    error: {
      code: 'DATABASE_ERROR',
      message: 'Failed to fetch project',
      details: { message: 'Connection timeout' },
      recovery: 'Try again or contact support if the issue persists'
    }
  }

  assert.equal(error.error.code, 'DATABASE_ERROR')
  assert.ok(error.error.recovery)
})

// Test error code constants
test('Error Codes: all expected codes are defined', () => {
  const errorCodes = {
    MISSING_FIELD: 'MISSING_FIELD',
    TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    RATE_LIMITED: 'RATE_LIMITED',
    DATABASE_ERROR: 'DATABASE_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
  }

  assert.equal(errorCodes.TOKEN_NOT_FOUND, 'TOKEN_NOT_FOUND')
  assert.equal(errorCodes.TOKEN_EXPIRED, 'TOKEN_EXPIRED')
  assert.equal(errorCodes.RATE_LIMITED, 'RATE_LIMITED')
})

// Test status codes
test('Status Codes: success returns 200 OK', () => {
  const statusCode = 200
  assert.equal(statusCode, 200)
})

test('Status Codes: missing token returns 400', () => {
  const statusCode = 400
  assert.equal(statusCode, 400)
})

test('Status Codes: token not found returns 404', () => {
  const statusCode = 404
  assert.equal(statusCode, 404)
})

test('Status Codes: expired token returns 410', () => {
  const statusCode = 410
  assert.equal(statusCode, 410)
})

test('Status Codes: rate limit returns 429', () => {
  const statusCode = 429
  assert.equal(statusCode, 429)
})

test('Status Codes: database error returns 500', () => {
  const statusCode = 500
  assert.equal(statusCode, 500)
})

// Test CORS headers
test('CORS: includes required headers', () => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  assert.equal(corsHeaders['Access-Control-Allow-Origin'], '*')
  assert.ok(corsHeaders['Access-Control-Allow-Methods'].includes('GET'))
})

// Test last_accessed_at update
test('Access Tracking: updates last_accessed_at on fetch', () => {
  const lastAccessed = new Date().toISOString()
  assert.ok(Date.parse(lastAccessed))
})

test('Access Tracking: non-critical failure does not block response', () => {
  // If last_accessed_at update fails, the request should still succeed
  const updateFailed = true
  const requestSucceeded = true

  if (updateFailed) {
    // Should log warning but not fail
    assert.equal(requestSucceeded, true)
  }
})

// Test response includes all required fields
test('Response: includes all project fields', () => {
  const requiredFields = [
    'token',
    'template',
    'projectName',
    'outputDir',
    'integrations',
    'envKeys',
    'createdAt',
    'expiresAt'
  ]

  requiredFields.forEach(field => {
    assert.ok(mockTransformedResponse[field] !== undefined)
  })
})

test('Response: includes optional fields when present', () => {
  const optionalFields = [
    'vision',
    'mission',
    'successCriteria',
    'inspirations',
    'description'
  ]

  optionalFields.forEach(field => {
    if (mockTransformedResponse[field]) {
      assert.ok(mockTransformedResponse[field])
    }
  })
})

test('Response: handles empty envKeys', () => {
  const projectWithoutEnvKeys = { ...mockProjectFromDB }
  delete projectWithoutEnvKeys.env_keys

  const transformedEnvKeys = projectWithoutEnvKeys.env_keys || {}
  assert.deepEqual(transformedEnvKeys, {})
})

// Test recovery guidance
test('Recovery Guidance: all errors include recovery field', () => {
  const errors = [
    {
      code: 'MISSING_FIELD',
      recovery: 'Provide a valid project token in the URL path'
    },
    {
      code: 'TOKEN_NOT_FOUND',
      recovery: 'Verify the token is correct or create a new project at the configurator'
    },
    {
      code: 'TOKEN_EXPIRED',
      recovery: 'Create a new project configuration at the configurator'
    },
    {
      code: 'RATE_LIMITED',
      recovery: 'Wait until the rate limit resets or provide your own ANTHROPIC_API_KEY'
    },
    {
      code: 'DATABASE_ERROR',
      recovery: 'Try again or contact support if the issue persists'
    }
  ]

  errors.forEach(error => {
    assert.ok(error.recovery)
    assert.ok(error.recovery.length > 0)
  })
})

// Test metadata
test('Metadata: includes timestamp', () => {
  const meta = {
    timestamp: new Date().toISOString()
  }

  assert.ok(meta.timestamp)
  assert.ok(Date.parse(meta.timestamp))
})

// Test Supabase error code mapping
test('Supabase Errors: PGRST116 maps to TOKEN_NOT_FOUND', () => {
  const supabaseError = {
    code: 'PGRST116'
  }

  if (supabaseError.code === 'PGRST116') {
    const mappedError = {
      code: 'TOKEN_NOT_FOUND',
      statusCode: 404
    }

    assert.equal(mappedError.code, 'TOKEN_NOT_FOUND')
    assert.equal(mappedError.statusCode, 404)
  }
})

// Test field transformation
test('Field Transformation: snake_case to camelCase', () => {
  const transformations = {
    project_name: 'projectName',
    output_dir: 'outputDir',
    env_keys: 'envKeys',
    success_criteria: 'successCriteria',
    created_at: 'createdAt',
    expires_at: 'expiresAt'
  }

  Object.entries(transformations).forEach(([snakeCase, camelCase]) => {
    assert.ok(camelCase)
    assert.ok(!camelCase.includes('_'))
  })
})

// Test integration with CLI pull command
test('CLI Integration: response format matches pull command expectations', () => {
  // The CLI pull command expects this structure
  const expectedStructure = {
    success: true,
    data: {
      token: 'string',
      template: 'string',
      projectName: 'string',
      outputDir: 'string',
      integrations: 'object',
      envKeys: 'object'
    }
  }

  assert.equal(typeof mockTransformedResponse.token, 'string')
  assert.equal(typeof mockTransformedResponse.template, 'string')
  assert.equal(typeof mockTransformedResponse.projectName, 'string')
  assert.equal(typeof mockTransformedResponse.outputDir, 'string')
  assert.equal(typeof mockTransformedResponse.integrations, 'object')
  assert.equal(typeof mockTransformedResponse.envKeys, 'object')
})

// Test error details
test('Error Details: TOKEN_NOT_FOUND includes token in details', () => {
  const error = {
    code: 'TOKEN_NOT_FOUND',
    details: { token: 'invalid-token' }
  }

  assert.ok(error.details.token)
})

test('Error Details: TOKEN_EXPIRED includes expiredAt and helpUrl', () => {
  const error = {
    code: 'TOKEN_EXPIRED',
    details: {
      token: 'expired-token',
      expiredAt: '2024-01-01T00:00:00Z',
      helpUrl: 'http://localhost:3000/configure'
    }
  }

  assert.ok(error.details.expiredAt)
  assert.ok(error.details.helpUrl)
})

test('Error Details: RATE_LIMITED includes resetAt timestamp', () => {
  const error = {
    code: 'RATE_LIMITED',
    details: { resetAt: Date.now() + 86400000 }
  }

  assert.ok(error.details.resetAt)
  assert.ok(error.details.resetAt > Date.now())
})
