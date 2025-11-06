require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const Review = require('./models/Review');
const auth = require('./middleware/auth'); // Middleware to check login status

const app = express();

// --- CORS CONFIGURATION ---
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend address
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Backend: MongoDB connected successfully."))
  .catch(err => console.error("❌ Backend: MongoDB connection error:", err));

// --- API Routes ---
app.use('/api/users', require('./routes/users')); // Handles /api/users/register and /api/users/login
// app.use('/api/snippets', require('./routes/snippets')); // REMOVED THIS LINE - File doesn't exist

// --- Review Routes ---

// @route   POST /api/review
// @desc    Submit code for analysis and save the review
// @access  Private (Requires login via 'auth' middleware)
app.post('/api/review', auth, async (req, res) => {
  try {
    const { code, language } = req.body;

    // Call the Python ML Service for analysis
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000/analyze';
    const mlResponse = await axios.post(mlServiceUrl, { code, language });

    // Create a new review document in the database
    const newReview = new Review({
      user: req.user.id, // Link to the logged-in user
      code,
      language,
      analysis: mlResponse.data,
      notes: '' // Initialize notes as empty
    });
    await newReview.save();
    res.status(201).json(newReview); // Send back the created review
  } catch (error) {
    console.error("❌ Backend Error in /api/review:", error.message);
    if (error.isAxiosError) {
      console.error("Full Axios Error:", error.response?.data || 'No response data from ML service.');
      const mlError = error.response?.data?.detail || 'The ML service is currently unavailable.';
      return res.status(500).json({ error: `Failed to get analysis: ${mlError}` });
    }
    res.status(500).json({ error: 'An internal server error occurred while processing the review.' });
  }
});

// @route   GET /api/reviews
// @desc    Fetch all analysis history for the logged-in user
// @access  Private
app.get('/api/reviews', auth, async (req, res) => {
  try {
    // Find reviews belonging to the current user, sorted by newest first
    const reviews = await Review.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Backend Error in /api/reviews:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/reviews/:id/notes
// @desc    Update the notes for a specific review
// @access  Private
app.put('/api/reviews/:id/notes', auth, async (req, res) => {
  const { notes } = req.body; // Get the new notes content from the request
  const reviewId = req.params.id; // Get the ID of the review from the URL parameter

  if (notes === undefined) {
    return res.status(400).json({ msg: 'Notes content is required' });
  }

  try {
    let review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    review.notes = notes;
    await review.save();
    res.json(review); // Send back the complete, updated review object
  } catch (err) {
    console.error('Error updating notes:', err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Review not found' });
    }
    res.status(500).send('Server Error');
  }
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server listening on http://localhost:${PORT}`);
});
