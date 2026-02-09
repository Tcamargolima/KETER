// ================================================
// TEST: Utility Functions
// ================================================
// Tests for UUID validation and session utilities

import { describe, it, expect } from 'vitest';
import { isValidUUID, getUserIdFromSession } from '../lib/utils';

describe('UUID Validation', () => {
  
  describe('isValidUUID', () => {
    it('should validate correct UUID v4', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidUUID(validUUID)).toBe(true);
    });

    it('should validate correct UUID v1', () => {
      const validUUIDv1 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      expect(isValidUUID(validUUIDv1)).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      const invalidUUID = 'demo-user';
      expect(isValidUUID(invalidUUID)).toBe(false);
    });

    it('should reject malformed UUID', () => {
      const malformedUUID = '550e8400-e29b-41d4-a716';
      expect(isValidUUID(malformedUUID)).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidUUID('')).toBe(false);
    });

    it('should reject null', () => {
      expect(isValidUUID(null)).toBe(false);
    });

    it('should reject undefined', () => {
      expect(isValidUUID(undefined)).toBe(false);
    });

    it('should reject non-string types', () => {
      expect(isValidUUID(123)).toBe(false);
      expect(isValidUUID({})).toBe(false);
      expect(isValidUUID([])).toBe(false);
    });

    it('should be case insensitive', () => {
      const upperCaseUUID = '550E8400-E29B-41D4-A716-446655440000';
      const lowerCaseUUID = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidUUID(upperCaseUUID)).toBe(true);
      expect(isValidUUID(lowerCaseUUID)).toBe(true);
    });
  });

  describe('getUserIdFromSession', () => {
    it('should extract valid user ID from session', () => {
      const mockSession = {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'user@example.com'
        }
      };
      
      const userId = getUserIdFromSession(mockSession);
      expect(userId).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should return null for null session', () => {
      const userId = getUserIdFromSession(null);
      expect(userId).toBe(null);
    });

    it('should return null for session without user', () => {
      const mockSession = {};
      const userId = getUserIdFromSession(mockSession);
      expect(userId).toBe(null);
    });

    it('should return null for session with invalid UUID', () => {
      const mockSession = {
        user: {
          id: 'demo-user',
          email: 'user@example.com'
        }
      };
      
      const userId = getUserIdFromSession(mockSession);
      expect(userId).toBe(null);
    });

    it('should return null for session with missing id', () => {
      const mockSession = {
        user: {
          email: 'user@example.com'
        }
      };
      
      const userId = getUserIdFromSession(mockSession);
      expect(userId).toBe(null);
    });
  });
});

// ================================================
// INTEGRATION TEST SCENARIOS
// ================================================

describe('Integration Scenarios: User Authentication', () => {
  
  it('Scenario 1: Valid authenticated user', () => {
    // Given: User has a valid Supabase session
    const session = {
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'john@example.com',
        created_at: '2024-01-01T00:00:00Z'
      },
      access_token: 'mock-token'
    };

    // When: Getting userId from session
    const userId = getUserIdFromSession(session);

    // Then: Should return valid UUID
    expect(userId).toBeTruthy();
    expect(isValidUUID(userId)).toBe(true);
  });

  it('Scenario 2: User not authenticated (no session)', () => {
    // Given: No active session
    const session = null;

    // When: Attempting to get userId
    const userId = getUserIdFromSession(session);

    // Then: Should return null
    expect(userId).toBe(null);
  });

  it('Scenario 3: Legacy demo-user should be rejected', () => {
    // Given: Old hardcoded demo-user ID
    const legacyUserId = 'demo-user';

    // When: Validating UUID
    const isValid = isValidUUID(legacyUserId);

    // Then: Should be rejected as invalid
    expect(isValid).toBe(false);
  });

  it('Scenario 4: Database query protection', () => {
    // Given: A malicious or invalid user ID
    const maliciousId = "'; DROP TABLE keteros; --";

    // When: Validating before database query
    const isValid = isValidUUID(maliciousId);

    // Then: Should reject and prevent SQL injection
    expect(isValid).toBe(false);
  });

  it('Scenario 5: Multiple UUID versions supported', () => {
    // Given: Different UUID versions from various sources
    const uuidV1 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    const uuidV4 = '550e8400-e29b-41d4-a716-446655440000';
    const uuidV5 = '886313e1-3b8a-5372-9b90-0c9aee199e5d';

    // When: Validating each
    const v1Valid = isValidUUID(uuidV1);
    const v4Valid = isValidUUID(uuidV4);
    const v5Valid = isValidUUID(uuidV5);

    // Then: All should be valid
    expect(v1Valid).toBe(true);
    expect(v4Valid).toBe(true);
    expect(v5Valid).toBe(true);
  });
});

// ================================================
// MANUAL TEST GUIDE
// ================================================

/*
MANUAL TESTING CHECKLIST:

1. Setup:
   □ Ensure Supabase authentication is configured
   □ Create test user account(s)
   □ Check browser console is open

2. Test Authentication Flow:
   □ Start app without authentication
   □ Verify "Autenticação Necessária" screen appears
   □ Log in with valid credentials
   □ Verify app loads with valid userId
   □ Check console for no UUID validation errors

3. Test UUID Validation:
   □ Check browser console during app load
   □ Verify no "UUID inválido" errors
   □ All hooks should receive valid UUID
   □ Database queries should succeed

4. Test Session Persistence:
   □ Log in and close browser
   □ Reopen browser and go to app
   □ Verify user remains logged in
   □ Check userId is still valid

5. Test Error Handling:
   □ Manually edit localStorage to set invalid session
   □ Reload app
   □ Verify error messages appear
   □ App should show auth required screen

6. Test Across Features:
   □ Create a practice entry
   □ Submit a night reflection
   □ Complete a micro-act
   □ Check all use real UUID, not 'demo-user'

EXPECTED RESULTS:
✓ No 'demo-user' string anywhere in app
✓ All database queries use valid UUIDs
✓ Proper error messages for invalid UUIDs
✓ No Supabase 400 errors
✓ Authentication required screen when not logged in
✓ Smooth user experience when authenticated

SUPABASE ERROR TO WATCH FOR (Should NOT appear):
✗ "invalid input syntax for type uuid: 'demo-user'"
✓ This error should never appear with these changes
*/
