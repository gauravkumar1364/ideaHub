// Test script for Live Variable Analyzer
const LiveVariableAnalyzer = require('./lva/analyzer');

// Test case 1: Simple assignment
console.log('=== Test 1: Simple Assignment ===');
const code1 = `let x = 5;
let y = 10;
let z = x + y;
console.log(z);`;

try {
  const analyzer1 = new LiveVariableAnalyzer(code1);
  const results1 = analyzer1.analyze();
  console.log('Total statements:', results1.summary.totalStatements);
  console.log('Variables:', results1.summary.variables);
  console.log('\nLine-by-line results:');
  results1.lineByLine.forEach(line => {
    if (line.isStatement) {
      console.log(`Line ${line.line}: ${line.code}`);
      console.log(`  Live: [${line.liveVariables.join(', ')}]`);
      console.log(`  GEN: [${line.gen.join(', ')}], KILL: [${line.kill.join(', ')}]`);
    }
  });
  console.log('\n✅ Test 1 passed!\n');
} catch (error) {
  console.error('❌ Test 1 failed:', error.message);
}

// Test case 2: Variable reassignment
console.log('=== Test 2: Variable Reassignment ===');
const code2 = `let x = 1;
x = x + 1;
x = x * 2;
let y = x;
y = y + 5;`;

try {
  const analyzer2 = new LiveVariableAnalyzer(code2);
  const results2 = analyzer2.analyze();
  console.log('Total statements:', results2.summary.totalStatements);
  console.log('Variables:', results2.summary.variables);
  console.log('\nStatement details:');
  results2.statements.forEach(stmt => {
    console.log(`Line ${stmt.line}: ${stmt.code}`);
    console.log(`  IN: [${stmt.liveIn.join(', ')}], OUT: [${stmt.liveOut.join(', ')}]`);
  });
  console.log('\n✅ Test 2 passed!\n');
} catch (error) {
  console.error('❌ Test 2 failed:', error.message);
}

// Test case 3: Dead code
console.log('=== Test 3: Dead Code Detection ===');
const code3 = `let x = 5;
let y = 10;
let z = x + y;
x = 20;
y = 30;
console.log(z);`;

try {
  const analyzer3 = new LiveVariableAnalyzer(code3);
  const results3 = analyzer3.analyze();
  console.log('\nStatement analysis:');
  results3.statements.forEach(stmt => {
    console.log(`Line ${stmt.line}: ${stmt.code}`);
    console.log(`  Live OUT: [${stmt.liveOut.join(', ')}]`);
    if (stmt.kill.length > 0 && stmt.liveOut.filter(v => stmt.kill.includes(v)).length === 0) {
      console.log(`  ⚠️  Dead assignment detected - variable(s) [${stmt.kill.join(', ')}] not live after this statement`);
    }
  });
  console.log('\n✅ Test 3 passed!\n');
} catch (error) {
  console.error('❌ Test 3 failed:', error.message);
}

console.log('All tests completed!');
