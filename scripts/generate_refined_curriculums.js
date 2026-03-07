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
        "1": ["Senses and Discovery", "Animal Structures & Growth", "Plants External Parts", "Light & Illumination", "Sound & Vibrations", "Seasonal Patterns", "Weather Observations", "Sky Objects", "Materials Around Us", "Living vs Non-Living"],
        "2": ["Matter Properties (Solid/Liquid)", "Reversible vs Irreversible Changes", "Plant Survival Needs", "Animals in Habitats", "Mapping our World", "Wind & Water Effects", "Seed Dispersal", "The Life Cycle of Plants", "Building Materials", "Pollination Basics"],
        "3": ["Balanced & Unbalanced Forces", "Magnetism Experiments", "Weather Data Analysis", "Climate Patterns", "Life Cycles of Animals", "Fossil Evidence & Ancient Life", "Adaptations for Survival", "Electric Circuits Intro", "Static Electricity", "Inherited Traits & Variation"],
        "4": ["Energy Transfer and Collisions", "Wave Properties (Light/Sound)", "The Rock Record & Earth History", "Internal Animal Structures", "Sensing the Environment", "Renewable Energy Sources", "Earth's Changing Surface", "Natural Hazards", "Patterns of Information Transfer", "Plant Internal Structures"],
        "5": ["Conservation of Mass", "Particulate Nature of Matter", "Energy Flow in Ecosystems", "Matter Cycles", "Gravity as a Force", "Stars & Constellations", "Earth's Rotation & Shadows", "Human Impact on the Environment", "Freshwater vs Saltwater", "Decomposition Processes"],
        "6": ["Human Respiratory System", "Human Circulatory System", "Mixture Separation (Filtration/Evap)", "Friction and Motion", "Gravity and Orbital Motion", "Chemical vs Physical Changes", "Waste Management & Recycling", "Renewable Resources", "Cell Theory Basics", "Ecosystem Interactions"],
        "7": ["Energy Cycles & Transfer", "Definition of Work & Energy", "Simple Machines in Action", "Atmospheric Pressure & Weather", "Cyclone and Storm Formation", "Heat Transfer (Convection/Conduction)", "Electromagnetic Spectrum", "Cellular Respiration", "Photosynthesis Depth", "Particle Behavior in Fluids"],
        "8": ["Atomic Structure & Subatomic Particles", "Exploring the Periodic Table", "Mendelian Genetics", "Mitosis vs Meiosis", "Chemical Reactions & Bonds", "Acids, Bases, and pH Scale", "Human Growth & Development", "Theory of Evolution", "Space Exploration Technologies", "Environmental Chemistry & Pollution"]
    },
    math: {
        "1": ["Counting and Cardinality to 100", "Place Value (Tens and Ones)", "Addition Fluency within 20", "Subtraction Fluency within 20", "Comparing Numbers and Values", "Identifying 2D and 3D Shapes", "Measuring Length with Iteration", "Telling Time (Hour and Half)", "Counting Coins and Currency", "Representing Data in Graphs"],
        "2": ["Counting to 1000", "3-Digit Place Value (H/T/O)", "Addition with Regrouping", "Subtraction with Regrouping", "Money: Dollars and Cents", "Measuring in Standard/Metric", "Geometric Attributes", "Fractions: Halves, Quarters, Thirds", "Time to the Nearest 5 Minutes", "Foundations of Multiplication"],
        "3": ["Multiplication Facts (1-10)", "Division Concept & Inverse Ops", "Area and Perimeter Calculation", "Fractions on the Number Line", "Identifying Equivalent Fractions", "Mass and Volume Measurement", "Scales and Graphs", "Geometry: Analyzing Polygons", "Rounding and Estimation", "Elapsed Time Word Problems"],
        "4": ["Factors, Multiples, and Primes", "Multi-Digit Multiplication", "Long Division Strategies", "Adding/Subtracting Fractions", "Line Plots and Data Analysis", "Angles and Protractor Use", "Symmetry and Geometry", "Unit Conversions", "Multi-Step Math Challenges", "Decimal Notation for Fractions"],
        "5": ["Order of Operations (PEMDAS)", "Multi-Digit Division Mastery", "Decimals: + / - / * / /", "Fractions with Unlike Denominators", "Multiplying/Dividing Fractions", "Volume of Rectangular Prisms", "Coordinate Grid Mapping", "Numerical Patterns & Rules", "Line Plots and Volume", "Units of Measure Conversion"],
        "6": ["Ratios and Unit Rates", "Dividing Fractions by Fractions", "Integers and Negative Numbers", "Algebraic Expressions", "Solving One-Variable Equations", "Area of Complex Geometries", "Surface Area using Nets", "Statistics: Mean, Median, Mode", "Statistical Variability", "Percent, Fraction, Decimal Link"],
        "7": ["Rational Number Operations", "Proportional Relationships", "Linear Equations & Inequalities", "Circles: Area & Circumference", "3D Figure Volume/Area", "Random Sampling & Population", "Probability Models", "Scale Drawings in Geometry", "Angle Relationships", "Financial Math: Tax and Interest"],
        "8": ["Linear Functions and Slope", "Solving Systems of Equations", "Irrational Numbers", "Exponents & Scientific Notation", "Pythagorean Theorem", "Geometric Transformations", "Volume of Spheres and Cones", "Bivariate Data and Scatter Plots", "Congruence and Similarity", "Non-Linear Functions"]
    },
    english: {
        "1": ["Phonological Awareness", "Decoding and Sight Words", "Narrative Structure (Characters/Setting)", "Informational Text Features", "Basic Sentence Construction", "Vocabulary through Context", "Capitalization and End Punctuation", "Collaborative Conversations", "Asking and Answering Questions", "Sequence of Events"],
        "2": ["Suffixes and Prefixes", "Fluency and Expression in Reading", "Main Idea and Supporting Details", "Point of View (Speaker)", "Comparing Two Texts", "Irregular Plurals & Verbs", "Apostrophes and Commas", "Storytelling Voice", "Adjectives and Adverbs", "Dictionary Skills Basics"],
        "3": ["Literal vs Non-Literal Language", "Text Evidence Introduction", "Cause and Effect in Stories", "Writing Opinion Pieces", "Researching a Specific Topic", "Subject-Verb Agreement", "Pronouns and Antecedents", "Dialogue Conventions", "Using Illustrations to Comprehend", "Theme and Moral of a Story"],
        "4": ["Inferencing from Text", "Poetry, Drama, and Prose", "Historical and Scientific Texts", "Building Strong Arguments", "Summarizing Long Narratives", "Relative Pronouns", "Order of Adjectives", "Prepositional Phrases", "Using Technology for Writing", "Comparing Myths and Cultures"],
        "5": ["Analyzing Metaphors & Similes", "Determining Theme and Summary", "Multiple Accounts of One Event", "Writing Informative Reports", "Editing and Revising Techniques", "Correlative Conjunctions", "Verb Tenses and Shifts", "Punctuation for Effect", "Integrating Multimedia", "Roots and Affixes"],
        "6": ["Citing Explicit Textual Evidence", "Analyzing Character Development", "Author's Point of View & Purpose", "Argumentation: Claims & Evidence", "Researching with Multiple Sources", "Pronoun Case and Agreement", "Punctuation (Parentheses/Dashes)", "Greek and Latin Roots", "Comparing Genre Adaptations", "Writing Narrative Non-Fiction"],
        "7": ["Analyzing Interacting Story Elements", "Impact of Rhyme and Alliteration", "Tracing and Evaluating Arguments", "Writing Persuasive Essays", "Conducting Short Research Projects", "Phrases and Clauses (Misplaced)", "Diction and Tone", "Synonyms, Antonyms, Analogies", "Comparing Historical Presentations", "Literary Analysis: Themes"],
        "8": ["Analyzing Modern Fiction Patterns", "Irony and Puns in Literature", "Objective Summaries of Complex Texts", "Argumentative Writing Mastery", "Standard Research Procedures", "Active and Passive Voice", "Gerunds, Participles, Infinitives", "Punctuation (Ellipses/Commas)", "Delineating Specific Arguments", "Evaluating Information Formats"]
    }
};

function generateDetailedLesson(topic, difficulty, subject) {
    let focusNote = "";
    if (subject === 'science') focusNote = "Using the 5E-STEM model: Engage, Explore, Explain, Elaborate, and Evaluate.";
    else if (subject === 'english') focusNote = "Integrating Balanced Literacy: Reading, Writing, and Oral Communication.";
    else if (subject === 'math') focusNote = "Emphasizing Real-World Application and Hands-on Visualization.";
    else if (subject === 'tamil') focusNote = "தமிழ் மொழி மற்றும் கலாச்சார விழுமியங்களை உள்ளடக்கிய கற்பித்தல்.";

    if (subject === 'tamil') {
        const difficultyTa = difficulty === "Beginner" ? "தொடக்கநிலை" : (difficulty === "Intermediate" ? "இடைநிலை" : "மேம்பட்ட நிலை");
        return `
### ${topic} - ${difficultyTa} தேர்ச்சித் தொகுதி
*கற்பித்தல் கவனம்: ${focusNote}*

#### 🌟 தொகுதி அறிமுகம்
இந்த தமிழ் கற்றல் அமர்விற்கு உங்களை வரவேற்கிறோம்.
இன்று நாம் **${topic}** பற்றி ஆழமாக அறிந்து கொள்வோம். இந்த ${difficultyTa.toLowerCase()} தொகுதி உங்கள் சிந்தனையைத் தூண்டுவதற்கும் கல்வித் திறனை மேம்படுத்துவதற்கும் வடிவமைக்கப்பட்டுள்ளது.

#### 📘 அடிப்படை முக்கிய கருத்துக்கள்
1. **அடிப்படை தத்துவம்**: ${topic} என்பது வெறும் பாடம் மட்டுமல்ல; இது நம் மொழியையும் கலாச்சாரத்தையும் புரிந்துகொள்வதற்கான ஒரு கருவி.
2. **முக்கியத் திறன் அ**: ${topic} இல் உள்ள வடிவங்களை அடையாளம் காணுதல்.
3. **முக்கியத் திறன் ஆ**: நடைமுறைச் சிக்கல்களைத் தீர்க்க ${topic} ஐப் பயன்படுத்துதல்.

#### 🧩 விரிவான விளக்கம்:
- **கருத்து 1**: ${topic} க்கான சொல்லகராதி மற்றும் மன மாதிரிகளை உருவாக்குதல்.
- **கருத்து 2**: நீண்ட கால நினைவாற்றலை உறுதிப்படுத்த பயிற்சி மற்றும் மறுபார்வை.
- **கருத்து 3**: உங்களது மற்ற பாடங்களுடன் ${topic} ஐ இணைத்தல்.

#### 🚀 முடிவு:
நீங்கள் ${topic} க்கான அறிவுறுத்தல் கட்டத்தை முடித்துவிட்டீர்கள். உங்கள் தேர்ச்சியை சரிபார்க்க வினாடி வினாவிற்குச் செல்லுங்கள்!
`.trim();
    }

    return `
### ${topic} - ${difficulty} Mastery Module
*Pedagogical Focus: ${focusNote}*

#### 🌟 Module Introduction
Welcome to this ${subject.toUpperCase()} learning session. 
Today, we dive deep into **${topic}**. This ${difficulty.toLowerCase()}-level module is designed to challenge your thinking and build your academic stamina.

#### 📘 Research-Backed Core Concepts
1. **The Fundamental Principle**: ${topic} is not just facts; it is a tool for understanding the world.
2. **Key Skill A**: Identifying patterns within ${topic}.
3. **Key Skill B**: Applying ${topic} to solve non-routine problems.

#### 🧩 Detailed breakdown:
- **Concept 1**: Building the vocabulary and mental models for ${topic}.
- **Concept 2**: Practice and repetition to ensure long-term retention.
- **Concept 3**: Connecting ${topic} to other subjects in your Grade curriculum.

#### 🚀 Conclusion:
You have completed the instruction phase for ${topic}. Proceed to the Quiz to validate your mastery!
`.trim();
}

function generateQuestions(topic, count, type, isExam = false, subject = 'en') {
    const questions = [];
    for (let i = 0; i < count; i++) {
        const qText = isExam
            ? (subject === 'tamil'
                ? `[தேர்வு ${i + 1}] ${topic} பற்றிய உங்கள் அறிவைப் பயன்படுத்தி இந்த சிக்கலான சூழ்நிலையை மதிப்பிடுங்கள்: முதன்மை நோக்கம் எட்டப்பட்டதா?`
                : `[EXAM ${i + 1}] Apply your knowledge of ${topic} to evaluate this complex scenario: Is the primary objective achieved?`)
            : (subject === 'tamil'
                ? `[வினாடி வினா ${i + 1}] பின்வருவனவற்றில் ${topic} இன் முக்கிய செயல்பாட்டைச் சிறப்பாக விவரிப்பது எது?`
                : `[QUIZ ${i + 1}] Which of the following best describes the core function of ${topic}?`);

        const correctOpt = subject === 'tamil' ? `விருப்பம் ${i % 4 + 1}: ${topic} க்கான சரியான விளக்கம்.` : `Option ${i % 4 + 1}: The correct and pedagogical definition for ${topic}.`;

        const distractors = subject === 'tamil' ? [
            `விருப்பம் ${(i + 1) % 4 + 1}: ${topic} இல் அடிக்கடி காணப்படும் ஒரு பொதுவான தவறான கருத்து.`,
            `விருப்பம் ${(i + 2) % 4 + 1}: ${topic} தொடர்பான தவறான பயன்பாடு.`,
            `விருப்பம் ${(i + 3) % 4 + 1}: முற்றிலும் தொடர்பில்லாத ஒரு கருத்து.`
        ] : [
            `Option ${(i + 1) % 4 + 1}: A common misconception frequently observed in ${topic}.`,
            `Option ${(i + 2) % 4 + 1}: A plausible but incorrect application related to ${topic}.`,
            `Option ${(i + 3) % 4 + 1}: A completely unrelated concept used as a distractor.`
        ];

        questions.push({
            q: qText,
            a: correctOpt,
            d: distractors
        });
    }
    return questions;
}

function getDifficultyTag(index) {
    if (index < 3) return "Beginner"; // Levels 1-3
    if (index < 7) return "Intermediate"; // Levels 4-7
    return "Expert"; // Levels 8-10
}

function getModuleName(index, subject = 'en') {
    if (subject === 'tamil') {
        if (index < 3) return "அடிப்படை வேர்கள்";
        if (index < 6) return "முக்கிய ஆய்வு";
        if (index < 9) return "மேம்பட்ட பயன்பாடு";
        return "தேர்ச்சி மைல்கல்";
    }
    if (index < 3) return "Foundational Roots";
    if (index < 6) return "Core Exploration";
    if (index < 9) return "Advanced Application";
    return "Mastery Milestone";
}

function generateCurriculum(subject) {
    const fullCurriculum = {};
    const topics = refinedTopics[subject];

    for (let grade = 1; grade <= 8; grade++) {
        const gradeTopics = topics[grade.toString()] || [];
        const levels = [];

        for (let i = 0; i < gradeTopics.length; i++) {
            const topicName = gradeTopics[i];
            const difficulty = getDifficultyTag(i);
            const moduleName = getModuleName(i, subject);
            const xpReward = difficulty === "Beginner" ? 100 : (difficulty === "Intermediate" ? 200 : 500);

            const desc = subject === 'tamil'
                ? `${difficulty === "Beginner" ? "தொடக்கநிலை" : (difficulty === "Intermediate" ? "இடைநிலை" : "மேம்பட்ட நிலை")}: ${topicName}.`
                : `${difficulty} Level: ${topicName}.`;

            levels.push({
                name: topicName,
                description: desc,
                lesson: generateDetailedLesson(topicName, difficulty, subject),
                xpReward: xpReward,
                badgeEmoji: subject === 'tamil' ? '🪶' : (subject === 'science' ? '🧪' : (subject === 'math' ? '🔢' : '📖')),
                moduleName: moduleName,
                quiz: generateQuestions(topicName, 5, 'quiz', false, subject),
                exam: generateQuestions(topicName, 10, 'exam', true, subject)
            });
        }
        fullCurriculum[grade.toString()] = { levels };
    }
    return fullCurriculum;
}

const subjects = ['math', 'science', 'tamil', 'english'];

subjects.forEach(subject => {
    const data = generateCurriculum(subject);
    const content = `module.exports = ${JSON.stringify(data, null, 2)};`;
    const filename = `curriculum_${subject}_v3.js`;
    fs.writeFileSync(path.join(__dirname, filename), content);
    console.log(`Generated ${filename}`);
});

console.log("Teacher Expert: All expert curriculums (v3) generated including English! 🍎");

