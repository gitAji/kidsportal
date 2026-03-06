const fs = require('fs');
const path = require('path');

const tamilTopics = {
    1: ["Uyir Ezhuthukkal (Vowels)", "Mei Ezhuthukkal (Consonants)", "Uyirmei Basics", "Animals & Birds", "Fruits & Vegetables", "Tamil Rhymes", "Colors & Shapes", "Basic Greetings", "Handwriting Practice", "Family & Body Parts"],
    2: ["Advanced Uyirmei", "Basic Word Formation", "Moral Stories", "Nature Poems", "Action Words", "Singular/Plural", "Opposites", "Gender in Tamil", "Days & Months", "Community Helpers"],
    3: ["Aathichoodi", "Paragraph Reading", "Nouns (Peyarchol)", "Verbs & Tenses", "Thirukkural Intro", "Descriptive Writing", "Nature Vocabulary", "Sentence Construction", "Folk Tales", "Time & Seasons"],
    4: ["Moothurai", "Konrai Vendhan", "Tamil Patrionism", "Science in Tamil", "Types of Nouns", "Pronouns", "Letter Writing", "Essay Writing", "Tools & Jobs", "Tamil Proverbs"],
    5: ["Thiruvasagam Verses", "Advanced Thirukkural", "History of Tamil", "Environment Prose", "Past & Future Tenses", "Case Endings Intro", "Story Building", "Comprehension", "Sports & Tamil Games", "Famous Tamil Poets"],
    6: ["Inba Tamil", "Tamil Kummi", "Growing Tamil", "Dreams & Science", "Ethics Intro", "Education Value", "Aathichoodi Deep Dive", "Silappathikaram Intro", "Letter Grammar", "Word Structure"],
    7: ["Language Pride", "Nature Conservation", "Human Values", "Science & Tech", "Ethics & Justice", "Arts & Culture", "Heritage", "Environment", "Case Endings", "Tamil Poetry"],
    8: ["Tamil Mozhi Vaazhthu", "Tradition (Marabu)", "Traditional Medicine", "Etymology", "Grammar Parts", "Case Endings Detailed", "Thirukkural Chapters", "Social Reforms", "Modern Technology", "Cultural Heritage"]
};

const curriculum = {};

for (let grade = 1; grade <= 8; grade++) {
    curriculum[grade] = { levels: [] };
    const topics = tamilTopics[grade];

    for (let i = 0; i < 10; i++) {
        const topic = topics[i];
        curriculum[grade].levels.push({
            name: topic,
            lesson: `This lesson covers ${topic}. Learn the rich Tamil language through focused study of ${topic.toLowerCase()} concepts and literature.`,
            quiz: [
                { q: `Identify a key aspect of ${topic}.`, a: "Correct answer", d: ["Distractor 1", "Distractor 2", "Distractor 3"] },
                { q: `What is the meaning associated with ${topic}?`, a: "The right meaning", d: ["Wrong meaning", "Opposite", "Nothing"] }
            ],
            exam: [
                { q: `Summarize the importance of ${topic}.`, a: "A good summary", d: ["Bad summary", "Wrong topic", "No info"] },
                { q: `Give an example of ${topic} in Tamil.`, a: "Valid example", d: ["Invalid", "English word", "Sanskrit word"] }
            ]
        });
    }
}

const content = `module.exports = ${JSON.stringify(curriculum, null, 2)};`;
fs.writeFileSync(path.join(__dirname, 'curriculum_tamil_data.js'), content);
console.log("Generated full Tamil curriculum data!");
