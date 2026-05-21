require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// ================= DATABASE =================
connectDB();

// ================= CORS =================
app.use(cors({
  origin: "https://study-notion-lms-omega.vercel.app",
  credentials: true,
}));

// ================= FILE UPLOAD =================
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
}));

// ================= BODY PARSER =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= TEST ROUTE =================
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Server is running!',
  });
});

// ================= ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/course', courseRoutes);

// ================= SERVER =================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});