// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // We'll create this CSS file next

function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to CodeReviewGPT 🤖</h1>
      <p className="subtitle">
        Your AI-powered partner for writing cleaner, more efficient code.
      </p>
      <div className="features">
        <div className="feature">
          <h3>Analyze Complexity</h3>
          <p>Get instant feedback on Time Complexity and Cyclomatic Complexity.</p>
        </div>
        <div className="feature">
          <h3>Improve Readability</h3>
          <p>Receive a dynamic readability score to help you write clearer code.</p>
        </div>
        <div className="feature">
          <h3>Get Smart Suggestions</h3>
          <p>Actionable tips to improve your code snippet on the spot.</p>
        </div>
      </div>
      <Link to="/analyze" className="cta-button">
        Start Analyzing Now
      </Link>
    </div>
  );
}

export default HomePage;