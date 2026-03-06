const fs = require('fs');
const path = require('path');

const refinedTopics = {
    tamil: {
        "1": ["Uyir Ezhuthukkal (Vowels)", "Mei Ezhuthukkal (Consonants)", "Uyirmei Basics", "Basic Tamil Phrases", "Narpunbugal (Social Ethics)", "Family & Relationships", "Animals & Birds in Tamil", "Colors & Shapes", "Body Parts Vocabulary", "Tamil Rhymes & Songs"],
        "2": ["Complete Alphabet Mastery", "Kuril & Nedil Sounds", "Simple Conversation Skills", "Daily Routines in Tamil", "Nature & Environment", "Food & Vegetables", "Clothing & Culture", "Math Symbols in Tamil", "Basic Sentence Building", "Traditional Stories"],
        "3": ["Pronouns in Tamil", "Basic Tense Structures", "Community Workers", "Public Places Vocabulary", "Tamil Festivals", "Descriptive Adjectives", "Handwriting Mastery", "Short Story Reading", "Tamil Months & Seasons", "Basic Grammar (Peyarchol)"],
        "4": ["Thirukkural Introduction", "Systematic Tamil Grammar", "Heroic Stories of Old", "Tamil Proverb Meanings", "Letter Writing Basics", "Advanced Tenses", "Synonyms & Antonyms", "Tamil Geography", "Inspirational Leaders", "Creative Writing Intro"],
        "5": ["Aathichudi Concepts", "Spelling Nuances (na/na/na)", "Oral Storytelling Skills", "Tamil Literature Intro", "Composition Writing", "Conjunctions & Connectors", "Tamil Folklore", "Science in Tamil", "Famous Tamil Poets", "Debate & Speech Basics"],
        "6": ["History of Tamil Script", "Science Integration", "Ancient Tamil Civilization", "Classical Literature Intro", "Advanced Grammar (Verbs)", "Poetry Analysis", "Tamil Diaspora Culture", "Technology in Tamil", "Values & Ethics", "Tamil Kings History"],
        "7": ["Morphosyntax Mastery", "Purananuru Selection", "Medieval Nature Poems", "Active & Passive Voice", "Tamil Epics (Silappathikaram)", "Ecology in Literature", "Compound Words", "Drama & Roleplay", "Tamil Heritage Sites", "Social Reformers of Tamil Nadu"],
        "8": ["Sangam Literature Depth", "Tamil Cases (Vigruthi)", "Metonymy & Idioms", "Ancient Tamil Medicine", "Modern Literature (Bharathiyar)", "Philosophical Texts", "Linguistic Evolution", "Researching Tamil Roots", "Journalism in Tamil", "Literary Criticism Basics"]
    },
    science: {
        "1": ["Plants External Parts", "Animal Structures", "Light & Illumination", "Sound & Vibrations", "Seasonal Patterns", "Weather Observations", "Sky Objects", "Senses & Discovery", "Materials Around Us", "Living vs Non-Living"],
        "2": ["Matter Properties", "Reversible Changes", "Irreversible Changes (Burning)", "Plants Survival Needs", "Animals in Habitats", "Mapping the World", "Wind & Water Effects", "Solid/Liquid/Gas Intro", "Building Materials", "The Life Cycle of Plants"],
        "3": ["Balanced & Unbalanced Forces", "Magnetism Experiments", "Weather Data Analysis", "Climate Patterns", "Life Cycles of Animals", "Fossil Evidence", "Adaptations for Survival", "Electric Circuits Intro", "Static Electricity", "Inherited Traits"],
        "4": ["Energy Transfer (Collisions)", "Wave Properties (Light/Sound)", "The Rock Record", "Fossil Records & History", "Internal Animal Structures", "Sensing the Environment", "Renewable Energy Sources", "Earth's Changing Surface", "Natural Hazards", "Patterns of Information Transfer"],
        "5": ["Conservation of Mass", "Particulate Nature of Matter", "Energy Flow in Ecosystems", "Matter Cycles", "Gravity as a Force", "Bright Stars & Constellations", "Earth's Rotation & Shadows", "Human Impact on Environment", "Freshwater vs Saltwater", "Decomposition Process"],
        "6": ["Human Organ Systems", "Respiratory System", "Circulatory System", "Mixture Separation (Filtration)", "Mixture Separation (Evaporation)", "Friction Effects", "Balanced Forces & Motion", "Gravity & Orbital Motion", "Chemical vs Physical Changes", "Waste Management"],
        "7": ["Energy Cycles & Transfer", "Definition of Work", "Simple Machines", "Atmospheric Pressure", "Cyclone Formation", "Heat Transfer (Convection)", "Electromagnetic Spectrum", "Cellular Respiration", "Photosynthesis Depth", "Particle Behavior in Fluids"],
        "8": ["Atomic Structure Basics", "The Periodic Table", "Mendelian Genetics", "Mitosis & Meiosis", "Chemical Reactions & Bonds", "Acids & Bases", "Human Growth & Development", "Evolutionary Theory", "Space Exploration Tech", "Environmental Chemistry"]
    },
    math: {
        "1": ["Counting to 100", "Place Value (Tens/Ones)", "Addition Fluency to 20", "Subtraction Fluency to 20", "Comparing Numbers", "Identifying 2D Shapes", "Measuring Length (Inches)", "Telling Time (Hour/Half)", "Counting Coins", "Data Graphs (Intro)"],
        "2": ["Counting to 1000", "3-Digit Place Value", "Addition with Regrouping", "Subtraction with Regrouping", "Money (Dollars & Cents)", "Measuring in CM/Metric", "Identifying 3D Shapes", "Fractions (Halves/Quarters)", "Time (Nearest 5 Mins)", "Even & Odd Numbers"],
        "3": ["Multiplication Facts (1-10)", "Division Concepts", "Area & Perimeter", "Fractions on Number Line", "Equivalent Fractions", "Mass & Volume Measurement", "Data with Scale Graphs", "Geometry: Categories of Shapes", "Rounding to Nearest 10/100", "Elapsed Time Calculations"],
        "4": ["Multi-Digit Multiplication", "Long Division Basics", "Adding/Subtracting Fractions", "Fraction Multiples", "Decimals Intro (Tenths)", "Angles & Protractor Use", "Symmetry & Lines", "Prime & Composite Numbers", "Unit Conversions", "Multi-Step Word Problems"],
        "5": ["Multi-Digit Division", "Decimal Operations (+/-/x/÷)", "Adding Fractions with Unlike Denoms", "Multiplying/Dividing Fractions", "Volume Calculations (L x W x H)", "Coordinate Planes", "Numerical Patterns", "Line Plots & Data", "Order of Operations", "Graphing Points"],
        "6": ["Ratios & Unit Rates", "Dividing Fractions by Fractions", "Negative Numbers & Integers", "Algebraic Expressions", "One-Variable Equations", "Area of Complex Shapes", "Surface Area (Nets)", "Mean, Median, Mode", "Statistical Variability", "Decimal/Fraction/Percent Link"],
        "7": ["Rational Numbers Operations", "Proportional Relationships", "Linear Equations & Inequalities", "Circles: Area & Circumference", "3D Figure Volume/Area", "Random Sampling", "Probability Models", "Scale Drawings", "Angle Relationships", "Percent Applications (Markup/Tax)"],
        "8": ["Linear Functions", "Systems of Equations", "Irrational Numbers", "Exponents & Scientific Notation", "Pythagorean Theorem", "Geometric Transformations", "Volume of Spheres/Cones", "Bivariate Data (Scatter Plots)", "Congruence & Similarity", "Real-World Modeling"]
    }
};

function generateCurriculum(subject) {
    const fullCurriculum = {};
    const topics = refinedTopics[subject];

    for (let grade = 1; grade <= 8; grade++) {
        const gradeTopics = topics[grade.toString()];
        const levels = [];

        for (let i = 0; i < gradeTopics.length; i++) {
            const topicName = gradeTopics[i];
            levels.push({
                name: `${topicName}`,
                description: `Master ${topicName} through interactive lessons and challenges.`,
                lesson: `This lesson covers the core principles of ${topicName}. Students will explore key concepts, practical examples, and historical or scientific context relevant to this level of study.`,
                xpReward: 100,
                badgeEmoji: subject === 'tamil' ? '🪶' : (subject === 'science' ? '🧪' : '🔢'),
                moduleName: i < 5 ? "Foundation" : "Advanced mastery",
                quiz: [
                    {
                        q: `Which of the following best describes a key concept of ${topicName}?`,
                        a: `The fundamental principle specific to ${topicName}.`,
                        d: ["A loosely related distractor", "An opposite concept", "Information from a different grade"]
                    },
                    {
                        q: `How do we apply ${topicName} in a real-world scenario?`,
                        a: `By following the systematic approach taught in this lesson.`,
                        d: ["Ignoring the rules", "Guessing randomly", "Using outdated methods"]
                    }
                ],
                exam: [
                    {
                        q: `Explain the importance of ${topicName} in the broader context of ${subject.toUpperCase()}.`,
                        a: `It provides a critical building block for advanced understanding.`,
                        d: ["It is not important at all", "It only applies to small children", "It has been replaced by modern tech"]
                    },
                    {
                        q: `What is the correct way to solve a challenge involving ${topicName}?`,
                        a: `Step-by-step application of the principles discovered.`,
                        d: ["Skipping the first step", "Combining unrelated ideas", "Doing nothing"]
                    },
                    {
                        q: `Identify the primary tool or method used when studying ${topicName}.`,
                        a: `Systematic observation and logic based on the lesson.`,
                        d: ["Using irrelevant data", "Relying on luck", "No tool is needed"]
                    }
                ]
            });
        }
        fullCurriculum[grade.toString()] = { levels };
    }
    return fullCurriculum;
}

const subjects = ['math', 'science', 'tamil'];

subjects.forEach(subject => {
    const data = generateCurriculum(subject);
    const content = `module.exports = ${JSON.stringify(data, null, 2)};`;
    const filename = `curriculum_${subject}_v2.js`;
    fs.writeFileSync(path.join(__dirname, filename), content);
    console.log(`Generated ${filename}`);
});
