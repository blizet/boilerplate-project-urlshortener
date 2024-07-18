require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Body parser middleware to handle POST requests
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from 'public' directory
app.use('/public', express.static(`${process.cwd()}/public`));

// In-memory store for URLs
const urlDatabase = {};
let urlCounter = 1;

// Serve the main HTML file
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// POST endpoint to create a short URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  console.log(originalUrl, "original")
  const urlRegex = /^https?:\/\/(www\.)?/i;
  console.log(urlRegex);
  const hostname = originalUrl.replace(urlRegex, "").split("/")[0];
  console.log(hostname)


  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = urlCounter++;
    urlDatabase[shortUrl] = originalUrl;
    const Data = { original_url: originalUrl, short_url: shortUrl }
    console.log(Data)
    res.json(Data);
  });
});

// GET endpoint to redirect to the original URL
app.get('/api/shorturl/:shorturl', (req, res) => {
  const shortUrl = req.params.shorturl;
  const originalUrl = urlDatabase[shortUrl];

  if (!originalUrl) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  res.redirect(originalUrl);
});

// Start the server
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});