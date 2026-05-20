require('dotenv').config(); // MUST BE FIRST

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// CONNECT DATABASE
connectDB();

// CORS FIX
app.use(cors({
  origin: "https://study-notion-lms-omega.vercel.app",
  credentials: true
}));

// MIDDLEWARE
app.use(express.json());

// TEST ROUTE
app.get('/', (req, res) => {
  res.json({ message: '🚀 Server is running!' });
});

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/course', courseRoutes);

// STATIC FOLDER
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});