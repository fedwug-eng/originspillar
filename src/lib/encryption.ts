import { createCipheriv, createDecipheriv, randomBytes, createHash, scryptSync, timingSafeEqual } from 'crypto'

/**
 * Secure encryption utilities for API keys
 * Uses AES-256-GCM (Authenticated Encryption)
 */

// Derive a 32-byte key from the environment variable or fallback
// We use SHA-256 to ensure the key is exactly 32 bytes regardless of input length
function getEncryptionKey(): Buffer {
    const secret = process.env.ENCRYPTION_KEY || 'apiforge-secret-key-change-in-prod-DoNotUse'
    return createHash('sha256').update(secret).digest()
}

/**
 * Hash an API key using SHA-256
 * Returns format: hash (hex encoded)
 */
export function hashApiKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex')
}

/**
 * Verify an API key against a stored hash
 * Supports both legacy scrypt (salt:hash) and new SHA-256 formats
 * Uses timingSafeEqual to prevent cryptographic timing attacks
 */
export function verifyApiKey(apiKey: string, storedHash: string): boolean {
    if (storedHash.includes(':')) {
        // Legacy scrypt format
        const [salt, hash] = storedHash.split(':')
        const derivedHash = scryptSync(apiKey, salt, 64).toString('hex')

        // Convert to buffers of matching length for timingSafeEqual
        const bufferHash = Buffer.from(hash, 'hex')
        const bufferDerived = Buffer.from(derivedHash, 'hex')

        if (bufferHash.length !== bufferDerived.length) return false;
        return timingSafeEqual(bufferHash, bufferDerived)
    }

    // Fast SHA-256 format
    const derivedHash = createHash('sha256').update(apiKey).digest('hex')

    // Convert to buffers of matching length for timingSafeEqual
    const bufferStored = Buffer.from(storedHash, 'hex')
    const bufferDerived = Buffer.from(derivedHash, 'hex')

    if (bufferStored.length !== bufferDerived.length) return false;
    return timingSafeEqual(bufferStored, bufferDerived)
}

/**
 * Get the prefix of an API key for database lookup
 */
export function getKeyPrefix(apiKey: string): string {
    return apiKey.substring(0, 10) // "af_abc123xx" format
}

/**
 * Encrypt text using AES-256-GCM
 * Returns format: iv:authTag:encryptedContent (hex encoded)
 */
export function encrypt(text: string): string {
    try {
        const key = getEncryptionKey()
        const iv = randomBytes(12) // GCM standard IV size is 12 bytes
        const cipher = createCipheriv('aes-256-gcm', key, iv)

        let encrypted = cipher.update(text, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        const authTag = cipher.getAuthTag().toString('hex')

        // Return all components needed for decryption
        return `${iv.toString('hex')}:${authTag}:${encrypted}`
    } catch (error) {
        console.error('Encryption failed:', error)
        throw new Error('Failed to encrypt data')
    }
}

/**
 * Decrypt text using AES-256-GCM
 * Expects format: iv:authTag:encryptedContent (hex encoded)
 */
export function decrypt(encryptedText: string): string {
    try {
        const parts = encryptedText.split(':')
        if (parts.length !== 3) {
            // Fallback for legacy/malformed data: attempt to return as-is or throw
            throw new Error('Invalid encrypted format')
        }

        const [ivHex, authTagHex, contentHex] = parts

        const key = getEncryptionKey()
        const iv = Buffer.from(ivHex, 'hex')
        const authTag = Buffer.from(authTagHex, 'hex')
        const decipher = createDecipheriv('aes-256-gcm', key, iv)

        decipher.setAuthTag(authTag)

        let decrypted = decipher.update(contentHex, 'hex', 'utf8')
        decrypted += decipher.final('utf8')

        return decrypted
    } catch (error) {
        console.error('Decryption failed:', error)
        throw new Error('Failed to decrypt data')
    }
}

/**
 * Generate a random API key with prefix
 */
export function generateApiKey(prefix: string = 'af'): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let key = prefix + '_'
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return key
}

/**
 * Generate a unique slug from name
 */
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
        '-' + Math.random().toString(36).substring(2, 8)
}
