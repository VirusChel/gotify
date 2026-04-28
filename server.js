const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = Date.now() + '-' + Math.random().toString(36).substr(2, 6) + ext;
        cb(null, name);
    }
});
const upload = multer({ storage });

const tracksFile = path.join(__dirname, 'tracks.json');
if (!fs.existsSync(tracksFile)) {
    fs.writeFileSync(tracksFile, JSON.stringify({ tracks: [] }));
}

app.use(express.json());
app.use(express.static('public'));

app.get('/api/tracks', (req, res) => {
    res.json(JSON.parse(fs.readFileSync(tracksFile)));
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    const { name, artist } = req.body;
    const file = req.file;
    if (!name || !artist || !file) return res.status(400).json({ error: 'Missing fields' });
    const newTrack = {
        id: Date.now().toString(),
        name, artist,
        url: `/uploads/${file.filename}`,
        plays: 0
    };
    const data = JSON.parse(fs.readFileSync(tracksFile));
    data.tracks.push(newTrack);
    fs.writeFileSync(tracksFile, JSON.stringify(data));
    res.json({ success: true, track: newTrack });
});

app.post('/api/play/:id', (req, res) => {
    const id = req.params.id;
    const data = JSON.parse(fs.readFileSync(tracksFile));
    const track = data.tracks.find(t => t.id === id);
    if (track) track.plays++;
    fs.writeFileSync(tracksFile, JSON.stringify(data));
    res.json({ success: true });
});

app.use('/uploads', express.static(uploadDir));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));