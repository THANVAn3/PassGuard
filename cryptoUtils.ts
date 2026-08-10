/**
 * Hashes a string using standard SHA-256 (Web Crypto API)
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Creates a safe masked string for UI preview (e.g., "P***d" or "P***123")
 */
export function maskPassword(password: string): string {
  if (!password) return '';
  if (password.length <= 2) return '*'.repeat(password.length);
  const first = password[0];
  const last = password[password.length - 1];
  const middleLen = Math.min(password.length - 2, 6);
  return `${first}${'*'.repeat(middleLen)}${last}`;
}
