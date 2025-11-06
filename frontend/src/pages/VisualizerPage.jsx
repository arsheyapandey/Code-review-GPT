import React, { useState, useEffect, useRef, useCallback } from 'react';
// Import the code strings and sorting functions
import { algorithmCode, bubbleSort, insertionSort, selectionSort, mergeSort } from '../algorithms/sortingAlgorithms.js';
// Import the Syntax Highlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../App.css'; // Ensure App.css is correctly imported

const MIN_VALUE = 5;
const MAX_VALUE = 100;
const DEFAULT_COLOR = '#ccc';
const SORTED_COLOR = '#32CD32';

function VisualizerPage() {
  const [array, setArray] = useState([]); // Single array state
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [highlightedLines, setHighlightedLines] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const containerRef = useRef(null); // Single container ref

  const [speed, setSpeed] = useState(50); // Delay in ms (lower is faster)
  const [size, setSize] = useState(50); // Number of bars

  // --- Helper Functions ---
  const resetArrayColors = () => {
    if (containerRef.current) {
      const bars = containerRef.current.children;
      for (let i = 0; i < bars.length; i++) {
        if (bars[i]) { // Safety check
           bars[i].style.backgroundColor = DEFAULT_COLOR;
        }
      }
    }
  };

  // Memoized generateNewArray function
  const generateNewArray = useCallback(() => {
    if (isSorting) return;
    resetArrayColors();
    setHighlightedLines([]);
    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE);
    }
    setArray(newArray);
  }, [size, isSorting]); // Dependencies

  // Effect to generate array on initial load and when size changes
  useEffect(() => {
     generateNewArray();
  }, [size, generateNewArray]);

  // Helper for final coloring sweep
  const finalColorSweep = (ref, arrLength) => {
      if (ref.current) {
          const bars = ref.current.children;
          const numBars = bars.length;
          if (numBars === 0) return;
          for (let i = 0; i < numBars; i++) {
              setTimeout(() => {
                  if (bars[i]) bars[i].style.backgroundColor = SORTED_COLOR;
              }, i * (Math.max(1, 100 / (numBars || 1))));
          }
      }
  };

  const startSorting = () => {
    if (isSorting) return;
    // Generate a fresh array on start, respecting current size
    generateNewArray();
    // Small delay allows the state update for the new array to render before sorting
    setTimeout(() => {
        const currentArray = arrayRef.current; // Use ref for current array state
        if (!currentArray || currentArray.length === 0) {
            console.error("Array is empty, cannot start sort.");
            return;
        }

        setIsSorting(true); // Set sorting state
        const sortingFunctionMap = { bubbleSort, insertionSort, selectionSort, mergeSort };
        const sort = sortingFunctionMap[algorithm];

        // Start sorting promise
        sort(currentArray, setArray, setHighlightedLines, speed)
        .then(() => {
            finalColorSweep(containerRef, currentArray.length); // Use currentArray length
        })
        .catch((e) => { console.error("Sort Error:", e); })
        .finally(() => {
            // Delay setting sorting to false to allow final sweep animation
            setTimeout(() => setIsSorting(false), currentArray.length * (Math.max(1, 100 / (currentArray.length || 1))) + speed + 100);
            setHighlightedLines([]);
        });
    }, 100); // Increased delay
  };

   // Use ref to keep track of the latest array state for the async sort function
   const arrayRef = useRef(array);
   useEffect(() => { arrayRef.current = array }, [array]);


  // Function to determine line props for syntax highlighter
  const lineProps = (lineNumber) => {
    if (highlightedLines.includes(lineNumber)) {
      return { style: { display: 'block', background: 'rgba(166, 121, 245, 0.3)' } };
    }
    return { style: { display: 'block' } };
  };

  // Helper to get display name from camelCase
  const getAlgoName = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  const algorithmDisplayName = getAlgoName(algorithm);

  return (
    // Revert to the simpler grid layout container class
    <div className="container visualizer-container-grid">
      {/* --- Column 1: Controls & Code --- */}
      <div className="visualizer-controls-column">
        <header>
          <h1>Algorithm Visualizer</h1>
          <p>Watch sorting algorithms in action!</p>
        </header>

        {/* Controls Section */}
        <div className="visualizer-controls">
          <div className="control-group">
            <label htmlFor="algorithm">Algorithm</label>
            <select id="algorithm" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} disabled={isSorting}>
              <option value="bubbleSort">Bubble Sort</option>
              <option value="insertionSort">Insertion Sort</option>
              <option value="selectionSort">Selection Sort</option>
              <option value="mergeSort">Merge Sort</option> {/* Can enable Merge Sort */}
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="size">Array Size: {size}</label>
            <input type="range" id="size" min="10" max="150" step="1" value={size} onChange={(e) => setSize(Number(e.target.value))} disabled={isSorting} className="slider" />
          </div>
          <div className="control-group">
            <label htmlFor="speed">Speed</label>
            <input type="range" id="speed" min="5" max="100" step="1" value={105 - speed} onChange={(e) => setSpeed(105 - Number(e.target.value))} disabled={isSorting} className="slider" />
          </div>
          <button onClick={generateNewArray} disabled={isSorting} className="gemini-button">
            New Array
          </button>
          <button onClick={startSorting} disabled={isSorting} className="analyze-button">
            {isSorting ? 'Sorting...' : 'Start Sorting'}
          </button>
        </div>

        {/* Code Display Section */}
        <div className="code-display">
          <h3>Code: {algorithmDisplayName}</h3>
          <SyntaxHighlighter
            language="javascript"
            style={atomDark}
            showLineNumbers
            wrapLines={true}
            lineProps={lineProps} // Apply dynamic line highlighting
            customStyle={{
              borderRadius: '8px',
              fontSize: '0.80em',
              maxHeight: 'calc(90vh - 350px)', // Adjust max height dynamically
              overflowY: 'auto',
              border: '1px solid #333',
              margin: '0',
            }}
            codeTagProps={{ style: { fontFamily: '"Fira Code", monospace' } }}
          >
            {algorithmCode[algorithm] || "// Select an algorithm to view code"}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* --- Column 2: Visualization --- */}
      <div className="array-visualization-column">
        {/* Title removed, implied */}
        <div className="array-container" ref={containerRef}>
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                height: `${(value / MAX_VALUE) * 100}%`,
                width: `${100 / size}%` // Bar width adjusts to size
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VisualizerPage;
