require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { parse } = require('url');

const ROOT_DIR = process.cwd();
const PORT = process.env.PORT || 42000;
const HOST = process.env.HOST || 'localhost';
const uploadDir = path.join(ROOT_DIR, process.env.UPLOAD_DIR || 'uploads');
const scriptPath = path.join(ROOT_DIR, process.env.SCRIPT_PATH || 'signal-send.sh');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const handleUpload = (req, res, parsedUrl) => {
    const filename = parsedUrl.query.filename;
    const numbers = parsedUrl.query.numbers.split(',').map(num => '+' + num);
    const savePath = path.join(uploadDir, filename);
    const fileStream = fs.createWriteStream(savePath);

    req.pipe(fileStream);

    fileStream.on('finish', () => {
        let pending = numbers.length;
        let hasError = false;

        numbers.forEach(number => {
            execFile(scriptPath, [savePath, number], (error, stdout, stderr) => {
                if (error && !hasError) {
                    hasError = true;
                    res.writeHead(500);
                    return res.end('Script failed: ' + error.message);
                }

                if (--pending === 0 && !hasError) {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end('File sent successfully');
                }
            });
        });
    });

    fileStream.on('error', (err) => {
        console.error('Write error:', err);
        res.writeHead(500);
        res.end('File save failed');
    });
}

const routes = {
    'POST /upload': handleUpload,
};

const server = http.createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const routeKey = `${req.method} ${parsedUrl.pathname}`;
    const handler = routes[routeKey];

    if (handler) {
        handler(req, res, parsedUrl);
        return
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, HOST, () => {
    console.log(
        '\x1b[32m\x1b[1m📦 File server\x1b[0m ' +
        '\x1b[37mlistening on\x1b[0m ' +
        '\x1b[36m\x1b[4mhttp://localhost:' + PORT + '\x1b[0m'
    );
});
