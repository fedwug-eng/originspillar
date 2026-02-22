const cp = require('child_process');
const fs = require('fs');

// Read the sanitized .env.local
const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');

const envs = ['production', 'preview', 'development'];
let count = 0;

for (const line of lines) {
    const trimmed = line.trim();
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.substring(0, eqIndex).trim();
    let value = trimmed.substring(eqIndex + 1).trim();

    // Remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
    }

    // Strip any remaining \r
    value = value.replace(/\r/g, '');

    if (!key || !value) continue;

    for (const env of envs) {
        // Remove existing
        try {
            cp.execSync(`npx vercel env rm ${key} ${env} -y`, { stdio: 'pipe' });
        } catch (e) { }

        // Add clean value
        try {
            cp.execSync(`npx vercel env add ${key} ${env}`, { input: value, stdio: ['pipe', 'pipe', 'pipe'] });
            count++;
        } catch (e) {
            console.error(`Failed to add ${key} for ${env}: ${e.stderr?.toString().trim()}`);
        }
    }
    console.log(`✅ ${key} updated across all environments`);
}

console.log(`\nDone! Updated ${count} environment variable entries.`);
