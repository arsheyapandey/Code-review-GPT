    // Helper function to pause execution
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const getBars = () => document.getElementsByClassName('array-bar');

    // --- Code Strings for Display ---
    // Line numbers correspond to the lines within these strings
    export const algorithmCode = {
      bubbleSort: `async function bubbleSort(arr, setArray, setHighlightedLines, speed) {
      let n = arr.length;
      const bars = getBars();

      for (let i = 0; i < n - 1; i++) { // Line 5
        for (let j = 0; j < n - i - 1; j++) { // Line 6
          setHighlightedLines([7]); // Highlight inner loop line
          if (!bars[j] || !bars[j+1]) return; // Line 8
          bars[j].style.backgroundColor = '#a679f5'; // Line 9
          bars[j + 1].style.backgroundColor = '#a679f5'; // Line 10
          await sleep(speed); // Line 11

          setHighlightedLines([13]); // Highlight comparison line
          if (arr[j] > arr[j + 1]) { // Line 14
            setHighlightedLines([15, 16]); // Highlight swap lines
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Line 16
            setArray([...arr]); // Line 17
            await sleep(speed); // Line 18
          }
          setHighlightedLines([20, 21]); // Highlight color revert lines
          bars[j].style.backgroundColor = '#ccc'; // Line 21
          bars[j + 1].style.backgroundColor = '#ccc'; // Line 22
        }
        setHighlightedLines([24]); // Highlight sorted mark line
        if (bars[n - 1 - i]) bars[n - 1 - i].style.backgroundColor = '#32CD32'; // Line 25
      }
      setHighlightedLines([27]); // Highlight final mark line
      if (bars[0]) bars[0].style.backgroundColor = '#32CD32'; // Line 28
      setHighlightedLines([]); // Clear highlights
    }`, // Line 30
      insertionSort: `async function insertionSort(arr, setArray, setHighlightedLines, speed) {
      let n = arr.length;
      const bars = getBars();

      for (let i = 1; i < n; i++) { // Line 5
        let key = arr[i]; // Line 6
        let j = i - 1; // Line 7
        // Highlight key element
        setHighlightedLines([9]);
        if(bars[i]) bars[i].style.backgroundColor = '#FF4500'; // Line 10
        await sleep(speed); // Line 11

        // Highlight while loop condition
        setHighlightedLines([14]);
        while (j >= 0 && arr[j] > key) { // Line 14
            // Highlight comparison bar
            setHighlightedLines([16, 17]);
            if(!bars[j]) return; // Line 17
            bars[j].style.backgroundColor = '#a679f5'; // Line 18
            // Shift element
            setHighlightedLines([20, 21]);
            arr[j + 1] = arr[j]; // Line 21
            setArray([...arr]); // Line 22
            await sleep(speed); // Line 23
            // Revert color
            setHighlightedLines([25]);
            bars[j].style.backgroundColor = '#ccc'; // Line 26
            j = j - 1; // Line 27
            setHighlightedLines([14]); // Back to while
        }
        // Place key in correct position
        setHighlightedLines([30, 31]);
        arr[j + 1] = key; // Line 31
        setArray([...arr]); // Line 32
        // Revert key color
        setHighlightedLines([34]);
        if(bars[i]) bars[i].style.backgroundColor = '#ccc'; // Line 35
        setHighlightedLines([5]); // Back to outer loop
      }
      setHighlightedLines([]); // Final clear
      // Final sorted color sweep (optional, can be done in component)
    }`,
      selectionSort: `async function selectionSort(arr, setArray, setHighlightedLines, speed) {
      let n = arr.length;
      const bars = getBars();

      for (let i = 0; i < n - 1; i++) { // Line 5
        let min_idx = i; // Line 6
        // Assume current is minimum
        setHighlightedLines([8]);
        if(bars[min_idx]) bars[min_idx].style.backgroundColor = '#FF4500'; // Line 9

        for (let j = i + 1; j < n; j++) { // Line 11
            // Bar being compared
            setHighlightedLines([13, 14]);
            if(!bars[j]) return; // Line 14
            bars[j].style.backgroundColor = '#a679f5'; // Line 15
            await sleep(speed); // Line 16

            setHighlightedLines([18]);
            if (arr[j] < arr[min_idx]) { // Line 18
                // Un-mark old minimum
                setHighlightedLines([20]);
                if(bars[min_idx]) bars[min_idx].style.backgroundColor = '#ccc'; // Line 21
                min_idx = j; // Line 22
                // Mark new minimum
                setHighlightedLines([24]);
                if(bars[min_idx]) bars[min_idx].style.backgroundColor = '#FF4500'; // Line 25
            } else {
                // Revert if not smaller
                setHighlightedLines([28]);
                if(bars[j]) bars[j].style.backgroundColor = '#ccc'; // Line 29
            }
            setHighlightedLines([11]); // Back to inner loop
        }
        // Swap the found minimum element
        setHighlightedLines([32, 33]);
        [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]]; // Line 33
        setArray([...arr]); // Line 34

        // Revert minimum color, mark sorted
        setHighlightedLines([37]);
        if(bars[min_idx]) bars[min_idx].style.backgroundColor = '#ccc'; // Line 38
        setHighlightedLines([39]);
        if(bars[i]) bars[i].style.backgroundColor = '#32CD32'; // Line 40
        setHighlightedLines([5]); // Back to outer loop
      }
      // Mark last element sorted
      setHighlightedLines([43]);
      if(bars[n-1]) bars[n-1].style.backgroundColor = '#32CD32'; // Line 44
       setHighlightedLines([]); // Final clear
    }`,
      mergeSort: `// Merge Sort visualization with line highlighting is complex
    // due to recursion and the animation array approach.
    // This requires a different strategy than the others.
    // Placeholder code:
    async function mergeSort(arr, setArray, setHighlightedLines, speed) {
      console.log("Merge Sort highlighting not implemented in this version.");
      setHighlightedLines([]);
      // Basic non-highlighting animation from previous version:
      const animations = getMergeSortAnimations(arr);
      const bars = getBars();
      const MAX_VALUE = 100; // Assuming max value for height calc
      for (let i = 0; i < animations.length; i++) {
        const isColorChange = i % 3 !== 2;
        if (isColorChange) {
          const [barOneIdx, barTwoIdx] = animations[i];
          const color = i % 3 === 0 ? '#a679f5' : '#ccc';
          if (bars[barOneIdx] && bars[barTwoIdx]) {
             await sleep(speed);
             bars[barOneIdx].style.backgroundColor = color;
             bars[barTwoIdx].style.backgroundColor = color;
          }
        } else {
          await sleep(speed);
          const [barOneIdx, newHeightValue] = animations[i];
          if (bars[barOneIdx]) {
             bars[barOneIdx].style.height = \`\${(newHeightValue / MAX_VALUE) * 100}%\`;
          }
        }
         if(!bars[0]) return; // Stop if unmounted
      }
      // Final sorted color sweep needed here too
    }`
    };

    // --- Bubble Sort ---
    export async function bubbleSort(array, setArray, setHighlightedLines, speed) { // Added setHighlightedLines
      let arr = [...array];
      let n = arr.length;
      const bars = getBars();

      setHighlightedLines([5]); // Line 5: Outer loop start
      for (let i = 0; i < n - 1; i++) {
        setHighlightedLines([6]); // Line 6: Inner loop start
        for (let j = 0; j < n - i - 1; j++) {
          setHighlightedLines([8, 9, 10]); // Lines 8-10: Bar access and coloring
          if (!bars[j] || !bars[j+1]) return;
          bars[j].style.backgroundColor = '#a679f5';
          bars[j + 1].style.backgroundColor = '#a679f5';
          await sleep(speed); // Line 11

          setHighlightedLines([14]); // Line 14: Comparison
          if (arr[j] > arr[j + 1]) {
            setHighlightedLines([16, 17, 18]); // Lines 16-18: Swap logic
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]);
            await sleep(speed);
          }
          setHighlightedLines([21, 22]); // Lines 21-22: Color revert
          bars[j].style.backgroundColor = '#ccc';
          bars[j + 1].style.backgroundColor = '#ccc';
        }
        setHighlightedLines([25]); // Line 25: Mark element as sorted
        if (bars[n - 1 - i]) bars[n - 1 - i].style.backgroundColor = '#32CD32';
      }
      setHighlightedLines([28]); // Line 28: Mark first element as sorted
      if (bars[0]) bars[0].style.backgroundColor = '#32CD32';
      setHighlightedLines([]); // Line 30: Clear highlights when done
    }


    // --- Insertion Sort ---
    export async function insertionSort(array, setArray, setHighlightedLines, speed) {
        let arr = [...array];
        let n = arr.length;
        const bars = getBars();
        setHighlightedLines([5]); // Start of outer loop
        for (let i = 1; i < n; i++) {
            setHighlightedLines([6, 7]); // Key assignment
            let key = arr[i];
            let j = i - 1;
            setHighlightedLines([10]); // Highlight key element bar
            if(bars[i]) bars[i].style.backgroundColor = '#FF4500';
            await sleep(speed); // Line 11

            setHighlightedLines([14]); // While loop condition
            while (j >= 0 && arr[j] > key) { // Line 14
                setHighlightedLines([17, 18]); // Highlight comparison bar
                if(!bars[j]) return; // Line 17
                bars[j].style.backgroundColor = '#a679f5'; // Line 18
                setHighlightedLines([21, 22]); // Shift element
                arr[j + 1] = arr[j]; // Line 21
                setArray([...arr]); // Line 22
                await sleep(speed); // Line 23
                setHighlightedLines([26]); // Revert color
                bars[j].style.backgroundColor = '#ccc'; // Line 26
                j = j - 1; // Line 27
                setHighlightedLines([14]); // Back to while
            }
            setHighlightedLines([31, 32]); // Place key
            arr[j + 1] = key; // Line 31
            setArray([...arr]); // Line 32
            setHighlightedLines([35]); // Revert key color
            if(bars[i]) bars[i].style.backgroundColor = '#ccc'; // Line 35
            setHighlightedLines([5]); // Back to outer loop
        }
         setHighlightedLines([]); // Final clear
         // Final color sweep can be done in component after promise resolves
    }
    // --- Selection Sort ---
    export async function selectionSort(array, setArray, setHighlightedLines, speed) {
        let arr = [...array];
        let n = arr.length;
        const bars = getBars();
        setHighlightedLines([5]); // Outer loop start
        for (let i = 0; i < n - 1; i++) {
            setHighlightedLines([6]); // Min index init
            let min_idx = i;
            setHighlightedLines([9]); // Highlight assumed minimum
            if(bars[min_idx]) bars[min_idx].style.backgroundColor = '#FF4500'; // Line 9

            setHighlightedLines([11]); // Inner loop start
            for (let j = i + 1; j < n; j++) { // Line 11
                setHighlightedLines([14, 15]); // Highlight comparison bar
                if(!bars[j]) return; // Line 14
                bars[j].style.backgroundColor = '#a679f5'; // Line 15
                await sleep(speed); // Line 16

                setHighlightedLines([18]); // If condition line 18
                if (arr[j] < arr[min_idx]) { // Line 18
                    setHighlightedLines([21]); // Unmark old min line 21
                    if(bars[min_idx]) bars[min_idx].style.backgroundColor = '#ccc'; // Line 21
                    min_idx = j; // Line 22
                    setHighlightedLines([25]); // Mark new min line 25
                    if(bars[min_idx]) bars[min_idx].style.backgroundColor = '#FF4500'; // Line 25
                } else {
                    setHighlightedLines([29]); // Revert if not smaller line 29
                    if(bars[j]) bars[j].style.backgroundColor = '#ccc'; // Line 29
                }
                setHighlightedLines([11]); // Back to inner loop start line 11
            }
            setHighlightedLines([33, 34]); // Swap lines 33, 34
            [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]]; // Line 33
            setArray([...arr]); // Line 34

            setHighlightedLines([38]); // Revert min color line 38
            if(bars[min_idx]) bars[min_idx].style.backgroundColor = '#ccc'; // Line 38
            setHighlightedLines([40]); // Mark as sorted line 40
            if(bars[i]) bars[i].style.backgroundColor = '#32CD32'; // Line 40
            setHighlightedLines([5]); // Back to outer loop start line 5
        }
        setHighlightedLines([44]); // Mark last as sorted line 44
        if(bars[n-1]) bars[n-1].style.backgroundColor = '#32CD32'; // Line 44
         setHighlightedLines([]); // Final clear
    }

    // --- Merge Sort ---
    // Using animation array approach for Merge Sort as direct state updates
    // with async/await in recursion is much harder to manage visually.
    export async function mergeSort(array, setArray, setHighlightedLines, speed) {
        console.log("Merge Sort highlighting not implemented yet for this animation method.");
        setHighlightedLines([]); // Clear any previous highlights

        const animations = getMergeSortAnimations(array);
        const bars = getBars();
        const MAX_VALUE = 100; // Need this, assuming max value is 100

        for (let i = 0; i < animations.length; i++) {
            // Check frequently if component is still mounted
            if (!bars || bars.length === 0 || !bars[0]) return;

            const isColorChange = i % 3 !== 2;
            if (isColorChange) {
                const [barOneIdx, barTwoIdx] = animations[i];
                // Check if indices are valid
                if (bars[barOneIdx] && bars[barTwoIdx]) {
                    const color = i % 3 === 0 ? '#a679f5' : '#ccc'; // Purple for comparison, grey to revert
                    // Use requestAnimationFrame for smoother visual updates potentially
                    // requestAnimationFrame(() => {
                        bars[barOneIdx].style.backgroundColor = color;
                        bars[barTwoIdx].style.backgroundColor = color;
                    // });
                }
            } else {
                const [barOneIdx, newHeightValue] = animations[i];
                 // Check if index is valid
                if (bars[barOneIdx]) {
                    // requestAnimationFrame(() => {
                        bars[barOneIdx].style.height = `${(newHeightValue / MAX_VALUE) * 100}%`;
                    // });
                }
            }
             // Add sleep *after* applying changes for this step
             await sleep(speed);
        }
        // Final sorted color sweep can be done in the component after promise resolves
    }


    // Helper function that returns an array of animations for Merge Sort
    function getMergeSortAnimations(array) {
        const animations = [];
        if (array.length <= 1) return animations; // Return empty animations for base case
        const auxiliaryArray = array.slice();
        mergeSortHelperAnims(array.slice(), 0, array.length - 1, auxiliaryArray, animations);
        return animations;
    }

    function mergeSortHelperAnims(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
        if (startIdx === endIdx) return;
        const middleIdx = Math.floor((startIdx + endIdx) / 2);
        mergeSortHelperAnims(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
        mergeSortHelperAnims(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
        doMergeAnims(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
    }

    function doMergeAnims(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
        let k = startIdx;
        let i = startIdx;
        let j = middleIdx + 1;
        while (i <= middleIdx && j <= endIdx) {
            // [barOneIdx, barTwoIdx] - Push indices to change their color (comparison).
            animations.push([i, j]);
            // [barOneIdx, barTwoIdx] - Push indices to revert their color.
            animations.push([i, j]);
            if (auxiliaryArray[i] <= auxiliaryArray[j]) {
                // [indexToOverwrite, newValue] - Overwrite index k in mainArray with value auxiliaryArray[i].
                animations.push([k, auxiliaryArray[i]]);
                mainArray[k++] = auxiliaryArray[i++];
            } else {
                // [indexToOverwrite, newValue] - Overwrite index k in mainArray with value auxiliaryArray[j].
                animations.push([k, auxiliaryArray[j]]);
                mainArray[k++] = auxiliaryArray[j++];
            }
        }
        while (i <= middleIdx) {
            animations.push([i, i]); // Compare i with itself (to highlight/revert)
            animations.push([i, i]);
            animations.push([k, auxiliaryArray[i]]); // Overwrite
            mainArray[k++] = auxiliaryArray[i++];
        }
        while (j <= endIdx) {
            animations.push([j, j]); // Compare j with itself
            animations.push([j, j]);
            animations.push([k, auxiliaryArray[j]]); // Overwrite
            mainArray[k++] = auxiliaryArray[j++];
        }
    }