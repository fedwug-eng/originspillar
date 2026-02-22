const cp = require('child_process');

const key = 'CLERK_WEBHOOK_SECRET';
const value = 'whsec_e8ZIvrIfQ8/c7uICihNquDf/GGmDl0dW';
const envs = ['production', 'preview', 'development'];

for (const env of envs) {
    try { cp.execSync(`npx vercel env rm ${key} ${env} -y`, { stdio: 'pipe' }); } catch (e) { }
    try {
        cp.execSync(`npx vercel env add ${key} ${env}`, { input: value, stdio: ['pipe', 'pipe', 'pipe'] });
        console.log(`✅ ${key} set for ${env}`);
    } catch (e) { console.error(`Failed for ${env}`); }
}
console.log('Done!');
