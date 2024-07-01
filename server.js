const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const archiver = require('archiver');
const app = express();
const port = 3008;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Generate a unique session ID for each user
function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

async function containsKeyword(filePath, keywords) {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const lines = fileContent.split(/\r?\n/);
        
        for (let line of lines) {
            for (let keyword of keywords) {
                if (line.toLowerCase().includes(keyword.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
    } catch (error) {
        console.error('Error reading file:', error);
        return false;
    }
}

app.post('/process-files', upload.array('files'), async (req, res) => {
    const { keywords, sessionId } = req.body;
    const files = req.files;

    if (!files || files.length === 0 || !keywords) {
        return res.status(400).send('Files and keywords are required.');
    }

    const keywordList = keywords.split(',').map(keyword => keyword.trim());
    const sessionDir = path.join(__dirname, 'uploads', sessionId);
    const destinationWithKeyword = path.join(sessionDir, 'with_keyword');
    const destinationWithoutKeyword = path.join(sessionDir, 'without_keyword');

    await fs.mkdir(destinationWithKeyword, { recursive: true });
    await fs.mkdir(destinationWithoutKeyword, { recursive: true });

    try {
        for (const file of files) {
            const sourcePath = file.path;
            const hasKeyword = await containsKeyword(sourcePath, keywordList);
            const destinationDir = hasKeyword ? destinationWithKeyword : destinationWithoutKeyword;
            const destinationPath = path.join(destinationDir, file.originalname);

            await fs.rename(sourcePath, destinationPath);
        }

        res.send('Files processed successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while processing the files.');
    }
});

app.get('/download/:sessionId/:type', async (req, res) => {
    const { sessionId, type } = req.params;
    const folderPath = path.join(__dirname, 'uploads', sessionId, type);

    try {
        await fs.access(folderPath);
    } catch (err) {
        return res.status(404).send('Files not found.');
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    res.attachment(`${type}.zip`);
    archive.pipe(res);

    archive.directory(folderPath, false);
    archive.finalize();
});

app.post('/cleanup', async (req, res) => {
    const { sessionId } = req.body;

    try {
        const sessionDir = path.join(__dirname, 'uploads', sessionId);
        await fs.rmdir(sessionDir, { recursive: true });
        res.send('Files cleaned up successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred during cleanup.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
