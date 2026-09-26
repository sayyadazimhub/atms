import fs from 'fs';

let content = fs.readFileSync('src/routes/admin/traders/route.js', 'utf8');

const importStr = "import { uploadToCloudinary } from '../../../lib/cloudinary.js';";
content = content.replace(importStr, importStr + "\nimport Busboy from 'busboy';\n");

const postStart = "export async function POST(req, res) {";
const putStart = "export async function PUT(req, res) {";

const postCode = fs.readFileSync('src/routes/admin/traders/post-replacement.js', 'utf8');

const pre = content.substring(0, content.indexOf(postStart));
const post = content.substring(content.indexOf(putStart));

fs.writeFileSync('src/routes/admin/traders/route.js', pre + postCode + "\n\n" + post);
console.log('patched');
