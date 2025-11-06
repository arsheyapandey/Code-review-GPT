import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../App.css'; // Assuming App.css contains base styles

function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null); // Track which review's notes are being edited
  const [currentNotes, setCurrentNotes] = useState(''); // Hold notes text during editing

  // Function to fetch reviews (already includes chart data processing)
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/reviews');
      setReviews(res.data); // Keep the original reviews for the list

      // Process data for the chart
      const formattedData = res.data
        .map(review => ({
          date: new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          readabilityScore: review.analysis?.readabilityScore ?? 0,
          cyclomaticComplexity: review.analysis?.cyclomaticComplexity ?? 0,
          originalDate: new Date(review.createdAt)
        }))
        .sort((a, b) => a.originalDate - b.originalDate)
        .slice(-15);

      setChartData(formattedData);

    } catch (err) {
      console.error("Could not fetch reviews", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // --- NEW: Function to start editing notes ---
  const handleEditNotes = (review) => {
    setEditingReviewId(review._id);
    setCurrentNotes(review.notes || ''); // Load existing notes
  };

  // --- NEW: Function to save notes via API call ---
  const handleSaveNotes = async (reviewId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/reviews/${reviewId}/notes`, { notes: currentNotes });
      // Update the reviews state locally with the updated review
      setReviews(reviews.map(r => r._id === reviewId ? res.data : r));
      // Exit editing mode
      setEditingReviewId(null);
      setCurrentNotes('');
    } catch (err) {
      console.error("Failed to save notes:", err);
      // Optionally show an error message to the user here
    }
  };

  // --- NEW: Function to cancel editing notes ---
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setCurrentNotes('');
  };

  if (isLoading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <h2>My Analysis History</h2>

      {/* --- Chart Section (Unchanged) --- */}
      {chartData.length > 1 ? (
        <div style={{ width: '100%', height: 300, marginBottom: '2rem' }}>
          <h3>Readability Score Trend (Last 15 Analyses)</h3>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" domain={[0, 100]} />
              <Tooltip
                 contentStyle={{ backgroundColor: '#252525', border: '1px solid #555', borderRadius: '5px' }}
                 itemStyle={{ color: '#eee' }}
                 labelStyle={{ color: '#a679f5', fontWeight: 'bold' }}
              />
              <Legend />
              <Line
                 type="monotone"
                 dataKey="readabilityScore"
                 name="Readability Score"
                 stroke="#a679f5"
                 strokeWidth={2}
                 activeDot={{ r: 8 }}
                 dot={{ r: 4, fill: '#a679f5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : reviews.length > 0 && (
         <p style={{textAlign: 'center', marginBottom: '2rem', color: '#aaa'}}>Analyze more code snippets to see your Readability Score trend!</p>
      )}

      {/* --- History List (UPDATED with Notes) --- */}
      {reviews.length === 0 ? (
        <p style={{textAlign: 'center'}}>You haven't analyzed any code yet. Go to the <Link to="/analyze">Analyze</Link> page to get started!</p>
      ) : (
        [...reviews].reverse().map((review) => (
          <div key={review._id} className="results-box" style={{ marginBottom: '1rem', textAlign: 'left' }}>
            {/* --- Existing Review Details --- */}
            <div className="result-item"><strong>Analyzed on:</strong><span>{new Date(review.createdAt).toLocaleString()}</span></div>
            {review.language && (<div className="result-item"><strong>Language:</strong><span>{review.language}</span></div>)}
            <pre className="code-editor" style={{ marginTop: '1rem', maxHeight: '200px', overflow: 'auto', whiteSpace: 'pre-wrap', backgroundColor: '#282c34', padding: '0.5rem', borderRadius: '5px' }}>
              <code>{review.code}</code>
            </pre>
            {review.analysis && (
                <details style={{marginTop: '1rem', cursor: 'pointer'}}>
                <summary style={{color: '#a679f5'}}>View Analysis Details</summary>
                <div className="result-item"><strong>Time Complexity:</strong><span>{review.analysis.timeComplexity ?? 'N/A'}</span></div>
                <div className="result-item"><strong>Readability Score:</strong><span>{review.analysis.readabilityScore ?? 'N/A'} / 100</span></div>
                <div className="result-item"><strong>Cyclomatic Complexity:</strong><span>{review.analysis.cyclomaticComplexity ?? 'N/A'}</span></div>
                </details>
            )}

            {/* --- NEW Notes Section --- */}
            <div className="notes-section">
              <h4>Notes:</h4>
              {editingReviewId === review._id ? (
                // Show textarea and Save/Cancel buttons when editing this review
                <div>
                  <textarea
                    value={currentNotes}
                    onChange={(e) => setCurrentNotes(e.target.value)}
                    rows={4}
                    style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#282c34', color: '#eee', border: '1px solid #555', borderRadius: '4px', padding: '0.5rem', fontFamily: 'Inter, sans-serif'}}
                    placeholder="Add your notes here..."
                  />
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleSaveNotes(review._id)} className="gemini-button" style={{flexGrow: 0, padding: '0.3rem 0.8rem', fontSize: '0.8rem'}}>Save</button>
                    <button onClick={handleCancelEdit} className="gemini-button" style={{flexGrow: 0, padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: 'linear-gradient(90deg, #555, #333)', borderColor: '#777'}}>Cancel</button>
                  </div>
                </div>
              ) : (
                // Show the notes text (or placeholder) and Edit button
                <div>
                  <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 0.5rem 0', color: '#ccc', minHeight: '1.5em' /* Prevent jumping */ }}>
                    {review.notes || <i>No notes added yet.</i>}
                  </p>
                  <button onClick={() => handleEditNotes(review)} className="gemini-button" style={{flexGrow: 0, padding: '0.3rem 0.8rem', fontSize: '0.8rem'}}>
                    {review.notes ? 'Edit Notes' : 'Add Notes'}
                  </button>
                </div>
              )}
            </div>
            {/* --- End Notes Section --- */}

          </div>
        ))
      )}
    </div>
  );
}

export default HistoryPage;