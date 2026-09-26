import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL, "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  fs.appendFileSync('requests.log', `[${req.method}] ${req.url} Body: ${JSON.stringify(req.body)}\n`);
  next();
});

// Dynamic route loader
async function loadRoutes() {
  const apiDir = path.join(__dirname, 'routes');
  
  function getRouteFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        getRouteFiles(fullPath, files);
      } else if (entry.name === 'route.js') {
        files.push(fullPath);
      }
    }
    return files;
  }

  const routeFiles = getRouteFiles(apiDir);

  for (let file of routeFiles) {
    let routePath = '/api' + file.replace(apiDir, '').replace(/\\/g, '/').replace('/route.js', '');
    if (routePath.endsWith('/')) routePath = routePath.slice(0, -1);
    
    // Handle Next.js dynamic routes [id] -> :id
    routePath = routePath.replace(/\[([^\]]+)\]/g, ':$1');

    console.log(`Registering route: ${routePath}`);
    const moduleUrl = pathToFileURL(file).href;
    const routeModule = await import(moduleUrl);

    app.all(routePath, async (req, res) => {
      const method = req.method;
      if (!routeModule[method]) {
        return res.status(405).end();
      }

      try {
        await routeModule[method](req, res);
      } catch (err) {
        console.error(`Error in ${method} ${routePath}:`, err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
    });
  }
}

loadRoutes().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}).catch(console.error);
