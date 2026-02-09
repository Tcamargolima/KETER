/**
 * Utility functions for KETER app
 */

/**
 * Validates if a string is a valid UUID v4
 * @param {string} uuid - The string to validate
 * @returns {boolean} - True if valid UUID, false otherwise
 */
export function isValidUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Gets current user ID from session
 * @param {object} session - Supabase session object
 * @returns {string|null} - User ID if valid, null otherwise
 */
export function getUserIdFromSession(session) {
  const userId = session?.user?.id;
  
  if (!userId) {
    console.warn('No user ID found in session');
    return null;
  }
  
  if (!isValidUUID(userId)) {
    console.error('Invalid UUID format for user ID:', userId);
    return null;
  }
  
  return userId;
}
