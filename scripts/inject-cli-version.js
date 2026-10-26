const fs = require('fs');
const path = require('path');
const https = require('https');

const INSTALL_SCRIPT_PATH = path.join(__dirname, '../dist/marketing/browser/install.sh');
const PROJECT_API = 'https://gitlab.com/api/v4/projects/glitchtip%2Fglitchtip-cli';

function fetchLatestTag() {
    return new Promise((resolve, reject) => {
        https.get(`${PROJECT_API}/releases`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`Failed to fetch releases: HTTP ${res.statusCode}`));
                }
                try {
                    const releases = JSON.parse(data);
                    if (releases && releases.length > 0) {
                        resolve(releases[0].tag_name);
                    } else {
                        reject(new Error('No releases found'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    try {
        console.log('Fetching latest GlitchTip CLI release tag...');
        const latestTag = await fetchLatestTag();
        console.log(`Latest tag found: ${latestTag}`);

        if (fs.existsSync(INSTALL_SCRIPT_PATH)) {
            let scriptContent = fs.readFileSync(INSTALL_SCRIPT_PATH, 'utf8');
            scriptContent = scriptContent.replace('LATEST_TAG="__GLITCHTIP_CLI_VERSION__"', `LATEST_TAG="${latestTag}"`);
            fs.writeFileSync(INSTALL_SCRIPT_PATH, scriptContent);
            console.log(`Successfully injected version ${latestTag} into install.sh`);
        } else {
            console.warn(`Warning: install.sh not found at ${INSTALL_SCRIPT_PATH}`);
        }
    } catch (error) {
        console.error('Error injecting CLI version:', error.message);
        process.exit(1);
    }
}

main();
