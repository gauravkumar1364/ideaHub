/**
 * Example JavaScript code snippets for Live Variable Analysis
 */

const examples = [
  {
    id: 'simple',
    title: 'Simple Assignment',
    description: 'Basic variable assignments and usage',
    code: `let x = 5;
let y = 10;
let z = x + y;
console.log(z);`,
  },
  {
    id: 'conditional',
    title: 'Conditional Statement',
    description: 'Variables in if-else blocks',
    code: `let a = 10;
let b = 20;
if (a > b) {
  let c = a;
} else {
  let c = b;
}
console.log(a, b);`,
  },
  {
    id: 'loop',
    title: 'Loop Example',
    description: 'Variables in a for loop',
    code: `let sum = 0;
let i = 0;
for (i = 1; i <= 5; i++) {
  sum = sum + i;
}
console.log(sum);`,
  },
  {
    id: 'multiple',
    title: 'Multiple Operations',
    description: 'Multiple variable operations',
    code: `let a = 5;
let b = 10;
let c = a + b;
a = c * 2;
b = a - c;
let result = a + b + c;`,
  },
  {
    id: 'reassignment',
    title: 'Variable Reassignment',
    description: 'Variables being reassigned',
    code: `let x = 1;
x = x + 1;
x = x * 2;
let y = x;
y = y + 5;`,
  },
  {
    id: 'function',
    title: 'Function Call',
    description: 'Variables with function calls',
    code: `let num = 10;
let square = num * num;
console.log(square);
let cube = square * num;
console.log(cube);`,
  },
  {
    id: 'array',
    title: 'Array Operations',
    description: 'Working with arrays',
    code: `let arr = [1, 2, 3];
let first = arr[0];
let sum = first + arr[1];
arr[2] = sum;`,
  },
  {
    id: 'increment',
    title: 'Increment/Decrement',
    description: 'Using ++ and -- operators',
    code: `let counter = 0;
counter++;
let temp = counter;
counter--;
let result = temp + counter;`,
  },
  {
    id: 'complex',
    title: 'Complex Example',
    description: 'More complex dataflow',
    code: `let a = 5;
let b = 10;
let c = 15;
let temp = a + b;
a = temp * c;
b = a - temp;
c = b + temp;
let final = a + b + c;`,
  },
  {
    id: 'dead_code',
    title: 'Dead Code Detection',
    description: 'Variables that are assigned but never used',
    code: `let x = 5;
let y = 10;
let z = x + y;
x = 20;
y = 30;
console.log(z);`,
  },
];

module.exports = examples;
