const fs = require('fs');
const file = './src/routes/admin/auth/login/route.js';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  'const { email, password } = req.body;',
  "const { email, password } = req.body;\n    console.log('Login attempt via API:', req.body);"
);
fs.writeFileSync(file, code);
console.log('Done');
