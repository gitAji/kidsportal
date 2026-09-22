const { admin, db } = require('./_adminInit');


// Rich task set for Grade 1, Level 1 - உயிர் எழுத்துக்கள் (Vowels)
const levelId = 'tamil-1-level-1';

const tasks = [
    // ── LESSON 1: Introduction ─────────────────────────────────────
    {
        taskId: `${levelId}-lesson-1`,
        taskName: 'கற்றல் 1: உயிர் எழுத்து அறிமுகம்',
        type: 'lesson',
        xpReward: 15,
        content: `## 🌟 உயிர் எழுத்துக்கள் - பாகம் 1: அறிமுகம்

தமிழ் மொழியில் **12 உயிர் எழுத்துக்கள்** உள்ளன.

### உயிர் எழுத்துக்கள் என்றால் என்ன?
"உயிர்" என்றால் **ஆன்மா / உயிர்**. இந்த எழுத்துக்கள் தனியே ஒலிக்கும் திறன் கொண்டவை.

### 12 உயிர் எழுத்துக்கள்:
| # | எழுத்து | ஆங்கில ஒலி | உதாரணச் சொல் |
|---|---------|------------|--------------|
| 1 | **அ** | a (short) | **அ**ம்மா |
| 2 | **ஆ** | aa (long) | **ஆ**டு |
| 3 | **இ** | i (short) | **இ**லை |
| 4 | **ஈ** | ee (long) | **ஈ**க்கை |
| 5 | **உ** | u (short) | **உ**ப்பு |
| 6 | **ஊ** | oo (long) | **ஊ**ர் |
| 7 | **எ** | e (short) | **எ**லி |
| 8 | **ஏ** | ae (long) | **ஏ**ணி |
| 9 | **ஐ** | ai | **ஐ**ந்து |
| 10 | **ஒ** | o (short) | **ஒ**ட்டகம் |
| 11 | **ஓ** | oo (long) | **ஓ**டு |
| 12 | **ஔ** | au | **ஔ**டதம் |

### 🎵 நினைவு வரிசை:
**அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ** — இந்த வரிசையில் கட்டாயம் கற்க வேண்டும்!`
    },

    // ── LESSON 2: Kuril vs Nedil ───────────────────────────────────
    {
        taskId: `${levelId}-lesson-2`,
        taskName: 'கற்றல் 2: குறில் மற்றும் நெடில்',
        type: 'lesson',
        xpReward: 15,
        content: `## 📘 உயிர் எழுத்துக்கள் - பாகம் 2: குறில் & நெடில்

### குறில் எழுத்துக்கள் (Short Vowels - 5):
குறுகிய ஒலி — ஒரே மூச்சில் சீக்கிரம் ஒலிக்கும்.

| எழுத்து | ஒலி | உதாரணம் |
|---------|-----|---------|
| **அ** | 'a' in 'apple' | அம்மா (Mother) |
| **இ** | 'i' in 'in' | இலை (Leaf) |
| **உ** | 'u' in 'put' | உப்பு (Salt) |
| **எ** | 'e' in 'end' | எலி (Mouse) |
| **ஒ** | 'o' in 'off' | ஒட்டகம் (Camel) |

### நெடில் எழுத்துக்கள் (Long Vowels - 5):
நீண்ட ஒலி — குறிலை விட இரட்டை நேரம் ஒலிக்கும்.

| எழுத்து | ஒலி | உதாரணம் |
|---------|-----|---------|
| **ஆ** | 'aa' in 'father' | ஆடு (Goat) |
| **ஈ** | 'ee' in 'see' | ஈக்கை (Mosquito net) |
| **ஊ** | 'oo' in 'food' | ஊர் (Village) |
| **ஏ** | 'ae' in 'café' | ஏணி (Ladder) |
| **ஓ** | 'o' in 'go' | ஓடு (Run) |

### ஐகாரம் & ஒளகாரம் (Special - 2):
| எழுத்து | ஒலி | உதாரணம் |
|---------|-----|---------|
| **ஐ** | 'ai' in 'aisle' | ஐந்து (Five) |
| **ஔ** | 'au' in 'found' | ஔடதம் (Medicine) |

### 💡 ஞாபக உத்தி:
குறிலை வேகமாக சொல்லவும், நெடிலை மெதுவாகவும்!
"அ" vs "ஆ" → 'a' vs 'aaa' (நீளமாக)'`
    },

    // ── LESSON 3: Words with each vowel ───────────────────────────
    {
        taskId: `${levelId}-lesson-3`,
        taskName: 'கற்றல் 3: உயிர் எழுத்தால் சொற்கள்',
        type: 'lesson',
        xpReward: 15,
        content: `## 📚 உயிர் எழுத்துக்கள் - பாகம் 3: சொல் கோட்டை

ஒவ்வொரு உயிர் எழுத்தாலும் ஆரம்பிக்கும் சொற்களை கற்போம்!

### 🅰️ அ - ஆரம்பிக்கும் சொற்கள்:
- **அம்மா** - Mother 👩
- **அப்பா** - Father 👨
- **அரசன்** - King 👑
- **அணில்** - Squirrel 🐿️

### 🅰️ ஆ - ஆரம்பிக்கும் சொற்கள்:
- **ஆடு** - Goat 🐐
- **ஆமை** - Tortoise 🐢
- **ஆறு** - River 🌊
- **ஆகாயம்** - Sky ☁️

### 🅸 இ - ஆரம்பிக்கும் சொற்கள்:
- **இலை** - Leaf 🍃
- **இரவு** - Night 🌙
- **இஞ்சி** - Ginger 🌿
- **இசை** - Music 🎵

### 🅸 ஈ - ஆரம்பிக்கும் சொற்கள்:
- **ஈ** - Fly 🪰
- **ஈக்கை** - Mosquito net
- **ஈரம்** - Wetness 💧

### 🅤 உ / ஊ - ஆரம்பிக்கும் சொற்கள்:
- **உப்பு** - Salt 🧂
- **உடல்** - Body 🏃
- **ஊர்** - Village 🏘️
- **ஊசி** - Needle 🪡

### 🔤 பயிற்சி:
தாளில் ஒவ்வொரு உயிர் எழுத்திற்கும் 2 சொற்கள் எழுதுங்கள்!`
    },

    // ── QUIZ 1: Recognition Quiz ───────────────────────────────────
    {
        taskId: `${levelId}-quiz-1`,
        taskName: 'வினாடி வினா 1: எழுத்து அறிதல்',
        type: 'quiz',
        xpReward: 25,
        timeLimit: 90,
        questions: [
            { questionId: `q1-${levelId}-0`, questionText: 'தமிழ் மொழியில் மொத்தம் எத்தனை உயிர் எழுத்துக்கள் உள்ளன?', options: ['10', '12', '18', '16'], correctAnswer: '12', type: 'multiple-choice' },
            { questionId: `q1-${levelId}-1`, questionText: 'குறில் எழுத்துக்கள் எத்தனை?', options: ['5', '7', '3', '12'], correctAnswer: '5', type: 'multiple-choice' },
            { questionId: `q1-${levelId}-2`, questionText: 'நெடில் எழுத்துக்கள் எத்தனை?', options: ['7', '5', '3', '6'], correctAnswer: '5', type: 'multiple-choice' },
            { questionId: `q1-${levelId}-3`, questionText: 'பின்வருவனவற்றில் குறில் எழுத்து எது?', options: ['ஆ', 'ஈ', 'அ', 'ஊ'], correctAnswer: 'அ', type: 'multiple-choice' },
            { questionId: `q1-${levelId}-4`, questionText: 'பின்வருவனவற்றில் நெடில் எழுத்து எது?', options: ['அ', 'இ', 'ஆ', 'உ'], correctAnswer: 'ஆ', type: 'multiple-choice' },
            { questionId: `q1-${levelId}-5`, questionText: '"அம்மா" என்ற சொல்லில் முதல் எழுத்து எந்த உயிர்?', options: ['ஆ', 'இ', 'அ', 'ம'], correctAnswer: 'அ', type: 'multiple-choice' },
            { questionId: `q1-${levelId}-6`, questionText: '"ஆடு" என்பதன் பொருள் என்ன?', options: ['Cow', 'Dog', 'Goat', 'Cat'], correctAnswer: 'Goat', type: 'multiple-choice' },
            { questionId: `q1-${levelId}-7`, questionText: '"உப்பு" என்பதன் பொருள் என்ன?', options: ['Sugar', 'Salt', 'Spice', 'Rice'], correctAnswer: 'Salt', type: 'multiple-choice' },
            { questionId: `q1-${levelId}-8`, questionText: 'ஐ, ஔ ஆகிய எழுத்துக்கள் எந்த வகை?', options: ['குறில்', 'நெடில்', 'ஐகார ஒளகார எழுத்துக்கள்', 'மெய்'], correctAnswer: 'ஐகார ஒளகார எழுத்துக்கள்', type: 'multiple-choice' },
            { questionId: `q1-${levelId}-9`, questionText: '"இலை" என்பதன் பொருள் என்ன?', options: ['Tree', 'Leaf', 'Flower', 'Root'], correctAnswer: 'Leaf', type: 'multiple-choice' },
        ]
    },

    // ── QUIZ 2: Application Quiz ─────────────────────────────────
    {
        taskId: `${levelId}-quiz-2`,
        taskName: 'வினாடி வினா 2: சொல் பொருத்தம்',
        type: 'quiz',
        xpReward: 25,
        timeLimit: 90,
        questions: [
            { questionId: `q2-${levelId}-0`, questionText: '"ஊர்" என்பதன் பொருள் என்ன?', options: ['City', 'Village', 'Country', 'Town'], correctAnswer: 'Village', type: 'multiple-choice' },
            { questionId: `q2-${levelId}-1`, questionText: '"எலி" என்பதன் பொருள் என்ன?', options: ['Rabbit', 'Mouse', 'Rat (big)', 'Squirrel'], correctAnswer: 'Mouse', type: 'multiple-choice' },
            { questionId: `q2-${levelId}-2`, questionText: '"ஏணி" என்பதன் பொருள் என்ன?', options: ['Stairs', 'Bridge', 'Ladder', 'Step'], correctAnswer: 'Ladder', type: 'multiple-choice' },
            { questionId: `q2-${levelId}-3`, questionText: '"ஐந்து" என்றால் எத்தனை?', options: ['3', '4', '5', '6'], correctAnswer: '5', type: 'multiple-choice' },
            { questionId: `q2-${levelId}-4`, questionText: 'Mother என்பதற்கு தமிழில் என்ன?', options: ['அப்பா', 'அம்மா', 'அக்கா', 'அண்ணன்'], correctAnswer: 'அம்மா', type: 'multiple-choice' },
            { questionId: `q2-${levelId}-5`, questionText: '"ஆறு" என்பதன் பொருள் என்ன?', options: ['Sea', 'Lake', 'River', 'Pond'], correctAnswer: 'River', type: 'multiple-choice' },
            { questionId: `q2-${levelId}-6`, questionText: '"இரவு" என்பதன் பொருள் என்ன?', options: ['Morning', 'Afternoon', 'Night', 'Evening'], correctAnswer: 'Night', type: 'multiple-choice' },
            { questionId: `q2-${levelId}-7`, questionText: 'Sky என்பதற்கு தமிழில் என்ன?', options: ['கடல்', 'ஆகாயம்', 'மலை', 'காடு'], correctAnswer: 'ஆகாயம்', type: 'multiple-choice' },
            { questionId: `q2-${levelId}-8`, questionText: '"அரசன்" என்பதன் பொருள் என்ன?', options: ['Soldier', 'Minister', 'King', 'Farmer'], correctAnswer: 'King', type: 'multiple-choice' },
            { questionId: `q2-${levelId}-9`, questionText: 'Music என்பதற்கு தமிழில் என்ன?', options: ['நடனம்', 'இசை', 'கவிதை', 'ஓவியம்'], correctAnswer: 'இசை', type: 'multiple-choice' },
        ]
    },

    // ── QUIZ 3: Advanced Application ─────────────────────────────
    {
        taskId: `${levelId}-quiz-3`,
        taskName: 'வினாடி வினா 3: ஆழ்ந்த அறிவு',
        type: 'quiz',
        xpReward: 30,
        timeLimit: 120,
        questions: [
            { questionId: `q3-${levelId}-0`, questionText: 'தமிழில் மொத்தம் எத்தனை எழுத்துக்கள் உள்ளன?', options: ['247', '18', '216', '12'], correctAnswer: '247', type: 'multiple-choice' },
            { questionId: `q3-${levelId}-1`, questionText: '"அ" எழுத்தை ஆங்கிலத்தில் எப்படி ஒலிப்பார்கள்?', options: ['aa', 'a (short)', 'i', 'u'], correctAnswer: 'a (short)', type: 'multiple-choice' },
            { questionId: `q3-${levelId}-2`, questionText: '"ஐ" எழுத்தை ஆங்கிலத்தில் எப்படி ஒலிப்பார்கள்?', options: ['i', 'ai', 'ee', 'ay'], correctAnswer: 'ai', type: 'multiple-choice' },
            { questionId: `q3-${levelId}-3`, questionText: 'உயிர் எழுத்துக்களின் வேறு பெயர்?', options: ['மெய் வரிசை', 'அகர வரிசை', 'ஆய்த வரிசை', 'உயிர்மெய் வரிசை'], correctAnswer: 'அகர வரிசை', type: 'multiple-choice' },
            { questionId: `q3-${levelId}-4`, questionText: 'குறில் எழுத்துக்களின் ஒலி அளவு என்ன?', options: ['நீண்ட ஒலி', 'குறுகிய ஒலி', 'மிகவும் நீண்ட ஒலி', 'இரட்டை ஒலி'], correctAnswer: 'குறுகிய ஒலி', type: 'multiple-choice' },
            { questionId: `q3-${levelId}-5`, questionText: 'நெடில் எழுத்துக்களின் ஒலி அளவு என்ன?', options: ['குறுகிய ஒலி', 'நீண்ட ஒலி', 'சிறிய ஒலி', 'மிகவும் சிறிய ஒலி'], correctAnswer: 'நீண்ட ஒலி', type: 'multiple-choice' },
            { questionId: `q3-${levelId}-6`, questionText: 'உயிர் எழுத்துக்களை யார் கண்டுபிடித்தார்?', options: ['திருவள்ளுவர்', 'அகத்தியர்', 'கம்பர்', 'பாரதியார்'], correctAnswer: 'அகத்தியர்', type: 'multiple-choice' },
            { questionId: `q3-${levelId}-7`, questionText: '"ஆமை" என்பதன் பொருள் என்ன?', options: ['Frog', 'Fish', 'Tortoise', 'Crocodile'], correctAnswer: 'Tortoise', type: 'multiple-choice' },
            { questionId: `q3-${levelId}-8`, questionText: '"ஒட்டகம்" என்பதன் பொருள் என்ன?', options: ['Horse', 'Elephant', 'Camel', 'Donkey'], correctAnswer: 'Camel', type: 'multiple-choice' },
            { questionId: `q3-${levelId}-9`, questionText: '"அணில்" என்பதன் பொருள் என்ன?', options: ['Rabbit', 'Rat', 'Squirrel', 'Cat'], correctAnswer: 'Squirrel', type: 'multiple-choice' },
        ]
    },

    // ── EXAM: Comprehensive ────────────────────────────────────────
    {
        taskId: `${levelId}-exam`,
        taskName: 'தேர்வு: உயிர் எழுத்துக்கள் - இறுதி சவால்',
        type: 'exam',
        xpReward: 60,
        timeLimit: 300,
        questions: [
            { questionId: `e-${levelId}-0`, questionText: 'தமிழ் மொழியில் மொத்தம் எத்தனை உயிர் எழுத்துக்கள் உள்ளன?', options: ['10', '12', '16', '18'], correctAnswer: '12', type: 'multiple-choice' },
            { questionId: `e-${levelId}-1`, questionText: 'குறில் எழுத்துக்கள் மட்டும் எவை?', options: ['அ, இ, உ, எ, ஒ', 'ஆ, ஈ, ஊ, ஏ, ஓ', 'ஐ, ஔ மட்டும்', 'அனைத்தும் குறில்'], correctAnswer: 'அ, இ, உ, எ, ஒ', type: 'multiple-choice' },
            { questionId: `e-${levelId}-2`, questionText: 'நெடில் எழுத்துக்கள் மட்டும் எவை?', options: ['அ, இ, உ, எ, ஒ', 'ஆ, ஈ, ஊ, ஏ, ஓ', 'ஐ, ஔ மட்டும்', 'எல்லாமே நெடில்'], correctAnswer: 'ஆ, ஈ, ஊ, ஏ, ஓ', type: 'multiple-choice' },
            { questionId: `e-${levelId}-3`, questionText: '"ஔடதம்" என்பதன் பொருள் என்ன?', options: ['Food', 'Medicine', 'Poison', 'Oil'], correctAnswer: 'Medicine', type: 'multiple-choice' },
            { questionId: `e-${levelId}-4`, questionText: '"இஞ்சி" என்பதன் பொருள் என்ன?', options: ['Turmeric', 'Pepper', 'Ginger', 'Garlic'], correctAnswer: 'Ginger', type: 'multiple-choice' },
            { questionId: `e-${levelId}-5`, questionText: 'Father என்பதற்கு தமிழில் என்ன?', options: ['அம்மா', 'அண்ணன்', 'அப்பா', 'தாத்தா'], correctAnswer: 'அப்பா', type: 'multiple-choice' },
            { questionId: `e-${levelId}-6`, questionText: '"ஊடு" என்றால் என்ன? (ஒலியல் - Phonology)', options: ['ஊ is a short vowel', 'ஊ is a long vowel', 'ஊ is not a vowel', 'ஊ does not exist'], correctAnswer: 'ஊ is a long vowel', type: 'multiple-choice' },
            { questionId: `e-${levelId}-7`, questionText: '"இசை" என்பதன் English பொருள் என்ன?', options: ['Dance', 'Painting', 'Music', 'Literature'], correctAnswer: 'Music', type: 'multiple-choice' },
            { questionId: `e-${levelId}-8`, questionText: 'Goat என்பதற்கு தமிழில் என்ன?', options: ['அணில்', 'ஆமை', 'ஆடு', 'அரசன்'], correctAnswer: 'ஆடு', type: 'multiple-choice' },
            { questionId: `e-${levelId}-9`, questionText: '"ஏணி" என்பதன் பொருள் என்ன?', options: ['Seat', 'Stool', 'Ladder', 'Chair'], correctAnswer: 'Ladder', type: 'multiple-choice' },
            { questionId: `e-${levelId}-10`, questionText: 'உயிர் எழுத்துக்களின் வரிசை சரியாக உள்ளது எது?', options: ['அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ', 'ஆ அ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ', 'அ ஆ ஈ இ உ ஊ எ ஏ ஐ ஒ ஓ ஔ', 'அ ஆ இ ஈ எ ஏ உ ஊ ஐ ஒ ஓ ஔ'], correctAnswer: 'அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ', type: 'multiple-choice' },
            { questionId: `e-${levelId}-11`, questionText: '"அணில்" - இந்த சொல்லில் உள்ள உயிர் எழுத்துக்கள் எவை?', options: ['அ, இ', 'ஆ, ஈ', 'அ, ஆ', 'இ, உ'], correctAnswer: 'அ, இ', type: 'multiple-choice' },
        ]
    },
];

async function run() {
    console.log(`Updating ${levelId} with ${tasks.length} rich tasks...`);

    const docRef = db.collection('levels').doc(levelId);
    await docRef.update({
        tasks,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Done! ${levelId} now has ${tasks.length} tasks:`);
    tasks.forEach(t => console.log(`   - [${t.type.toUpperCase()}] ${t.taskName} (${t.xpReward} XP)`));
}

run().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
