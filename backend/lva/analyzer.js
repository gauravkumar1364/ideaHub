const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

/**
 * Live Variable Analysis (LVA) Tool
 * Performs backward dataflow analysis to determine which variables are live at each program point
 */

class LiveVariableAnalyzer {
  constructor(code) {
    this.code = code;
    this.ast = null;
    this.cfg = [];
    this.liveVariables = new Map();
    this.genSets = new Map();
    this.killSets = new Map();
  }

  /**
   * Main analysis function
   */
  analyze() {
    try {
      // Step 1: Parse the code
      this.ast = parser.parse(this.code, {
        sourceType: 'module',
        plugins: ['jsx'],
      });

      // Step 2: Build CFG and collect statements
      this.buildCFG();

      // Step 3: Calculate GEN and KILL sets
      this.calculateGenKillSets();

      // Step 4: Perform backward dataflow analysis
      this.performDataflowAnalysis();

      // Step 5: Format results
      return this.formatResults();
    } catch (error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  /**
   * Build Control Flow Graph
   */
  buildCFG() {
    const statements = [];
    let statementId = 0;
    const self = this;

    traverse(this.ast, {
      // Track all statements with their line numbers
      Statement(path) {
        // Skip nested function declarations - analyze only top-level for simplicity
        if (path.getFunctionParent() && path.getFunctionParent().node !== path.node) {
          return;
        }

        const node = path.node;
        if (node.loc) {
          statements.push({
            id: statementId++,
            line: node.loc.start.line,
            type: node.type,
            node: node,
            code: self.getCodeForNode(node),
          });
        }
      },
    });

    // Sort by line number
    this.cfg = statements.sort((a, b) => a.line - b.line);
  }

  /**
   * Get code snippet for a node
   */
  getCodeForNode(node) {
    if (!node.loc) return '';
    const lines = this.code.split('\n');
    const startLine = node.loc.start.line - 1;
    const endLine = node.loc.end.line - 1;
    
    if (startLine === endLine) {
      const line = lines[startLine];
      return line.substring(node.loc.start.column, node.loc.end.column);
    }
    
    // Multi-line statement
    const codeLines = [];
    for (let i = startLine; i <= endLine; i++) {
      if (i === startLine) {
        codeLines.push(lines[i].substring(node.loc.start.column));
      } else if (i === endLine) {
        codeLines.push(lines[i].substring(0, node.loc.end.column));
      } else {
        codeLines.push(lines[i]);
      }
    }
    return codeLines.join('\n');
  }

  /**
   * Calculate GEN and KILL sets for each statement
   */
  calculateGenKillSets() {
    this.cfg.forEach((stmt) => {
      const gen = new Set();
      const kill = new Set();

      // Find variables used (GEN) and defined (KILL)
      traverse(
        t.file(t.program([stmt.node])),
        {
          Identifier(path) {
            const name = path.node.name;
            
            // Check if it's a variable reference (not a property or function name)
            if (path.isReferencedIdentifier()) {
              // If it's on the left side of an assignment, it's killed
              if (isLeftHandSideOfAssignment(path)) {
                kill.add(name);
              } else {
                // Otherwise, it's used (generated/needed)
                gen.add(name);
              }
            }
          },
          VariableDeclarator(path) {
            // Variable declarations kill the variable
            if (t.isIdentifier(path.node.id)) {
              kill.add(path.node.id.name);
            }
            // Pattern matching for destructuring
            if (t.isObjectPattern(path.node.id) || t.isArrayPattern(path.node.id)) {
              extractIdentifiersFromPattern(path.node.id).forEach(name => kill.add(name));
            }
          },
          AssignmentExpression(path) {
            // Left side is killed
            if (t.isIdentifier(path.node.left)) {
              kill.add(path.node.left.name);
            }
            if (t.isMemberExpression(path.node.left) && t.isIdentifier(path.node.left.object)) {
              // For member expressions like obj.prop = value, obj is used
              gen.add(path.node.left.object.name);
            }
          },
          UpdateExpression(path) {
            // i++, ++i, i--, --i both use and kill the variable
            if (t.isIdentifier(path.node.argument)) {
              const name = path.node.argument.name;
              gen.add(name); // Used before update
              kill.add(name); // Then redefined
            }
          },
        },
        undefined,
        {}
      );

      // Remove variables that are both generated and killed (killed takes precedence)
      kill.forEach((v) => gen.delete(v));

      this.genSets.set(stmt.id, gen);
      this.killSets.set(stmt.id, kill);
    });
  }

  /**
   * Perform backward dataflow analysis
   */
  performDataflowAnalysis() {
    // Initialize: OUT[exit] = empty, OUT[all others] = empty
    const liveOut = new Map();
    const liveIn = new Map();

    this.cfg.forEach((stmt) => {
      liveOut.set(stmt.id, new Set());
      liveIn.set(stmt.id, new Set());
    });

    // Iterative algorithm until fixed point
    let changed = true;
    let iterations = 0;
    const maxIterations = 100;

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      // Process statements in reverse order (backward analysis)
      for (let i = this.cfg.length - 1; i >= 0; i--) {
        const stmt = this.cfg[i];
        
        // OUT[n] = Union of IN[s] for all successors s
        const newOut = new Set();
        if (i < this.cfg.length - 1) {
          // Successor is the next statement
          const successor = this.cfg[i + 1];
          liveIn.get(successor.id).forEach((v) => newOut.add(v));
        }

        // IN[n] = GEN[n] ∪ (OUT[n] - KILL[n])
        const newIn = new Set(this.genSets.get(stmt.id));
        const outMinusKill = new Set([...newOut].filter(
          (v) => !this.killSets.get(stmt.id).has(v)
        ));
        outMinusKill.forEach((v) => newIn.add(v));

        // Check if changed
        if (!setsEqual(liveIn.get(stmt.id), newIn) || !setsEqual(liveOut.get(stmt.id), newOut)) {
          changed = true;
        }

        liveIn.set(stmt.id, newIn);
        liveOut.set(stmt.id, newOut);
      }
    }

    this.liveVariables = { liveIn, liveOut };
  }

  /**
   * Format results for API response
   */
  formatResults() {
    const lines = this.code.split('\n');
    const results = {
      totalLines: lines.length,
      statements: [],
      cfg: [],
      summary: {
        totalStatements: this.cfg.length,
        variables: this.extractAllVariables(),
      },
    };

    // Map statements to line-based results
    const lineMap = new Map();
    
    this.cfg.forEach((stmt) => {
      const gen = Array.from(this.genSets.get(stmt.id) || []).sort();
      const kill = Array.from(this.killSets.get(stmt.id) || []).sort();
      const liveIn = Array.from(this.liveVariables.liveIn.get(stmt.id) || []).sort();
      const liveOut = Array.from(this.liveVariables.liveOut.get(stmt.id) || []).sort();

      const stmtData = {
        id: stmt.id,
        line: stmt.line,
        code: stmt.code.trim(),
        type: stmt.type,
        gen: gen,
        kill: kill,
        liveIn: liveIn,
        liveOut: liveOut,
      };

      results.statements.push(stmtData);
      results.cfg.push({
        id: stmt.id,
        line: stmt.line,
        successor: stmt.id < this.cfg.length - 1 ? this.cfg[stmt.id + 1].id : null,
      });

      lineMap.set(stmt.line, stmtData);
    });

    // Create line-by-line view
    results.lineByLine = lines.map((code, idx) => {
      const lineNum = idx + 1;
      const stmtData = lineMap.get(lineNum);
      
      return {
        line: lineNum,
        code: code,
        isStatement: !!stmtData,
        liveVariables: stmtData ? stmtData.liveIn : [],
        gen: stmtData ? stmtData.gen : [],
        kill: stmtData ? stmtData.kill : [],
      };
    });

    return results;
  }

  /**
   * Extract all variables mentioned in the code
   */
  extractAllVariables() {
    const variables = new Set();
    
    this.genSets.forEach((genSet) => {
      genSet.forEach((v) => variables.add(v));
    });
    
    this.killSets.forEach((killSet) => {
      killSet.forEach((v) => variables.add(v));
    });

    return Array.from(variables).sort();
  }
}

/**
 * Helper: Check if identifier is on left side of assignment
 */
function isLeftHandSideOfAssignment(path) {
  const parent = path.parent;
  if (t.isAssignmentExpression(parent)) {
    return path.node === parent.left || isDescendantOf(path.node, parent.left);
  }
  return false;
}

/**
 * Helper: Check if node is descendant of another
 */
function isDescendantOf(node, potentialAncestor) {
  if (!potentialAncestor) return false;
  if (node === potentialAncestor) return true;
  
  // Simple check for member expressions
  if (t.isMemberExpression(potentialAncestor)) {
    return node === potentialAncestor.object || node === potentialAncestor.property;
  }
  
  return false;
}

/**
 * Helper: Extract identifiers from patterns (destructuring)
 */
function extractIdentifiersFromPattern(pattern) {
  const identifiers = [];
  
  if (t.isObjectPattern(pattern)) {
    pattern.properties.forEach((prop) => {
      if (t.isObjectProperty(prop) && t.isIdentifier(prop.value)) {
        identifiers.push(prop.value.name);
      } else if (t.isRestElement(prop) && t.isIdentifier(prop.argument)) {
        identifiers.push(prop.argument.name);
      }
    });
  } else if (t.isArrayPattern(pattern)) {
    pattern.elements.forEach((elem) => {
      if (t.isIdentifier(elem)) {
        identifiers.push(elem.name);
      } else if (t.isRestElement(elem) && t.isIdentifier(elem.argument)) {
        identifiers.push(elem.argument.name);
      }
    });
  }
  
  return identifiers;
}

/**
 * Helper: Check if two sets are equal
 */
function setsEqual(set1, set2) {
  if (set1.size !== set2.size) return false;
  for (const item of set1) {
    if (!set2.has(item)) return false;
  }
  return true;
}

module.exports = LiveVariableAnalyzer;
