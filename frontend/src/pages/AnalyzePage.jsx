import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python'; // For Python highlighting
import 'prismjs/components/prism-java';   // For Java highlighting
import 'prismjs/themes/prism-okaidia.css';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../App.css';

// --- NEW: Placeholder code for each language ---
const placeholderCode = {
  javascript: `function findDuplicates(arr) {\n  const duplicates = [];\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {\n        duplicates.push(arr[i]);\n      }\n    }\n  }\n  return duplicates;\n}`,
  python: `def fibonacci(n):\n    """Calculates the nth Fibonacci number recursively."""\n    if n <= 1:\n        return n\n    else:\n        return fibonacci(n-1) + fibonacci(n-2)`,
  java: `public class BinarySearch {\n    // Returns index of x if it is present in arr[]\n    int binarySearch(int arr[], int x) {\n        int l = 0, r = arr.length - 1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n \n            if (arr[m] == x) return m;\n \n            if (arr[m] < x) l = m + 1;\n \n            else r = m - 1;\n        }\n        return -1;\n    }\n}`
};

function AnalyzePage() {
  const [code, setCode] = useState(placeholderCode.javascript);
  const [language, setLanguage] = useState('javascript');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [docstring, setDocstring] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');
  const [explanation, setExplanation] = useState('');

  const resetGeminiStates = () => {
    setDocstring('');
    setRefactoredCode('');
    setExplanation('');
  };

  // --- NEW: Handles language change, updates code, and clears results ---
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(placeholderCode[newLang]);
    setAnalysis(null); // Clear previous analysis
    resetGeminiStates(); // Clear previous AI results
    setError(''); // Clear any errors
  };

  const handleInitialSubmit = async () => {
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    resetGeminiStates();
    try {
      const response = await axios.post('http://localhost:5000/api/review', { code, language });
      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(err.response?.status === 401 ? 'You must be logged in to analyze code.' : 'Failed to get analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeminiAction = async (endpoint, setter) => {
    setIsGeminiLoading(true);
    setter('');
    try {
      const response = await axios.post(`http://127.0.0.1:8000/${endpoint}`, { code, language });
      const key = Object.keys(response.data)[0];
      setter(response.data[key]);
    } catch (err) {
      setError(`Failed to perform AI action.`);
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const getPrismLanguage = (lang) => {
    if (lang === 'python') return languages.py;
    if (lang === 'java') return languages.java;
    return languages.js;
  };

  return (
    <div className="container">
      <header><h1>CodeReviewGPT 🤖</h1><p>Select a language and paste your code below.</p></header>
      <main>
        <div className="language-selector-wrapper">
          <label htmlFor="language-select">Language:</label>
          {/* --- UPDATED: Use the new handler function --- */}
          <select id="language-select" value={language} onChange={handleLanguageChange} className="control-group select">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="editor-wrapper">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => highlight(code, getPrismLanguage(language), language)}
            padding={15}
            className="code-editor"
          />
        </div>
        
        <button onClick={handleInitialSubmit} disabled={isLoading} className="analyze-button">{isLoading ? 'Analyzing...' : 'Analyze Code'}</button>
        
        {error && <div className="error-box">{error}</div>}
        {isLoading && <div className="loader"></div>}
        
        {analysis && (
          <div className="results-box">
            <h2>Analysis Results</h2>
            <div className="result-item"><strong>Time Complexity:</strong><span>{analysis.timeComplexity}</span></div>
            <div className="result-item"><strong>Readability Score:</strong><span>{analysis.readabilityScore} / 100</span></div>
            <div className="result-item"><strong>Cyclomatic Complexity:</strong><span>{analysis.cyclomaticComplexity}</span></div>
            <div className="result-item"><strong>Lines of Code:</strong><span>{analysis.linesOfCode}</span></div>
            <h3>Suggestions:</h3>
            <ul>{analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
            
            <div className="gemini-actions">
              <button onClick={() => handleGeminiAction('generate-docstring', setDocstring)} disabled={isGeminiLoading} className="gemini-button">✨ Generate Docstring</button>
              <button onClick={() => handleGeminiAction('refactor-code', setRefactoredCode)} disabled={isGeminiLoading} className="gemini-button">✨ Refactor Code</button>
              <button onClick={() => handleGeminiAction('explain-code', setExplanation)} disabled={isGeminiLoading} className="gemini-button">✨ Explain This Code</button>
            </div>
          </div>
        )}
        
        {isGeminiLoading && <div className="loader"></div>}

        {docstring && (
          <div className="results-box gemini-result">
            <h3>Generated Docstring</h3>
            <SyntaxHighlighter language={language} style={atomDark} customStyle={{ borderRadius: '5px' }}>
              {docstring}
            </SyntaxHighlighter>
          </div>
        )}

        {refactoredCode && (
          <div className="results-box gemini-result">
            <h3>Refactored Code</h3>
            <SyntaxHighlighter language={language} style={atomDark} customStyle={{ borderRadius: '5px' }}>
              {refactoredCode}
            </SyntaxHighlighter>
          </div>
        )}

        {explanation && (
          <div className="results-box gemini-result">
            <h3>Code Explanation</h3>
            <div className="explanation-content" dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }} />
          </div>
        )}
      </main>
    </div>
  );
}

export default AnalyzePage;