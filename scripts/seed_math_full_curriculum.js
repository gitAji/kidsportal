const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) env[key.trim()] = val.join('=').trim();
});

const projectId = env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKeyRaw = env.FIREBASE_ADMIN_PRIVATE_KEY;
if (privateKeyRaw && privateKeyRaw.startsWith('"') && privateKeyRaw.endsWith('"')) {
    privateKeyRaw = privateKeyRaw.substring(1, privateKeyRaw.length - 1);
}
const privateKey = privateKeyRaw?.replace(/\\n/g, '\n');

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore();

// ─── Helper: shuffle array ────────────────────────────────────────
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Helper: create options from correct answer + distractors ─────
function makeOptions(correct, distractors) {
    const pool = distractors.filter(d => String(d) !== String(correct));
    const picked = shuffle(pool).slice(0, 3);
    return shuffle([correct, ...picked]);
}

// ══════════════════════════════════════════════════════════════════
//  FULL CURRICULUM DATA — Grades 1-8, Levels 1-10
//  Each level has: lesson content, quiz questions (5), exam questions (5)
// ══════════════════════════════════════════════════════════════════

const curriculum = {
    // ──────────────────── GRADE 1 ────────────────────
    1: {
        levels: [
            {
                name: "Counting to 120",
                lesson: "Numbers go up in order! After 10 comes 11, after 20 comes 21. Let's practice counting from 1 to 120. Look at a number chart: every time you go DOWN a row, the first number gets bigger by 10 (10, 20, 30...).",
                quiz: [
                    { q: "What number comes right after 19?", a: "20", d: ["18", "21", "10"] },
                    { q: "Count by 10s: 10, 20, 30, ___?", a: "40", d: ["31", "50", "100"] },
                    { q: "What number is before 50?", a: "49", d: ["51", "40", "60"] },
                    { q: "If you have 99 and add 1 more, what is it?", a: "100", d: ["101", "98", "90"] },
                    { q: "Which number is the biggest?", a: "115", d: ["105", "110", "100"] }
                ],
                exam: [
                    { q: "What number comes after 119?", a: "120", d: ["118", "121", "100"] },
                    { q: "Count back: 10, 9, 8, ___?", a: "7", d: ["6", "11", "9"] },
                    { q: "Type the number that comes after 35.", a: "36", type: "identification" },
                    { q: "Which number is smaller?", a: "42", d: ["45", "50", "44"] },
                    { q: "Count by 10s: 50, 60, ___?", a: "70", d: ["80", "61", "100"] }
                ]
            },
            {
                name: "Addition to 20",
                lesson: "Addition means putting two groups together. We use a PLUS sign (+). If you have 3 apples and I give you 2 more, you have 5 apples (3 + 2 = 5). You can use your fingers, number lines, or blocks to help count them all up!",
                quiz: [
                    { q: "What is 5 + 3?", a: "8", d: ["7", "9", "6"] },
                    { q: "What is 10 + 5?", a: "15", d: ["14", "16", "20"] },
                    { q: "If you have 4 red cars and 4 blue cars, how many in total?", a: "8", d: ["7", "9", "10"] },
                    { q: "What is 6 + 0?", a: "6", d: ["0", "7", "16"] },
                    { q: "What is 7 + 7?", a: "14", d: ["12", "15", "13"] }
                ],
                exam: [
                    { q: "What is 9 + 4?", a: "13", d: ["12", "14", "15"] },
                    { q: "Sue has 8 blocks. Ali gives her 4 more. How many blocks does she have?", a: "12", d: ["11", "13", "14"] },
                    { q: "Type the answer for 10 + 10.", a: "20", type: "identification" },
                    { q: "What is 12 + 6?", a: "18", d: ["17", "16", "19"] },
                    { q: "What is 15 + 3?", a: "18", d: ["17", "19", "20"] }
                ]
            },
            {
                name: "Subtraction to 20",
                lesson: "Subtraction means taking away from a group. We use a MINUS sign (-). If you have 5 cookies and eat 2, you have 3 left (5 - 2 = 3). Think of it as counting backwards. Subtraction is the opposite of addition!",
                quiz: [
                    { q: "What is 10 - 4?", a: "6", d: ["5", "7", "8"] },
                    { q: "If you have 8 toys and lose 2, how many are left?", a: "6", d: ["7", "5", "10"] },
                    { q: "What is 15 - 5?", a: "10", d: ["11", "9", "20"] },
                    { q: "What is 9 - 9?", a: "0", d: ["1", "18", "9"] },
                    { q: "What is 12 - 3?", a: "9", d: ["8", "10", "11"] }
                ],
                exam: [
                    { q: "What is 16 - 8?", a: "8", d: ["7", "9", "10"] },
                    { q: "There are 14 birds on a branch. 4 fly away. How many are left?", a: "10", d: ["9", "11", "18"] },
                    { q: "Type the answer for 20 - 5.", a: "15", type: "identification" },
                    { q: "What is 18 - 9?", a: "9", d: ["8", "10", "7"] },
                    { q: "What is 11 - 2?", a: "9", d: ["8", "10", "13"] }
                ]
            },
            {
                name: "Place Value (Tens and Ones)",
                lesson: "Every double-digit number is made of TENS and ONES. Think of bundles of 10 sticks. In the number 24, there are 2 bundles of ten (20) and 4 single sticks (4). The first digit is the tens place, the second digit is the ones place.",
                quiz: [
                    { q: "In the number 35, which digit is in the tens place?", a: "3", d: ["5", "30", "1"] },
                    { q: "How many TENS are in the number 62?", a: "6", d: ["2", "60", "8"] },
                    { q: "What number is 4 tens and 8 ones?", a: "48", d: ["84", "408", "12"] },
                    { q: "What number is 1 ten and 5 ones?", a: "15", d: ["51", "6", "105"] },
                    { q: "In the number 91, what place is the 1 in?", a: "Ones", d: ["Tens", "Hundreds", "No place"] }
                ],
                exam: [
                    { q: "How many ones are in the number 27?", a: "7", d: ["2", "20", "9"] },
                    { q: "Type the number that is 5 tens and 0 ones.", a: "50", type: "identification" },
                    { q: "Which is bigger: 3 tens or 29 ones?", a: "3 tens (30)", d: ["29 ones", "They are equal", "Neither"] },
                    { q: "What is 8 tens equal to?", a: "80", d: ["8", "18", "800"] },
                    { q: "In the number 73, which digit is in the tens place?", a: "7", d: ["3", "70", "10"] }
                ]
            },
            {
                name: "Comparing Numbers",
                lesson: "We can compare numbers to see which is bigger or smaller. We use special mouth symbols: > (greater than, the wide open mouth eats the big number), < (less than, pointing at the small number), and = (equal to, they are the same).",
                quiz: [
                    { q: "Which number is greater: 45 or 54?", a: "54", d: ["45", "They are equal", "Cannot tell"] },
                    { q: "What symbol goes here: 10 ___ 8?", a: ">", d: ["<", "=", "+"] },
                    { q: "What symbol goes here: 12 ___ 20?", a: "<", d: [">", "=", "-"] },
                    { q: "What symbol goes here: 55 ___ 55?", a: "=", d: [">", "<", "+"] },
                    { q: "Which sentence is true?", a: "15 < 20", d: ["20 < 15", "15 > 20", "15 = 20"] }
                ],
                exam: [
                    { q: "Compare 89 and 98.", a: "89 < 98", d: ["89 > 98", "89 = 98", "98 < 89"] },
                    { q: "Type the symbol for 'equal to'.", a: "=", type: "identification" },
                    { q: "Which is the smallest number?", a: "18", d: ["21", "81", "19"] },
                    { q: "What symbol goes here: 100 ___ 99?", a: ">", d: ["<", "=", "+"] },
                    { q: "Which sentence is true?", a: "33 = 33", d: ["33 < 33", "33 > 33", "0 = 33"] }
                ]
            },
            {
                name: "Shapes 2D and 3D",
                lesson: "2D shapes are flat! Circles (0 straight sides, 0 corners), triangles (3 sides), squares (4 equal sides), rectangles (4 sides). 3D shapes pop out! Cubes (look like dice), spheres (balls), cones (ice cream cones), cylinders (soup cans).",
                quiz: [
                    { q: "How many sides does a triangle have?", a: "3", d: ["4", "2", "0"] },
                    { q: "A square has 4 sides. Are they all the same length?", a: "Yes", d: ["No", "Only two are the same", "None are the same"] },
                    { q: "Which is a 3D shape?", a: "Sphere", d: ["Circle", "Square", "Triangle"] },
                    { q: "What shape does a standard soup can look like?", a: "Cylinder", d: ["Cone", "Cube", "Sphere"] },
                    { q: "Which 2D shape has zero straight edges?", a: "Circle", d: ["Triangle", "Rectangle", "Square"] }
                ],
                exam: [
                    { q: "How many corners does a circle have?", a: "0", d: ["1", "3", "4"] },
                    { q: "Type the shape of a box with 6 square faces.", a: "cube", type: "identification" },
                    { q: "What shape has 4 sides, but only the opposite sides are the same length?", a: "Rectangle", d: ["Square", "Triangle", "Circle"] },
                    { q: "What 3D shape does a party hat look like?", a: "Cone", d: ["Cylinder", "Sphere", "Cube"] },
                    { q: "A ball is which type of shape?", a: "Sphere", d: ["Circle", "Cone", "Cylinder"] }
                ]
            },
            {
                name: "Measurement (Length)",
                lesson: "Length tells us how LONG or TALL something is. We can measure using non-standard units (like paperclips or erasers) or standard units (like inches or centimeters). Always start measuring from the very edge (the zero mark)!",
                quiz: [
                    { q: "Which is longer?", a: "A school bus", d: ["A bicycle", "A toy car", "A pencil"] },
                    { q: "Which is shorter?", a: "A baby", d: ["An adult", "A tree", "A house"] },
                    { q: "If a book is 5 paperclips long, and a pencil is 3 paperclips long, which is longer?", a: "The book", d: ["The pencil", "They are equal", "Cannot tell"] },
                    { q: "When using a ruler, where should you line up the end of your object?", a: "At the 0 mark", d: ["At the 1 mark", "In the middle", "At the 10 mark"] },
                    { q: "What do we measure when we want to know how tall a door is?", a: "Length / Height", d: ["Weight", "Time", "Color"] }
                ],
                exam: [
                    { q: "If string A is shorter than string B, and string B is shorter than string C, which is the longest?", a: "String C", d: ["String B", "String A", "They are the same"] },
                    { q: "Type the unit of length we use on small rulers in America.", a: "inch", type: "identification" },
                    { q: "Tom is taller than Sam. Sam is taller than Tim. Who is shortest?", a: "Tim", d: ["Tom", "Sam", "Not enough info"] },
                    { q: "Which tool would you use to measure a pencil?", a: "A ruler", d: ["A scale", "A clock", "A thermometer"] },
                    { q: "What does length tell us?", a: "How long something is", d: ["How heavy it is", "How hot it is", "How loud it is"] }
                ]
            },
            {
                name: "Time (Hours and Half-Hours)",
                lesson: "A clock shows time. The SHORT hand is the HOUR hand (1, 2, 3 o'clock). The LONG hand is the MINUTE hand. When the long hand points to 12, it is the top of the hour (o'clock). When the long hand points to 6, it is half-past (thirty minutes).",
                quiz: [
                    { q: "Which hand on the clock is the hour hand?", a: "The short hand", d: ["The long hand", "The fast hand", "The red hand"] },
                    { q: "If the short hand is on 4 and long hand on 12, what time is it?", a: "4:00", d: ["12:04", "4:30", "12:00"] },
                    { q: "If the short hand is between 2 and 3, and the long hand is on 6, what time is it?", a: "2:30", d: ["3:30", "6:00", "2:00"] },
                    { q: "How many minutes are in one full hour?", a: "60", d: ["30", "100", "12"] },
                    { q: "What does 'half-past two' mean?", a: "2:30", d: ["2:00", "3:00", "1:30"] }
                ],
                exam: [
                    { q: "If the minute hand points to 12, we say ___.", a: "o'clock", d: ["thirty", "fifty", "half-past"] },
                    { q: "Type the time shown: 9:00.", a: "nine o'clock", type: "identification" },
                    { q: "If the time is 5:30, what number is the long (minute) hand pointing to?", a: "6", d: ["12", "5", "3"] },
                    { q: "What hand tells us the minutes?", a: "The long hand", d: ["The short hand", "The hour hand", "None"] },
                    { q: "Which time is later in the morning?", a: "11:00 am", d: ["9:00 am", "8:30 am", "10:00 am"] }
                ]
            },
            {
                name: "Fractions (Halves and Fourths)",
                lesson: "Fractions are EQUAL parts of a whole! If you cut a pizza straight down the middle, you get 2 equal halves. Each part is 1/2. If you cut it again across the middle, you get 4 equal fourths (or quarters). Each part is 1/4. They MUST be equal size!",
                quiz: [
                    { q: "If you cut an apple into 2 EQUAL pieces, what is each piece called?", a: "A half", d: ["A fourth", "A whole", "A slice"] },
                    { q: "How many halves make a whole pizza?", a: "2", d: ["4", "1", "3"] },
                    { q: "If you cut a square into 4 EQUAL pieces, what are they called?", a: "Fourths", d: ["Halves", "Wholes", "Thirds"] },
                    { q: "Which fraction means 'one half'?", a: "1/2", d: ["1/4", "1/1", "2/2"] },
                    { q: "To make halves or fourths, the pieces must be ___.", a: "equal sizes", d: ["random sizes", "different sizes", "any size"] }
                ],
                exam: [
                    { q: "Another name for 'a fourth' is ___.", a: "A quarter", d: ["A half", "A whole", "A piece"] },
                    { q: "Type the fraction for one fourth.", a: "1/4", type: "identification" },
                    { q: "How many fourths make a whole?", a: "4", d: ["2", "3", "8"] },
                    { q: "If I eat 2 halves of a cookie, how much did I eat?", a: "The whole cookie", d: ["Nothing", "One half", "One fourth"] },
                    { q: "Which is bigger: 1 whole pizza or 1 half pizza?", a: "1 whole pizza", d: ["1 half pizza", "They are equal", "Cannot tell"] }
                ]
            },
            {
                name: "Word Problems",
                lesson: "Math is everywhere! To solve a word problem: Read carefully. Find the numbers. Look for clue words! 'More', 'total', 'in all' mean ADD (+). 'Left', 'take away', 'fewer' mean SUBTRACT (-). Then write the math sentence to find the answer.",
                quiz: [
                    { q: "Sue has 5 apples. She buys 3 MORE. Should you add or subtract?", a: "Add", d: ["Subtract", "Neither", "Wait"] },
                    { q: "Dan has 6 toys. He lost 2. How many are LEFT? Should you add or subtract?", a: "Subtract", d: ["Add", "Neither", "Wait"] },
                    { q: "If 4 birds are sitting and 5 more fly over, how many IN ALL? Solve the math.", a: "9", d: ["1", "5", "8"] },
                    { q: "You had 10 stickers and gave 4 away. How many do you have now?", a: "6", d: ["14", "10", "4"] },
                    { q: "What do the words 'in total' usually mean you should do?", a: "Add", d: ["Subtract", "Draw a picture", "Nothing"] }
                ],
                exam: [
                    { q: "There are 12 fish in the tank. We add 3 more fish. How many fish are there?", a: "15", d: ["9", "12", "16"] },
                    { q: "Type the final answer: Meg had 8 balloons. 2 popped. How many are left?", a: "6", type: "identification" },
                    { q: "At the park, there were 7 swings. 3 are broken. How many can be used?", a: "4", d: ["10", "5", "6"] },
                    { q: "A boy has 10 coins. He finds 5 more. How many coins total?", a: "15", d: ["5", "10", "20"] },
                    { q: "Clue word 'fewer' usually means to ___.", a: "Subtract", d: ["Add", "Write the answer", "Call for help"] }
                ]
            }
        ]
    },

    // ──────────────────── GRADE 2 ────────────────────
    2: {
        levels: [
            {
                name: "Addition to 100",
                lesson: "When adding bigger numbers like 43 + 24, add the ONES first (3+4=7), then add the TENS (40+20=60). The answer is 67. Stacking the numbers vertically makes it easier to line up the tens and ones!",
                quiz: [
                    { q: "What is 30 + 20?", a: "50", d: ["10", "60", "40"] },
                    { q: "What is 42 + 25?", a: "67", d: ["65", "57", "69"] },
                    { q: "What do we always add first?", a: "The ones", d: ["The tens", "The biggest number", "The top number"] },
                    { q: "What is 55 + 12?", a: "67", d: ["77", "66", "57"] },
                    { q: "What is 71 + 18?", a: "89", d: ["88", "99", "79"] }
                ],
                exam: [
                    { q: "What is 82 + 15?", a: "97", d: ["87", "77", "95"] },
                    { q: "Type the answer for 40 + 40.", a: "80", type: "identification" },
                    { q: "What is 23 + 34?", a: "57", d: ["67", "56", "47"] },
                    { q: "If you add 5 to 64, what do you get?", a: "69", d: ["59", "74", "68"] },
                    { q: "What is 60 + 39?", a: "99", d: ["89", "100", "90"] }
                ]
            },
            {
                name: "Subtraction to 100",
                lesson: "When subtracting bigger numbers like 58 - 23, take away the ONES first (8-3=5), then subtract the TENS (50-20=30). The answer is 35. Make sure the tens and ones are lined up properly!",
                quiz: [
                    { q: "What is 60 - 20?", a: "40", d: ["30", "50", "80"] },
                    { q: "What is 48 - 15?", a: "33", d: ["35", "43", "23"] },
                    { q: "Which column do you subtract first?", a: "The ones", d: ["The tens", "The left side", "The top"] },
                    { q: "What is 76 - 32?", a: "44", d: ["34", "54", "46"] },
                    { q: "What is 99 - 11?", a: "88", d: ["77", "90", "89"] }
                ],
                exam: [
                    { q: "What is 55 - 24?", a: "31", d: ["41", "30", "21"] },
                    { q: "Type the answer for 80 - 40.", a: "40", type: "identification" },
                    { q: "What is 87 - 52?", a: "35", d: ["25", "45", "37"] },
                    { q: "If you subtract 6 from 38, what is the answer?", a: "32", d: ["42", "22", "34"] },
                    { q: "What is 65 - 30?", a: "35", d: ["25", "45", "95"] }
                ]
            },
            {
                name: "Regrouping (Carrying & Borrowing)",
                lesson: "If the ones column adds up to 10 or more, we CARRY the extra ten to the tens column! (e.g., 28+14, 8+4=12, carry the 1). If the top ones digit is too small to subtract, we BORROW a ten from the tens column! (e.g., 52-27, borrow from 5 to make 2 a 12).",
                quiz: [
                    { q: "When adding 37 + 15, what is the ones column addition (7+5)?", a: "12", d: ["11", "13", "10"] },
                    { q: "If the ones column adds to 14, what do you carry to the tens place?", a: "1 ten", d: ["4 ones", "14 tens", "Nothing"] },
                    { q: "What is 28 + 14?", a: "42", d: ["32", "40", "34"] },
                    { q: "When subtracting 42 - 18, why do we borrow?", a: "Because 2 is smaller than 8", d: ["Because 4 is larger than 1", "We don't borrow here", "Because 8 is even"] },
                    { q: "What is 53 - 26?", a: "27", d: ["37", "33", "23"] }
                ],
                exam: [
                    { q: "What is 49 + 25?", a: "74", d: ["64", "65", "84"] },
                    { q: "Type the answer to 61 - 19.", a: "42", type: "identification" },
                    { q: "What is 74 + 18?", a: "92", d: ["82", "94", "84"] },
                    { q: "What is 80 - 35?", a: "45", d: ["55", "35", "50"] },
                    { q: "In 95 - 48, what does the 5 become when you borrow?", a: "15", d: ["10", "5", "6"] }
                ]
            },
            {
                name: "Place Value (Hundreds)",
                lesson: "Numbers now have 3 digits! The first is HUNDREDS, second is TENS, third is ONES. The number 346 is 3 hundreds (300) + 4 tens (40) + 6 ones (6). A flat block is 100, a stick is 10, a small cube is 1.",
                quiz: [
                    { q: "In 482, which digit is in the hundreds place?", a: "4", d: ["8", "2", "400"] },
                    { q: "What number is 5 hundreds, 2 tens, 1 one?", a: "521", d: ["125", "251", "500"] },
                    { q: "What is the value of the 7 in 719?", a: "700", d: ["7", "70", "1"] },
                    { q: "In 395, which digit is in the tens place?", a: "9", d: ["3", "5", "90"] },
                    { q: "How many tens are in one hundred?", a: "10", d: ["100", "1", "5"] }
                ],
                exam: [
                    { q: "What number is 600 + 40 + 8?", a: "648", d: ["684", "846", "640"] },
                    { q: "Type the number that is 2 hundreds, 0 tens, and 5 ones.", a: "205", type: "identification" },
                    { q: "Which digit is in the ones place of 943?", a: "3", d: ["4", "9", "0"] },
                    { q: "Which number has a 5 in the hundreds place?", a: "524", d: ["452", "245", "650"] },
                    { q: "What is the value of the 1 in 812?", a: "10", d: ["1", "100", "800"] }
                ]
            },
            {
                name: "Even and Odd Numbers",
                lesson: "EVEN numbers can be split into two equal teams (0, 2, 4, 6, 8 endings). ODD numbers always have one left over (1, 3, 5, 7, 9 endings). Look at the ONES digit! 42 is even because 2 is even. 75 is odd because 5 is odd.",
                quiz: [
                    { q: "Which of these is an even number?", a: "4", d: ["3", "7", "9"] },
                    { q: "Which of these is an odd number?", a: "5", d: ["6", "8", "2"] },
                    { q: "How do you know if a big number is even or odd?", a: "Look at the ones digit", d: ["Look at the tens digit", "Count all the numbers", "Guess"] },
                    { q: "Is 48 even or odd?", a: "Even", d: ["Odd", "Neither", "Both"] },
                    { q: "Is 31 even or odd?", a: "Odd", d: ["Even", "Neither", "Both"] }
                ],
                exam: [
                    { q: "Which group has all even numbers?", a: "12, 14, 16", d: ["11, 13, 15", "10, 15, 20", "2, 4, 5"] },
                    { q: "Type whether the number 57 is 'even' or 'odd'.", a: "odd", type: "identification" },
                    { q: "Which digit determines if 183 is odd?", a: "3", d: ["8", "1", "100"] },
                    { q: "If two friends share 10 cookies equally, is 10 even or odd?", a: "Even", d: ["Odd", "Neither", "Impossible"] },
                    { q: "Which is the largest even number here?", a: "20", d: ["21", "19", "18"] }
                ]
            },
            {
                name: "Arrays and Repeated Addition",
                lesson: "An array is a group of objects in rows and columns. 3 rows of 4 dots is an array! We can use repeated addition to find the total: 4 + 4 + 4 = 12. This is the very beginning of multiplication!",
                quiz: [
                    { q: "What is an array?", a: "Objects arranged in rows and columns", d: ["A big circle", "A random pile", "A single line"] },
                    { q: "If an array has 2 rows of 3, what is the repeated addition sentence?", a: "3 + 3 = 6", d: ["2 + 2 = 4", "3 + 2 = 5", "1 + 1 = 2"] },
                    { q: "If you have 4 groups of 2, the total is ___.", a: "8", d: ["6", "10", "4"] },
                    { q: "What is the repeated addition for 3 rows of 5?", a: "5 + 5 + 5 = 15", d: ["3 + 3 = 6", "5 + 3 = 8", "10 + 5 = 15"] },
                    { q: "If an array has 3 rows and 3 columns, the total is ___.", a: "9", d: ["6", "12", "3"] }
                ],
                exam: [
                    { q: "An array has 4 rows of 4 stars. How many stars?", a: "16", d: ["8", "12", "20"] },
                    { q: "Type the total for 5 groups of 2.", a: "10", type: "identification" },
                    { q: "What repeated addition matches an array of 2 rows of 6?", a: "6 + 6 = 12", d: ["2 + 2 = 4", "6 + 2 = 8", "2 + 6 = 8"] },
                    { q: "Arrays help us get ready for what type of math?", a: "Multiplication", d: ["Subtraction", "Fractions", "Telling time"] },
                    { q: "An array has 1 row of 5 dots. Total dots?", a: "5", d: ["1", "6", "15"] }
                ]
            },
            {
                name: "Time (to the nearest 5 minutes)",
                lesson: "The clock face has numbers 1-12. The big hand counts minutes by 5s! Each little line is 1 minute, but big jumps between numbers are 5 minutes. 1=5 past, 2=10 past, 3=15, 6=30. AM is morning, PM is afternoon/evening.",
                quiz: [
                    { q: "When the long minute hand points to the 1, how many minutes is it?", a: "5 minutes", d: ["1 minute", "10 minutes", "0 minutes"] },
                    { q: "When the minute hand points to the 3, it is ___ minutes past the hour.", a: "15", d: ["3", "10", "45"] },
                    { q: "What time is 30 minutes after 4:00?", a: "4:30", d: ["4:15", "5:00", "4:00"] },
                    { q: "If we count by 5s on the clock, what is the 4?", a: "20 minutes", d: ["15 minutes", "25 minutes", "4 minutes"] },
                    { q: "You eat lunch at 12:00. Is this AM or PM?", a: "PM", d: ["AM", "Neither", "Both"] }
                ],
                exam: [
                    { q: "When the long hand points to the 9, how many minutes?", a: "45 minutes", d: ["30 minutes", "9 minutes", "15 minutes"] },
                    { q: "Type the minutes when the long hand points to the 10.", a: "50", type: "identification" },
                    { q: "Breakfast is usually eaten in the ___.", a: "AM", d: ["PM", "Midnight", "Neither"] },
                    { q: "If the hour hand is between 2 and 3, and the minute hand is on 4, what time is it?", a: "2:20", d: ["3:20", "2:04", "4:10"] },
                    { q: "How many minutes are in half an hour?", a: "30", d: ["60", "15", "45"] }
                ]
            },
            {
                name: "Money (Coins and Bills)",
                lesson: "Let's learn money! A Penny = 1¢. A Nickel = 5¢. A Dime = 10¢. A Quarter = 25¢. 100¢ equals 1 Dollar ($1.00). When you get a word problem about money, count the biggest coins first. 2 quarters = 50¢, 4 quarters = $1.00.",
                quiz: [
                    { q: "How much is a dime worth?", a: "10 cents", d: ["5 cents", "1 cent", "25 cents"] },
                    { q: "How much is a quarter worth?", a: "25 cents", d: ["10 cents", "50 cents", "5 cents"] },
                    { q: "How many pennies make a dollar?", a: "100", d: ["10", "25", "50"] },
                    { q: "How much is 2 dimes and 1 nickel?", a: "25 cents", d: ["15 cents", "20 cents", "30 cents"] },
                    { q: "How many quarters make 1 dollar?", a: "4", d: ["2", "5", "10"] }
                ],
                exam: [
                    { q: "How much is 3 quarters?", a: "75 cents", d: ["25 cents", "50 cents", "100 cents"] },
                    { q: "Type the value of 1 nickel in cents.", a: "5", type: "identification" },
                    { q: "If a toy costs 50¢ and you give the cashier 3 quarters (75¢), how much change do you get?", a: "25 cents", d: ["10 cents", "50 cents", "0 cents"] },
                    { q: "How much is 1 quarter, 1 dime, and 1 penny?", a: "36 cents", d: ["26 cents", "35 cents", "40 cents"] },
                    { q: "Which coin is worth the least?", a: "Penny", d: ["Nickel", "Dime", "Quarter"] }
                ]
            },
            {
                name: "Measurement (Rulers in inches/cm)",
                lesson: "A standard ruler measures in Inches (in) and Centimeters (cm). Inches are bigger than centimeters. One ruler is 12 inches, which is exactly 1 foot! Just like before, line up the end of your object exactly at the ZERO mark.",
                quiz: [
                    { q: "Which unit of measurement is bigger?", a: "Inch", d: ["Centimeter", "Millimeter", "They are equal"] },
                    { q: "A standard wooden ruler in the USA is how long?", a: "12 inches", d: ["10 inches", "6 inches", "100 inches"] },
                    { q: "12 inches is exactly equal to what?", a: "1 foot", d: ["1 yard", "1 mile", "1 centimeter"] },
                    { q: "If you measure a pencil and it goes to the number 6 on the inch side, how long is it?", a: "6 inches", d: ["6 centimeters", "6 feet", "6 yards"] },
                    { q: "Where must you start measuring on a ruler?", a: "At the zero mark", d: ["At the 1 mark", "In the middle", "At the end"] }
                ],
                exam: [
                    { q: "Which is a standard unit for measuring length on a ruler?", a: "Centimeter", d: ["Pound", "Gallon", "Degree"] },
                    { q: "Type the unit that 12 inches makes (singular).", a: "foot", type: "identification" },
                    { q: "If a book is 8 inches and a notebook is 10 inches, what is their total length?", a: "18 inches", d: ["16 inches", "20 inches", "2 inches"] },
                    { q: "About how many centimeters are in a 12-inch ruler?", a: "Around 30 cm", d: ["10 cm", "20 cm", "50 cm"] },
                    { q: "If a ribbon is 2 feet long, how many inches is that?", a: "24 inches", d: ["12 inches", "36 inches", "2 inches"] }
                ]
            },
            {
                name: "Data and Graphs",
                lesson: "We use graphs to organize information (data). A BAR GRAPH uses bars to show amounts. A PIE CHART shows parts of a circle. A PICTURE GRAPH uses pictures. The key tells you what each picture means (e.g., 😊 = 2 students). Always look at the key!",
                quiz: [
                    { q: "What does a bar graph use to show amounts?", a: "Bars", d: ["Circles", "Lines", "Pictures"] },
                    { q: "What is information collected for a graph called?", a: "Data", d: ["Dates", "Toys", "Rules"] },
                    { q: "In a picture graph, what tells you what one picture is equal to?", a: "The Key", d: ["The Title", "The Bar", "The Bottom"] },
                    { q: "If one star ⭐ in a key equals 2 points, how much is 3 stars?", a: "6 points", d: ["3 points", "5 points", "2 points"] },
                    { q: "Why do we use graphs?", a: "To organize and compare data easily", d: ["To hide information", "To make math harder", "To color pages"] }
                ],
                exam: [
                    { q: "Look at a pie chart. If a piece is very large, what does it mean?", a: "That category has a large amount", d: ["It has a small amount", "It is zero", "It's the title"] },
                    { q: "Type the word for the information you put in a graph.", a: "data", type: "identification" },
                    { q: "A bar for 'Cats' stops at the number 5. What does this mean?", a: "There are 5 cats", d: ["There are 0 cats", "There are 10 cats", "The cats are 5 inches tall"] },
                    { q: "If the key says 🍏 = 5 apples, how many apples do two 🍏🍏 represent?", a: "10 apples", d: ["2 apples", "5 apples", "25 apples"] },
                    { q: "Which type of graph uses pictures or symbols?", a: "Picture graph / Pictograph", d: ["Bar graph", "Line graph", "Pie chart"] }
                ]
            }
        ]
    }
};

// ══════════════════════════════════════════════════════════════════
//  LOAD GRADES 3-8
// ══════════════════════════════════════════════════════════════════
try {
    const grades34 = require('./curriculum_math_grades_3_to_4.js');
    const grades56 = require('./curriculum_math_grades_5_to_6.js');
    const grades78 = require('./curriculum_math_grades_7_to_8.js');
    Object.assign(curriculum, grades34, grades56, grades78);
    console.log("✅ Loaded Math grades 3-8 curriculum data.");
} catch (e) {
    console.log("⚠️  Math grades 3-8 data not found. Only seeding grades 1-2. Error:", e.message);
}

// ══════════════════════════════════════════════════════════════════
//  SEED TO FIRESTORE
// ══════════════════════════════════════════════════════════════════
async function seedToFirestore() {
    console.log("\n📐 Beginning full MATH curriculum upload to Firebase...\n");
    let uploadCount = 0;
    const batchSize = 100;
    let batch = db.batch();
    let currentBatchCount = 0;

    const gradeNums = Object.keys(curriculum).map(Number).sort((a, b) => a - b);

    for (const gradeNum of gradeNums) {
        const gradeId = `grade-${gradeNum}`;
        const subjectId = `math-${gradeNum}`; // subject is math!
        const levels = curriculum[gradeNum].levels;

        console.log(`📘 Grade ${gradeNum}: ${levels.length} levels`);

        for (let levelNum = 1; levelNum <= levels.length; levelNum++) {
            const lvl = levels[levelNum - 1];
            const levelId = `${subjectId}-level-${levelNum}`;
            const docId = `${gradeId}_${subjectId}_${levelId}`;

            const tasks = [
                {
                    taskId: `${levelId}-lesson-1`,
                    taskName: `Learn: ${lvl.name}`,
                    type: "lesson",
                    content: lvl.lesson,
                    questions: []
                },
                {
                    taskId: `${levelId}-quiz-1`,
                    taskName: "Practice Quiz",
                    type: "quiz",
                    timeLimit: 180,
                    content: `Let's practice what we learned about ${lvl.name}!`,
                    questions: lvl.quiz.map((item, idx) => {
                        const qType = item.type || "multiple-choice";
                        const qObj = {
                            questionId: `q${idx + 1}-${levelId}`,
                            questionText: item.q,
                            correctAnswer: item.a,
                            type: qType
                        };
                        if (qType !== "identification") {
                            qObj.options = makeOptions(item.a, item.d || []);
                        }
                        return qObj;
                    })
                },
                {
                    taskId: `${levelId}-exam-1`,
                    taskName: "Level Challenge!",
                    type: "exam",
                    timeLimit: 300,
                    content: `Show what you know about ${lvl.name}!`,
                    questions: lvl.exam.map((item, idx) => {
                        const qType = item.type || "multiple-choice";
                        const qObj = {
                            questionId: `ex${idx + 1}-${levelId}`,
                            questionText: item.q,
                            correctAnswer: item.a,
                            type: qType
                        };
                        if (qType !== "identification") {
                            qObj.options = makeOptions(item.a, item.d || []);
                        }
                        return qObj;
                    })
                }
            ];

            const docData = {
                gradeId,
                subjectId,
                levelId,
                levelName: `Level ${levelNum}: ${lvl.name}`,
                isLocked: levelNum > 1,
                tasks,
                updatedAt: FieldValue.serverTimestamp()
            };

            const docRef = db.collection('levels').doc(docId);
            batch.set(docRef, docData, { merge: true });
            currentBatchCount++;
            uploadCount++;

            if (currentBatchCount >= batchSize) {
                await batch.commit();
                console.log(`   ✅ Committed batch of ${batchSize}`);
                batch = db.batch();
                currentBatchCount = 0;
            }
        }
    }

    if (currentBatchCount > 0) {
        await batch.commit();
    }

    console.log(`\n🎉 Upload complete! Pushed ${uploadCount} MATH level modules to Firestore.\n`);
}

seedToFirestore().catch(console.error);
