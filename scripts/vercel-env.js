const fs = require('fs');
const { execSync } = require('child_process');

try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const lines = envFile.split('\n');

    lines.forEach(line => {
        // Ignore comments and empty lines
        if (line.trim() && !line.startsWith('#')) {
            const splitIndex = line.indexOf('=');
            if (splitIndex > -1) {
                const key = line.substring(0, splitIndex).trim();
                let value = line.substring(splitIndex + 1).trim();

                // Remove surrounding quotes if they exist
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }

                if (key && value) {
                    console.log(`Setting ${key}...`);
                    try {
                        // Use echo to pipe the value into the vercel env add command
                        execSync(`echo "${value}" | vercel env add ${key} production`, { stdio: 'inherit' });
                        execSync(`echo "${value}" | vercel env add ${key} preview`, { stdio: 'inherit' });
                        execSync(`echo "${value}" | vercel env add ${key} development`, { stdio: 'inherit' });
                    } catch (err) {
                        console.error(`Error setting ${key}`);
                    }
                }
            }
        }
    });
    console.log("Finished importing env vars.");
} catch (err) {
    console.error("Error reading .env.local", err);
}
