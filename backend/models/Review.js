const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { // Link to the user who saved it
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: { // The code that was analyzed
    type: String,
    required: true
  },
  language: { // The language of the code
    type: String,
    required: true
  },
  analysis: { // The results from the ML service
    type: Object
  },
  notes: { // The user's personal notes for this review
    type: String,
    default: '' // Default to an empty string if no notes are added
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Review', reviewSchema);

