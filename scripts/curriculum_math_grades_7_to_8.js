module.exports = {
    // ──────────────────── GRADE 7 ────────────────────
    7: {
        levels: [
            {
                name: "Proportional Relationships",
                lesson: "Proportions state that two ratios are EQUAL! If 1 apple costs $2, then 3 apples cost $6. (1/2 = 3/6). The Constant of Proportionality (k) is how much 'y' changes when 'x' changes by 1. In the equation y = kx, 'k' is the constant multiplier.",
                quiz: [
                    { q: "What does a proportion show?", a: "That two ratios are equal", d: ["That two shapes are congruent", "That numbers are infinite", "Nothing"] },
                    { q: "If the ratio is 2 boys for every 3 girls, and there are 10 boys, how many girls?", a: "15", d: ["10", "12", "5"] },
                    { q: "What is 'k' in the equation y = kx?", a: "The Constant of Proportionality", d: ["The y-intercept", "The variable", "The area"] },
                    { q: "If y = 4x, what is the constant (k)?", a: "4", d: ["1", "4x", "y"] },
                    { q: "If 5 pencils cost 50 cents, what is the constant (cost per pencil)?", a: "10 cents", d: ["5 cents", "25 cents", "50 cents"] }
                ],
                exam: [
                    { q: "Solve the proportion: 3/4 = x/12. What is x?", a: "9", d: ["3", "12", "6"] },
                    { q: "Type the constant of proportionality if y = 15x is a straight line graph.", a: "15", type: "identification" },
                    { q: "A recipe calls for 2 cups flour to 1 cup sugar. If you use 6 cups flour, how much sugar?", a: "3 cups", d: ["4 cups", "2 cups", "6 cups"] },
                    { q: "If a point (x, y) on a graph is (2, 10), and it perfectly proportional, what is the constant k?", a: "5", d: ["2", "10", "20"] },
                    { q: "A directly proportional graph always passes through what point?", a: "The origin (0,0)", d: ["(1,1)", "(10,10)", "(0,1)"] }
                ]
            },
            {
                name: "Percents in the Real World",
                lesson: "Percentages are used everywhere! Taxes INCREASE the cost (subtotal + tax). Discounts/Sale Prices DECREASE the cost (original - discount). Interest is a percentage a bank pays you, or charges you! Simple Interest formula: I = P x r x t (Principal x Rate x Time).",
                quiz: [
                    { q: "Does sales tax increase or decrease the total amount you pay?", a: "Increase", d: ["Decrease", "Stays the same", "Depends on the day"] },
                    { q: "A $10 item has a 50% discount. What is the new price?", a: "$5", d: ["$15", "$10", "$2"] },
                    { q: "If you leave a 20% tip on a $20 bill, how much is the tip?", a: "$4", d: ["$2", "$5", "$24"] },
                    { q: "A store buys a toy for $5 and marks it up 100%. What is the selling price?", a: "$10", d: ["$5", "$15", "$100"] },
                    { q: "To find 10% of any number quickly, move the decimal:", a: "Left 1 place", d: ["Right 1 place", "Left 2 places", "To the end"] }
                ],
                exam: [
                    { q: "Simple Interest formula is I = P x R x T. What does P stand for?", a: "Principal (Starting Amount)", d: ["Percent", "Price", "Payment"] },
                    { q: "Type the sale price of a $100 jacket that is 30% off (just the number).", a: "70", type: "identification" },
                    { q: "Look at the fraction 1/4. What percent is that?", a: "25%", d: ["40%", "14%", "41%"] },
                    { q: "A meal is $40. Sales tax is 5%. How much is tax?", a: "$2", d: ["$5", "$4", "$8"] },
                    { q: "If you borrow $100 at 5% simple interest per year, how much interest after 1 year?", a: "$5", d: ["$10", "$50", "$105"] }
                ]
            },
            {
                name: "Adding/Subtracting Rational Numbers",
                lesson: "Adding and Subtracting NEGATIVES! If the signs are the SAME (both negative), add them up and keep the sign (-2 + -3 = -5). If signs are DIFFERENT, subtract them and keep the sign of the bigger absolute value! Subtracting a negative is the same as ADDING A POSITIVE! (5 - (-3) = 8).",
                quiz: [
                    { q: "What is -4 + -5?", a: "-9", d: ["1", "-1", "9"] },
                    { q: "What is 10 + -3?", a: "7", d: ["-7", "13", "-13"] },
                    { q: "What is the secret trick for 'subtracting a negative', like 5 - (-2)?", a: "Change both minuses to a plus", d: ["Make it a fraction", "Multiply them", "Keep them negative"] },
                    { q: "What is -8 - (-4)?", a: "-4", d: ["-12", "12", "4"] },
                    { q: "If you owe $10 (-10) and find $5 (+5), what is your balance?", a: "-$5", d: ["$5", "-$15", "$15"] }
                ],
                exam: [
                    { q: "What is -20 + 20?", a: "0", d: ["-40", "40", "1"] },
                    { q: "Type the answer to -7 - 3.", a: "-10", type: "identification" },
                    { q: "What is -15 + 10?", a: "-5", d: ["5", "25", "-25"] },
                    { q: "Change the subtraction to addition: 12 - 15.", a: "12 + (-15)", d: ["15 + (-12)", "12 + 15", "-12 + 15"] },
                    { q: "You dive to -20 feet, then swim down another 10 feet (-10). Depth?", a: "-30 feet", d: ["-10 feet", "10 feet", "30 feet"] }
                ]
            },
            {
                name: "Multiplying/Dividing Rational Numbers",
                lesson: "The rules for multiplication and division of negatives are EASY! If the signs MATCH (positive/positive OR negative/negative), the answer is always POSITIVE! If the signs are DIFFERENT (positive/negative), the answer is always NEGATIVE! -4 x -2 = 8.  -4 x 2 = -8.",
                quiz: [
                    { q: "What is a negative number times a negative number?", a: "A positive number", d: ["A negative number", "Zero", "A fraction"] },
                    { q: "What is -3 x 5?", a: "-15", d: ["15", "8", "-8"] },
                    { q: "What is -10 ÷ -2?", a: "5", d: ["-5", "20", "-20"] },
                    { q: "What is 20 ÷ -4?", a: "-5", d: ["5", "-24", "16"] },
                    { q: "If you multiply three negative numbers together, the answer is:", a: "Negative", d: ["Positive", "Zero", "Positive or Negative"] }
                ],
                exam: [
                    { q: "What is -6 x -6?", a: "36", d: ["-36", "12", "-12"] },
                    { q: "Type the quotient of -45 ÷ 9.", a: "-5", type: "identification" },
                    { q: "What is (-2) x (3) x (-4)?", a: "24", d: ["-24", "-9", "9"] },
                    { q: "Any number multiplied by 0 is:", a: "0", d: ["1", "Negative", "Positive"] },
                    { q: "What is -100 ÷ 10?", a: "-10", d: ["10", "-90", "110"] }
                ]
            },
            {
                name: "Two-Step Equations",
                lesson: "To solve equations like 2x + 3 = 11, undo the order of operations! (Reverse PEMDAS). Get rid of the addition/subtraction FIRST. Subtract 3 from both sides: 2x = 8. THEN get rid of multiplication/division. Divide both sides by 2: x = 4. Check your answer!",
                quiz: [
                    { q: "In the equation 3x - 5 = 10, what is the VERY FIRST step to solve?", a: "Add 5 to both sides", d: ["Divide by 3", "Subtract 5", "Multiply by 3"] },
                    { q: "Solve for x: 2x + 4 = 10.", a: "x = 3", d: ["x = 5", "x = 7", "x = 2"] },
                    { q: "Solve for y: (y/2) - 1 = 5", a: "y = 12", d: ["y = 8", "y = 6", "y = 3"] },
                    { q: "If 4m + 2 = 14, what does 4m equal?", a: "12", d: ["16", "3", "14"] },
                    { q: "Solve: -3x + 1 = 10", a: "x = -3", d: ["x = 3", "x = -9", "x = 9"] }
                ],
                exam: [
                    { q: "Which correctly models a two-step equation?", a: "Do addition/subtraction inverse, then multiplication/division inverse", d: ["Only multiply", "Divide first, always", "Add variables together"] },
                    { q: "Type the value of x for: 5x - 10 = 15.", a: "5", type: "identification" },
                    { q: "Solve: -2a - 4 = 8", a: "a = -6", d: ["a = 6", "a = -2", "a = 2"] },
                    { q: "Solve: x / 5 + 3 = 5", a: "x = 10", d: ["x = 2", "x = 25", "x = 4"] },
                    { q: "What should you always do after finding your answer?", a: "Substitute it back into the equation to check it", d: ["Erase your work", "Cry", "Change the negative sign"] }
                ]
            },
            {
                name: "Two-Step Inequalities",
                lesson: "Solving an inequality (like -2x > 8) is exactly like solving an equation, BUT with one HUGE RULE! If you multiply or divide both sides by a NEGATIVE NUMBER, you MUST FLIP THE INEQUALITY SIGN! (-2x > 8 becomes x < -4).",
                quiz: [
                    { q: "What must you do if you divide an inequality by a negative number?", a: "Flip the inequality sign", d: ["Divide it again", "Make the answer zero", "Nothing"] },
                    { q: "Solve: 3x < 15. Do we flip the sign?", a: "No, because we divided by positive 3", d: ["Yes, always", "Only on Tuesdays", "No, because 15 is positive"] },
                    { q: "Solve: -2y > 10.", a: "y < -5", d: ["y > -5", "y < 5", "y > 5"] },
                    { q: "Solve: -x < 4.", a: "x > -4", d: ["x < -4", "x = -4", "x = 4"] },
                    { q: "Solve: 4m - 2 > 10", a: "m > 3", d: ["m < 3", "m > -3", "m < -3"] }
                ],
                exam: [
                    { q: "Solve: -5x + 5 < 20", a: "x > -3", d: ["x < -3", "x > 3", "x < 3"] },
                    { q: "Type the value that x must be greater than for: -x + 1 < -9.", a: "10", type: "identification" },
                    { q: "If you add a negative number to both sides of an inequality, do you flip the sign?", a: "No, only flip when multiplying or dividing by a negative", d: ["Yes, always", "Only if it is a fraction", "It becomes an equal sign"] },
                    { q: "Solve: x/(-2) > 4.", a: "x < -8", d: ["x > -8", "x < 8", "x > 8"] },
                    { q: "Which graph would match x < 5?", a: "Open circle on 5, arrow to the left", d: ["Closed circle on 5, arrow to right", "Open circle on 5, right", "Closed circle on 5, left"] }
                ]
            },
            {
                name: "Circles",
                lesson: "Circles have special names! Radius (center to edge). Diameter (edge to edge through center). Circumference (distance AROUND the edge). The magic number is Pi (π ≈ 3.14). Circumference = π x D. Area = π x r² (radius squared).",
                quiz: [
                    { q: "What is the distance around the outside of a circle called?", a: "Circumference", d: ["Perimeter", "Area", "Radius"] },
                    { q: "What is a line from the center to the edge called?", a: "Radius", d: ["Diameter", "Chord", "Arc"] },
                    { q: "If the radius is 5, what is the diameter?", a: "10", d: ["2.5", "25", "15"] },
                    { q: "What is the formula for the Area of a circle?", a: "π x r²", d: ["π x d", "Length x Width", "Base x Height"] },
                    { q: "What number is commonly used for Pi (π)?", a: "3.14", d: ["1.34", "3.41", "4.13"] }
                ],
                exam: [
                    { q: "If the diameter is 6 cm, what is the radius?", a: "3 cm", d: ["12 cm", "36 cm", "18 cm"] },
                    { q: "Type the word for a line going straight across a circle through its center.", a: "diameter", type: "identification" },
                    { q: "What is the circumference of a circle with a diameter of 10? Use 3.14 for Pi.", a: "31.4", d: ["314", "100", "3.14"] },
                    { q: "Radius squared (r²) means: ", a: "Radius times Radius", d: ["Radius times 2", "Radius times Pi", "Radius plus Radius"] },
                    { q: "Area of a circle with radius 2? (Use 3.14 for Pi)", a: "12.56", d: ["6.28", "3.14", "25.12"] }
                ]
            },
            {
                name: "Angle Relationships",
                lesson: "Angles that add up to 90 degrees are COMPLEMENTARY (forming a corner). Angles that add up to 180 degrees are SUPPLEMENTARY (forming a straight line). Angles directly across from each other in an 'X' are VERTICAL angles, and they are always exactly equal!",
                quiz: [
                    { q: "Complementary angles add up to how many degrees?", a: "90°", d: ["180°", "360°", "45°"] },
                    { q: "Supplementary angles add up to how many degrees?", a: "180°", d: ["90°", "360°", "0°"] },
                    { q: "If angle A is 40°, what is its complement?", a: "50°", d: ["140°", "40°", "90°"] },
                    { q: "If an angle is 100°, what is its supplement?", a: "80°", d: ["10°", "100°", "260°"] },
                    { q: "What is true about Vertical Angles (angles across from each other)?", a: "They are equal", d: ["They add to 90", "They add to 180", "They are always right angles"] }
                ],
                exam: [
                    { q: "Two lines form an 'X'. The top angle is 110°. What is the bottom vertical angle?", a: "110°", d: ["70°", "90°", "180°"] },
                    { q: "Type the math word for angles that add to 180 degrees.", a: "supplementary", type: "identification" },
                    { q: "Can two obtuse angles be supplementary?", a: "No, they would add up to more than 180", d: ["Yes, always", "Only if they are equal", "Yes, they add up to 360"] },
                    { q: "Angle A and Angle B are complementary. If A = x, what is B?", a: "90 - x", d: ["180 - x", "x", "x - 90"] },
                    { q: "If two angles sit on a straight line, what are they?", a: "Supplementary", d: ["Complementary", "Vertical", "Right"] }
                ]
            },
            {
                name: "Probability",
                lesson: "Probability is the chance of something happening! It's a fraction: (Wanted Outcomes) / (Total Possible Outcomes). Tossing a coin has 2 total outcomes (heads/tails). Getting heads is 1 out of 2, or 1/2, or 50%. A standard die has 6 sides (1-6). Event 0 implies impossible, 1 implies certain.",
                quiz: [
                    { q: "If an event is impossible, its probability is:", a: "0", d: ["1", "1/2", "100"] },
                    { q: "If an event is certain to happen, its probability is:", a: "1 (or 100%)", d: ["0", "1/2", "Infinite"] },
                    { q: "What is the probability of rolling a 3 on a 6-sided die?", a: "1/6", d: ["3/6", "1/3", "1/2"] },
                    { q: "What is the probability of rolling an EVEN number on a 6-sided die?", a: "3/6 (or 1/2)", d: ["2/6", "4/6", "1/6"] },
                    { q: "A bag has 3 red marbles and 2 blue marbles. Probability of picking red?", a: "3/5", d: ["2/5", "3/2", "5/3"] }
                ],
                exam: [
                    { q: "A spinner has 4 equal sections: Red, Blue, Green, Yellow. What is the probability of landing on Red or Blue?", a: "2/4 (or 1/2)", d: ["1/4", "3/4", "1/8"] },
                    { q: "Type the probability (as an unsimplified fraction, e.g. 1/6) of rolling a 5 on a standard die.", a: "1/6", type: "identification" },
                    { q: "If you flip a coin twice, what is the probability of getting Heads BOTH times?", a: "1/4", d: ["1/2", "1/3", "2/2"] },
                    { q: "If the probability of Rain is 30%, what is the probability of NO Rain?", a: "70%", d: ["30%", "100%", "0%"] },
                    { q: "What is theoretical probability based on?", a: "Math rules and possible outcomes", d: ["An actual experiment that you did", "A guess", "A magic trick"] }
                ]
            },
            {
                name: "Populations and Samples",
                lesson: "A POPULATION is an entire group (all students in school). A SAMPLE is a small part of that group (one 7th grade class). To make an accurate guess (inference) about the population, the sample MUST be RANDOM and unbiased!",
                quiz: [
                    { q: "What is a population?", a: "The entire group being studied", d: ["A small piece of the group", "A number of people", "Only animals"] },
                    { q: "What is a sample?", a: "A smaller part chosen to represent the population", d: ["The whole group", "A type of graph", "An average"] },
                    { q: "To get a good survey result, a sample must be:", a: "Randomly selected", d: ["Only your friends", "The first 5 people you see", "Biased"] },
                    { q: "If you want to know the favorite food of kids in your state, which is the best sample?", a: "100 random kids from 5 different cities", d: ["Your 4 best friends", "All the kids at your lunch table", "50 kids in a pizza restaurant"] },
                    { q: "A 'biased' sample means:", a: "It does NOT fairly represent the whole population", d: ["It is perfectly fair", "It is random", "It has too many numbers"] }
                ],
                exam: [
                    { q: "You ask people at a football game what their favorite sport is. Why is this a bad sample?", a: "It is biased; they clearly like football", d: ["It is perfect", "The sample is too small", "It is completely random"] },
                    { q: "Type the word that means a smaller, representative subset of an entire group.", a: "sample", type: "identification" },
                    { q: "In a random sample of 20 kids, 5 like math. We infer that out of 100 kids, how many like math?", a: "25", d: ["20", "5", "50"] },
                    { q: "Which of these is a truly random sample?", a: "Drawing names out of a hat blindly", d: ["Asking only girls", "Asking only people with A grades", "Asking the basketball team"] },
                    { q: "Making a logical guess about a whole population using a sample is called an:", a: "Inference", d: ["Equation", "Area", "Absolute value"] }
                ]
            }
        ]
    },

    // ──────────────────── GRADE 8 ────────────────────
    8: {
        levels: [
            {
                name: "Properties of Exponents",
                lesson: "Exponents tell you how many times to multiply the BASE by itself. 3² = 3 x 3! RULES: 1. Multiplying same bases? ADD exponents. (x² * x³ = x⁵). 2. Dividing same bases? SUBTRACT exponents (x⁵ / x² = x³). 3. Power of a Power? MULTIPLY exponents (x²)³ = x⁶. 4. Anything to the zero power equals ONE!",
                quiz: [
                    { q: "What does 4³ mean?", a: "4 x 4 x 4", d: ["4 + 3", "4 x 3", "3 x 3 x 3 x 3"] },
                    { q: "What is 5⁰?", a: "1", d: ["0", "5", "50"] },
                    { q: "When multiplying (x³) times (x⁴), what do you do to the exponents?", a: "Add them (x⁷)", d: ["Multiply them (x¹²)", "Subtract them", "Keep them the same"] },
                    { q: "What happens when you divide (y⁸) / (y²)?", a: "Subtract exponents (y⁶)", d: ["Add them (y¹⁰)", "Divide them (y⁴)", "Multiply them"] },
                    { q: "Using the power of a power rule: What is (z³)²?", a: "z⁶", d: ["z⁵", "z⁹", "z³²"] }
                ],
                exam: [
                    { q: "Simplify x² * x⁵", a: "x⁷", d: ["x¹⁰", "x³", "x²⁵"] },
                    { q: "Type the numeric answer to 100⁰.", a: "1", type: "identification" },
                    { q: "Simplify (m⁴)³", a: "m¹²", d: ["m⁷", "m¹", "m⁴³"] },
                    { q: "Simplify (2²) x (2³)", a: "2⁵", d: ["2⁶", "4⁵", "4⁶"] },
                    { q: "A negative exponent means:", a: "It belongs in the denominator as a fraction (1/x²)", d: ["The number is negative", "The number is zero", "Add the numbers"] }
                ]
            },
            {
                name: "Scientific Notation",
                lesson: "Scientific notation makes giant (or tiny) numbers easy to write. Format: A number between 1 and 10, times a power of 10. (e.g., 3.4 x 10³). Positive exponent means move decimal RIGHT (big number). Negative exponent means move decimal LEFT (tiny decimal).",
                quiz: [
                    { q: "In scientific notation, the first number must be between what two values?", a: "1 and 10", d: ["0 and 1", "10 and 100", "0 and infinity"] },
                    { q: "What is 2.5 x 10² in standard form?", a: "250", d: ["25", "0.025", "2500"] },
                    { q: "Convert 4,500 to scientific notation.", a: "4.5 x 10³", d: ["45 x 10²", "0.45 x 10⁴", "4.5 x 10⁻³"] },
                    { q: "A negative exponent on the 10 means the standard number is ___.", a: "A small fraction/decimal (less than 1)", d: ["A negative number", "A giant number", "Zero"] },
                    { q: "What is 3.1 x 10⁻² in standard form?", a: "0.031", d: ["310", "0.31", "3.100"] }
                ],
                exam: [
                    { q: "Convert 8,000,000 to scientific notation.", a: "8 x 10⁶", d: ["8 x 10⁷", "80 x 10⁵", "0.8 x 10⁷"] },
                    { q: "Type the standard number form of 5.5 x 10³ (no commas).", a: "5500", type: "identification" },
                    { q: "Convert 0.0006 to scientific notation.", a: "6 x 10⁻⁴", d: ["6 x 10⁴", "60 x 10⁻⁵", "0.6 x 10⁻³"] },
                    { q: "Which is a larger number: 1 x 10⁶ or 9 x 10⁵?", a: "1 x 10⁶ (one million)", d: ["9 x 10⁵ (nine hundred thousand)", "They are equal", "Cannot tell"] },
                    { q: "Is 12.5 x 10³ written in proper scientific notation?", a: "No, 12.5 is greater than 10", d: ["Yes, perfectly fine", "No, the exponent must be negative", "Yes, it has a decimal"] }
                ]
            },
            {
                name: "Square & Cube Roots",
                lesson: "A Square Root (√) asks: What number times ITSELF equals this number? (√25 = 5, because 5x5=25). A Cube Root (³√) asks: What number times itself 3 times equals this number? (³√8 = 2, because 2x2x2=8). RATIONAL numbers can be written as fractions. IRRATIONAL numbers (like √2 or Pi) go on forever without repeating!",
                quiz: [
                    { q: "What is the square root of 36? (√36)", a: "6", d: ["18", "72", "3"] },
                    { q: "What is the square root of 100? (√100)", a: "10", d: ["50", "1000", "25"] },
                    { q: "What is the cube root of 27? (³√27)", a: "3", d: ["9", "4", "27"] },
                    { q: "What does the symbol √ mean?", a: "Square Root", d: ["Divide", "Long Division", "Percentage"] },
                    { q: "Numbers like Pi (3.14159...) that never end and never repeat are called:", a: "Irrational numbers", d: ["Rational numbers", "Integers", "Fractions"] }
                ],
                exam: [
                    { q: "Evaluate √81", a: "9", d: ["8", "10", "40.5"] },
                    { q: "Type the cube root of 8.", a: "2", type: "identification" },
                    { q: "Between which two whole numbers is √20?", a: "Between 4 and 5", d: ["Between 10 and 11", "Between 19 and 21", "Between 3 and 4"] },
                    { q: "Is the number √2 a rational or irrational number?", a: "Irrational", d: ["Rational", "Integer", "Both"] },
                    { q: "Evaluate ³√64", a: "4", d: ["8", "32", "16"] }
                ]
            },
            {
                name: "Pythagorean Theorem",
                lesson: "Used ONLY on Right Triangles! The formula is a² + b² = c². The two short legs touching the square corner are 'a' and 'b'. The long slanted side across from the corner is the HYPOTENUSE ('c'). Square the legs, add them, then find the square root!",
                quiz: [
                    { q: "What is the Pythagorean Theorem formula?", a: "a² + b² = c²", d: ["a + b = c", "V = LWH", "A = 1/2 bh"] },
                    { q: "The longest side of a right triangle is called the:", a: "Hypotenuse", d: ["Leg", "Base", "Vertex"] },
                    { q: "Which letter in the formula MUST represent the hypotenuse?", a: "c", d: ["a", "b", "It doesn't matter"] },
                    { q: "If leg a=3 and leg b=4, what is c²?", a: "25", d: ["7", "12", "5"] },
                    { q: "If c² = 25, what is the length of side c?", a: "5", d: ["25", "12.5", "50"] }
                ],
                exam: [
                    { q: "If a=6 and b=8, what is side c?", a: "10", d: ["14", "100", "48"] },
                    { q: "Type the name of the longest side of a right triangle.", a: "hypotenuse", type: "identification" },
                    { q: "If the hypotenuse (c) is 13, and leg (a) is 5, how do you find leg (b)?", a: "Subtract: c² - a² = b²", d: ["Add: c² + a² = b²", "Multiply them", "Divide by 2"] },
                    { q: "Can the Pythagorean Theorem be used on an obtuse triangle?", a: "No, only on right triangles", d: ["Yes, on any triangle", "Only on squares", "Only on straight lines"] },
                    { q: "The hypotenuse is ALWAYS directly across from:", a: "The right angle (90° corner)", d: ["The shortest leg", "The longest leg", "The outside"] }
                ]
            },
            {
                name: "Solving Linear Equations",
                lesson: "Advanced Equations! Sometimes variables are on BOTH sides (3x + 2 = 2x + 5). First, move the smaller variable so they are on the same side! (Subtract 2x from both sides -> x + 2 = 5). Now it's a simple one-step equation! x = 3. Use the distributive property to remove parentheses first.",
                quiz: [
                    { q: "If an equation has variables on both sides, what should you do first?", a: "Move them to the same side using addition/subtraction", d: ["Add all numbers together", "Multiply both sides by 2", "Erase one of them"] },
                    { q: "Solve 5x = 4x + 10.", a: "x = 10", d: ["x = -10", "x = 5", "x = 40"] },
                    { q: "Using the distributive property: What does 2(x + 3) become?", a: "2x + 6", d: ["2x + 3", "x + 6", "2x + 5"] },
                    { q: "Solve: 2x - 4 = x + 1", a: "x = 5", d: ["x = 3", "x = -3", "x = -5"] },
                    { q: "What does it mean if an equation ends up saying 5 = 5?", a: "Infinite solutions (It is an identity)", d: ["No solution", "x = 5", "x = 0"] }
                ],
                exam: [
                    { q: "Solve: 3x - 1 = x + 7", a: "x = 4", d: ["x = 3", "x = 5", "x = 8"] },
                    { q: "Type the value for x: 10x = 9x + 20.", a: "20", type: "identification" },
                    { q: "What does it mean if an equation ends up saying 3 = 7?", a: "No solution (It is impossible)", d: ["x = 4", "Infinite solutions", "x = 10"] },
                    { q: "Expand using distributive property: 4(y - 2)", a: "4y - 8", d: ["4y - 2", "4y + 8", "y - 8"] },
                    { q: "Solve: -x = 5 (How do you isolate positive x?)", a: "x = -5 (Divide or multiply both sides by -1)", d: ["x = 5", "x = 0", "No solution"] }
                ]
            },
            {
                name: "Functions (Linear vs. Non-linear)",
                lesson: "A Function is a magical machine: Each input (x) has exactly ONE output (y). It can't spit out two different answers for the same input! A LINEAR function forms a perfectly straight line on a graph. The famous linear equation is y = mx + b. 'm' is the slope (angle), 'b' is the y-intercept (starting point).",
                quiz: [
                    { q: "What is the defining rule of a function?", a: "Every input has exactly ONE output", d: ["Every output has ONE input", "It must be a straight line", "It must cross zero"] },
                    { q: "What does a linear function look like on a graph?", a: "A perfectly straight continuous line", d: ["A curve", "A circle", "Random dots"] },
                    { q: "In the equation y = mx + b, what does the 'm' stand for?", a: "The slope (steepness)", d: ["The y-intercept", "The function", "The middle"] },
                    { q: "In the equation y = mx + b, what does the 'b' stand for?", a: "The y-intercept (where the line hits the y-axis)", d: ["The bottom", "The slope", "The biggest number"] },
                    { q: "If y = x², what shape will the graph make?", a: "A curve (parabola)", d: ["A straight line", "A circle", "A triangle"] }
                ],
                exam: [
                    { q: "If y = 3x + 2, what is the slope?", a: "3", d: ["2", "x", "y"] },
                    { q: "Type the y-intercept of the line y = 5x - 4.", a: "-4", type: "identification" },
                    { q: "Which of these is a non-linear equation?", a: "y = x³", d: ["y = 4x + 1", "y = -2x", "y = x - 5"] },
                    { q: "What is the 'Vertical Line Test' used for in graphing?", a: "To see if a graph is a function (hits the line only once)", d: ["To measure the slope", "To find the y-intercept", "To find the area"] },
                    { q: "If the slope (m) is negative, which way does the line slant?", a: "Downwards from left to right", d: ["Upwards from left to right", "Straight vertical", "Straight horizontal"] }
                ]
            },
            {
                name: "Transformations",
                lesson: "Transformations MOVE shapes on a coordinate plane! 1. TRANSLATION: Slide up/down/left/right without turning! 2. ROTATION: Turning to a new angle. 3. REFLECTION: A mirror image flip! 4. DILATION: Making a shape magically bigger or smaller (resizing).",
                quiz: [
                    { q: "Which transformation is a perfect 'slide'?", a: "Translation", d: ["Rotation", "Reflection", "Dilation"] },
                    { q: "Which transformation is a 'mirror image flip'?", a: "Reflection", d: ["Translation", "Rotation", "Dilation"] },
                    { q: "Which transformation 'turns' a shape?", a: "Rotation", d: ["Translation", "Reflection", "Dilation"] },
                    { q: "Which transformation makes a shape bigger or smaller?", a: "Dilation", d: ["Translation", "Rotation", "Reflection"] },
                    { q: "If you slide a triangle 3 spaces left and 2 spaces up, what kind of transformation is it?", a: "Translation", d: ["Rotation", "Reflection", "Dilation"] }
                ],
                exam: [
                    { q: "A 'Scale Factor' is used in which transformation?", a: "Dilation", d: ["Rotation", "Translation", "Reflection"] },
                    { q: "Type the name of the transformation that 'flips' a shape.", a: "reflection", type: "identification" },
                    { q: "If you reflect a shape across the y-axis, does it change size?", a: "No, reflections do not change size", d: ["Yes, always", "Only if it is a triangle", "It becomes a circle"] },
                    { q: "Turning a shape 90 degrees clockwise is a:", a: "Rotation", d: ["Translation", "Reflection", "Dilation"] },
                    { q: "A 'Pre-image' becomes an 'Image' after a transformation. The Image is usually labeled with:", a: "Prime marks (like A', B')", d: ["Asterisks (*)", "Negative signs (-)", "Zeros (0)"] }
                ]
            },
            {
                name: "Congruence & Similarity",
                lesson: "CONGRUENT means EXACTLY identical in size and shape (angles and sides match perfectly). A translation, rotation, or reflection produces congruent shapes! SIMILAR means the exact same shape, but a DIFFERENT size (like a grown up and a baby). Dilations produce similar shapes!",
                quiz: [
                    { q: "If two polygons are Congruent, they are:", a: "Exactly the same size and shape", d: ["The same shape but different sizes", "Different shapes entirely", "Always triangles"] },
                    { q: "If two polygons are Similar, they are:", a: "The same shape but different sizes", d: ["Exactly the same size and shape", "Different shapes entirely", "Always squares"] },
                    { q: "Which transformation makes shapes Similar, but NOT Congruent?", a: "Dilation", d: ["Translation", "Rotation", "Reflection"] },
                    { q: "Do the angles change when you dilate a triangle to make it bigger?", a: "No, angles stay identical", d: ["Yes, angles get bigger", "Yes, angles get smaller", "They become right angles"] },
                    { q: "If I slide a square 5 inches to the right, is the new square congruent to the old one?", a: "Yes", d: ["No", "It is only similar", "Cannot be determined"] }
                ],
                exam: [
                    { q: "What must be true about the side lengths of Similar shapes?", a: "They are proportional (have a constant ratio)", d: ["They must be exactly equal", "They have no relationship", "They are all negative"] },
                    { q: "Type the word that means 'exactly the same size and shape'.", a: "congruent", type: "identification" },
                    { q: "Are all identical squares similar?", a: "Yes", d: ["No", "Only some of them", "Only if they are red"] },
                    { q: "A triangle is rotated 180 degrees. Is the new triangle congruent?", a: "Yes", d: ["No", "It is similar but not congruent", "It becomes a square"] },
                    { q: "Two shapes have the exact same angles, but one is twice as big. They are:", a: "Similar", d: ["Congruent", "Rotated", "Neither"] }
                ]
            },
            {
                name: "Volume of Cylinders, Cones, Spheres",
                lesson: "New 3D shapes! For all of these, find the Area of the Circle base first (πr²). CYLINDER: Base Area x Height (πr²h). CONE: A cone is exactly 1/3 of a cylinder! Formula: (πr²h) ÷ 3. SPHERE: The formula for a round ball is 4/3 x π x r³.",
                quiz: [
                    { q: "What is the formula for the volume of a Cylinder?", a: "π x r² x h", d: ["1/3 x π x r² x h", "4/3 x π x r³", "L x W x H"] },
                    { q: "A cone holds what fraction of the volume of a cylinder with the same base and height?", a: "1/3", d: ["1/2", "1/4", "Equal"] },
                    { q: "What is the formula for the volume of a Cone?", a: "1/3 x π x r² x h", d: ["π x r² x h", "L x W x H", "Base x Height"] },
                    { q: "What is the formula for the volume of a ball (Sphere)?", a: "4/3 x π x r³", d: ["π x r² x h", "L x W x H", "π x r²"] },
                    { q: "What part of a cylinder is 'π x r²'?", a: "The circle base", d: ["The height", "The side wall", "The volume"] }
                ],
                exam: [
                    { q: "If a cylinder has a volume of 30, what is the volume of a cone with the exact same base and height?", a: "10", d: ["30", "15", "90"] },
                    { q: "Type the 3-letter word for the 3D shape that looks like an ice cream cone.", a: "cone", type: "identification" },
                    { q: "For a sphere formula (r³), what does r³ mean?", a: "Radius x Radius x Radius", d: ["Radius x 3", "3 + Radius", "Radius times Pi"] },
                    { q: "A cylinder has radius 2 and height 10. Volume? (Use 3.14 for Pi, round to whole)", a: "126", d: ["63", "12", "20"] },
                    { q: "Why do cylinders and cones formulas both start with πr²?", a: "Because their bottoms (bases) are circles", d: ["Because it is a rule", "Because they have no sides", "Because they are triangles"] }
                ]
            },
            {
                name: "Scatter Plots & Two-Way Tables",
                lesson: "Data analysis! A Scatter Plot shows dots representing two variables (like Height vs. Shoe Size). We look for a CORRELATION (trend). Positive: as x goes up, y goes up. Negative: as x goes up, y goes down. A 'Line of Best Fit' is a straight line drawn straight through the middle of the dots to guess future trends!",
                quiz: [
                    { q: "What does a scatter plot show?", a: "The relationship between two different variables", d: ["One variable over time", "Parts of a whole circle", "Only negative numbers"] },
                    { q: "If the dots on a graph go generally UPWARDS from left to right, it is a:", a: "Positive correlation", d: ["Negative correlation", "No correlation", "Zero correlation"] },
                    { q: "If the dots look totally random like a cloud, it is:", a: "No correlation", d: ["Positive correlation", "Negative correlation", "Perfect correlation"] },
                    { q: "What is a 'Line of Best Fit'?", a: "A straight line drawn through the center of the data points", d: ["A curved line connecting every dot", "A line that touches zero", "A line connecting the first and last dot"] },
                    { q: "What does an outlier mean on a scatter plot?", a: "A data point far away from all the other dots", d: ["The dot closest to the line", "The first dot", "A negative dot"] }
                ],
                exam: [
                    { q: "As hours of video games went up, test scores went down. What correlation is this?", a: "Negative correlation", d: ["Positive correlation", "No correlation", "Perfect correlation"] },
                    { q: "Type the word for a straight line drawn through the middle of scattered data.", a: "trendline", type: "identification" },
                    { q: "A Two-Way Table compares two categorical variables. Where are the totals usually placed?", a: "In the margins (bottom row, right column)", d: ["In the center", "They aren't shown", "Only in the top row"] },
                    { q: "We can use the Line of Best Fit to:", a: "Predict future data", d: ["Erase the outlier", "Make the dots vanish", "Find the area"] },
                    { q: "The more miles you drive, the more gas you use. What correlation is this?", a: "Positive correlation", d: ["Negative correlation", "No correlation", "Constant correlation"] }
                ]
            }
        ]
    }
};
