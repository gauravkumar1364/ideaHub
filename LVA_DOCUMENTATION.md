# Live Variable Analysis Tool

## Overview

This tool performs **Live Variable Analysis (LVA)** on JavaScript code using Babel for parsing and custom visitor patterns for backward dataflow analysis. It's designed as a Software Testing college project to demonstrate compiler optimization techniques and program analysis.

## Features

- ✅ **JavaScript Code Parsing** - Uses Babel parser to generate Abstract Syntax Tree (AST)
- ✅ **Control Flow Graph (CFG)** - Builds simplified CFG from the code
- ✅ **GEN/KILL Sets** - Calculates which variables are used and defined at each statement
- ✅ **Backward Dataflow Analysis** - Computes live variables at each program point
- ✅ **Web-based Interface** - Interactive UI to input code and view results
- ✅ **Example Test Cases** - Pre-loaded examples demonstrating various scenarios
- ✅ **Line-by-Line Visualization** - Shows live variables at each line of code
- ✅ **Statement Details** - Displays IN/OUT sets and GEN/KILL for each statement

## What is Live Variable Analysis?

Live Variable Analysis is a **backward dataflow analysis** technique used in compilers to determine which variables are "live" at each program point.

### Definition

A variable `v` is **live** at a program point `p` if:
- There exists a path from `p` to a use of `v`
- The path does not redefine `v`

### Key Concepts

- **GEN[s]**: Variables that are **used** (referenced) in statement `s`
- **KILL[s]**: Variables that are **defined** (assigned) in statement `s`
- **IN[s]**: Variables that are live at the **entry** of statement `s`
- **OUT[s]**: Variables that are live at the **exit** of statement `s`

### Dataflow Equations

```
IN[s] = GEN[s] ∪ (OUT[s] - KILL[s])
OUT[s] = ∪ IN[successor of s]
```

The analysis proceeds **backward** from the end of the program to the beginning, iterating until a fixed point is reached.

## Architecture

### Backend Components

```
backend/
├── lva/
│   ├── analyzer.js      # Core LVA implementation
│   └── examples.js      # Test case examples
└── routes/
    └── lva.js           # API endpoints
```

#### API Endpoints

1. **POST /api/lva/analyze**
   - Accepts JavaScript code
   - Returns analysis results with live variables, GEN/KILL sets, and CFG
   
2. **GET /api/lva/examples**
   - Returns list of example code snippets
   
3. **GET /api/lva/example/:id**
   - Returns specific example with pre-computed analysis

### Frontend Component

```
frontend/src/pages/LiveVariableAnalysis.jsx
```

Features:
- Code editor textarea
- Three tabs: Editor, Results, CFG
- Example code loading
- Line-by-line analysis display
- Statement details view
- Control flow visualization

## Usage

### Starting the Application

1. **Start Backend** (in one terminal):
   ```bash
   cd backend
   npm install
   node server.js
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the Tool**:
   - Navigate to http://localhost:5173/lva
   - Or click the Activity icon in the navbar

### Using the Tool

1. **Select an Example** - Click one of the pre-loaded example buttons
2. **Or Enter Your Own Code** - Type JavaScript code in the editor
3. **Click "Analyze Code"** - Run the analysis
4. **View Results**:
   - **Results Tab**: See line-by-line live variables and GEN/KILL sets
   - **CFG Tab**: View the control flow graph structure
5. **Explore Statement Details** - Examine IN/OUT sets for each statement

## Example Code Snippets

### 1. Simple Assignment
```javascript
let x = 5;
let y = 10;
let z = x + y;
console.log(z);
```

**Analysis**:
- At line 3: `x` and `y` are live (needed for `x + y`)
- At line 4: `z` is live (needed for `console.log`)
- After line 4: No variables are live

### 2. Variable Reassignment
```javascript
let x = 1;
x = x + 1;
x = x * 2;
let y = x;
y = y + 5;
```

**Analysis**:
- Shows how variables become live before use and die after being killed
- Demonstrates the use-def chain

### 3. Dead Code Detection
```javascript
let x = 5;
let y = 10;
let z = x + y;
x = 20;  // Dead code - x is redefined but never used
y = 30;  // Dead code - y is redefined but never used
console.log(z);
```

**Analysis**:
- Identifies that `x` and `y` assignments on lines 4-5 are dead (not live out)

## Technical Implementation

### 1. Parsing with Babel

```javascript
const parser = require('@babel/parser');
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx'],
});
```

### 2. Building Control Flow Graph

- Traverses AST to collect all statements
- Orders statements by line number
- Creates simplified sequential CFG (can be extended for branches/loops)

### 3. GEN/KILL Set Calculation

For each statement:
- **GEN**: Find all identifier references (variables used)
- **KILL**: Find all assignments/declarations (variables defined)

Uses Babel's AST traversal:
```javascript
traverse(ast, {
  Identifier(path) {
    if (path.isReferencedIdentifier()) {
      // Check if it's used or defined
    }
  }
});
```

### 4. Backward Dataflow Analysis

```javascript
// Initialize
for each statement s:
  IN[s] = ∅
  OUT[s] = ∅

// Iterate until fixed point
while (changed):
  for each statement s (in reverse order):
    OUT[s] = ∪ IN[successor]
    IN[s] = GEN[s] ∪ (OUT[s] - KILL[s])
```

### 5. Result Formatting

- Maps statements to lines
- Creates line-by-line view
- Formats for web display

## Limitations and Extensions

### Current Limitations

1. **Simplified CFG**: Sequential flow only (no complex branching/loop analysis)
2. **Top-level Only**: Doesn't analyze nested functions
3. **No Interprocedural Analysis**: Each function analyzed in isolation
4. **Basic Data Types**: Focuses on simple variables, not complex objects

### Possible Extensions

- ✨ Full CFG with branches, loops, and function calls
- ✨ Reaching definitions analysis
- ✨ Available expressions analysis
- ✨ Dead code elimination
- ✨ Register allocation hints
- ✨ Visualization with graph diagrams
- ✨ Support for more JavaScript features (async/await, classes, etc.)

## Use Cases

### 1. Educational
- Teaching compiler optimization
- Understanding dataflow analysis
- Learning AST manipulation

### 2. Code Optimization
- Identifying dead code
- Register allocation preparation
- Variable liveness for garbage collection

### 3. Static Analysis
- Bug detection (uninitialized variables)
- Security analysis (taint analysis foundation)
- Code quality metrics

## Dependencies

### Backend
- `@babel/parser` - JavaScript parsing
- `@babel/traverse` - AST traversal
- `@babel/types` - AST node type checking
- `express` - Web server

### Frontend
- `react` - UI framework
- `axios` - HTTP client
- `react-router-dom` - Routing

## Testing

The tool includes 10 example test cases covering:
- Simple assignments
- Conditional statements
- Loops
- Multiple operations
- Reassignments
- Function calls
- Array operations
- Increment/decrement
- Complex dataflow
- Dead code scenarios

## References

1. **Compilers: Principles, Techniques, and Tools** (Dragon Book) - Aho, Lam, Sethi, Ullman
2. **Modern Compiler Implementation** - Andrew Appel
3. **Babel Documentation** - https://babeljs.io/docs/
4. **Static Program Analysis** - Anders Møller and Michael I. Schwartzbach

## Author

Created as a Software Testing college project demonstrating live variable analysis using modern JavaScript tooling.

## License

MIT License - Free to use for educational purposes.
