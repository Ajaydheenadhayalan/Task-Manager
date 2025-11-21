const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // initializes DB

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.get('/', (req, res) => res.send('Task Manager API is running'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
