const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { promisify } = require('util');
const { exec } = require('child_process');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

// Configuration
const DEFAULT_PORT = 3000;
const WATCH_DIRS = ['src', 'examples', 'test'];
const BUILD_CMD = 'npm run build';
const TEST_CMD = 'npm test';
const URL_FILE = 'preview-url.txt';

// Debounce timer for file changes
let debounceTimer = null;
const DEBOUNCE_DELAY = 500; // ms

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.ts': 'application/typescript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown',
  '.txt': 'text/plain'
};

// Get file MIME type
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// Serve static file
async function serveStaticFile(res, filePath) {
  try {
    await stat(filePath);
    const data = await fs.promises.readFile(filePath);
    const mimeType = getMimeType(filePath);
    res.setHeader('Content-Type', mimeType);
    res.statusCode = 200;
    res.end(data);
  } catch (err) {
    res.statusCode = 404;
    res.end('Not Found');
  }
}

// List directory (for root)
async function listDirectory(res, dirPath) {
  try {
    const files = await readdir(dirPath);
    let html = '<!DOCTYPE html><html><head><title>Match Pro - Preview</title>';
    html += '<style>body{font-family:sans-serif;margin:40px;}';
    html += 'a{text-decoration:none;color:#0066cc;}';
    html += 'a:hover{text-decoration:underline;}';
    html += '.dir{margin:10px 0;}';
    html += '.file{margin:5px 0;padding-left:20px;}';
    html += '</style></head><body>';
    html += '<h1>Match Pro - Preview Server</h1>';
    html += `<p>Serving files from: ${process.cwd()}</p>`;
    html += '<h2>Directories:</h2>';
    
    // Sort directories first
    const dirs = [];
    const filesList = [];
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.promises.stat(filePath);
      if (stats.isDirectory()) {
        dirs.push(file);
      } else {
        filesList.push(file);
      }
    }
    
    dirs.sort();
    filesList.sort();
    
    for (const dir of dirs) {
      html += `<div class="dir">📁 <a href="${encodeURI(dir)}/">${dir}/</a></div>`;
    }
    for (const file of filesList) {
      html += `<div class="file">📄 <a href="${encodeURI(file)}">${file}</a></div>`;
    }
    
    html += '<hr><p><small>Match Pro - Pattern Matching Library</small></p>';
    html += '</body></html>';
    
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end(html);
  } catch (err) {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

// Run build and test commands
function runBuildAndTest() {
  console.log('\n🔨 Running build and test...');
  
  // Run build
  exec(BUILD_CMD, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Build failed:\n${stderr}`);
      return;
    }
    console.log('✅ Build succeeded');
    
    // Run test
    exec(TEST_CMD, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Test failed:\n${stderr}`);
        return;
      }
      console.log('✅ Test succeeded\n');
    });
  });
}

// Watch for file changes
function startWatcher() {
  const watcher = fs.watch('.', { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    
    // Check if changed file is in watched directories
    const filePath = path.join('.', filename);
    const inWatchedDir = WATCH_DIRS.some(dir => 
      filePath.startsWith(path.join('.', dir) + path.sep) || 
      filePath === path.join('.', dir)
    );
    
    if (!inWatchedDir) return;
    
    // Debounce
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`\n📝 Change detected: ${filename}`);
      runBuildAndTest();
    }, DEBOUNCE_DELAY);
  });
  
  console.log(`👀 Watching for changes in: ${WATCH_DIRS.join(', ')}`);
}

// Find available port starting from defaultPort
function findAvailablePort(startPort, callback) {
  const server = net.createServer();
  
  server.listen(startPort, () => {
    const port = server.address().port;
    server.close(() => {
      callback(port);
    });
  });
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      findAvailablePort(startPort + 1, callback);
    } else {
      callback(startPort); // fallback
    }
  });
}

// Create HTTP server
function createServer(port) {
  return http.createServer(async (req, res) => {
    let filePath = path.join('.', req.url);
    
    // Prevent directory traversal attacks
    if (filePath.includes('..')) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    
    // Default to index.html for directories
    if (filePath.endsWith('/')) {
      filePath += 'index.html';
    }
    
    // Check if it's a directory
    try {
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        await listDirectory(res, filePath);
        return;
      }
    } catch (err) {
      // File doesn't exist, try to serve as file anyway (will 404)
    }
    
    // Serve static file
    await serveStaticFile(res, filePath);
  });
}

// Start the server
async function startServer() {
  console.log('Starting server...');
  // Find available port
  findAvailablePort(DEFAULT_PORT, (port) => {
    const server = createServer(port);
    
    server.listen(port, () => {
      const url = `http://localhost:${port}`;
      console.log(`🚀 Preview server running at: ${url}`);
      
      // Write URL to file
      fs.promises.writeFile(URL_FILE, url, 'utf8')
        .then(() => {
          console.log(`📝 URL written to ${URL_FILE}`);
        })
        .catch(err => {
          console.error(`⚠️ Failed to write URL file: ${err}`);
        });
      
      // Start watcher
      startWatcher();
    });
    
    server.on('error', (err) => {
      console.error(`❌ Server error: ${err}`);
      process.exit(1);
    });
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down preview server...');
  process.exit(0);
});

// Start the server
startServer().catch(err => {
  console.error(`❌ Failed to start server: ${err}`);
  process.exit(1);
});
