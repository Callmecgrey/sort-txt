const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs').promises; // Import fs with promises
const path = require('path');
const readline = require('readline');

const app = express();
const port = 3008;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

async function containsKeyword(filePath, keyword) {
    try {
        const fileStream = await fs.readFile(filePath, 'utf-8');
        const lines = fileStream.split(/\r?\n/);
        
        for (let line of lines) {
            if (line.toLowerCase().includes(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error reading file:', error);
        return false;
    }
}

app.post('/process-file', upload.single('file'), async (req, res) => {
    const { keyword } = req.body;
    const file = req.file;

    if (!file || !keyword) {
        return res.status(400).send('File and keyword are required.');
    }

    const sourcePath = file.path;
    const destinationWithKeyword = path.join(__dirname, 'uploads', 'with_keyword');
    const destinationWithoutKeyword = path.join(__dirname, 'uploads', 'without_keyword');

    await fs.mkdir(destinationWithKeyword, { recursive: true });
    await fs.mkdir(destinationWithoutKeyword, { recursive: true });

    try {
        const hasKeyword = await containsKeyword(sourcePath, keyword);
        const destinationDir = hasKeyword ? destinationWithKeyword : destinationWithoutKeyword;
        const destinationPath = path.join(destinationDir, file.originalname);

        await fs.rename(sourcePath, destinationPath);

        // Remove the original file from uploads directory
        await fs.unlink(sourcePath);

        res.send('File processed successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while processing the file.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
