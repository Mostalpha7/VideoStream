const express = require('express')
const fs = require('fs')
const app = express()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/video', (req, res) => {
    const range = req.headers.range
    if (!range) {
        res.status(400).send('Requires Range header')
    }

    // Get file size
    const videoPath = 'panda.mp4'
    const videoSize = fs.statSync('panda.mp4').size

    // Parse range.
    const CHUNK_SIZE = 10 ** 6
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
    console.log(start, end)
    const contentLength = end - start + 1

    // Get headers
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
    }

    res.writeHead(206, headers)

    const videoStream = fs.createReadStream(videoPath, { start, end })
    console.log(videoStream)
    videoStream.pipe(res)
})

app.listen(8000, console.log('Listening on port 8000!'))