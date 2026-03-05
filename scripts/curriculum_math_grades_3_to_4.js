module.exports = {
    // ──────────────────── GRADE 3 ────────────────────
    3: {
        levels: [
            {
                name: "Multiplication Basics",
                lesson: "Multiplication is like fast adding! Think of equal groups. 3 x 4 means 3 groups of 4 things (4 + 4 + 4 = 12). The numbers you multiply are called 'factors' and the answer is the 'product'. An array (rows and columns) is a great way to see multiplication.",
                quiz: [
                    { q: "What does 3 x 5 mean?", a: "3 groups of 5", d: ["3 plus 5", "3 groups of 3", "5 groups of 1"] },
                    { q: "What is the product of 2 x 4?", a: "8", d: ["6", "10", "12"] },
                    { q: "Which repeated addition sentence matches 4 x 2?", a: "2 + 2 + 2 + 2", d: ["4 + 2", "2 + 4", "4 + 4 + 4 + 4"] },
                    { q: "If you have 4 cars with 4 wheels each, how many wheels?", a: "16", d: ["12", "8", "20"] },
                    { q: "What is 5 x 0?", a: "0", d: ["5", "1", "10"] }
                ],
                exam: [
                    { q: "What is 3 x 3?", a: "9", d: ["6", "12", "8"] },
                    { q: "Type the answer to 5 x 2.", a: "10", type: "identification" },
                    { q: "What string of addition matches 3 x 6?", a: "6 + 6 + 6", d: ["3 + 6", "3 + 3 + 3", "6 + 3 + 6"] },
                    { q: "There are 2 boxes of 5 crayons. How many crayons?", a: "10", d: ["7", "15", "5"] },
                    { q: "What do we call the answer in multiplication?", a: "Product", d: ["Sum", "Difference", "Factor"] }
                ]
            },
            {
                name: "Division Basics",
                lesson: "Division is sharing objects equally! If you have 12 cookies and share them with 3 friends (12 ÷ 3), each friend gets 4 cookies. It is the opposite (inverse) of multiplication. Since 3 x 4 = 12, then 12 ÷ 3 = 4.",
                quiz: [
                    { q: "What does division mean?", a: "Sharing fairly into equal groups", d: ["Adding all together", "Taking one away", "Counting fast"] },
                    { q: "If 10 pieces of candy are shared between 2 kids, how many does each get?", a: "5", d: ["8", "12", "4"] },
                    { q: "What is 15 ÷ 3?", a: "5", d: ["4", "6", "12"] },
                    { q: "If 4 x 2 = 8, what is 8 ÷ 2?", a: "4", d: ["8", "2", "6"] },
                    { q: "You have 9 blocks to put into 3 piles. How many in each pile?", a: "3", d: ["4", "6", "2"] }
                ],
                exam: [
                    { q: "What is 8 ÷ 4?", a: "2", d: ["4", "12", "6"] },
                    { q: "Type the answer to 12 ÷ 4.", a: "3", type: "identification" },
                    { q: "If 5 x ___ = 20, what is 20 ÷ 5?", a: "4", d: ["5", "10", "15"] },
                    { q: "Sharing 20 apples into 4 baskets leaves how many in each?", a: "5", d: ["16", "4", "6"] },
                    { q: "Which symbol means division?", a: "÷", d: ["+", "-", "x"] }
                ]
            },
            {
                name: "Multiplication Tables (0-10)",
                lesson: "Fluency means you know the facts fast! 0 times anything is 0. 1 times anything is that number. 2s are doubles. 5s end in 0 or 5. 10s end in 0. The more you practice, the faster you get. Let's drill!",
                quiz: [
                    { q: "What is 7 x 1?", a: "7", d: ["1", "8", "0"] },
                    { q: "What is 4 x 5?", a: "20", d: ["15", "25", "10"] },
                    { q: "What is 9 x 0?", a: "0", d: ["9", "1", "90"] },
                    { q: "What is 6 x 6?", a: "36", d: ["30", "42", "12"] },
                    { q: "What is 8 x 3?", a: "24", d: ["21", "27", "11"] }
                ],
                exam: [
                    { q: "What is 7 x 7?", a: "49", d: ["42", "56", "14"] },
                    { q: "Type the answer to 8 x 6.", a: "48", type: "identification" },
                    { q: "What is 9 x 9?", a: "81", d: ["72", "90", "18"] },
                    { q: "What is 5 x 7?", a: "35", d: ["30", "40", "12"] },
                    { q: "What is 10 x 8?", a: "80", d: ["18", "800", "88"] }
                ]
            },
            {
                name: "Fractions (Parts of a Whole)",
                lesson: "A fraction is a part of a whole. The top number is the NUMERATOR (how many parts we have). The bottom number is the DENOMINATOR (how many equal parts make the whole). In the fraction 3/4, there are 4 equal parts total and we have 3 of them.",
                quiz: [
                    { q: "In the fraction 2/5, which number is the numerator?", a: "2", d: ["5", "Both", "Skip"] },
                    { q: "What does the denominator tell you?", a: "Total equal parts in the whole", d: ["How many parts are eaten", "The bigger number", "Nothing"] },
                    { q: "If a pizza is cut into 8 slices total and you take 3, what fraction did you take?", a: "3/8", d: ["8/3", "3/5", "1/8"] },
                    { q: "What fraction is equal to one whole?", a: "4/4", d: ["1/4", "3/4", "0/4"] },
                    { q: "A square is divided into 3 pieces. Only 1 is shaded. The fraction is ___.", a: "1/3", d: ["2/3", "3/1", "1/4"] }
                ],
                exam: [
                    { q: "In 4/6, what is the denominator?", a: "6", d: ["4", "10", "2"] },
                    { q: "Type the fraction: five out of seven total parts.", a: "5/7", type: "identification" },
                    { q: "A bar is cut into 10 pieces. 7 are colored. The fraction is:", a: "7/10", d: ["10/7", "3/10", "7/3"] },
                    { q: "Which is a true statement?", a: "The numerator goes on top", d: ["The denominator goes on top", "Fractions never equal 1", "The parts don't have to be equal"] },
                    { q: "You eat 2 pieces of a 4-part pie. Fraction of pie eaten?", a: "2/4", d: ["4/2", "1/4", "2/2"] }
                ]
            },
            {
                name: "Equivalent Fractions",
                lesson: "Equivalent fractions look different but represent the same amount! For example, 1/2 of a pizza is exactly the same amount of food as 2/4 of a pizza, or 4/8 of a pizza. We can prove this by drawing fraction models or using a number line.",
                quiz: [
                    { q: "Which fraction is equal to 1/2?", a: "2/4", d: ["1/3", "2/5", "1/4"] },
                    { q: "If you have 4/8 of a pizza, you have ___ of the pizza.", a: "Half", d: ["A quarter", "All", "None"] },
                    { q: "Which fraction is equal to 1 whole?", a: "3/3", d: ["1/3", "3/4", "0/3"] },
                    { q: "True or false: 1/2 is the same size as 3/6.", a: "True", d: ["False", "Cannot tell", "Only sometimes"] },
                    { q: "Which pairs are equivalent?", a: "2/2 and 4/4", d: ["1/2 and 1/3", "1/4 and 2/4", "3/4 and 3/8"] }
                ],
                exam: [
                    { q: "Which fraction shows the exact same amount as 2/6?", a: "1/3", d: ["2/3", "1/2", "1/6"] },
                    { q: "Type the denominator of a fraction equivalent to 1/2 that has a numerator of 5 (5/__).", a: "10", type: "identification" },
                    { q: "If you shade 2/4 of a square, how much is unshaded?", a: "2/4", d: ["1/4", "3/4", "None"] },
                    { q: "How are 1/2 and 4/8 related?", a: "They are equivalent", d: ["1/2 is larger", "4/8 is larger", "They are not numbers"] },
                    { q: "Which matches 1 whole?", a: "8/8", d: ["1/8", "8/1", "7/8"] }
                ]
            },
            {
                name: "Comparing Fractions",
                lesson: "When denominators are the SAME, just compare the numerators! (3/4 is bigger than 1/4). When numerators are the same, the SMALLER denominator means BIGGER pieces! (1/2 is bigger than 1/8 because sharing a pizza with 2 people is better than 8 people).",
                quiz: [
                    { q: "Which is greater: 5/8 or 3/8?", a: "5/8", d: ["3/8", "They are equal", "Cannot tell"] },
                    { q: "Which is greater: 1/2 or 1/4?", a: "1/2", d: ["1/4", "They are equal", "Cannot tell"] },
                    { q: "Which is smaller: 1/10 or 1/3?", a: "1/10", d: ["1/3", "They are equal", "Cannot tell"] },
                    { q: "Which is greater: 4/5 or 2/5?", a: "4/5", d: ["2/5", "They are equal", "Cannot tell"] },
                    { q: "Why is 1/3 bigger than 1/4?", a: "Because splitting a whole into 3 makes bigger pieces than 4", d: ["Because 4 is bigger than 3", "It is not bigger", "Because 3 is odd"] }
                ],
                exam: [
                    { q: "Compare: 3/6 ___ 5/6", a: "<", d: [">", "=", "+"] },
                    { q: "Type the symbol (<, >, =) to compare: 1/2 ___ 1/8", a: ">", type: "identification" },
                    { q: "Which fraction is the smallest piece of a whole?", a: "1/12", d: ["1/2", "1/4", "1/8"] },
                    { q: "Which is greater: 7/10 or 9/10?", a: "9/10", d: ["7/10", "They are equal", "Cannot tell"] },
                    { q: "Compare: 1/4 ___ 1/3", a: "<", d: [">", "=", "+"] }
                ]
            },
            {
                name: "Area of Rectangles",
                lesson: "Area is the space INSIDE a flat shape. We measure it in square units. You can count the squares inside, or you can multiply the Length time the Width! If a rug is 5 feet long and 3 feet wide, 5 x 3 = 15 square feet.",
                quiz: [
                    { q: "What does area measure?", a: "The space inside a shape", d: ["The distance around a shape", "How heavy it is", "How tall it is"] },
                    { q: "To find the area of a rectangle, what math operation do you use?", a: "Multiplication (Length x Width)", d: ["Addition (Length + Width)", "Subtraction", "Division"] },
                    { q: "Width is 4, Length is 5. What is the area?", a: "20", d: ["9", "1", "45"] },
                    { q: "Length is 6 meters, width is 2 meters. Area?", a: "12 square meters", d: ["8 square meters", "4 meters", "18 meters"] },
                    { q: "A square has a side of 3 inches. What is the area?", a: "9 square inches", d: ["6 square inches", "12 square inches", "3 square inches"] }
                ],
                exam: [
                    { q: "What is the area of a rectangle that is 7 ft by 3 ft?", a: "21 sq ft", d: ["10 sq ft", "4 sq ft", "24 sq ft"] },
                    { q: "Type the area of a 4 cm by 4 cm square (just the number).", a: "16", type: "identification" },
                    { q: "If the area is 12 and the length is 4, what is the width?", a: "3", d: ["8", "16", "2"] },
                    { q: "Which rug covers more floor: A 3x4 rug or a 2x5 rug?", a: "The 3x4 rug", d: ["The 2x5 rug", "They cover the same", "Cannot be determined"] },
                    { q: "Area is measured in ___ units.", a: "Square", d: ["Circle", "Straight", "Heavy"] }
                ]
            },
            {
                name: "Perimeter",
                lesson: "Perimeter is the distance AROUND the outside of a shape. Imagine a little ant walking along the very edge. You find perimeter by ADDING all the sides together! A square with sides of 3 has a perimeter of 3 + 3 + 3 + 3 = 12.",
                quiz: [
                    { q: "What is perimeter?", a: "The distance around the outside edge", d: ["The space inside a shape", "How heavy something is", "A type of fraction"] },
                    { q: "How do you find perimeter?", a: "Add all the side lengths together", d: ["Multiply the sides", "Subtract the sides", "Divide the sides"] },
                    { q: "A triangle has sides of 3, 4, and 5. Perimeter?", a: "12", d: ["15", "60", "7"] },
                    { q: "A square has a side of 5. What is the perimeter?", a: "20", d: ["25", "10", "15"] },
                    { q: "A rectangle has long sides of 6 and short sides of 2. Perimeter?", a: "16", d: ["8", "12", "14"] }
                ],
                exam: [
                    { q: "A pentagon has 5 equal sides of 2 inches. Perimeter?", a: "10 inches", d: ["7 inches", "12 inches", "25 inches"] },
                    { q: "Type the perimeter of a 4x4 square.", a: "16", type: "identification" },
                    { q: "If a rectangle's perimeter is 10, and length is 3. What is width?", a: "2", d: ["7", "4", "3"] },
                    { q: "A pool is 10m long and 5m wide. What is the distance to walk exactly around it?", a: "30m", d: ["15m", "50m", "25m"] },
                    { q: "What math operation do you use for perimeter?", a: "Addition", d: ["Multiplication", "Division", "Fractions"] }
                ]
            },
            {
                name: "Elapsed Time",
                lesson: "Elapsed time is how much time passes between a start time and an end time. If a movie starts at 2:00 PM and ends at 4:00 PM, the elapsed time is 2 hours. Use a number line or count by hours, then count by minutes.",
                quiz: [
                    { q: "A class starts at 1:00 PM and ends at 2:00 PM. How long is it?", a: "1 hour", d: ["30 minutes", "2 hours", "12 hours"] },
                    { q: "You read from 3:15 to 3:45. How many minutes passed?", a: "30 minutes", d: ["15 minutes", "45 minutes", "1 hour"] },
                    { q: "A game starts at 10:00 AM and lasts 2 hours. When will it end?", a: "12:00 PM", d: ["11:00 AM", "1:00 PM", "8:00 AM"] },
                    { q: "If it's 4:00 and you waited 15 minutes, what time is it now?", a: "4:15", d: ["4:30", "3:45", "5:15"] },
                    { q: "Lunch is 30 minutes long. It starts at 11:30. When does it end?", a: "12:00", d: ["11:00", "12:30", "1:00"] }
                ],
                exam: [
                    { q: "You leave home at 8:15 and drive for 1 hour. What time do you arrive?", a: "9:15", d: ["9:00", "8:45", "7:15"] },
                    { q: "Type the total minutes passed from 2:10 to 2:50.", a: "40", type: "identification" },
                    { q: "A test takes 45 minutes. You start at 1:00. When do you finish?", a: "1:45", d: ["1:30", "2:00", "2:45"] },
                    { q: "Elapsed time means the amount of time that has ___.", a: "Passed", d: ["Stopped", "Been wasted", "Gotten lost"] },
                    { q: "Recess is from 10:15 to 10:35. How long is recess?", a: "20 minutes", d: ["15 minutes", "30 minutes", "25 minutes"] }
                ]
            },
            {
                name: "Geometry (Quadrilaterals)",
                lesson: "A quadrilateral is ANY shape with exactly 4 straight sides. A SQUARE has 4 equal sides & 4 square corners. A RECTANGLE has 4 square corners. A RHOMBUS has 4 equal sides. A TRAPEZOID has exactly 1 pair of parallel lines.",
                quiz: [
                    { q: "How many sides does a quadrilateral have?", a: "4", d: ["3", "5", "6"] },
                    { q: "Which shape has 4 equal sides and 4 square (right) angles?", a: "Square", d: ["Rectangle", "Rhombus", "Trapezoid"] },
                    { q: "A rhombus MUST have ______.", a: "4 equal sides", d: ["4 right angles", "No equal sides", "Only 3 sides"] },
                    { q: "Which shape is a quadrilateral?", a: "Rectangle", d: ["Triangle", "Pentagon", "Circle"] },
                    { q: "A rectangle HAS to have:", a: "4 square corners (right angles)", d: ["4 equal sides", "No parallel lines", "5 vertices"] }
                ],
                exam: [
                    { q: "Is a square also a rectangle?", a: "Yes", d: ["No", "Only on Tuesdays", "It is a triangle"] },
                    { q: "Type the name of any polygon with 4 sides.", a: "quadrilateral", type: "identification" },
                    { q: "Which shape has ONE pair of parallel sides?", a: "Trapezoid", d: ["Square", "Rectangle", "Rhombus"] },
                    { q: "Can a rhombus be a square?", a: "Yes, if it has 4 right angles", d: ["No, never", "Always", "It is a circle"] },
                    { q: "All of these are quadrilaterals EXCEPT:", a: "Hexagon", d: ["Rhombus", "Square", "Rectangle"] }
                ]
            }
        ]
    },

    // ──────────────────── GRADE 4 ────────────────────
    4: {
        levels: [
            {
                name: "Multi-Digit Multiplication",
                lesson: "Time for bigger numbers! When multiplying a 2-digit number (like 34) by a 1-digit number (like 5), multiply the ones first (5x4=20, put down 0 and carry the 2), then the tens (5x3=15, add 2=17). So, 170. For a 2x2 problem, we use zero as a placeholder when multiplying the tens!",
                quiz: [
                    { q: "What is 12 x 4?", a: "48", d: ["40", "24", "44"] },
                    { q: "What is 20 x 5?", a: "100", d: ["25", "50", "150"] },
                    { q: "When multiplying 30 x 3, what is the answer?", a: "90", d: ["33", "60", "900"] },
                    { q: "What is 15 x 6?", a: "90", d: ["80", "100", "75"] },
                    { q: "What is 11 x 9?", a: "99", d: ["119", "20", "88"] }
                ],
                exam: [
                    { q: "What is 25 x 4?", a: "100", d: ["75", "125", "80"] },
                    { q: "Type the product of 40 x 8.", a: "320", type: "identification" },
                    { q: "What is 14 x 5?", a: "70", d: ["60", "80", "50"] },
                    { q: "In a 2-digit by 2-digit multiplication problem, what place holder is used on the second row?", a: "Zero (0)", d: ["One (1)", "Two (2)", "No place holder"] },
                    { q: "What is 50 x 6?", a: "300", d: ["30", "56", "360"] }
                ]
            },
            {
                name: "Long Division",
                lesson: "Long division has steps: Divide, Multiply, Subtract, Bring down! Check the remainder. E.g. 45 ÷ 3. Can 3 go into 4? Yes, 1 time. 3x1=3. 4-3=1. Bring down the 5 to make 15. 3 goes into 15... 5 times. Answer: 15. The left-over part is a REMAINDER.",
                quiz: [
                    { q: "What are the steps of long division in order?", a: "Divide, Multiply, Subtract, Bring down", d: ["Add, Subtract, Multiply, Divide", "Bring down, Multiply, Divide, Add", "Subtract, Divide, Multiply, Finish"] },
                    { q: "What is 48 ÷ 4?", a: "12", d: ["10", "14", "8"] },
                    { q: "If there is a number left over that cannot be divided, it is called a ___.", a: "Remainder", d: ["Dividend", "Quotient", "Divisor"] },
                    { q: "What is 80 ÷ 8?", a: "10", d: ["8", "0", "88"] },
                    { q: "What is 36 ÷ 3?", a: "12", d: ["13", "11", "9"] }
                ],
                exam: [
                    { q: "What is 55 ÷ 5?", a: "11", d: ["10", "12", "5"] },
                    { q: "Type the quotient of 100 ÷ 2.", a: "50", type: "identification" },
                    { q: "What is 17 ÷ 5?", a: "3 Remainder 2", d: ["3 Remainder 1", "4", "2 Remainder 7"] },
                    { q: "The answer to a division problem is called the:", a: "Quotient", d: ["Product", "Sum", "Remainder"] },
                    { q: "What is 42 ÷ 3?", a: "14", d: ["12", "13", "15"] }
                ]
            },
            {
                name: "Factors and Multiples",
                lesson: "FACTORS are numbers you multiply to GET a number (Factors of 6: 1, 2, 3, 6). MULTIPLES are what you get when you multiply a number by 1, 2, 3... (Multiples of 6: 6, 12, 18...). A PRIME number only has 2 factors: 1 and itself.",
                quiz: [
                    { q: "What are the factors of 10?", a: "1, 2, 5, 10", d: ["10, 20, 30", "2, 5", "1, 10"] },
                    { q: "Which is a multiple of 4?", a: "12", d: ["2", "6", "10"] },
                    { q: "A prime number only has how many factors?", a: "Two (1 and itself)", d: ["Three", "One", "Ten"] },
                    { q: "Is 7 a prime or composite number?", a: "Prime", d: ["Composite", "Both", "Neither"] },
                    { q: "Which list contains multiples of 5?", a: "5, 10, 15, 20", d: ["1, 5", "2, 3, 5", "5, 6, 7"] }
                ],
                exam: [
                    { q: "What are all the factors of 8?", a: "1, 2, 4, 8", d: ["8, 16, 24", "1, 8", "2, 4"] },
                    { q: "Type the first multiple of 7.", a: "7", type: "identification" },
                    { q: "Is 12 a prime or composite number?", a: "Composite", d: ["Prime", "Neither", "Both"] },
                    { q: "Which of these is a prime number?", a: "13", d: ["9", "15", "21"] },
                    { q: "The Greatest Common Factor (GCF) of 4 and 8 is?", a: "4", d: ["2", "8", "32"] }
                ]
            },
            {
                name: "Adding/Subtracting Fractions",
                lesson: "When fractions have the SAME bottom number (like denominators), adding or subtracting is easy! Leave the denominator exactly the same. Only add or subtract the top numbers (numerators). e.g., 2/5 + 1/5 = 3/5. It's like adding 2 apples + 1 apple = 3 apples.",
                quiz: [
                    { q: "What is 1/4 + 2/4?", a: "3/4", d: ["3/8", "2/8", "4/4"] },
                    { q: "What is 5/6 - 2/6?", a: "3/6", d: ["7/6", "3/0", "1/6"] },
                    { q: "When adding fractions with like denominators, do you add the bottom numbers?", a: "No, keep it the same", d: ["Yes, add them", "Yes, multiply them", "Yes, subtract them"] },
                    { q: "If you have 3/8 of a pie and eat 1/8, what is left?", a: "2/8", d: ["4/8", "3/16", "2/0"] },
                    { q: "What is 4/10 + 3/10?", a: "7/10", d: ["7/20", "1/10", "12/10"] }
                ],
                exam: [
                    { q: "What is 7/8 - 4/8?", a: "3/8", d: ["11/8", "3/0", "2/8"] },
                    { q: "Type the numerator for the answer to 5/12 + 2/12.", a: "7", type: "identification" },
                    { q: "What is 2/7 + 4/7?", a: "6/7", d: ["8/7", "6/14", "2/0"] },
                    { q: "You run 2/5 of a mile and walk 2/5 of a mile. Total distance represented as a fraction?", a: "4/5", d: ["4/10", "2/10", "0/5"] },
                    { q: "What is 9/10 - 8/10?", a: "1/10", d: ["17/10", "1/0", "1/20"] }
                ]
            },
            {
                name: "Multiplying Fractions by Whole Numbers",
                lesson: "Multiplying a fraction by a whole number is repeated addition. 3 x (1/4) is 1/4 + 1/4 + 1/4, which is 3/4. Just multiply the whole number by the top number (numerator) and keep the bottom number (denominator) the same!",
                quiz: [
                    { q: "What is 3 x (1/5)?", a: "3/5", d: ["3/15", "1/15", "4/5"] },
                    { q: "What is 2 x (2/7)?", a: "4/7", d: ["4/14", "2/14", "2/7"] },
                    { q: "What part of the fraction gets multiplied by the whole number?", a: "Only the numerator", d: ["Only the denominator", "Both parts", "Neither part"] },
                    { q: "What is 5 x (1/8)?", a: "5/8", d: ["5/40", "1/40", "6/8"] },
                    { q: "If you need 1/2 a cup of flour for a batch, and make 3 batches. How much flour?", a: "3/2 cups", d: ["3/6 cups", "1/6 cups", "1/2 cup"] }
                ],
                exam: [
                    { q: "What is 4 x (2/9)?", a: "8/9", d: ["8/36", "6/9", "4/18"] },
                    { q: "Type the numerator of the answer 6 x 1/10 (unsimplified).", a: "6", type: "identification" },
                    { q: "Repeated addition for 4 x (1/3) is:", a: "1/3 + 1/3 + 1/3 + 1/3", d: ["4/3 + 4/3", "1/4 + 1/3", "4 + 3"] },
                    { q: "What is 7 x (1/2)?", a: "7/2", d: ["7/14", "1/14", "7.2"] },
                    { q: "What is the denominator of the answer for 3 x 4/5?", a: "5", d: ["15", "3", "4"] }
                ]
            },
            {
                name: "Decimals (Tenths and Hundredths)",
                lesson: "Decimals are another way to write fractions! If a whole is divided into 10 pieces, 1 piece is 1/10, or 0.1 (one tenth). If divided into 100, 1 piece is 1/100, or 0.01 (one hundredth). The dot is the decimal point. 0.3 means 3 tenths.",
                quiz: [
                    { q: "How do you write 5/10 as a decimal?", a: "0.5", d: ["0.05", "5.0", "50"] },
                    { q: "How do you write 3/100 as a decimal?", a: "0.03", d: ["0.3", "3.0", "300"] },
                    { q: "What fraction does 0.7 represent?", a: "7/10", d: ["7/100", "7/1", "1/7"] },
                    { q: "In 0.45, what place is the 4 in?", a: "Tenths", d: ["Hundredths", "Ones", "Tens"] },
                    { q: "In 0.45, what place is the 5 in?", a: "Hundredths", d: ["Tenths", "Ones", "Tens"] }
                ],
                exam: [
                    { q: "Write 25/100 as a decimal.", a: "0.25", d: ["2.5", "0.025", "25.0"] },
                    { q: "Type the numeric decimal for four tenths.", a: "0.4", type: "identification" },
                    { q: "What fraction is equal to 0.09?", a: "9/100", d: ["9/10", "9/1", "90/100"] },
                    { q: "Which digit is in the tenths place in 0.81?", a: "8", d: ["1", "0", "81"] },
                    { q: "What is equivalent to 0.6?", a: "6/10", d: ["6/100", "0.06", "600"] }
                ]
            },
            {
                name: "Comparing Decimals",
                lesson: "To compare decimals, look at the tenths place first! 0.5 is bigger than 0.4. If the tenths are the same, look at the hundredths. 0.45 > 0.42. Helpful tip: 0.4 is the EXACT same as 0.40. Add a zero at the end if it helps you compare!",
                quiz: [
                    { q: "Which is greater: 0.7 or 0.4?", a: "0.7", d: ["0.4", "Equal", "Cannot tell"] },
                    { q: "Compare: 0.2 ___ 0.28", a: "<", d: [">", "=", "+"] },
                    { q: "Which is greater: 0.6 or 0.60?", a: "They are equal", d: ["0.6", "0.60", "Cannot tell"] },
                    { q: "Which decimal is the smallest?", a: "0.09", d: ["0.9", "0.19", "0.91"] },
                    { q: "Compare: 0.35 ___ 0.53", a: "<", d: [">", "=", "-"] }
                ],
                exam: [
                    { q: "Which is the largest number?", a: "0.8", d: ["0.79", "0.08", "0.7"] },
                    { q: "Type the symbol (<, >, =) representing 0.5 ___ 0.50.", a: "=", type: "identification" },
                    { q: "Compare: 0.1 ___ 0.09", a: ">", d: ["<", "=", "+"] },
                    { q: "Why is 0.4 greater than 0.38?", a: "4 tenths is greater than 3 tenths", d: ["38 is a bigger number", "8 is the biggest digit", "It is not greater"] },
                    { q: "Order from smallest to largest: 0.2, 0.05, 0.52", a: "0.05, 0.2, 0.52", d: ["0.52, 0.2, 0.05", "0.2, 0.05, 0.52", "0.05, 0.52, 0.2"] }
                ]
            },
            {
                name: "Lines, Rays, and Angles",
                lesson: "A LINE goes on forever both ways. A RAY starts at a dot and goes on forever one way. A LINE SEGMENT has two dots (stops). An ANGLE is two rays sharing a dot. ACUTE means tiny (< 90). RIGHT means a perfect corner (90). OBTUSE means big (> 90).",
                quiz: [
                    { q: "Which of these goes on forever in BOTH directions?", a: "Line", d: ["Ray", "Line Segment", "Angle"] },
                    { q: "Which angle makes a perfect square corner?", a: "Right angle", d: ["Acute angle", "Obtuse angle", "Straight angle"] },
                    { q: "An angle that is very small and sharp is called:", a: "Acute", d: ["Obtuse", "Right", "Straight"] },
                    { q: "An angle that is wide open (bigger than a right angle) is:", a: "Obtuse", d: ["Acute", "Right", "Small"] },
                    { q: "A part of a line with two endpoints is called a ___.", a: "Line segment", d: ["Ray", "Line", "Angle"] }
                ],
                exam: [
                    { q: "A ray has how many endpoints?", a: "1", d: ["0", "2", "3"] },
                    { q: "Type the math word for an angle that is smaller than 90 degrees.", a: "acute", type: "identification" },
                    { q: "What do we call the corner point where two rays meet to form an angle?", a: "Vertex", d: ["Edge", "Line", "Dot"] },
                    { q: "Which angle looks like the corner of a book?", a: "Right angle", d: ["Obtuse angle", "Acute angle", "Circle"] },
                    { q: "If an angle opens wider than a square corner, it is:", a: "Obtuse", d: ["Acute", "Right", "Parallel"] }
                ]
            },
            {
                name: "Measuring Angles (Protractor)",
                lesson: "Angles are measured in DEGREES (°). A full circle is 360°. A straight line is 180°. A right angle is 90°. We use a tool called a PROTRACTOR to measure them. Line up the vertex in the middle hole, and read the number where the line crosses.",
                quiz: [
                    { q: "What unit do we use to measure angles?", a: "Degrees", d: ["Inches", "Pounds", "Liters"] },
                    { q: "Exactly how many degrees is a right angle?", a: "90°", d: ["180°", "45°", "360°"] },
                    { q: "What tool is used to measure an angle?", a: "Protractor", d: ["Ruler", "Compass", "Thermometer"] },
                    { q: "A straight line measures how many degrees?", a: "180°", d: ["90°", "360°", "0°"] },
                    { q: "If an angle is 45°, it is:", a: "Acute", d: ["Right", "Obtuse", "Straight"] }
                ],
                exam: [
                    { q: "An angle measures 120°. What type of angle is it?", a: "Obtuse", d: ["Acute", "Right", "Straight"] },
                    { q: "Type the degree measure of a right angle (number only).", a: "90", type: "identification" },
                    { q: "How many degrees are in a full circle?", a: "360°", d: ["180°", "90°", "100°"] },
                    { q: "Two right angles put together make a:", a: "Straight line (180°)", d: ["Square (90°)", "Acute angle", "Circle"] },
                    { q: "When using a protractor, what part of the angle goes in the center hole?", a: "The vertex", d: ["The ray", "The arrow", "The line"] }
                ]
            },
            {
                name: "Symmetry",
                lesson: "Symmetry means if you fold a shape in half, both sides match EXACTLY. The fold line is called the 'Line of Symmetry'. A heart has 1 line down the middle. A square has 4 lines of symmetry. Some shapes have no symmetry at all!",
                quiz: [
                    { q: "What happens when you fold a shape on a line of symmetry?", a: "Both halves match perfectly", d: ["It breaks", "It turns into a circle", "Nothing"] },
                    { q: "How many lines of symmetry does a capital letter 'A' have?", a: "1", d: ["0", "2", "4"] },
                    { q: "A perfect circle has how many lines of symmetry?", a: "Infinite (many)", d: ["1", "0", "4"] },
                    { q: "If a shape cannot be folded to match perfectly, it is:", a: "Asymmetrical (not symmetrical)", d: ["A square", "Symmetrical", "A polygon"] },
                    { q: "How many lines of symmetry does a square have?", a: "4", d: ["1", "2", "8"] }
                ],
                exam: [
                    { q: "How many lines of symmetry down the middle does a capital 'O' have?", a: "More than one", d: ["Zero", "Exactly one", "None"] },
                    { q: "Type the number of symmetry lines in a standard heart shape.", a: "1", type: "identification" },
                    { q: "Does a rectangle have diagonal lines of symmetry?", a: "No", d: ["Yes", "Only sometimes", "It has 4"] },
                    { q: "Which letter is symmetrical?", a: "M", d: ["P", "S", "L"] },
                    { q: "If looking in a mirror, the reflection is a type of ___.", a: "Symmetry", d: ["Math", "Fraction", "Addition"] }
                ]
            }
        ]
    }
};
