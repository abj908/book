const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

console.log("Starting server...");

const app = express();

// Increase the request body size limit
app.use(express.json({ limit: '10mb' })); // or larger if needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
    res.send('Server is running.');
});

console.log("Environment Variables Loaded");
console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY}`);
console.log(`Google API Key: ${process.env.GOOGLE_API_KEY}`);

// Load API keys from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Route to handle book detection and data fetching
app.post('/detect-books', async (req, res) => {
    const { base64Image } = req.body;

    // Simulated response from OpenAI API
    const detectedBooks = ["Anna Karenina", "Moby Dick"];

    // Fetch bibliographic information for detected books
    const bookData = [];
    for (const book of detectedBooks) {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${book}&key=${GOOGLE_API_KEY}`
            );
            bookData.push(response.data.items[0].volumeInfo);
        } catch (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Failed to fetch book data.' });
        }
    }

    res.json(bookData);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});