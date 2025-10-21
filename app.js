const express = require('express');
const cors = require('cors');
const stringRoutes = require('./router');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/strings', stringRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
