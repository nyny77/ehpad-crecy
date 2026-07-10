const fs = require('fs');
const content = fs.readFileSync('src/lib/services-data.ts', 'utf8');
const regex = /id:\s*['"]([^'"]+)['"]/g;
let match;
const ids = [];
while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
}
fs.writeFileSync('ids.txt', ids.join('\n'));
