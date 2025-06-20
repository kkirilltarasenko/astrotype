const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');

function fixImportsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/(from\s+['"])(\.[^'"]+?)(['"])/g, (match, p1, importPath, p3) => {
        const absPath = path.resolve(path.dirname(filePath), importPath);
        if (fs.existsSync(absPath + '.js')) {
            return `${p1}${importPath}.js${p3}`;
        } else if (fs.existsSync(path.join(absPath, 'index.js'))) {
            return `${p1}${importPath}/index.js${p3}`;
        } else {
            return match;
        }
    });
    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (file.endsWith('.js')) {
            fixImportsInFile(fullPath);
        }
    });
}

walkDir(DIST_DIR); 