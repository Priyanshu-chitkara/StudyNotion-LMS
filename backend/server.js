require('dotenv').config(); // 🔥 MUST BE FIRST LINE

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// 🔥 Connect DB AFTER env loaded
connectDB();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: '🚀 Server is running!' });
});

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/course', courseRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});