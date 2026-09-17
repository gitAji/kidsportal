const fs = require('fs');
const path = require('path');

const dbPath = path.join('/home/user/kidsportal', 'src', 'app', 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function mkLevel(levelId, moduleName, levelName, lessonContent, quiz, exam) {
  return {
    levelId,
    levelName,
    isLocked: false,
    tasks: [
      {
        taskId: `${levelId}-lesson`,
        taskName: `Lesson: ${levelName}`,
        type: 'lesson',
        content: lessonContent,
        questions: [],
      },
      {
        taskId: `${levelId}-quiz`,
        taskName: 'Practice Quiz',
        type: 'quiz',
        timeLimit: 180,
        content: "Let's practice what we just learned!",
        questions: quiz.map((q, idx) => ({
          questionId: `${levelId}-quiz-q${idx + 1}`,
          ...q,
        })),
      },
      {
        taskId: `${levelId}-exam`,
        taskName: 'Level Challenge!',
        type: 'exam',
        timeLimit: 300,
        content: 'Time to show what you know!',
        questions: exam.map((q, idx) => ({
          questionId: `${levelId}-exam-q${idx + 1}`,
          ...q,
        })),
      },
    ],
    moduleName,
  };
}

// ---------------------------------------------------------------------------
// Grade 3, tamil-3-level-9: "Reading Short Stories" -> Aathichudi
// ---------------------------------------------------------------------------
const aathichudi = mkLevel(
  'tamil-3-level-9',
  'Module 4: Mastery Challenge',
  'Aathichudi: Auvaiyar\'s Wisdom',
  'ஆத்திசூடி (Aathichudi) is one of the most famous books ever written for Tamil children. It was written long ago by the poet ஔவையார் (Auvaiyar), and it is a list of short, one-line sayings that each teach a good habit or a good value. The clever part is that the sayings are arranged in the order of the Tamil alphabet — the first saying starts with அ, the second with ஆ, the third with இ, and so on! This helped children learn their letters and good manners at the same time. Here are some famous lines: "அறம் செய விரும்பு" means "Wish to do good deeds." "ஆறுவது சினம்" means "Let your anger cool down" — it reminds us not to stay angry. "ஈவது விலக்கேல்" means "Do not stop someone from giving to others." "ஊக்கமது கைவிடேல்" means "Never give up your effort." Even though Auvaiyar wrote these lines a very long time ago, they still teach us how to be kind, patient, and hardworking today.',
  [
    {
      questionText: 'Who wrote the Aathichudi?',
      correctAnswer: 'Auvaiyar',
      type: 'multiple-choice',
      options: ['Auvaiyar', 'Bharathiyar', 'Kambar', 'Ilango Adigal'],
    },
    {
      questionText: 'What is special about the order of the sayings in Aathichudi?',
      correctAnswer: 'Each saying starts with the next letter of the Tamil alphabet',
      type: 'multiple-choice',
      options: [
        'They are numbered 1 to 100',
        'Each saying starts with the next letter of the Tamil alphabet',
        'They are arranged from shortest to longest',
        'They are written as questions and answers',
      ],
    },
    {
      questionText: 'What does the line "ஆறுவது சினம்" teach us to do?',
      correctAnswer: 'Let your anger cool down / control your anger',
      type: 'identification',
    },
    {
      questionText: 'Write the Tamil name of the famous book of one-line sayings written by Auvaiyar.',
      correctAnswer: 'ஆத்திசூடி',
      type: 'identification',
    },
  ],
  [
    {
      questionText: 'Why did Auvaiyar arrange the Aathichudi in alphabetical order?',
      correctAnswer: 'So that children could learn the Tamil letters and good values at the same time',
      type: 'identification',
    },
    {
      questionText: 'Which line from Aathichudi means "Wish to do good deeds"?',
      correctAnswer: 'அறம் செய விரும்பு',
      type: 'multiple-choice',
      options: ['அறம் செய விரும்பு', 'ஆறுவது சினம்', 'ஈவது விலக்கேல்', 'ஊக்கமது கைவிடேல்'],
    },
    {
      questionText: 'The line "ஊக்கமது கைவிடேல்" teaches children to never give up their...',
      correctAnswer: 'Effort / diligence',
      type: 'multiple-choice',
      options: ['Toys', 'Effort / diligence', 'Money', 'Friends'],
    },
    {
      questionText: 'What kind of book is Aathichudi — a story, a poem, or a list of one-line sayings?',
      correctAnswer: 'A list of one-line sayings (moral maxims)',
      type: 'identification',
    },
    {
      questionText: 'Why is Aathichudi still taught to Tamil children today, even though it was written so long ago?',
      correctAnswer: 'Because its lessons about kindness, patience, and hard work are still true and useful today',
      type: 'identification',
    },
  ]
);

// ---------------------------------------------------------------------------
// Grade 5, tamil-5-level-4: "Proverbs II" -> Tamil Kings: Chola, Pandya & Chera
// ---------------------------------------------------------------------------
const tamilKings = mkLevel(
  'tamil-5-level-4',
  'Module 2: Core Concepts',
  'Tamil Kings: The Chola, Pandya & Chera Dynasties',
  'Long ago, ancient Tamil land (Tamilakam) was ruled by three great royal families, often called மூவேந்தர் (the "Three Crowned Kings"): the சோழர் (Chola), பாண்டியர் (Pandya), and சேரர் (Chera). Each dynasty ruled a different region and had its own symbol (emblem). The Cholas ruled the fertile Kaveri river valley in the east, and their emblem was the tiger. Their early capital was Uraiyur. The Pandyas ruled the south, with their capital at மதுரை (Madurai), and their emblem was the fish (carp). Madurai was also a great center of learning, home to the Tamil Sangams — academies of poets who composed and preserved classical Tamil literature. The Cheras ruled the west, in what is now Kerala, with their capital near Vanji, and their emblem was the bow. These three kingdoms sometimes fought each other for power, but they also supported poets, temples, and trade, and their courts are where much of the earliest Tamil literature, called Sangam literature, was composed and collected.',
  [
    {
      questionText: 'What were the three ancient Tamil royal dynasties together called?',
      correctAnswer: 'மூவேந்தர் (the Three Crowned Kings)',
      type: 'identification',
    },
    {
      questionText: 'Which dynasty had the tiger as its emblem and ruled the Kaveri river valley?',
      correctAnswer: 'Chola',
      type: 'multiple-choice',
      options: ['Chola', 'Pandya', 'Chera', 'Pallava'],
    },
    {
      questionText: 'Which city was the capital of the Pandya kingdom and a great center of Tamil learning?',
      correctAnswer: 'Madurai',
      type: 'multiple-choice',
      options: ['Uraiyur', 'Madurai', 'Thanjavur', 'Vanji'],
    },
    {
      questionText: 'What was the emblem of the Chera dynasty, which ruled the west (modern Kerala)?',
      correctAnswer: 'The bow',
      type: 'multiple-choice',
      options: ['The bow', 'The fish', 'The tiger', 'The elephant'],
    },
  ],
  [
    {
      questionText: 'Name the three ancient Tamil dynasties known as the "Three Crowned Kings."',
      correctAnswer: 'Chola, Pandya, and Chera',
      type: 'identification',
    },
    {
      questionText: 'What were the Tamil Sangams, and which city hosted them?',
      correctAnswer: 'Academies of poets who composed and preserved classical Tamil literature, hosted in Madurai',
      type: 'identification',
    },
    {
      questionText: 'Which emblem belonged to the Pandya dynasty?',
      correctAnswer: 'The fish (carp)',
      type: 'multiple-choice',
      options: ['The fish (carp)', 'The bow', 'The tiger', 'The lion'],
    },
    {
      questionText: 'Besides ruling their kingdoms, what else did these three royal courts support that helped Tamil culture grow?',
      correctAnswer: 'They supported poets, temples, trade, and the composition/preservation of literature',
      type: 'identification',
    },
    {
      questionText: 'Which region did the Chola dynasty rule?',
      correctAnswer: 'The fertile Kaveri river valley in the east',
      type: 'multiple-choice',
      options: [
        'The fertile Kaveri river valley in the east',
        'The mountains of the north',
        'The western coast (modern Kerala)',
        'The island of Sri Lanka',
      ],
    },
  ]
);

// ---------------------------------------------------------------------------
// Grade 6, tamil-6-level-4: "Idioms & Figures of Speech I" -> Chola Empire
// ---------------------------------------------------------------------------
const cholaEmpire = mkLevel(
  'tamil-6-level-4',
  'Module 2: Core Concepts',
  'The Chola Empire: Rajaraja & Rajendra Chola',
  'By the 10th and 11th centuries CE, the Chola kingdom had grown into one of the most powerful empires in Tamil history, thanks to two remarkable rulers: ராஜராஜ சோழன் (Rajaraja Chola I, who ruled 985–1014 CE) and his son ராஜேந்திர சோழன் (Rajendra Chola I, who ruled 1014–1044 CE). Rajaraja Chola I built the magnificent பிரகதீஸ்வரர் கோயில் (Brihadeeswarar Temple) in Thanjavur, a towering stone temple dedicated to Lord Shiva that is now a UNESCO World Heritage Site and still stands today, over a thousand years later. He also built a powerful navy and expanded Chola rule to northern Sri Lanka and the Maldive Islands. His son Rajendra Chola I pushed the empire even further: he led a famous military campaign all the way north to the Ganges river, and to celebrate this achievement he built a new capital city called கங்கைகொண்ட சோழபுரம் (Gangaikonda Cholapuram, "the city of the Chola who took the Ganges"). Rajendra Chola also sent a naval expedition across the sea to Southeast Asia, reaching the Srivijaya empire in what is now Indonesia and Malaysia — one of the few times in history that an Indian kingdom launched a major overseas naval campaign. Together, father and son made the Chola Empire one of the largest and most advanced empires of its time, famous for its temples, its navy, and its support of Tamil art and literature.',
  [
    {
      questionText: 'What famous temple did Rajaraja Chola I build in Thanjavur?',
      correctAnswer: 'The Brihadeeswarar Temple (பிரகதீஸ்வரர் கோயில்)',
      type: 'identification',
    },
    {
      questionText: 'Which Chola king led a military campaign all the way to the Ganges river and built Gangaikonda Cholapuram to mark it?',
      correctAnswer: 'Rajendra Chola I',
      type: 'multiple-choice',
      options: ['Rajaraja Chola I', 'Rajendra Chola I', 'Rajaraja Chola II', 'Kulothunga Chola'],
    },
    {
      questionText: 'Rajendra Chola I sent a naval expedition overseas to which Southeast Asian empire?',
      correctAnswer: 'The Srivijaya empire',
      type: 'multiple-choice',
      options: ['The Srivijaya empire', 'The Khmer empire', 'The Ming empire', 'The Roman empire'],
    },
    {
      questionText: 'What is special about the Brihadeeswarar Temple today, over a thousand years after it was built?',
      correctAnswer: 'It is a UNESCO World Heritage Site and still stands',
      type: 'identification',
    },
  ],
  [
    {
      questionText: 'Explain what Rajaraja Chola I achieved during his reign (985–1014 CE).',
      correctAnswer: 'He built the Brihadeeswarar Temple in Thanjavur and built a powerful navy that expanded Chola rule to northern Sri Lanka and the Maldives',
      type: 'identification',
    },
    {
      questionText: 'Why did Rajendra Chola I build the city of Gangaikonda Cholapuram?',
      correctAnswer: 'To commemorate his military campaign that reached the Ganges river',
      type: 'identification',
    },
    {
      questionText: 'Who was the father of Rajendra Chola I?',
      correctAnswer: 'Rajaraja Chola I',
      type: 'multiple-choice',
      options: ['Rajaraja Chola I', 'Ilango Adigal', 'Kambar', 'Karikala Chola'],
    },
    {
      questionText: 'What made Rajendra Chola I\'s naval expedition to Srivijaya unusual for an Indian kingdom of that time?',
      correctAnswer: 'It was one of the few times an Indian kingdom launched a major overseas naval campaign',
      type: 'identification',
    },
    {
      questionText: 'What god was the Brihadeeswarar Temple in Thanjavur built to honor?',
      correctAnswer: 'Lord Shiva',
      type: 'multiple-choice',
      options: ['Lord Shiva', 'Lord Vishnu', 'Lord Murugan', 'Goddess Meenakshi'],
    },
  ]
);

// ---------------------------------------------------------------------------
// Grade 7, tamil-7-level-3: "Idioms & Figures of Speech II" -> Jaffna Kingdom
// ---------------------------------------------------------------------------
const jaffnaKingdom = mkLevel(
  'tamil-7-level-3',
  'Module 1: Getting Started',
  'The Jaffna Kingdom: Tamil History in Sri Lanka',
  'Tamil history is not only about mainland India — it also includes a long and proud history in இலங்கை (Sri Lanka). Around the 13th century CE, a Tamil kingdom known as the யாழ்ப்பாண இராச்சியம் (Jaffna Kingdom) was established in the northern part of Sri Lanka, ruled by the Aryacakravarti dynasty. Its capital was நல்லூர் (Nallur), which became an important center of Tamil Hindu (Saiva) culture, religion, and literature in the island. The kingdom built magnificent temples, most famously the நல்லூர் கந்தசுவாமி கோயில் (Nallur Kandaswamy Temple) dedicated to Lord Murugan, which remains one of the most important Hindu temples in Sri Lanka today. The Jaffna Kingdom traded with South India and other parts of the region, and its rulers supported Tamil scholars and poets, helping Tamil language and culture flourish in the north of the island for several centuries. The kingdom remained independent until 1619, when it was conquered by Portuguese colonizers — bringing an end to centuries of Tamil royal rule in Sri Lanka, though Tamil language, culture, and Hindu traditions continued to thrive among the Tamil community there.',
  [
    {
      questionText: 'What was the name of the Tamil kingdom established in northern Sri Lanka around the 13th century?',
      correctAnswer: 'The Jaffna Kingdom (யாழ்ப்பாண இராச்சியம்)',
      type: 'identification',
    },
    {
      questionText: 'What was the capital city of the Jaffna Kingdom?',
      correctAnswer: 'Nallur',
      type: 'multiple-choice',
      options: ['Nallur', 'Kandy', 'Colombo', 'Trincomalee'],
    },
    {
      questionText: 'Which famous temple in Jaffna is dedicated to Lord Murugan?',
      correctAnswer: 'Nallur Kandaswamy Temple',
      type: 'multiple-choice',
      options: [
        'Nallur Kandaswamy Temple',
        'Brihadeeswarar Temple',
        'Meenakshi Temple',
        'Ramanathaswamy Temple',
      ],
    },
    {
      questionText: 'In what year was the Jaffna Kingdom conquered, ending centuries of Tamil royal rule in Sri Lanka?',
      correctAnswer: '1619',
      type: 'identification',
    },
  ],
  [
    {
      questionText: 'Which dynasty ruled the Jaffna Kingdom?',
      correctAnswer: 'The Aryacakravarti dynasty',
      type: 'identification',
    },
    {
      questionText: 'Who conquered the Jaffna Kingdom in 1619?',
      correctAnswer: 'The Portuguese',
      type: 'multiple-choice',
      options: ['The Portuguese', 'The British', 'The Dutch', 'The Cholas'],
    },
    {
      questionText: 'Why was Nallur important to the Jaffna Kingdom beyond being its capital?',
      correctAnswer: 'It became an important center of Tamil Hindu (Saiva) culture, religion, and literature',
      type: 'identification',
    },
    {
      questionText: 'What did the rulers of the Jaffna Kingdom do to help Tamil language and culture flourish?',
      correctAnswer: 'They supported Tamil scholars and poets and built temples',
      type: 'identification',
    },
    {
      questionText: 'What continued to thrive among the Tamil community in Sri Lanka even after the kingdom fell?',
      correctAnswer: 'Tamil language, culture, and Hindu traditions',
      type: 'multiple-choice',
      options: [
        'Tamil language, culture, and Hindu traditions',
        'The Aryacakravarti royal government',
        'The original Jaffna army',
        'Trade with the Chola empire',
      ],
    },
  ]
);

// ---------------------------------------------------------------------------
// Grade 8, tamil-8-level-9: "Research & Presentation Skills" -> Subramania Bharati
// ---------------------------------------------------------------------------
const bharathiyar = mkLevel(
  'tamil-8-level-9',
  'Module 3: Skill Building',
  'Subramania Bharati: Poet of Freedom',
  'சுப்பிரமணிய பாரதி (Subramania Bharati), affectionately called பாரதியார் (Bharathiyar) and honored as "Mahakavi" (great poet), was born in 1882 in Ettayapuram, Tamil Nadu, and became one of the most important Tamil poets of the modern era. He lived during a time when India was under British colonial rule, and his poetry became a powerful voice for India\'s freedom movement — he wrote fiery, passionate verses calling for national independence, unity, and courage, and his songs were sung at protests and gatherings across Tamil Nadu. But Bharathiyar wrote about more than just politics: he was also a bold social reformer who used his poetry to speak out against the caste system and to call for the equality and education of women, ideas that were considered very progressive for his time. He wrote beautiful, playful poems for and about children too, such as "சின்னஞ்சிறு கிளியே" (Chinnanchiru Kiliye, "Little Parrot"), which is still taught and loved today. He also composed devotional and patriotic songs about "பாரத மாதா" (Bharat Matha, "Mother India"), blending love of language, faith, and country into his verse. Bharathiyar died young, in 1921, but his poetry continues to inspire Tamil readers, and he is remembered as one of the greatest poets in the history of the Tamil language.',
  [
    {
      questionText: 'What is Subramania Bharati commonly known as, out of respect for his poetry?',
      correctAnswer: 'Bharathiyar / Mahakavi (great poet)',
      type: 'identification',
    },
    {
      questionText: 'What major historical movement did Bharathiyar\'s poetry support?',
      correctAnswer: "India's freedom / independence movement",
      type: 'multiple-choice',
      options: [
        "India's freedom / independence movement",
        'The building of the Brihadeeswarar Temple',
        'The founding of the Tamil Sangams',
        'The Jaffna Kingdom\'s trade expansion',
      ],
    },
    {
      questionText: 'Besides politics, what social causes did Bharathiyar speak out for in his poetry?',
      correctAnswer: 'Ending the caste system and supporting equality and education for women',
      type: 'identification',
    },
    {
      questionText: 'What is the name of Bharathiyar\'s famous poem for children, meaning "Little Parrot"?',
      correctAnswer: 'சின்னஞ்சிறு கிளியே (Chinnanchiru Kiliye)',
      type: 'identification',
    },
  ],
  [
    {
      questionText: 'In which town was Subramania Bharati born, and in what year?',
      correctAnswer: 'Ettayapuram, in 1882',
      type: 'identification',
    },
    {
      questionText: 'What did Bharathiyar mean by "பாரத மாதா" (Bharat Matha) in his patriotic songs?',
      correctAnswer: 'Mother India',
      type: 'multiple-choice',
      options: ['Mother India', 'The Chola Empire', 'The Tamil Sangam', 'The city of Madurai'],
    },
    {
      questionText: 'Why were Bharathiyar\'s views on women\'s education considered progressive for his time?',
      correctAnswer: 'Because he called for equality and education for women when such ideas were not widely accepted yet',
      type: 'identification',
    },
    {
      questionText: 'How were Bharathiyar\'s patriotic songs used during the independence movement?',
      correctAnswer: 'They were sung at protests and public gatherings to inspire unity and courage',
      type: 'identification',
    },
    {
      questionText: 'In what year did Subramania Bharati die?',
      correctAnswer: '1921',
      type: 'multiple-choice',
      options: ['1901', '1921', '1947', '1965'],
    },
  ]
);

// ---------------------------------------------------------------------------
// Apply the swaps
// ---------------------------------------------------------------------------
const swaps = [
  { gradeId: 'grade-3', subjectId: 'tamil-3', levelId: 'tamil-3-level-9', newLevel: aathichudi },
  { gradeId: 'grade-5', subjectId: 'tamil-5', levelId: 'tamil-5-level-4', newLevel: tamilKings },
  { gradeId: 'grade-6', subjectId: 'tamil-6', levelId: 'tamil-6-level-4', newLevel: cholaEmpire },
  { gradeId: 'grade-7', subjectId: 'tamil-7', levelId: 'tamil-7-level-3', newLevel: jaffnaKingdom },
  { gradeId: 'grade-8', subjectId: 'tamil-8', levelId: 'tamil-8-level-9', newLevel: bharathiyar },
];

let applied = 0;
swaps.forEach(({ gradeId, subjectId, levelId, newLevel }) => {
  const grade = dbData.grades.find(g => g.gradeId === gradeId);
  if (!grade) throw new Error(`Grade not found: ${gradeId}`);
  const subject = grade.subjects.find(s => s.subjectId === subjectId);
  if (!subject) throw new Error(`Subject not found: ${subjectId} in ${gradeId}`);
  const idx = subject.levels.findIndex(l => l.levelId === levelId);
  if (idx === -1) throw new Error(`Level not found: ${levelId} in ${subjectId}`);
  subject.levels[idx] = newLevel;
  applied++;
  console.log(`Replaced ${levelId}: "${newLevel.levelName}"`);
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2) + '\n');
console.log(`\nApplied ${applied} Tamil history/literature unit swaps.`);
