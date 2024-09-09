const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module for resolving file paths

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle POST requests to /api/sendData
app.post('/api/sendData', (req, res) => {
  const { topic, context } = req.body;
  console.log('Received data:', { topic, context });
  res.json({ message: 'Data received successfully' });
});

// Fallback route for undefined paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
