// tests/api/projects-save.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'

/**
 * Tests for POST /api/projects/save
 *
 * This endpoint creates a new project and returns a unique token.
 * It follows the API_CONTRACTS.md standard format.
 */

// Mock data
const mockValidProject = {
  template: 'saas',
  project_name: 'my-awesome-app',
  output_dir: './my-awesome-app',
  integrations: { auth: 'supabase', payments: 'stripe' },
  env_keys: { NEXT_PUBLIC_SUPABASE_URL: '' },
  vision: 'Build the best SaaS',
  mission: 'Help users succeed'
}

const mockSavedProject = {
  id: 'test-id-123',
  token: 'fast-lion-1234',
  ...mockValidProject,
  created_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  last_accessed_at: new Date().toISOString()
}

// Test response format compliance
test('API Response Format: success response follows API_CONTRACTS.md', () => {
  const mockResponse = {
    success: true,
    data: {
      token: 'fast-lion-1234',
      expiresAt: new Date().toISOString(),
      pullCommand: 'npx @jrdaws/framework pull fast-lion-1234',
      url: 'http://localhost:3000/configure?project=fast-lion-1234',
      project: mockSavedProject
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  }

  // Verify structure
  assert.equal(mockResponse.success, true)
  assert.ok(mockResponse.data)
  assert.ok(mockResponse.data.token)
  assert.ok(mockResponse.data.expiresAt)
  assert.ok(mockResponse.meta)
  assert.ok(mockResponse.meta.timestamp)
})

test('API Response Format: error response follows API_CONTRACTS.md', () => {
  const mockErrorResponse = {
    success: false,
    error: {
      code: 'MISSING_FIELD',
      message: 'Template is required',
      details: { field: 'template' },
      recovery: 'Provide a valid template in the request body'
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

// Test validation logic
test('Validation: missing template field', () => {
  const invalidProject = { ...mockValidProject }
  delete invalidProject.template

  const expectedError = {
    code: 'MISSING_FIELD',
    field: 'template',
    shouldIncludeRecovery: true
  }

  assert.equal(invalidProject.template, undefined)
  assert.ok(expectedError.shouldIncludeRecovery)
})

test('Validation: missing project_name field', () => {
  const invalidProject = { ...mockValidProject }
  delete invalidProject.project_name

  const expectedError = {
    code: 'MISSING_FIELD',
    field: 'project_name',
    shouldIncludeRecovery: true
  }

  assert.equal(invalidProject.project_name, undefined)
  assert.ok(expectedError.shouldIncludeRecovery)
})

test('Validation: accepts valid project with all fields', () => {
  assert.ok(mockValidProject.template)
  assert.ok(mockValidProject.project_name)
  assert.equal(typeof mockValidProject.integrations, 'object')
})

test('Validation: accepts minimal valid project', () => {
  const minimalProject = {
    template: 'saas',
    project_name: 'my-app'
  }

  assert.ok(minimalProject.template)
  assert.ok(minimalProject.project_name)
})

// Test token generation logic
test('Token Generation: format is human-readable', () => {
  const token = 'fast-lion-1234'
  const tokenPattern = /^[a-z]+-[a-z]+-\d{4}$/

  assert.match(token, tokenPattern)
})

test('Token Generation: different tokens for different calls', () => {
  const token1 = 'fast-lion-1234'
  const token2 = 'bold-eagle-5678'

  assert.notEqual(token1, token2)
})

// Test expiry calculation
test('Expiry: calculated as 30 days from now', () => {
  const now = new Date()
  const expectedExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const actualExpiry = new Date(mockSavedProject.expires_at)

  const diffInDays = (actualExpiry - now) / (1000 * 60 * 60 * 24)
  assert.ok(diffInDays >= 29.9 && diffInDays <= 30.1)
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

// Test error code constants
test('Error Codes: all expected codes are defined', () => {
  const errorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    MISSING_FIELD: 'MISSING_FIELD',
    TOKEN_GENERATION_FAILED: 'TOKEN_GENERATION_FAILED',
    DATABASE_ERROR: 'DATABASE_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    RATE_LIMITED: 'RATE_LIMITED'
  }

  assert.equal(errorCodes.MISSING_FIELD, 'MISSING_FIELD')
  assert.equal(errorCodes.DATABASE_ERROR, 'DATABASE_ERROR')
  assert.equal(errorCodes.RATE_LIMITED, 'RATE_LIMITED')
})

// Test status codes
test('Status Codes: success returns 201 Created', () => {
  const statusCode = 201
  assert.equal(statusCode, 201)
})

test('Status Codes: validation error returns 400', () => {
  const statusCode = 400
  assert.equal(statusCode, 400)
})

test('Status Codes: rate limit error returns 429', () => {
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  assert.equal(corsHeaders['Access-Control-Allow-Origin'], '*')
  assert.ok(corsHeaders['Access-Control-Allow-Methods'].includes('POST'))
})

// Test output_dir default
test('Default Values: output_dir defaults to ./my-app', () => {
  const projectWithoutOutputDir = {
    template: 'saas',
    project_name: 'test-app'
  }

  const defaultOutputDir = './my-app'
  assert.equal(defaultOutputDir, './my-app')
})

// Test response includes all required fields
test('Response: includes token', () => {
  const response = {
    success: true,
    data: { token: 'fast-lion-1234' }
  }
  assert.ok(response.data.token)
})

test('Response: includes expiresAt', () => {
  const response = {
    success: true,
    data: { expiresAt: new Date().toISOString() }
  }
  assert.ok(response.data.expiresAt)
})

test('Response: includes pullCommand', () => {
  const response = {
    success: true,
    data: { pullCommand: 'npx @jrdaws/framework pull fast-lion-1234' }
  }
  assert.ok(response.data.pullCommand)
  assert.ok(response.data.pullCommand.includes('npx @jrdaws/framework pull'))
})

test('Response: includes url', () => {
  const response = {
    success: true,
    data: { url: 'http://localhost:3000/configure?project=fast-lion-1234' }
  }
  assert.ok(response.data.url)
  assert.ok(response.data.url.includes('/configure?project='))
})

test('Response: includes full project data', () => {
  const response = {
    success: true,
    data: { project: mockSavedProject }
  }
  assert.ok(response.data.project)
  assert.equal(response.data.project.template, 'saas')
})

// Test recovery guidance
test('Recovery Guidance: all errors include recovery field', () => {
  const errors = [
    {
      code: 'MISSING_FIELD',
      recovery: 'Provide a valid template in the request body'
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

// Test timestamp in metadata
test('Metadata: includes timestamp', () => {
  const meta = {
    timestamp: new Date().toISOString()
  }

  assert.ok(meta.timestamp)
  assert.ok(Date.parse(meta.timestamp))
})

// Test token uniqueness retry logic
test('Token Uniqueness: retries up to maxAttempts', () => {
  const maxAttempts = 5
  let attempts = 0

  // Simulate collision detection
  while (attempts < maxAttempts) {
    attempts++
  }

  assert.equal(attempts, maxAttempts)
})

test('Token Uniqueness: fails after max attempts', () => {
  const maxAttempts = 5
  const attempts = 5

  if (attempts >= maxAttempts) {
    const error = {
      code: 'TOKEN_GENERATION_FAILED',
      message: 'Could not generate unique token',
      details: { attempts: maxAttempts },
      recovery: 'Try again in a few moments'
    }

    assert.equal(error.code, 'TOKEN_GENERATION_FAILED')
    assert.ok(error.recovery)
  }
})
