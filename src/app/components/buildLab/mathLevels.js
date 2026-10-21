// src/app/components/buildLab/mathLevels.js
// Levels for the Math Equation Builder. Each level's `check` evaluates the
// tapped tiles as an arithmetic expression (× and ÷ before + and -, left to
// right within each pass — no eval(), just a small manual two-pass evaluator)
// and compares the result to the target.

function evaluateExpression(tiles) {
    // tiles: array like ["7", "+", "3"] — numbers and single-char operators alternating.
    if (tiles.length === 0 || tiles.length % 2 === 0) return null; // must be num, op, num, op, num...
    const nums = [];
    const ops = [];
    for (let i = 0; i < tiles.length; i++) {
        if (i % 2 === 0) {
            const n = Number(tiles[i]);
            if (Number.isNaN(n)) return null;
            nums.push(n);
        } else {
            if (!['+', '-', '×', '÷'].includes(tiles[i])) return null;
            ops.push(tiles[i]);
        }
    }
    // Pass 1: × and ÷, left to right
    let pass1Nums = [nums[0]];
    let pass1Ops = [];
    for (let i = 0; i < ops.length; i++) {
        if (ops[i] === '×' || ops[i] === '÷') {
            const a = pass1Nums.pop();
            const b = nums[i + 1];
            pass1Nums.push(ops[i] === '×' ? a * b : a / b);
        } else {
            pass1Nums.push(nums[i + 1]);
            pass1Ops.push(ops[i]);
        }
    }
    // Pass 2: + and -, left to right
    let result = pass1Nums[0];
    for (let i = 0; i < pass1Ops.length; i++) {
        result = pass1Ops[i] === '+' ? result + pass1Nums[i + 1] : result - pass1Nums[i + 1];
    }
    return result;
}

function targetCheck(target) {
    return (tiles) => evaluateExpression(tiles) === target;
}

const mathLevels = [
    {
        id: 'ml-1',
        name: 'Make 10',
        prompt: 'Build an equation that equals 10',
        bank: ['7', '3', '+', '5', '2'],
        hint: 'Try 7 + 3.',
        check: targetCheck(10),
    },
    {
        id: 'ml-2',
        name: 'Make 12',
        prompt: 'Build an equation that equals 12',
        bank: ['4', '3', '×', '6', '2', '+'],
        hint: 'Try 4 × 3.',
        check: targetCheck(12),
    },
    {
        id: 'ml-3',
        name: 'Make 20',
        prompt: 'Build an equation that equals 20',
        bank: ['15', '5', '+', '25', '5', '-'],
        hint: 'Try 15 + 5, or 25 − 5.',
        check: targetCheck(20),
    },
    {
        id: 'ml-4',
        name: 'Make 18',
        prompt: 'Build an equation that equals 18',
        bank: ['6', '3', '×', '9', '2', '×', '4'],
        hint: 'Try 6 × 3, or 9 × 2.',
        check: targetCheck(18),
    },
    {
        id: 'ml-5',
        name: 'Two Steps',
        prompt: 'Build an equation that equals 50',
        bank: ['10', '5', '×', '20', '30', '+'],
        hint: 'Try 10 × 5, or 20 + 30.',
        check: targetCheck(50),
    },
];

export default mathLevels;
