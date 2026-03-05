module.exports = {
    // ──────────────────── GRADE 5 ────────────────────
    5: {
        levels: [
            {
                name: "Place Value with Decimals",
                lesson: "Place value goes BOTH ways from the decimal point! Left: Ones, Tens, Hundreds, Thousands. Right: Tenths (0.1), Hundredths (0.01), Thousandths (0.001). As you move right, each place is 10 times SMALLER. 5.432 means 5 ones, 4 tenths, 3 hundredths, 2 thousandths.",
                quiz: [
                    { q: "In the number 12.345, which digit is in the tenths place?", a: "3", d: ["4", "5", "2"] },
                    { q: "In the number 8.096, what is the value of the 9?", a: "9 hundredths", d: ["9 tenths", "9 thousandths", "9 ones"] },
                    { q: "What number is 3 ones, 5 tenths, and 8 thousandths?", a: "3.508", d: ["3.58", "3.058", "35.8"] },
                    { q: "Which place is ten times smaller than a hundredth?", a: "Thousandth", d: ["Tenth", "One", "Ten"] },
                    { q: "What digit is in the thousandths place in 0.817?", a: "7", d: ["1", "8", "0"] }
                ],
                exam: [
                    { q: "Write 4 and 25 thousandths as a decimal.", a: "4.025", d: ["4.25", "40.25", "0.425"] },
                    { q: "Type the place value directly left of the tenths place.", a: "ones", type: "identification" },
                    { q: "What is the value of the 4 in 6.741?", a: "4/100 (4 hundredths)", d: ["4/10", "4", "4/1000"] },
                    { q: "Which number has a 5 in the tenths place?", a: "1.52", d: ["5.12", "1.25", "51.2"] },
                    { q: "Identify the number with 0 in the hundredths place.", a: "3.109", d: ["3.019", "3.190", "3.901"] }
                ]
            },
            {
                name: "Multiplying & Dividing by Powers of 10",
                lesson: "Multiplying by 10, 100, 1000 moves the decimal to the RIGHT (number gets bigger). Dividing moves it LEFT (gets smaller). Number of zeros = number of jumps! To multiply 3.4 by 100, jump the decimal right 2 times to get 340.",
                quiz: [
                    { q: "What happens when you multiply any number by 10?", a: "The decimal moves 1 place to the right", d: ["It moves 1 place left", "Add a zero to the front", "Nothing"] },
                    { q: "What is 4.5 x 100?", a: "450", d: ["45", "0.045", "4500"] },
                    { q: "What is 72 ÷ 10?", a: "7.2", d: ["0.72", "720", "0.072"] },
                    { q: "What is 6.1 x 1000?", a: "6100", d: ["61", "610", "0.0061"] },
                    { q: "To divide by 100, move the decimal:", a: "2 places LEFT", d: ["2 places RIGHT", "1 place LEFT", "3 places RIGHT"] }
                ],
                exam: [
                    { q: "What is 0.8 x 100?", a: "80", d: ["8", "800", "0.008"] },
                    { q: "Type the answer to 12.5 ÷ 100.", a: "0.125", type: "identification" },
                    { q: "If you multiply by 10 to the 3rd power (10³), how many jumps right?", a: "3", d: ["10", "1", "1000"] },
                    { q: "59 ÷ 1000 = ?", a: "0.059", d: ["59000", "0.59", "5.9"] },
                    { q: "Moving the decimal left 1 time is the same as:", a: "Dividing by 10", d: ["Multiplying by 10", "Multiplying by 100", "Dividing by 100"] }
                ]
            },
            {
                name: "Adding & Subtracting Decimals",
                lesson: "The golden rule: LINE UP THE DOTS! Write whole numbers with a hidden decimal at the end (5 = 5.0). Use zeros as placeholders in empty spaces (0.5 becomes 0.50). Once aligned, just add or subtract normally and drop the decimal straight down.",
                quiz: [
                    { q: "What MUST you do before adding or subtracting decimals?", a: "Line up the decimal points", d: ["Line up the digits", "Remove the decimal", "Multiply by 10"] },
                    { q: "What is 1.5 + 2.4?", a: "3.9", d: ["39", "3.0", "4.9"] },
                    { q: "What is 5.0 - 2.5?", a: "2.5", d: ["3.5", "2.0", "7.5"] },
                    { q: "What is 0.8 + 0.3?", a: "1.1", d: ["0.11", "0.5", "8.3"] },
                    { q: "How do you write the whole number 7 to line up with 3.45?", a: "7.00", d: ["0.07", "7.45", "70"] }
                ],
                exam: [
                    { q: "What is 12.4 + 3.82?", a: "16.22", d: ["15.22", "16.42", "15.06"] },
                    { q: "Type the answer to 10 - 0.5.", a: "9.5", type: "identification" },
                    { q: "What is 4.15 - 1.2?", a: "2.95", d: ["3.13", "2.85", "3.95"] },
                    { q: "What is 0.99 + 0.01?", a: "1.00", d: ["0.100", "0.90", "1.1"] },
                    { q: "Tom ran 1.2 miles and 2.5 miles. Total miles?", a: "3.7 miles", d: ["3.3 miles", "37 miles", "1.3 miles"] }
                ]
            },
            {
                name: "Multiplying & Dividing Decimals",
                lesson: "MULTIPLY: Ignore decimals first. Multiply like whole numbers. Then count total decimal places in the problem and put that many jumps back into the answer! DIVIDE: Move the decimal out of the outside number (divisor), do the exact same jumps to the inside number, then pop it straight up.",
                quiz: [
                    { q: "When multiplying 0.2 x 0.3, how many total decimal places are in the problem?", a: "2", d: ["1", "3", "0"] },
                    { q: "What is 0.2 x 0.3?", a: "0.06", d: ["0.6", "6.0", "0.006"] },
                    { q: "What is 1.2 x 4?", a: "4.8", d: ["48", "0.48", "8.4"] },
                    { q: "When dividing decimals, where do you move the decimal point first?", a: "Make the outside number (divisor) a whole number", d: ["Make the inside number whole", "Remove all decimals", "Multiply by 2"] },
                    { q: "What is 0.8 ÷ 4?", a: "0.2", d: ["0.4", "2.0", "3.2"] }
                ],
                exam: [
                    { q: "What is 0.5 x 0.5?", a: "0.25", d: ["2.5", "0.025", "0.55"] },
                    { q: "Type the quotient of 1.5 ÷ 0.5.", a: "3", type: "identification" },
                    { q: "What is 0.12 x 3?", a: "0.36", d: ["3.6", "0.036", "36"] },
                    { q: "If the first factor has 2 decimal jumps and the second has 1, the answer needs ___ jumps.", a: "3", d: ["2", "1", "0"] },
                    { q: "What is 3.6 ÷ 0.6?", a: "6", d: ["0.6", "36", "60"] }
                ]
            },
            {
                name: "Add/Sub Fractions (Unlike Denominators)",
                lesson: "You CANNOT add or subtract fractions unless the bottom numbers (denominators) match! You must find a Common Denominator. Find a number both bottoms can multiply into. Whatever you multiply the bottom by, multiply the top by the exact same number. Then add normally!",
                quiz: [
                    { q: "What is the very first step to add 1/2 and 1/3?", a: "Find a common denominator", d: ["Add numerators", "Multiply denominators", "Add denominators"] },
                    { q: "What is the least common denominator for 1/3 and 1/4?", a: "12", d: ["7", "6", "24"] },
                    { q: "Change 1/2 to have a denominator of 6. What is the new numerator?", a: "3", d: ["1", "2", "6"] },
                    { q: "What is 1/2 + 1/4?", a: "3/4", d: ["2/6", "2/4", "3/8"] },
                    { q: "What is 3/4 - 1/2?", a: "1/4", d: ["2/2", "3/2", "2/4"] }
                ],
                exam: [
                    { q: "What is 2/3 + 1/6?", a: "5/6", d: ["3/9", "4/6", "4/9"] },
                    { q: "Type the common denominator for halves and fifths (2 and 5).", a: "10", type: "identification" },
                    { q: "What is 4/5 - 1/2?", a: "3/10", d: ["3/3", "4/10", "3/5"] },
                    { q: "Whatever you multiply the denominator by to make it common, you must ___.", a: "Multiply the numerator by the same number", d: ["Add it to the numerator", "Leave the numerator alone", "Divide"] },
                    { q: "What is 1/3 + 1/4?", a: "7/12", d: ["2/7", "1/12", "12/7"] }
                ]
            },
            {
                name: "Multiplying Fractions",
                lesson: "Multiplying fractions is the EASIEST fraction operation! You don't need common denominators. Just multiply straight across: Numerator x Numerator, and Denominator x Denominator. Then simplify the answer. If there is a mixed number, change it to an improper fraction first.",
                quiz: [
                    { q: "Do you need common denominators to multiply fractions?", a: "No", d: ["Yes", "Only sometimes", "Only for whole numbers"] },
                    { q: "What is 1/2 x 1/3?", a: "1/6", d: ["2/5", "1/5", "3/6"] },
                    { q: "What is 2/3 x 3/4?", a: "6/12 or 1/2", d: ["8/9", "5/7", "6/7"] },
                    { q: "How do you multiply two fractions?", a: "Multiply numerators and multiply denominators straight across", d: ["Cross multiply", "Keep the denominator the same", "Flip the second one"] },
                    { q: "What is 1/4 x 3/5?", a: "3/20", d: ["4/9", "3/5", "3/9"] }
                ],
                exam: [
                    { q: "What is 5/6 x 1/2?", a: "5/12", d: ["5/6", "6/8", "10/12"] },
                    { q: "Type the numerator for the unsimplified answer of 4/5 x 2/3.", a: "8", type: "identification" },
                    { q: "What is 3/8 x 2/5?", a: "6/40", d: ["5/13", "16/15", "6/13"] },
                    { q: "Before multiplying, what must you do to a mixed number like 1 1/2?", a: "Change it to an improper fraction", d: ["Ignore the 1", "Add it to the numerator", "Nothing"] },
                    { q: "What is 1/2 x 2/2?", a: "1/2 (or 2/4)", d: ["1/4", "3/4", "1"] }
                ]
            },
            {
                name: "Dividing Fractions",
                lesson: "To divide fractions, use Keep-Change-Flip (KCF)! KEEP the first fraction exactly the same. CHANGE the division sign to multiplication. FLIP the second fraction upside down (reciprocal). Then just multiply straight across like normal!",
                quiz: [
                    { q: "What is the famous rule for dividing fractions?", a: "Keep, Change, Flip", d: ["Cross Multiply", "Line up the dots", "Find Common Bottom"] },
                    { q: "What is the reciprocal (flipped version) of 3/4?", a: "4/3", d: ["3/4", "1/4", "4/1"] },
                    { q: "If dividing 1/2 ÷ 1/4, what does the problem change to?", a: "1/2 x 4/1", d: ["2/1 x 1/4", "1/2 x 1/4", "1/2 ÷ 4/1"] },
                    { q: "What is 1/2 ÷ 1/4?", a: "2", d: ["1/8", "1/2", "8"] },
                    { q: "What is the reciprocal of the whole number 5?", a: "1/5", d: ["5/1", "5", "0.5"] }
                ],
                exam: [
                    { q: "What is 3/4 ÷ 1/2?", a: "3/2 (or 1 1/2)", d: ["3/8", "4/6", "1/4"] },
                    { q: "Type the math word for a 'flipped' fraction.", a: "reciprocal", type: "identification" },
                    { q: "What is 1/3 ÷ 2/5?", a: "5/6", d: ["2/15", "6/5", "1/15"] },
                    { q: "What is 4 ÷ 1/2?", a: "8", d: ["2", "4/2", "1/8"] },
                    { q: "Which part of the division problem gets flipped?", a: "Only the second fraction", d: ["Only the first fraction", "Both fractions", "Neither"] }
                ]
            },
            {
                name: "Order of Operations (PEMDAS)",
                lesson: "If an equation has many steps, follow PEMDAS! Parentheses first, Exponents second, Multiply/Divide third (left to right), Add/Subtract last (left to right). \"Please Excuse My Dear Aunt Sally\". Without rules, everyone would get a different answer!",
                quiz: [
                    { q: "What does the 'P' in PEMDAS stand for?", a: "Parentheses", d: ["Power", "Plus", "Product"] },
                    { q: "In the expression 4 + 2 x 3, what do you calculate first?", a: "2 x 3", d: ["4 + 2", "4 + 3", "It doesn't matter"] },
                    { q: "What is 4 + 2 x 3?", a: "10", d: ["18", "9", "12"] },
                    { q: "In the expression (5 - 2) x 4, what do you do first?", a: "Subtract (5 - 2 = 3)", d: ["Multiply", "Add", "Whatever is on the right"] },
                    { q: "What is (5 - 2) x 4?", a: "12", d: ["20", "8", "3"] }
                ],
                exam: [
                    { q: "What is 10 + 10 ÷ 2?", a: "15", d: ["10", "5", "20"] },
                    { q: "Type the result of: 20 - (4 x 3).", a: "8", type: "identification" },
                    { q: "If you have multiplication and division in the same problem, which goes first?", a: "Whichever comes first from left to right", d: ["Always multiplication", "Always division", "Do them at the same time"] },
                    { q: "What is 3 x (4 + 6)?", a: "30", d: ["18", "13", "34"] },
                    { q: "Which operation is evaluated LAST according to PEMDAS?", a: "Addition/Subtraction", d: ["Multiplication", "Exponents", "Parentheses"] }
                ]
            },
            {
                name: "Volume of Rectangular Prisms",
                lesson: "Volume is the amount of space INSIDE a 3D object! Imagine filling a box with tiny 1-inch cubes. The formula is Length x Width x Height. (V = L x W x H). Answer is in 'cubic' units (e.g., cubic inches). A 2x3x4 box holds 24 cubes.",
                quiz: [
                    { q: "What does volume measure?", a: "Space inside a 3D object", d: ["Distance around an object", "Space inside a flat shape", "Weight"] },
                    { q: "What is the magic formula for the volume of a rectangular prism?", a: "Length x Width x Height", d: ["Length + Width + Height", "Base x Height", "Length x Width"] },
                    { q: "If a box is 2 long, 3 wide, and 2 high, what is the volume?", a: "12", d: ["7", "10", "6"] },
                    { q: "Volume answers are always written in ___.", a: "Cubic units", d: ["Square units", "Linear units", "Heavy units"] },
                    { q: "A cube has a side of 3. What is its volume? (Hint: L, W, and H are all 3).", a: "27", d: ["9", "12", "6"] }
                ],
                exam: [
                    { q: "What is the volume of a 5 x 4 x 10 box?", a: "200 cubic units", d: ["19 cubic units", "50 cubic units", "100 cubic units"] },
                    { q: "Type the volume of a box with L=10, W=2, H=3.", a: "60", type: "identification" },
                    { q: "If the Base Area is 20, and the Height is 4, what is the Volume? (V = Base Area x H)", a: "80", d: ["24", "5", "16"] },
                    { q: "If length=4, width=4, height=4, what shape is it?", a: "A cube", d: ["A pyramid", "A sphere", "A cylinder"] },
                    { q: "Volume is measurement in how many dimensions?", a: "3D", d: ["2D", "1D", "4D"] }
                ]
            },
            {
                name: "Coordinate Plane (Quadrant I)",
                lesson: "A coordinate plane is a map with a grid! The X-axis is the flat horizontal line, the Y-axis is the tall vertical line. An ordered pair looks like (X, Y). Rule: ALWAYS run across the x-axis before you jump up the y-axis! Walk to the elevator before going up. (3, 4) means right 3, up 4.",
                quiz: [
                    { q: "The horizontal line (left-right) on a grid is called the ___.", a: "X-axis", d: ["Y-axis", "Z-axis", "Equator"] },
                    { q: "The vertical line (up-down) on a grid is called the ___.", a: "Y-axis", d: ["X-axis", "Pole", "Latitude"] },
                    { q: "In the ordered pair (5, 2), which number is the x-coordinate?", a: "5", d: ["2", "Neither", "Both"] },
                    { q: "What is the trick for plotting (4, 6)?", a: "Run right 4, Jump up 6", d: ["Jump up 4, Run right 6", "Run left 4, Jump down 6", "Multiply 4 x 6"] },
                    { q: "What ordered pair is located at the origin (the starting corner)?", a: "(0, 0)", d: ["(1, 1)", "(10, 10)", "(0, 1)"] }
                ],
                exam: [
                    { q: "From (0,0), how do you get to (8, 3)?", a: "Right 8, Up 3", d: ["Up 8, Right 3", "Left 8, Down 3", "Right 3, Up 8"] },
                    { q: "Type the y-coordinate of the point (7, 9).", a: "9", type: "identification" },
                    { q: "Point A is at (2, 5). Point B is at (2, 8). Which line do they share?", a: "The same vertical x-line", d: ["The same horizontal y-line", "They don't share any", "The origin"] },
                    { q: "If a dot is on the bottom line and hasn't gone up at all, its y-coordinate is:", a: "0", d: ["1", "X", "Negative"] },
                    { q: "What is the format of an ordered pair?", a: "(X, Y)", d: ["(Y, X)", "X x Y", "X + Y"] }
                ]
            }
        ]
    },

    // ──────────────────── GRADE 6 ────────────────────
    6: {
        levels: [
            {
                name: "Ratios",
                lesson: "A ratio is a way to compare two amounts! If there are 3 boys for every 4 girls, the ratio is 3 to 4. We can write this three ways: '3 to 4', '3:4', or as a fraction '3/4'. Order matters! Just like fractions, you can simplify ratios (10:5 simplifies to 2:1).",
                quiz: [
                    { q: "If a bowl has 5 apples and 2 oranges, what is the ratio of apples to oranges?", a: "5:2", d: ["2:5", "7:5", "5:7"] },
                    { q: "Which of these is a valid way to write a ratio?", a: "All of the above", d: ["3 to 4", "3:4", "3/4"] },
                    { q: "Order matters in a ratio. If the question asks for dogs to cats, which number comes first?", a: "Dogs", d: ["Cats", "The total", "The bigger number"] },
                    { q: "Simplify the ratio 4:8.", a: "1:2", d: ["2:4", "8:4", "1:4"] },
                    { q: "A class has 10 boys and 12 girls. Ratio of boys to TOTAL students?", a: "10:22", d: ["10:12", "12:10", "12:22"] }
                ],
                exam: [
                    { q: "Simplify the ratio 9:3.", a: "3:1", d: ["1:3", "9:1", "3:9"] },
                    { q: "Type the ratio of 6 red pens to 1 green pen using a colon.", a: "6:1", type: "identification" },
                    { q: "If the ratio of milk to water is 1:3, and I use 2 cups of milk, how much water?", a: "6 cups", d: ["3 cups", "8 cups", "1 cup"] },
                    { q: "What does a ratio compare?", a: "Two quantities", d: ["Decimals only", "Measurements and weight", "Only whole numbers"] },
                    { q: "A team won 5 games and lost 2. What is the ratio of wins to losses?", a: "5:2", d: ["2:5", "7:5", "5:7"] }
                ]
            },
            {
                name: "Unit Rates & Percentages",
                lesson: "A Unit Rate is a ratio where the second number is 1. (e.g., 60 miles per 1 hour). To find unit rate, divide the top by the bottom! A Percentage is a special ratio comparing a number to 100. 50% means 50 per 100, which is exactly 1/2 or 0.50.",
                quiz: [
                    { q: "A car drives 100 miles in 2 hours. What is the unit rate (miles per 1 hour)?", a: "50 miles/hour", d: ["100 miles/hour", "25 miles/hour", "200 miles/hour"] },
                    { q: "If 4 apples cost $2.00, what is the cost of 1 apple?", a: "$0.50", d: ["$1.00", "$0.25", "$2.00"] },
                    { q: "What number is the denominator in any percentage?", a: "100", d: ["10", "1", "1000"] },
                    { q: "How is 25% written as a fraction?", a: "25/100 (or 1/4)", d: ["25/10", "1/25", "100/25"] },
                    { q: "What decimal is equal to 50%?", a: "0.50", d: ["0.05", "5.0", "0.55"] }
                ],
                exam: [
                    { q: "What is 10% written as a decimal?", a: "0.10", d: ["0.01", "1.0", "10.0"] },
                    { q: "Type the unit rate: 20 miles in 4 hours = ___ mph.", a: "5", type: "identification" },
                    { q: "If you score 80 out of 100 on a test, what is your percent?", a: "80%", d: ["8%", "0.8%", "100%"] },
                    { q: "A 12-pack of soda costs $6. What is the unit price per soda?", a: "$0.50", d: ["$2.00", "$1.00", "5 cents"] },
                    { q: "Which fraction is equal to 75%?", a: "3/4", d: ["1/4", "3/5", "7/5"] }
                ]
            },
            {
                name: "Dividing Fractions (Advanced KCF)",
                lesson: "Keep-Change-Flip works for all fractions and mixed numbers. Let's do word problems! If you have a 4-foot board, and cut it into 1/2 foot pieces: 4 ÷ 1/2. Keep 4, Change ÷ to x, Flip 1/2 to 2/1. 4 x 2 = 8 pieces! Division by a fraction makes a BIGGER number.",
                quiz: [
                    { q: "How many 1/4 pound burgers can you make from 2 pounds of meat?", a: "8", d: ["2", "4", "6"] },
                    { q: "What is 3 ÷ 1/3?", a: "9", d: ["1", "6", "3"] },
                    { q: "What is the phrase for dividing fractions?", a: "Keep, Change, Flip", d: ["Drop, Add, Swap", "Keep, Keep, Find", "Line them up"] },
                    { q: "What happens to the second fraction in the division problem?", a: "It is flipped (reciprocal)", d: ["It stays the same", "It becomes a negative", "It gets a common denominator"] },
                    { q: "Calculate: 1/2 ÷ 2 = ?", a: "1/4", d: ["1", "4", "2/2"] }
                ],
                exam: [
                    { q: "How many 1/5 liter cups can be filled from 3 liters?", a: "15", d: ["3/5", "8", "5"] },
                    { q: "Type the answer to 6 ÷ 1/2.", a: "12", type: "identification" },
                    { q: "What is 2/3 ÷ 1/6?", a: "4", d: ["1/9", "6", "2/18"] },
                    { q: "A string is 5 feet long. It's cut into 1/4 foot pieces. How many pieces?", a: "20", d: ["5", "1", "9"] },
                    { q: "When you divide a whole number by a fraction less than 1, the answer is:", a: "Bigger than the original number", d: ["Smaller than the original number", "Negative", "Zero"] }
                ]
            },
            {
                name: "Rational Numbers (Negatives)",
                lesson: "Below zero lives the Negative Numbers! Just like temperature, -5 is five degrees below zero. Together, positive whole numbers, negatives, and zero are called INTEGERS. Left on the number line gets smaller! -10 is much colder (smaller) than -2.",
                quiz: [
                    { q: "Which number is smaller: -2 or -5?", a: "-5", d: ["-2", "They are equal", "0"] },
                    { q: "What number is the exact opposite of 8?", a: "-8", d: ["0", "1/8", "80"] },
                    { q: "The temperature drops from 2 degrees to 5 degrees below zero. What integer is that?", a: "-5", d: ["3", "-3", "-7"] },
                    { q: "Which direction are negative numbers from zero on a number line?", a: "Left", d: ["Right", "Up", "They are not on the line"] },
                    { q: "List from smallest to largest: -1, -5, 3", a: "-5, -1, 3", d: ["3, -1, -5", "-1, -5, 3", "-5, 3, -1"] }
                ],
                exam: [
                    { q: "Compare: -100 ___ -1", a: "<", d: [">", "=", "+"] },
                    { q: "Type the opposite integer of -14.", a: "14", type: "identification" },
                    { q: "A submarine descends 400 feet. What integer represents this?", a: "-400", d: ["400", "0", "-40"] },
                    { q: "What is true about integers?", a: "They include negative numbers, zero, and positive numbers", d: ["They are only negative numbers", "They include fractions", "They never cross zero"] },
                    { q: "Which number is closest to zero?", a: "-1", d: ["-5", "2", "-3"] }
                ]
            },
            {
                name: "Absolute Value",
                lesson: "Absolute value is a number's DISTANCE from zero! Distance is never negative! The absolute value of -5 is 5 (because it takes 5 hops to get to zero). The absolute value of 5 is also 5. The symbols are two straight bars: |-8| = 8.",
                quiz: [
                    { q: "What is the absolute value of -7?", a: "7", d: ["-7", "0", "14"] },
                    { q: "What does the absolute value actually measure?", a: "Distance from zero", d: ["Distance from 100", "The negative value", "Temperature"] },
                    { q: "What is | -12 |?", a: "12", d: ["-12", "0", "1"] },
                    { q: "What is the absolute value of 0?", a: "0", d: ["1", "Negative zero", "Infiite"] },
                    { q: "Can an absolute value answer be a negative number?", a: "No, distance is never negative", d: ["Yes, always", "Only on Tuesdays", "If the first number is positive"] }
                ],
                exam: [
                    { q: "Evaluate: | -45 |", a: "45", d: ["-45", "0", "90"] },
                    { q: "Type the absolute value of -99.", a: "99", type: "identification" },
                    { q: "Which has a greater absolute value: -10 or 5?", a: "-10 (because 10 > 5)", d: ["5 (because 5 > -10)", "They are equal", "Cannot tell"] },
                    { q: "Compare: | -5 | ___ | 4 |", a: ">", d: ["<", "=", "+"] },
                    { q: "The symbols for absolute value are:", a: "Two straight vertical lines | |", d: ["Parentheses ( )", "Brackets [ ]", "Negative signs -"] }
                ]
            },
            {
                name: "Algebraic Expressions",
                lesson: "Algebra uses letters (variables) to hide mystery numbers! 'x' is a variable. An expression has no equal sign! '3x + 5' means '3 times a mystery number, plus 5'. A number touching a letter means MULTIPLY (4y means 4 times y). Substitute to evaluate!",
                quiz: [
                    { q: "In the expression 5y + 2, what does the 5y mean?", a: "5 times y", d: ["5 plus y", "y divided by 5", "5 minus y"] },
                    { q: "If x = 3, what is the value of 4x?", a: "12", d: ["43", "7", "1"] },
                    { q: "What is a variable?", a: "A letter holding the place for an unknown number", d: ["A math symbol", "The answer", "A fraction"] },
                    { q: "If m = 10, evaluate m - 4.", a: "6", d: ["14", "40", "-6"] },
                    { q: "Translate to algebra: 'A number plus seven'.", a: "n + 7", d: ["7 - n", "7n", "n - 7"] }
                ],
                exam: [
                    { q: "Evaluate 2x + 1 when x = 5.", a: "11", d: ["21", "12", "15"] },
                    { q: "Type the translation for 'Three times a number z'.", a: "3z", type: "identification" },
                    { q: "If b = 8, what is b / 4?", a: "2", d: ["32", "4", "12"] },
                    { q: "Translate: 'A number divided by 2'.", a: "x / 2", d: ["2 / x", "2x", "x - 2"] },
                    { q: "What operation is implied when a number is right next to a variable (like 6a)?", a: "Multiplication", d: ["Addition", "Division", "Exponents"] }
                ]
            },
            {
                name: "One-Variable Equations",
                lesson: "An equation is an expression with an EQUAL sign! It's a balanced scale. To solve for 'x', you must do the INVERSE (opposite) operation! If x + 5 = 12, the inverse of +5 is -5. Subtract 5 from BOTH sides! x = 7. Whatever you do to one side, do to the other!",
                quiz: [
                    { q: "To solve x + 8 = 10, what should you do?", a: "Subtract 8 from both sides", d: ["Add 8 to both sides", "Multiply by 8", "Guess 10"] },
                    { q: "Solve: y - 3 = 6", a: "y = 9", d: ["y = 3", "y = 18", "y = 2"] },
                    { q: "If 4x = 20, what is the inverse operation to find x?", a: "Divide by 4", d: ["Multiply by 4", "Subtract 4", "Add 20"] },
                    { q: "Solve: 5m = 35", a: "m = 7", d: ["m = 30", "m = 40", "m = 5"] },
                    { q: "What is the golden rule of algebra equations?", a: "Whatever you do to one side, you must do to the other", d: ["Always add", "Variables go on the right", "Ignore negatives"] }
                ],
                exam: [
                    { q: "Solve: x / 2 = 10", a: "x = 20", d: ["x = 5", "x = 12", "x = 8"] },
                    { q: "Type the value of x if x + 15 = 25.", a: "10", type: "identification" },
                    { q: "Solve: p - 10 = 50", a: "p = 60", d: ["p = 40", "p = 500", "p = 5"] },
                    { q: "If 3n = 12, what is n?", a: "n = 4", d: ["n = 36", "n = 9", "n = 15"] },
                    { q: "What is the inverse operation of Division?", a: "Multiplication", d: ["Addition", "Subtraction", "Fractions"] }
                ]
            },
            {
                name: "Inequalities",
                lesson: "An inequality means things are NOT perfectly equal. x > 5 means 'x is greater than 5'. There are infinite answers! (6, 7, 8...). We graph them on a number line. Use an open circle for < or >. Use a closed (filled) circle for ≤ or ≥ to include the number.",
                quiz: [
                    { q: "What does the symbol ≤ mean?", a: "Less than or equal to", d: ["Greater than or equal to", "Not equal", "Less than"] },
                    { q: "If x > 10, can x be 10?", a: "No, it starts higher than 10", d: ["Yes, absolutely", "Only if it is negative", "Yes, 10 is greater than 10"] },
                    { q: "To graph x ≥ 4, what kind of circle do you draw on the 4?", a: "A closed (filled) circle", d: ["An open (empty) circle", "No circle", "A square"] },
                    { q: "If you have $20, and want to buy a game that costs 'c' dollars but you don't have enough, what is true?", a: "c > 20", d: ["c < 20", "c = 20", "c ≤ 20"] },
                    { q: "Is 8 a solution to the inequality x < 12?", a: "Yes", d: ["No", "Maybe", "Only if it is 8.0"] }
                ],
                exam: [
                    { q: "Which symbol means 'greater than or equal to'?", a: "≥", d: ["≤", ">", "≠"] },
                    { q: "Type the symbol for 'less than or equal to'.", a: "≤", type: "identification" },
                    { q: "If x < 5, what kind of circle goes on the 5?", a: "Open", d: ["Closed", "Dotted", "Square"] },
                    { q: "Which number is a solution to y > -2?", a: "0", d: ["-3", "-5", "-2"] },
                    { q: "You must be at least 48 inches to ride the rollercoaster. Which inequality shows this?", a: "Height ≥ 48", d: ["Height ≤ 48", "Height > 48", "Height < 48"] }
                ]
            },
            {
                name: "Area of Polygons & Surface Area",
                lesson: "New area formulas! Triangle = (Base x Height) ÷ 2. Parallelogram (slanted box) = Base x Height. Surface Area is wrapping paper! To find Surface Area of a 3D box, find the flat area of ALL 6 faces and add them together.",
                quiz: [
                    { q: "What is the area formula for a triangle?", a: "Base x Height divided by 2", d: ["Base x Height", "Length x Width x Height", "Side x Side"] },
                    { q: "A triangle has base 4 and height 6. Area?", a: "12", d: ["24", "10", "20"] },
                    { q: "A parallelogram has base 5 and height 4. Area?", a: "20", d: ["10", "9", "25"] },
                    { q: "What is Surface Area?", a: "The total area of all the flat faces on a 3D object", d: ["The space inside a 3D object", "The weight of the object", "Base x Height"] },
                    { q: "A cube has 6 identical square faces. If one face is 9 sq inches, what is the total Surface Area?", a: "54 sq inches", d: ["81 sq inches", "18 sq inches", "36 sq inches"] }
                ],
                exam: [
                    { q: "A triangle has base 10 and height 2. Area?", a: "10", d: ["20", "12", "5"] },
                    { q: "Type the area of a rectangle face with length 5 and width 6.", a: "30", type: "identification" },
                    { q: "Why do we divide by 2 for a triangle?", a: "A triangle is exactly half of a rectangle/parallelogram", d: ["Because it has 3 sides", "Because 2 is an even number", "We always divide in math"] },
                    { q: "How many flat faces does a rectangular box (prism) have?", a: "6", d: ["4", "8", "2"] },
                    { q: "Surface area is measured in:", a: "Square units", d: ["Cubic units", "Linear units", "Degrees"] }
                ]
            },
            {
                name: "Statistics (Mean, Median, Mode, Range)",
                lesson: "How to summarize a group of numbers! MEAN: The average. Add them all up, divide by how many there are. MEDIAN: The exact middle number when lined up from smallest to biggest. MODE: The number that shows up the most. RANGE: Biggest minus the smallest number.",
                quiz: [
                    { q: "What does 'Mean' mean?", a: "The average (add all and divide)", d: ["The middle number", "The most common number", "The biggest number"] },
                    { q: "Find the Mode of: 1, 2, 2, 4, 5.", a: "2", d: ["1", "5", "4"] },
                    { q: "What is the very first step to find the Median?", a: "Line the numbers up from smallest to largest", d: ["Add them all up", "Subtract them", "Pick a random number"] },
                    { q: "Find the Range of: 2, 5, 10.", a: "8 (10 - 2)", d: ["10", "2", "12"] },
                    { q: "Find the Mean of 4, 4, 4.", a: "4", d: ["12", "0", "8"] }
                ],
                exam: [
                    { q: "Find the Median of 1, 3, 7, 9, 10.", a: "7", d: ["10", "1", "6"] },
                    { q: "Type the Mode of this list: 5, 8, 8, 9, 10", a: "8", type: "identification" },
                    { q: "Find the Mean of 2 and 8.", a: "5", d: ["10", "6", "4"] },
                    { q: "Find the Range of 10, 15, 30.", a: "20", d: ["10", "30", "15"] },
                    { q: "Which statistic tells you the difference between the highest and lowest values?", a: "Range", d: ["Mean", "Median", "Mode"] }
                ]
            }
        ]
    }
};
