const fs = require('fs');
const path = './src/lib/services-data.ts';
let content = fs.readFileSync(path, 'utf8');

const order = [
    'direction',
    'hotelier',
    'animation',
    'psychologue',
    'technique',
    'rh',
    'lingerie',
    'admin',
    'cuisine',
    'idec',
    'soignants',
    'infirmiere',
    'bienetre',
    'kine',
    'medecins',
    'benevoles'
];

const startStr = 'export const SERVICES_EXTENDED = ';
const startIdx = content.indexOf(startStr);
const endIdx = content.lastIndexOf('];') + 2;

const before = content.substring(0, startIdx);
const arrayContentStr = content.substring(startIdx + startStr.length, endIdx);
const after = content.substring(endIdx);

const objects = [];
let currentObj = '';
let depth = 0;

for (let i = 0; i < arrayContentStr.length; i++) {
    const char = arrayContentStr[i];
    if (char === '{') depth++;
    if (depth > 0) currentObj += char;
    if (char === '}') {
        depth--;
        if (depth === 0) {
            objects.push(currentObj);
            currentObj = '';
        }
    }
}

const map = {};
objects.forEach(obj => {
    const idMatch = obj.match(/id:\s*"([^"]+)"/);
    if (idMatch) {
        map[idMatch[1]] = obj;
    }
});

const newArrayContent = '[\n    ' + order.map(id => map[id]).join(',\n    ') + '\n]';

fs.writeFileSync(path, before + startStr + newArrayContent + ';' + after);
console.log('Successfully reordered!');
