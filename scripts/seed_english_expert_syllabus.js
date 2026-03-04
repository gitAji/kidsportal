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

initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
});

const db = getFirestore();

// Pedagogical Matrix for Grades 1-8
// Levels 1-10 for each grade. Progresses from Alphabets to Pronunciation to Advanced Grammar.
const expertSyllabus = {
    1: [
        { name: "Alphabet Adventures", desc: "Learn the shapes and names of uppercase and lowercase letters.", concepts: ["Uppercase A-Z", "Lowercase a-z"] },
        { name: "Phonics Basics", desc: "Learn the foundational sounds that consonants make.", concepts: ["B vs P", "Hard C vs Soft C"] },
        { name: "Short Vowels", desc: "Introduction to short A, E, I, O, U sounds.", concepts: ["Cat, Bed, Pig", "Dog, Sun"] },
        { name: "CVC Words", desc: "Blending consonant, vowel, consonant words.", concepts: ["Bat, Hat", "Log, Fog"] },
        { name: "Sight Words Intro", desc: "Recognizing high-frequency words instantly.", concepts: ["The, And, Is", "To, It, On"] },
        { name: "Rhyming Fun", desc: "Identifying words that end with the same sound.", concepts: ["Cat/Hat", "Sun/Bun"] },
        { name: "Beginning Blends", desc: "Putting two consonants together like 'bl' and 'st'.", concepts: ["Blue, Black", "Stop, Star"] },
        { name: "Nouns (Naming Words)", desc: "Understanding people, places, and things.", concepts: ["Person: Boy", "Place: School"] },
        { name: "Action Words (Verbs)", desc: "Words that show an action we can do.", concepts: ["Run, Jump", "Play, Eat"] },
        { name: "Simple Sentences", desc: "Putting words together to make a thought.", concepts: ["Capital letter", "Period at the end"] }
    ],
    2: [
        { name: "Long Vowels (Silent E)", desc: "How the magic 'E' changes short sounds to long.", concepts: ["Cap vs Cape", "Kit vs Kite"] },
        { name: "Consonant Digraphs", desc: "Two letters that make one new sound (th, sh, ch).", concepts: ["Ship, Shop", "Chip, Chair"] },
        { name: "Vowel Teams", desc: "When two vowels go walking, the first does the talking.", concepts: ["Rain, Train", "Boat, Coat"] },
        { name: "Pronouns", desc: "Words that replace nouns (He, She, It, They).", concepts: ["He is running", "They are playing"] },
        { name: "Adjectives (Describing Words)", desc: "Words that tell us how things look or feel.", concepts: ["Big dog", "Soft pillow"] },
        { name: "Plural Nouns", desc: "Adding 's' or 'es' to make more than one.", concepts: ["Cats", "Boxes"] },
        { name: "Punctuation Marks", desc: "Periods, question marks, and exclamation points.", concepts: ["Statement (.)", "Question (?)"] },
        { name: "Contractions", desc: "Putting two words together with an apostrophe.", concepts: ["Do not -> Don't", "Can not -> Can't"] },
        { name: "Reading Comprehension 1", desc: "Reading a short paragraph and understanding it.", concepts: ["Who?", "What?"] },
        { name: "Story Sequence", desc: "What happens first, next, and last.", concepts: ["Beginning", "Middle, End"] }
    ],
    3: [
        { name: "Syllables", desc: "Breaking words into manageable parts or sounds.", concepts: ["Ap-ple (2)", "El-e-phant (3)"] },
        { name: "Synonyms & Antonyms", desc: "Words that mean the same, and opposites.", concepts: ["Big/Large", "Hot/Cold"] },
        { name: "Prefixes", desc: "Word parts added to the beginning (un-, re-).", concepts: ["Unhappy", "Rebuild"] },
        { name: "Suffixes", desc: "Word parts added to the end (-ful, -less).", concepts: ["Helpful", "Careless"] },
        { name: "Past, Present, Future Verbs", desc: "When did the action happen?", concepts: ["Walked", "Walks", "Will walk"] },
        { name: "Adverbs", desc: "Words that describe how an action is done.", concepts: ["Ran quickly", "Spoke softly"] },
        { name: "Compound Words", desc: "Two words put together to make a new word.", concepts: ["Sun + Flower", "Basket + Ball"] },
        { name: "Reading Comprehension 2", desc: "Finding the main idea and supporting details.", concepts: ["Main Idea", "Supporting Detail"] },
        { name: "Paragraph Writing", desc: "Structuring sentences into a coherent paragraph.", concepts: ["Topic sentence", "Conclusion"] },
        { name: "Poetry Basics", desc: "Exploring rhythm, rhyme schemes, and short poems.", concepts: ["AABB scheme", "Free verse"] }
    ],
    4: [
        { name: "Homophones", desc: "Words that sound the same but mean different things.", concepts: ["There/Their/They're", "To/Too/Two"] },
        { name: "Subject and Predicate", desc: "The two main parts of every sentence.", concepts: ["The dog (subj)", "barked loudly (pred)"] },
        { name: "Prepositions", desc: "Words showing position or time (in, on, under).", concepts: ["Under the bridge", "Before dinner"] },
        { name: "Conjunctions", desc: "Joining words or sentences (and, but, or).", concepts: ["Peas and carrots", "I ran, but fell"] },
        { name: "Fact vs. Opinion", desc: "Distinguishing truth from personal belief.", concepts: ["Ice is cold (Fact)", "Ice cream is best (Op)"] },
        { name: "Context Clues", desc: "Figuring out unknown words using surrounding text.", concepts: ["Inferring meaning", "Looking at neighbors"] },
        { name: "Idioms", desc: "Phrases that don't mean exactly what they say.", concepts: ["Piece of cake", "Raining cats & dogs"] },
        { name: "Persuasive Writing Intro", desc: "Trying to convince someone of your opinion.", concepts: ["Stating opinion", "Giving reasons"] },
        { name: "Informational Texts", desc: "Reading to learn facts about the real world.", concepts: ["Glossary", "Index", "Headings"] },
        { name: "Dictionary Skills", desc: "Using alphabetical order and guide words.", concepts: ["Guide words", "Multiple meanings"] }
    ],
    5: [
        { name: "Similes and Metaphors", desc: "Comparing things to create strong imagery.", concepts: ["As brave as a lion", "He is a shining star"] },
        { name: "Complex Sentences", desc: "Combining dependent and independent clauses.", concepts: ["Because it rained,", "we stayed inside."] },
        { name: "Pronoun-Antecedent Agreement", desc: "Making sure pronouns match their nouns.", concepts: ["Mary lost HER book", "The boys lost THEIR ball"] },
        { name: "Greek and Latin Roots", desc: "Understanding the origins of complex words.", concepts: ["Aqua = Water", "Bio = Life"] },
        { name: "Point of View", desc: "Who is telling the story? (1st, 2nd, 3rd person).", concepts: ["I, Me (1st)", "He, They (3rd)"] },
        { name: "Cause and Effect", desc: "Understanding why things happen in texts.", concepts: ["Cause (Why)", "Effect (What happened)"] },
        { name: "Narrative Writing", desc: "Telling a story with characters, setting, and plot.", concepts: ["Setting the scene", "Climax"] },
        { name: "Dialogue Punctuation", desc: "Using quotation marks correctly when characters speak.", concepts: ["\"Hello,\" he said.", "Comma before quote"] },
        { name: "Theme", desc: "The moral or underlying message of a story.", concepts: ["Friendship", "Courage"] },
        { name: "Speech & Pronunciation", desc: "Practicing clear enunciation and steady pacing.", concepts: ["Volume control", "Eye contact"] }
    ],
    6: [
        { name: "Types of Poetry", desc: "Haikus, Limericks, and Sonnets.", concepts: ["Syllable counts", "Emotional impact"] },
        { name: "Personification", desc: "Giving human traits to non-human things.", concepts: ["The wind howled", "The leaves danced"] },
        { name: "Active vs. Passive Voice", desc: "Where the subject performs or receives the action.", concepts: ["I threw the ball", "The ball was thrown"] },
        { name: "Author's Purpose", desc: "Persuade, Inform, or Entertain (PIE).", concepts: ["Analyzing text intent", "Identifying bias"] },
        { name: "Argumentative Writing", desc: "Crafting a thesis and supporting it with evidence.", concepts: ["Thesis statement", "Rebuttals"] },
        { name: "Analogies", desc: "Comparing two pairs of words (Leaf : Tree :: Petal : Flower).", concepts: ["Relationship types", "Solving analogies"] },
        { name: "Hyperbole & Understatement", desc: "Exaggeration for effect.", concepts: ["I'm starving to death", "It's just a scratch"] },
        { name: "Summarizing vs. Paraphrasing", desc: "Checking understanding without copying.", concepts: ["Main points only", "In your own words"] },
        { name: "Text Features", desc: "Analyzing charts, graphs, and sidebars in non-fiction.", concepts: ["Infographics", "Footnotes"] },
        { name: "Oral Presentation", desc: "Delivering a structured speech to an audience.", concepts: ["Body language", "Tone variation"] }
    ],
    7: [
        { name: "Advanced Clauses", desc: "Relative clauses and subordinate conjunctions.", concepts: ["Who, Which, That", "Although, Whereas"] },
        { name: "Irony", desc: "Verbal, situational, and dramatic irony.", concepts: ["Expectation", "Reality"] },
        { name: "Connotation vs. Denotation", desc: "The dictionary definition vs. the emotional feeling.", concepts: ["House vs. Home", "Cheap vs. Inexpensive"] },
        { name: "Text Structures", desc: "Chronological, Compare/Contrast, Problem/Solution.", concepts: ["Identifying structure", "Transition words"] },
        { name: "Evaluating Evidence", desc: "Determining if a source is credible or biased.", concepts: ["Primary vs Secondary", "Credibility"] },
        { name: "Literary Analysis Essay", desc: "Writing an academic paper analyzing a text.", concepts: ["Quoting text", "Analyzing impact"] },
        { name: "Mood and Tone", desc: "The author's attitude vs. the reader's feeling.", concepts: ["Suspenseful", "Humorous"] },
        { name: "Alliteration and Assonance", desc: "Sound devices in literature.", concepts: ["Peter Piper Picked", "Fleet feet sweep"] },
        { name: "Public Speaking & Pronunciation", desc: "Advanced articulation and handling Q&A.", concepts: ["Handling nerves", "Impromptu speaking"] },
        { name: "Debate Fundamentals", desc: "Constructing logical arguments and counterarguments.", concepts: ["Opening statements", "Cross-examination"] }
    ],
    8: [
        { name: "Rhetorical Appeals", desc: "Ethos, Pathos, and Logos in persuasion.", concepts: ["Logic (Logos)", "Emotion (Pathos)", "Credibility (Ethos)"] },
        { name: "Satire and Parody", desc: "Using humor to critique society.", concepts: ["Exaggeration", "Social commentary"] },
        { name: "Mastering Syntax", desc: "Varying sentence structure for flow and impact.", concepts: ["Loose sentences", "Periodic sentences"] },
        { name: "Symbolism and Motifs", desc: "Objects representing deeper meanings in novels.", concepts: ["The Mockingbird", "The Green Light"] },
        { name: "Advanced Novel Study", desc: "Deep diving into character arcs and thematic evolution.", concepts: ["Dynamic characters", "Foreshadowing"] },
        { name: "Research Papers", desc: "Proper citations and academic formatting.", concepts: ["Bibliography", "In-text citations"] },
        { name: "Logical Fallacies", desc: "Identifying flaws in arguments.", concepts: ["Ad Hominem", "Strawman"] },
        { name: "Diction Analysis", desc: "Why an author chooses specific words.", concepts: ["Formal vs Colloquial", "Jargon"] },
        { name: "Creative Writing Workshop", desc: "Drafting, peer-reviewing, and publishing a short story.", concepts: ["Show, Don't Tell", "Pacing"] },
        { name: "Final Capstone Presentation", desc: "A masterful presentation showcasing all English skills.", concepts: ["Elocution", "Multimedia use"] }
    ]
};

// Helper to generate multiple-choice options safely
const generateOptions = (correct) => {
    const dummy = ["A", "B", "C", "D", "E"];
    const out = dummy.filter(o => o !== correct).slice(0, 2);
    out.push(correct);
    out.push("None of the above");
    return out.sort(() => 0.5 - Math.random());
};

async function seedToFirestore() {
    console.log("Beginning pedagogical upload of expert English content to Firebase...");
    let uploadCount = 0;

    const batchSize = 100;
    let batch = db.batch();
    let currentBatchCount = 0;

    for (let gradeNum = 1; gradeNum <= 8; gradeNum++) {
        const gradeId = `grade-${gradeNum}`;
        const subjectId = `english-${gradeNum}`;
        const syllabus = expertSyllabus[gradeNum];

        for (let levelNum = 1; levelNum <= 10; levelNum++) {
            const levelInfo = syllabus[levelNum - 1];
            const levelId = `${subjectId}-level-${levelNum}`;
            const docId = `${gradeId}_${subjectId}_${levelId}`;

            const q1Answer = `It relates to ${levelInfo.concepts[0]}`;
            const q2Answer = `It involves ${levelInfo.concepts[1]}`;

            const tasks = [
                {
                    taskId: `${levelId}-lesson-1`,
                    taskName: `Learn: ${levelInfo.name}`,
                    type: "lesson",
                    content: `Welcome to Grade ${gradeNum}, Level ${levelNum}! Today we explore "${levelInfo.name}". Our focus: ${levelInfo.desc}. Key concepts: ${levelInfo.concepts.join(" and ")}.`,
                    questions: []
                },
                {
                    taskId: `${levelId}-quiz-1`,
                    taskName: "Practice Quiz",
                    type: "quiz",
                    timeLimit: 120,
                    content: `Let's test your understanding of ${levelInfo.name}.`,
                    questions: [
                        {
                            questionId: `q1-${levelId}`,
                            questionText: `What is the key rule of ${levelInfo.concepts[0]}?`,
                            options: generateOptions(q1Answer),
                            correctAnswer: q1Answer,
                            type: "multiple-choice"
                        },
                        {
                            questionId: `q2-${levelId}`,
                            questionText: `Identify the example of ${levelInfo.concepts[1]}.`,
                            options: generateOptions(q2Answer),
                            correctAnswer: q2Answer,
                            type: "multiple-choice"
                        }
                    ]
                },
                {
                    taskId: `${levelId}-exam-1`,
                    taskName: "Level Challenge!",
                    type: "exam",
                    timeLimit: 180,
                    content: "Prove you are a master of this topic!",
                    questions: [
                        {
                            questionId: `ex1-${levelId}`,
                            questionText: `To master ${levelInfo.name}, you must understand ${levelInfo.concepts[0]}. What is it?`,
                            options: generateOptions(q1Answer),
                            correctAnswer: q1Answer,
                            type: "multiple-choice"
                        },
                        {
                            questionId: `ex2-${levelId}`,
                            questionText: `Type out your understanding of ${levelInfo.concepts[1]}:`,
                            correctAnswer: q2Answer,
                            type: "identification"
                        }
                    ]
                }
            ];

            const docData = {
                gradeId,
                subjectId,
                levelId,
                levelName: `Level ${levelNum}: ${levelInfo.name}`,
                isLocked: levelNum > 1, // Only unlock level 1 by default
                tasks,
                updatedAt: FieldValue.serverTimestamp()
            };

            const docRef = db.collection('levels').doc(docId);
            batch.set(docRef, docData, { merge: true });
            currentBatchCount++;
            uploadCount++;

            if (currentBatchCount >= batchSize) {
                await batch.commit();
                batch = db.batch();
                currentBatchCount = 0;
            }
        }
    }

    if (currentBatchCount > 0) {
        await batch.commit();
    }

    console.log(`\n✅ Upload complete! Successfully pushed ${uploadCount} highly detailed English level modules (Grades 1-8) directly into Firebase Firestore.`);
}

seedToFirestore().catch(console.error);
