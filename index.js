const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the template engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve the HTML form and handle form submission
app.get('/', (req, res) => {
  const storedData = getStoredData();
  res.render('index', { jsonData: null, storedData });
});

app.post('/submit', (req, res) => {
  const jsonData = req.body.jsonData;
  let parsedData;

  try {
    parsedData = JSON.parse(jsonData);
    fs.writeFileSync(dataFilePath, JSON.stringify(parsedData, null, 2));
    res.render('index', { jsonData: parsedData, storedData: getStoredData() });
  } catch (error) {
    res.render('index', { jsonData: null, error: 'Invalid JSON data', storedData: getStoredData() });
  }
});

// Retrieve the stored JSON data
app.get('/data', (req, res) => {
  const storedData = getStoredData();
  res.json(storedData);
});

// Helper function to retrieve stored JSON data
function getStoredData() {
  try {
    const rawData = fs.readFileSync(dataFilePath);
    const jsonData = JSON.parse(rawData);
    return jsonData;
  } catch (error) {
    return null;
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
