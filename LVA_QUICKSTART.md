# Live Variable Analysis Tool - Quick Start Guide

## What is this?

A complete **Live Variable Analysis (LVA)** tool for JavaScript code, built as a Software Testing college project. It uses Babel for parsing and implements backward dataflow analysis to determine which variables are "live" at each program point.

## Features

✅ **JavaScript Parser** - Uses Babel to parse and analyze JavaScript code  
✅ **Dataflow Analysis** - Backward analysis to compute live variables  
✅ **GEN/KILL Sets** - Calculates which variables are used and defined  
✅ **Control Flow Graph** - Visualizes program flow  
✅ **Web Interface** - Interactive UI to analyze code  
✅ **Example Library** - 10 pre-loaded test cases  
✅ **Dead Code Detection** - Identifies unused variable assignments  

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### 2. Setup Environment

**Backend** - Create `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/ideahub
JWT_SECRET=your_secret_key
PORT=5000
```

**Frontend** - Create `frontend/.env`:
```
VITE_API=http://localhost:5000/api
```

### 3. Start the Application

```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

### 4. Access the Tool

Open your browser and navigate to:
- **Main App**: http://localhost:5173
- **LVA Tool**: http://localhost:5173/lva

Or click the Activity icon (📊) in the navigation bar.

## How to Use

1. **Select an Example** - Click one of the example buttons (e.g., "Simple Assignment")
2. **Or Write Your Own Code** - Type JavaScript in the editor
3. **Analyze** - Click "🚀 Analyze Code"
4. **View Results**:
   - **Analysis Results Tab** - See live variables, GEN/KILL sets for each line
   - **Control Flow Tab** - View the control flow graph

## Example: Dead Code Detection

```javascript
let x = 5;
let y = 10;
let z = x + y;
x = 20;  // ⚠️ Dead code! x is not used after this
y = 30;  // ⚠️ Dead code! y is not used after this
console.log(z);
```

The tool will show that `x` and `y` are not live after lines 4 and 5, indicating dead code.

## Understanding the Results

### Analysis Summary
- **Total Lines**: Number of lines in your code
- **Statements**: Number of executable statements
- **Variables**: All variables found in the code

### Line-by-Line View
- **Live Variables**: Variables that are live at the entry of this line
- **GEN**: Variables used (referenced) in this statement
- **KILL**: Variables defined (assigned) in this statement

### Statement Details
- **Live IN**: Variables live at statement entry
- **Live OUT**: Variables live at statement exit
- **Type**: AST node type (e.g., VariableDeclaration)

## API Endpoints

### Analyze Code
```bash
POST /api/lva/analyze
Content-Type: application/json

{
  "code": "let x = 5;\nlet y = x + 10;"
}
```

### Get Examples
```bash
GET /api/lva/examples
```

### Get Specific Example
```bash
GET /api/lva/example/simple
```

## Architecture

```
backend/
├── lva/
│   ├── analyzer.js     # Core LVA implementation
│   └── examples.js     # Test cases
└── routes/
    └── lva.js          # API endpoints

frontend/src/
└── pages/
    └── LiveVariableAnalysis.jsx
```

## Technical Details

### Algorithm: Backward Dataflow Analysis

```
for each statement s:
  IN[s] = GEN[s] ∪ (OUT[s] - KILL[s])
  OUT[s] = ∪ IN[successor of s]
```

### Technologies
- **Babel Parser** - JavaScript AST generation
- **Babel Traverse** - AST traversal
- **Express** - Backend API
- **React** - Frontend UI
- **Axios** - HTTP requests

## Examples Included

1. **Simple Assignment** - Basic variable usage
2. **Conditional Statement** - If-else blocks
3. **Loop Example** - For loop with variables
4. **Multiple Operations** - Complex expressions
5. **Variable Reassignment** - Redefining variables
6. **Function Call** - Variables with function calls
7. **Array Operations** - Working with arrays
8. **Increment/Decrement** - Using ++ and --
9. **Complex Example** - Advanced dataflow
10. **Dead Code Detection** - Finding unused assignments

## Use Cases

### Educational
- Teaching compiler optimization techniques
- Understanding dataflow analysis
- Learning program analysis fundamentals

### Code Optimization
- Identifying dead code
- Register allocation planning
- Variable lifetime analysis

### Static Analysis
- Finding uninitialized variables
- Security analysis foundations
- Code quality metrics

## Limitations

- **Sequential CFG**: Currently handles sequential code (basic branching support)
- **Top-level Analysis**: Doesn't analyze nested functions deeply
- **Simplified Model**: Focuses on variables, not complex objects

## Future Enhancements

- Full CFG with complex control flow
- Interprocedural analysis
- More JavaScript features (async/await, classes)
- Visual graph diagrams
- Export results to PDF/JSON
- Integration with code editors

## Troubleshooting

**Backend won't start**
- Ensure MongoDB is running (or comment out MongoDB connection for LVA-only usage)
- Check that port 5000 is available

**Frontend shows connection error**
- Verify backend is running on port 5000
- Check `VITE_API` in frontend/.env

**Analysis fails**
- Ensure code is valid JavaScript
- Check browser console for errors
- Try with one of the example snippets first

## References

- **Compilers: Principles, Techniques, and Tools** (Dragon Book)
- **Babel Documentation**: https://babeljs.io/docs/
- **Dataflow Analysis**: Modern Compiler Implementation by Andrew Appel

## License

MIT License - Free for educational use

---

**Created as a Software Testing college project demonstrating live variable analysis using modern JavaScript tooling.**
