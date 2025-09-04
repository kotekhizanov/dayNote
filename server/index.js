const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const dataFile = path.join(__dirname, 'data.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile));
  } catch (e) {
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.get('/api/events', (req, res) => {
  const { month } = req.query;
  const data = readData();
  if (month) {
    const result = {};
    Object.keys(data).forEach((date) => {
      if (date.startsWith(month)) {
        result[date] = data[date];
      }
    });
    res.json(result);
  } else {
    res.json(data);
  }
});

app.get('/api/events/:date', (req, res) => {
  const data = readData();
  const event = data[req.params.date];
  if (event) {
    res.json(event);
  } else {
    res.status(404).end();
  }
});

app.post('/api/events/:date', (req, res) => {
  const data = readData();
  data[req.params.date] = req.body;
  writeData(data);
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
