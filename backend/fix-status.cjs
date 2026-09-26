const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('d:\\Web Devlopment Projects\\atms\\backend\\src\\routes', (filePath) => {
    if (!filePath.endsWith('.js')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace res.status(500).json(data/trader/settings/customer/product/provider)
    content = content.replace(/res\.status\(500\)\.json\((data|trader|settings|customer|product|provider|updatedAdmin)\)/g, 'res.status(200).json($1)');
    
    // Replace res.status(500).json({ message: ... })
    content = content.replace(/res\.status\(500\)\.json\(\{\s*message:/g, 'res.status(200).json({ message:');
    
    // Replace res.status(401).json(data/etc) just in case (like we saw in profile)
    content = content.replace(/res\.status\(401\)\.json\((data|trader|settings|customer|product|provider|admin)\)/g, 'res.status(200).json($1)');

    // In user/sales, user/purchases, etc there might be res.status(500).json(sale) etc?
    content = content.replace(/res\.status\(500\)\.json\((sale|purchase)\)/g, 'res.status(200).json($1)');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed', filePath);
    }
});
