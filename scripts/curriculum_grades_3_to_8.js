// Curriculum data for Grades 3-8
// Exported as a module for use by seed_english_full_curriculum.js

const data = {
    // ──────────────────── GRADE 3 ────────────────────
    3: {
        levels: [
            {
                name: "Syllables",
                lesson: "A syllable is a part of a word with one vowel sound. Clap each part! 'Apple' = Ap-ple (2 claps). 'Elephant' = El-e-phant (3 claps). 'Cat' = 1 clap. Splitting words into syllables helps us read and spell big words.",
                quiz: [
                    { q: "How many syllables in 'apple'?", a: "2", d: ["1", "3", "4"] },
                    { q: "How many syllables in 'cat'?", a: "1", d: ["2", "3", "0"] },
                    { q: "How many syllables in 'elephant'?", a: "3", d: ["2", "4", "1"] },
                    { q: "How many syllables in 'banana'?", a: "3", d: ["2", "4", "1"] },
                    { q: "Each syllable has at least one ___.", a: "vowel sound", d: ["consonant", "blend", "digraph"] }
                ],
                exam: [
                    { q: "How many syllables in 'butterfly'?", a: "3", d: ["2", "4", "1"] },
                    { q: "Type the number of syllables in 'computer'.", a: "3", type: "identification" },
                    { q: "Which word has 1 syllable?", a: "dog", d: ["water", "happy", "tiger"] },
                    { q: "How many syllables in 'wonderful'?", a: "3", d: ["2", "4", "1"] },
                    { q: "Which word has the MOST syllables?", a: "caterpillar", d: ["rabbit", "tiger", "monkey"] }
                ]
            },
            {
                name: "Synonyms & Antonyms",
                lesson: "Synonyms are words that mean the SAME thing: big/large, happy/glad, fast/quick. Antonyms are words that mean the OPPOSITE: hot/cold, big/small, happy/sad. Learning these makes your writing more interesting!",
                quiz: [
                    { q: "Which is a synonym for 'big'?", a: "large", d: ["small", "tiny", "short"] },
                    { q: "What is the antonym of 'hot'?", a: "cold", d: ["warm", "boiling", "hot"] },
                    { q: "Which is a synonym for 'happy'?", a: "glad", d: ["sad", "angry", "tired"] },
                    { q: "What is the antonym of 'fast'?", a: "slow", d: ["quick", "rapid", "speedy"] },
                    { q: "Are 'big' and 'small' synonyms or antonyms?", a: "Antonyms", d: ["Synonyms", "Neither", "Both"] }
                ],
                exam: [
                    { q: "Synonym for 'beautiful'?", a: "pretty", d: ["ugly", "plain", "dull"] },
                    { q: "Type an antonym for 'up'.", a: "down", type: "identification" },
                    { q: "Which pair are synonyms?", a: "start / begin", d: ["start / stop", "start / end", "start / finish"] },
                    { q: "Antonym of 'light'?", a: "dark", d: ["bright", "shiny", "clear"] },
                    { q: "Which pair are antonyms?", a: "old / young", d: ["old / aged", "old / ancient", "old / elderly"] }
                ]
            },
            {
                name: "Prefixes",
                lesson: "A prefix is a group of letters added to the BEGINNING of a word to change its meaning. 'un-' means NOT: unhappy = not happy. 're-' means AGAIN: redo = do again. 'pre-' means BEFORE: preview = view before.",
                quiz: [
                    { q: "What does 'unhappy' mean?", a: "Not happy", d: ["Very happy", "Quite happy", "Always happy"] },
                    { q: "The prefix 're-' means ___.", a: "again", d: ["not", "before", "after"] },
                    { q: "What does 'redo' mean?", a: "Do again", d: ["Don't do", "Do before", "Do after"] },
                    { q: "Add 'un-' to 'kind': ___.", a: "unkind", d: ["rekind", "prekind", "diskind"] },
                    { q: "The prefix 'pre-' means ___.", a: "before", d: ["after", "not", "again"] }
                ],
                exam: [
                    { q: "What does 'preview' mean?", a: "View before", d: ["View again", "Not view", "View after"] },
                    { q: "Type a word that means 'not fair' using a prefix.", a: "unfair", type: "identification" },
                    { q: "Which has a prefix?", a: "rewrite", d: ["write", "writing", "writer"] },
                    { q: "'Disagree' has which prefix?", a: "dis-", d: ["un-", "re-", "pre-"] },
                    { q: "What does 'reread' mean?", a: "Read again", d: ["Not read", "Read before", "Stop reading"] }
                ]
            },
            {
                name: "Suffixes",
                lesson: "A suffix is added to the END of a word. '-ful' means FULL OF: hopeful = full of hope. '-less' means WITHOUT: careless = without care. '-er' means ONE WHO: teacher = one who teaches. '-est' means THE MOST: tallest.",
                quiz: [
                    { q: "What does 'hopeful' mean?", a: "Full of hope", d: ["Without hope", "Hope again", "Before hope"] },
                    { q: "The suffix '-less' means ___.", a: "without", d: ["full of", "more", "again"] },
                    { q: "What does 'careless' mean?", a: "Without care", d: ["Full of care", "Care again", "Before care"] },
                    { q: "A 'teacher' is one who ___.", a: "teaches", d: ["learns", "plays", "runs"] },
                    { q: "'-est' means ___.", a: "the most", d: ["without", "full of", "one who"] }
                ],
                exam: [
                    { q: "What does 'fearless' mean?", a: "Without fear", d: ["Full of fear", "Most fear", "Fear again"] },
                    { q: "Type a word that means 'full of joy'.", a: "joyful", type: "identification" },
                    { q: "Which word has a suffix?", a: "slowly", d: ["slow", "snail", "speed"] },
                    { q: "'Tallest' means ___.", a: "The most tall", d: ["Kind of tall", "Not tall", "Tall again"] },
                    { q: "Add '-er' to 'sing': ___.", a: "singer", d: ["singing", "sings", "singest"] }
                ]
            },
            {
                name: "Past, Present, Future Verbs",
                lesson: "Verbs change form to show WHEN something happens. PAST: I walked (already happened). PRESENT: I walk (happening now). FUTURE: I will walk (hasn't happened yet). Past tense often adds '-ed'. Future tense uses 'will'.",
                quiz: [
                    { q: "Which is past tense?", a: "walked", d: ["walk", "will walk", "walking"] },
                    { q: "Which is future tense?", a: "will run", d: ["ran", "runs", "running"] },
                    { q: "'She plays' is what tense?", a: "Present", d: ["Past", "Future", "None"] },
                    { q: "Past tense of 'jump' is ___.", a: "jumped", d: ["will jump", "jumping", "jumps"] },
                    { q: "Future tense uses the word ___.", a: "will", d: ["was", "did", "has"] }
                ],
                exam: [
                    { q: "'They cooked dinner.' What tense?", a: "Past", d: ["Present", "Future", "None"] },
                    { q: "Type the past tense of 'play'.", a: "played", type: "identification" },
                    { q: "Which is present tense?", a: "She sings.", d: ["She sang.", "She will sing.", "She had sung."] },
                    { q: "'We will go tomorrow.' What tense?", a: "Future", d: ["Past", "Present", "None"] },
                    { q: "Change to past: 'I talk' → 'I ___'.", a: "talked", d: ["will talk", "talks", "talking"] }
                ]
            },
            {
                name: "Adverbs",
                lesson: "Adverbs describe HOW an action is done. Many end in '-ly'. 'She ran quickly.' — quickly tells HOW she ran. 'He spoke softly.' — softly tells HOW he spoke. Adverbs can also tell WHEN (yesterday) or WHERE (here).",
                quiz: [
                    { q: "Which word is an adverb?", a: "quickly", d: ["quick", "quicker", "quickest"] },
                    { q: "In 'He ran fast', which is the adverb?", a: "fast", d: ["He", "ran", "the"] },
                    { q: "Adverbs usually describe ___.", a: "verbs", d: ["nouns", "adjectives", "pronouns"] },
                    { q: "Many adverbs end in ___.", a: "-ly", d: ["-ed", "-ing", "-er"] },
                    { q: "Which is an adverb?", a: "slowly", d: ["slow", "snail", "slug"] }
                ],
                exam: [
                    { q: "Find the adverb: 'The bird sang beautifully.'", a: "beautifully", d: ["bird", "sang", "The"] },
                    { q: "Type an adverb meaning 'in a quiet way'.", a: "quietly", type: "identification" },
                    { q: "Which is NOT an adverb?", a: "pretty", d: ["softly", "loudly", "gently"] },
                    { q: "'She arrived yesterday.' Which is the adverb?", a: "yesterday", d: ["She", "arrived", "the"] },
                    { q: "Add an adverb: 'He walked ___.'", a: "slowly", d: ["slow", "big", "happy"] }
                ]
            },
            {
                name: "Compound Words",
                lesson: "A compound word is made by joining TWO words to create a new word with a new meaning. Sun + flower = sunflower. Basket + ball = basketball. Rain + bow = rainbow. Both original words keep their spelling!",
                quiz: [
                    { q: "Sun + flower = ?", a: "sunflower", d: ["sunbird", "sundrop", "sunlight"] },
                    { q: "Which is a compound word?", a: "basketball", d: ["basket", "ball", "playing"] },
                    { q: "Rain + bow = ?", a: "rainbow", d: ["raindrop", "rainfall", "raincoat"] },
                    { q: "How many words make a compound word?", a: "2", d: ["1", "3", "4"] },
                    { q: "Bed + room = ?", a: "bedroom", d: ["bedside", "bedtime", "bedding"] }
                ],
                exam: [
                    { q: "Which is NOT a compound word?", a: "running", d: ["football", "notebook", "airplane"] },
                    { q: "Type the compound word: tooth + brush.", a: "toothbrush", type: "identification" },
                    { q: "Break this compound word: 'moonlight'.", a: "moon + light", d: ["moo + night", "moon + lit", "mo + onlight"] },
                    { q: "Star + fish = ?", a: "starfish", d: ["stardust", "starlight", "starship"] },
                    { q: "Which is a compound word?", a: "cupcake", d: ["baking", "frosting", "mixing"] }
                ]
            },
            {
                name: "Reading Comprehension 2",
                lesson: "Good readers find the MAIN IDEA — what the whole passage is mostly about. They also find SUPPORTING DETAILS — facts that back up the main idea. Example: Main idea: 'Dogs make great pets.' Details: They are loyal, they protect your home, they love to play.",
                quiz: [
                    { q: "The main idea tells us ___.", a: "What the passage is mostly about", d: ["One small fact", "The author's name", "When it was written"] },
                    { q: "Supporting details ___.", a: "Back up the main idea", d: ["Change the topic", "Are not important", "Are always at the end"] },
                    { q: "Read: 'Bees are amazing. They make honey and help flowers grow.' Main idea?", a: "Bees are amazing", d: ["Honey is sweet", "Flowers grow", "Gardens are nice"] },
                    { q: "Read: 'Exercise is important. It keeps your heart strong and body fit.' What is a supporting detail?", a: "It keeps your heart strong", d: ["Exercise is boring", "Food is tasty", "Sleep is nice"] },
                    { q: "Where is the main idea usually found?", a: "At the beginning", d: ["At the end only", "In the middle only", "Never stated"] }
                ],
                exam: [
                    { q: "Read: 'Recycling helps our planet. It reduces waste and saves energy.' What is the main idea?", a: "Recycling helps our planet", d: ["Waste is bad", "Energy is important", "Planets are big"] },
                    { q: "Type what supporting details do.", a: "support the main idea", type: "identification" },
                    { q: "Read: 'Cats are independent pets. They clean themselves and don't need walks.' How many supporting details?", a: "2", d: ["1", "3", "0"] },
                    { q: "A good main idea is ___.", a: "Broad enough to cover the whole text", d: ["A tiny detail", "Very long", "A question"] },
                    { q: "Read: 'Water is essential. Our bodies need it. Plants need it too.' Main idea?", a: "Water is essential", d: ["Plants are green", "Bodies are big", "Rain falls"] }
                ]
            },
            {
                name: "Paragraph Writing",
                lesson: "A paragraph is a group of sentences about ONE topic. It has 3 parts: 1) TOPIC SENTENCE — tells what the paragraph is about. 2) BODY SENTENCES — give details and examples. 3) CLOSING SENTENCE — wraps it up. Always indent the first line!",
                quiz: [
                    { q: "A paragraph is about ___ topic(s).", a: "one", d: ["many", "zero", "two"] },
                    { q: "The topic sentence tells ___.", a: "What the paragraph is about", d: ["A random fact", "The ending", "The author's name"] },
                    { q: "Body sentences give ___.", a: "Details and examples", d: ["The title", "Page numbers", "Nothing useful"] },
                    { q: "A closing sentence ___.", a: "Wraps up the paragraph", d: ["Starts a new topic", "Asks a question", "Gives a title"] },
                    { q: "The first line of a paragraph should be ___.", a: "Indented", d: ["Underlined", "Bold", "Red"] }
                ],
                exam: [
                    { q: "How many parts does a basic paragraph have?", a: "3", d: ["2", "4", "5"] },
                    { q: "Type the name of the sentence that starts a paragraph.", a: "topic sentence", type: "identification" },
                    { q: "Which is a good topic sentence?", a: "Dogs make wonderful pets.", d: ["Woof.", "I had cereal.", "The end."] },
                    { q: "Body sentences should relate to the ___.", a: "topic sentence", d: ["previous paragraph", "next chapter", "title page"] },
                    { q: "A paragraph should NOT ___.", a: "Jump between unrelated topics", d: ["Have details", "Have a closing", "Be indented"] }
                ]
            },
            {
                name: "Poetry Basics",
                lesson: "Poetry uses words in creative ways! Poems can RHYME — when end words sound alike (cat/hat). A RHYME SCHEME labels the pattern with letters: AABB means line 1 rhymes with 2, line 3 with 4. FREE VERSE poems don't rhyme but still create images and feelings.",
                quiz: [
                    { q: "What is it called when words at the end of lines sound alike?", a: "Rhyme", d: ["Rhythm", "Verse", "Stanza"] },
                    { q: "In AABB rhyme scheme, which lines rhyme?", a: "1 with 2, 3 with 4", d: ["1 with 3, 2 with 4", "All lines", "No lines"] },
                    { q: "A poem that doesn't rhyme is called ___.", a: "Free verse", d: ["Broken verse", "Lost verse", "Empty verse"] },
                    { q: "A group of lines in a poem is called a ___.", a: "Stanza", d: ["Paragraph", "Chapter", "Section"] },
                    { q: "Poetry uses words in ___ ways.", a: "creative", d: ["boring", "normal", "exact"] }
                ],
                exam: [
                    { q: "What rhyme scheme is this: cat/hat, dog/log?", a: "AABB", d: ["ABAB", "ABBA", "ABCD"] },
                    { q: "Type the name for a poem with no rhyme.", a: "free verse", type: "identification" },
                    { q: "Which pair could end two rhyming lines?", a: "moon / June", d: ["moon / star", "moon / sun", "moon / cloud"] },
                    { q: "ABAB means lines ___ rhyme together.", a: "1 with 3, and 2 with 4", d: ["1 with 2, and 3 with 4", "All of them", "None of them"] },
                    { q: "Poetry often creates ___.", a: "vivid images and feelings", d: ["math problems", "science experiments", "cooking recipes"] }
                ]
            }
        ]
    },

    // ──────────────────── GRADE 4 ────────────────────
    4: {
        levels: [
            {
                name: "Homophones",
                lesson: "Homophones are words that SOUND the same but have DIFFERENT meanings and spellings. 'there' (a place), 'their' (belonging to them), 'they're' (they are). 'to' (direction), 'too' (also/very), 'two' (the number 2).",
                quiz: [
                    { q: "'___ going to the park.' (they are)", a: "They're", d: ["There", "Their", "Thier"] },
                    { q: "'I have ___ cats.' (the number)", a: "two", d: ["to", "too", "tow"] },
                    { q: "'That is ___ house.' (belonging to them)", a: "their", d: ["there", "they're", "thier"] },
                    { q: "'I want to go ___.' (also)", a: "too", d: ["to", "two", "tow"] },
                    { q: "Homophones sound ___ but are spelled ___.", a: "the same / differently", d: ["different / the same", "the same / the same", "different / differently"] }
                ],
                exam: [
                    { q: "'Put it over ___.' (that place)", a: "there", d: ["their", "they're", "thier"] },
                    { q: "Type the correct homophone: 'I ___ a bear!' (past tense of see)", a: "saw", type: "identification" },
                    { q: "Which is correct: 'The ___ is shining.'?", a: "sun", d: ["son", "sunn", "sone"] },
                    { q: "'I ___ the answer.' (understand)", a: "know", d: ["no", "now", "noe"] },
                    { q: "'She ___ a letter.' (past of write)", a: "wrote", d: ["right", "write", "rite"] }
                ]
            },
            {
                name: "Subject and Predicate",
                lesson: "Every sentence has two parts. The SUBJECT tells WHO or WHAT the sentence is about. The PREDICATE tells what the subject DOES or IS. 'The tall boy | kicked the ball.' Subject: The tall boy. Predicate: kicked the ball.",
                quiz: [
                    { q: "The subject tells us ___.", a: "Who or what the sentence is about", d: ["When it happened", "The action", "The ending"] },
                    { q: "The predicate tells us ___.", a: "What the subject does", d: ["Who did it", "The title", "The setting"] },
                    { q: "In 'The cat sleeps.', what is the subject?", a: "The cat", d: ["sleeps", "The", "cat sleeps"] },
                    { q: "In 'She runs fast.', what is the predicate?", a: "runs fast", d: ["She", "fast", "She runs"] },
                    { q: "Every sentence needs both a ___ and a ___.", a: "subject and predicate", d: ["noun and adjective", "verb and adverb", "prefix and suffix"] }
                ],
                exam: [
                    { q: "In 'My little brother plays drums.', what is the subject?", a: "My little brother", d: ["plays drums", "drums", "little"] },
                    { q: "Type the predicate in: 'Birds fly south.'", a: "fly south", type: "identification" },
                    { q: "In 'The red car stopped suddenly.', what is the predicate?", a: "stopped suddenly", d: ["The red car", "red car", "The"] },
                    { q: "Which is a complete subject?", a: "The friendly dog", d: ["barked loudly", "ran quickly", "jumped high"] },
                    { q: "A predicate always contains a ___.", a: "verb", d: ["noun", "adjective", "pronoun"] }
                ]
            },
            {
                name: "Prepositions",
                lesson: "Prepositions are small words that show WHERE, WHEN, or HOW things relate. WHERE: in, on, under, behind, between. WHEN: before, after, during. 'The cat is UNDER the table.' 'We eat BEFORE school.' 'She hid BEHIND the door.'",
                quiz: [
                    { q: "Which is a preposition?", a: "under", d: ["happy", "run", "blue"] },
                    { q: "'The book is ___ the shelf.' (location)", a: "on", d: ["run", "big", "eat"] },
                    { q: "'We play ___ lunch.' (time)", a: "after", d: ["big", "run", "cat"] },
                    { q: "Prepositions show ___.", a: "Where, when, or how things relate", d: ["Colors", "Names", "Numbers"] },
                    { q: "Which is a preposition: 'The cat is between the boxes'?", a: "between", d: ["cat", "boxes", "is"] }
                ],
                exam: [
                    { q: "Find the preposition: 'She looked behind the curtain.'", a: "behind", d: ["She", "looked", "curtain"] },
                    { q: "Type a preposition meaning 'not above'.", a: "under", type: "identification" },
                    { q: "Which sentence uses a preposition correctly?", a: "The bird sat on the branch.", d: ["The bird on sat branch.", "On the bird branch sat.", "Sat bird on the branch."] },
                    { q: "'During the movie' — 'during' shows ___.", a: "when", d: ["where", "how many", "whose"] },
                    { q: "How many prepositions: 'The ball rolled under the table and behind the chair.'?", a: "2", d: ["1", "3", "0"] }
                ]
            },
            {
                name: "Conjunctions",
                lesson: "Conjunctions are joining words. They connect words, phrases, or sentences. The main ones are AND, BUT, OR. 'I like cats AND dogs.' (adds info) 'I like cats BUT not dogs.' (shows contrast) 'Do you want tea OR coffee?' (shows choice).",
                quiz: [
                    { q: "Which is a conjunction?", a: "and", d: ["big", "run", "happy"] },
                    { q: "'I like pizza ___ pasta.' (both)", a: "and", d: ["but", "or", "so"] },
                    { q: "'She is smart ___ kind.' (adds info)", a: "and", d: ["but", "or", "nor"] },
                    { q: "'I tried ___ I failed.' (contrast)", a: "but", d: ["and", "or", "so"] },
                    { q: "'Tea ___ coffee?' (choice)", a: "or", d: ["and", "but", "so"] }
                ],
                exam: [
                    { q: "What does 'but' show?", a: "Contrast", d: ["Addition", "Choice", "Time"] },
                    { q: "Type the conjunction that shows choice.", a: "or", type: "identification" },
                    { q: "Fill in: 'I was tired ___ I kept working.'", a: "but", d: ["and", "or", "to"] },
                    { q: "How many conjunctions: 'I like red and blue but not green.'?", a: "2", d: ["1", "3", "0"] },
                    { q: "Which joins two sentences?", a: "but", d: ["the", "very", "quickly"] }
                ]
            },
            {
                name: "Fact vs. Opinion",
                lesson: "A FACT is something that can be PROVEN true. 'Water boils at 100°C.' An OPINION is someone's personal BELIEF or feeling. 'Chocolate is the best flavor.' Facts use evidence. Opinions use words like 'I think', 'best', 'worst', 'should'.",
                quiz: [
                    { q: "Which is a FACT?", a: "The Earth orbits the Sun.", d: ["Summer is the best season.", "Dogs are better than cats.", "Red is the prettiest color."] },
                    { q: "Which is an OPINION?", a: "Pizza is the best food.", d: ["Water is wet.", "Fish live in water.", "The sun rises in the east."] },
                    { q: "Facts can be ___.", a: "proven true", d: ["only guessed", "changed easily", "always opinions"] },
                    { q: "Which word signals an opinion?", a: "should", d: ["because", "therefore", "however"] },
                    { q: "Is 'Ice is cold' a fact or opinion?", a: "Fact", d: ["Opinion", "Neither", "Both"] }
                ],
                exam: [
                    { q: "Which is a fact?", a: "There are 7 continents.", d: ["Europe is the best continent.", "Africa is beautiful.", "Asia is boring."] },
                    { q: "Type whether this is fact or opinion: 'Math is hard.'", a: "opinion", type: "identification" },
                    { q: "Facts use ___.", a: "evidence and proof", d: ["feelings only", "guesses only", "wishes only"] },
                    { q: "Which signal word suggests an opinion?", a: "I believe", d: ["According to data", "Research shows", "Studies prove"] },
                    { q: "Is '2 + 2 = 4' a fact or opinion?", a: "Fact", d: ["Opinion", "Neither", "Both"] }
                ]
            },
            {
                name: "Context Clues",
                lesson: "When you see a word you don't know, look at the words AROUND it for hints! These are context clues. 'The dog was famished, so it ate all the food quickly.' What does 'famished' mean? The clue 'ate all the food quickly' tells us it means very hungry!",
                quiz: [
                    { q: "'The room was frigid, so we put on coats.' Frigid means ___.", a: "very cold", d: ["very hot", "very big", "very dark"] },
                    { q: "Context clues are found ___.", a: "In the words around the unknown word", d: ["In a different book", "Only in dictionaries", "Nowhere"] },
                    { q: "'She was elated when she won.' Elated means ___.", a: "very happy", d: ["very sad", "very tired", "very angry"] },
                    { q: "'The enormous elephant couldn't fit.' Enormous means ___.", a: "very large", d: ["very small", "very fast", "very old"] },
                    { q: "Using context clues helps you ___.", a: "Figure out unknown words", d: ["Spell better", "Write faster", "Count numbers"] }
                ],
                exam: [
                    { q: "'He was so exhausted that he fell asleep immediately.' Exhausted means ___.", a: "very tired", d: ["very excited", "very hungry", "very angry"] },
                    { q: "Type what 'ravenous' might mean in: 'The ravenous boy ate three plates of food.'", a: "very hungry", type: "identification" },
                    { q: "'The luminous stars brightened the night.' Luminous means ___.", a: "bright/shining", d: ["dark", "small", "slow"] },
                    { q: "'She was reluctant to jump in the cold pool.' Reluctant means ___.", a: "unwilling/hesitant", d: ["eager", "happy", "fast"] },
                    { q: "The BEST context clues are usually ___.", a: "In the same sentence or nearby sentences", d: ["On a different page", "In the title only", "In the author bio"] }
                ]
            },
            {
                name: "Idioms",
                lesson: "Idioms are phrases that DON'T mean what they literally say. 'It's raining cats and dogs' means it's raining very hard (not actual animals!). 'Piece of cake' means something is easy. 'Break a leg' means good luck! You have to learn what each idiom means.",
                quiz: [
                    { q: "'It's raining cats and dogs' means ___.", a: "It's raining very hard", d: ["Animals are falling", "Pets are outside", "A storm of animals"] },
                    { q: "'That test was a piece of cake' means ___.", a: "It was easy", d: ["It tasted good", "It was sweet", "It was round"] },
                    { q: "'Break a leg!' means ___.", a: "Good luck!", d: ["Be careful!", "Go to the doctor!", "Fall down!"] },
                    { q: "An idiom's meaning is ___.", a: "Different from the literal words", d: ["Exactly what the words say", "Always about animals", "Never used"] },
                    { q: "'Under the weather' means ___.", a: "Feeling sick", d: ["Standing in rain", "Very cold", "Under a cloud"] }
                ],
                exam: [
                    { q: "'Costs an arm and a leg' means ___.", a: "Very expensive", d: ["Hurts a lot", "Needs surgery", "Is broken"] },
                    { q: "Type what 'hit the books' means.", a: "study hard", type: "identification" },
                    { q: "'Let the cat out of the bag' means ___.", a: "Revealed a secret", d: ["Freed a cat", "Opened a bag", "Went shopping"] },
                    { q: "'Bite the bullet' means ___.", a: "Face a hard situation bravely", d: ["Eat metal", "Go to dentist", "Chew food"] },
                    { q: "'Spill the beans' means ___.", a: "Tell a secret", d: ["Make a mess", "Cook dinner", "Drop food"] }
                ]
            },
            {
                name: "Persuasive Writing Intro",
                lesson: "Persuasive writing tries to CONVINCE the reader to agree with you. Structure: 1) State your OPINION clearly. 2) Give REASONS why you believe this. 3) Use EXAMPLES to support your reasons. 4) End with a strong CONCLUSION. Use words like 'I believe', 'because', 'for example'.",
                quiz: [
                    { q: "Persuasive writing tries to ___.", a: "Convince the reader", d: ["Tell a story", "Describe a place", "List facts only"] },
                    { q: "A persuasive essay starts with ___.", a: "Your opinion", d: ["A random fact", "A question", "The ending"] },
                    { q: "Which word helps persuade?", a: "because", d: ["yesterday", "purple", "running"] },
                    { q: "Reasons should be supported by ___.", a: "examples", d: ["colors", "pictures only", "nothing"] },
                    { q: "The last part of a persuasive essay is ___.", a: "a strong conclusion", d: ["a new topic", "a question", "a joke"] }
                ],
                exam: [
                    { q: "Which is the best opinion statement?", a: "Schools should have longer recess.", d: ["Recess exists.", "Kids play.", "The sun shines."] },
                    { q: "Type a linking word used in persuasive writing.", a: "because", type: "identification" },
                    { q: "Which is a reason, not an opinion?", a: "Exercise makes your heart stronger.", d: ["Exercise is fun.", "I love exercise.", "Exercise is the best."] },
                    { q: "Good persuasive writing includes ___.", a: "Opinion, reasons, and examples", d: ["Only opinions", "Only facts", "Only stories"] },
                    { q: "A conclusion should ___.", a: "Restate your opinion strongly", d: ["Introduce a new topic", "Ask many questions", "Say nothing"] }
                ]
            },
            {
                name: "Informational Texts",
                lesson: "Informational texts teach us FACTS about the real world. They use special features: HEADINGS organize sections, BOLD WORDS highlight important terms, a GLOSSARY defines difficult words, an INDEX helps you find topics, and CAPTIONS explain pictures.",
                quiz: [
                    { q: "Informational texts are about ___.", a: "Real facts", d: ["Made-up stories", "Fairy tales", "Dreams"] },
                    { q: "A glossary gives ___.", a: "Definitions of words", d: ["Page numbers", "Author info", "Jokes"] },
                    { q: "An index helps you ___.", a: "Find specific topics", d: ["Read stories", "Draw pictures", "Write poems"] },
                    { q: "Bold words usually show ___.", a: "Important terms", d: ["Boring words", "Common words", "Small words"] },
                    { q: "Captions are found ___.", a: "Under or near pictures", d: ["At the very end", "On the cover", "In the index"] }
                ],
                exam: [
                    { q: "Which text feature organizes a page into sections?", a: "Headings", d: ["Footnotes", "Captions", "Glossary"] },
                    { q: "Type the text feature that explains a photo.", a: "caption", type: "identification" },
                    { q: "Where would you look to find what page 'volcanoes' is on?", a: "Index", d: ["Glossary", "Heading", "Caption"] },
                    { q: "Where would you find the meaning of 'photosynthesis'?", a: "Glossary", d: ["Index", "Caption", "Title"] },
                    { q: "Informational texts are also called ___.", a: "Nonfiction", d: ["Fiction", "Fantasy", "Fairy tales"] }
                ]
            },
            {
                name: "Dictionary Skills",
                lesson: "A dictionary lists words in ALPHABETICAL ORDER with their meanings. GUIDE WORDS at the top of each page show the first and last words on that page. Many words have MULTIPLE MEANINGS — 'bat' can be an animal or something you hit a ball with. Look at the sentence to decide which meaning fits!",
                quiz: [
                    { q: "Words in a dictionary are in ___ order.", a: "alphabetical", d: ["random", "size", "reverse"] },
                    { q: "Guide words show ___.", a: "The first and last words on a page", d: ["The longest words", "The hardest words", "Every word"] },
                    { q: "The word 'bat' has ___ meanings.", a: "more than one", d: ["exactly one", "zero", "only animal meaning"] },
                    { q: "Which word comes first in the dictionary?", a: "apple", d: ["banana", "cherry", "date"] },
                    { q: "To find the right meaning of a word, look at ___.", a: "the sentence it's used in", d: ["the cover", "only the first meaning", "the last page"] }
                ],
                exam: [
                    { q: "Would 'cat' be on a page with guide words 'cabin — cut'?", a: "Yes", d: ["No", "Maybe", "Only sometimes"] },
                    { q: "Type what you look at to find the range of words on a dictionary page.", a: "guide words", type: "identification" },
                    { q: "Which comes first in a dictionary?", a: "elephant", d: ["giraffe", "hippo", "lion"] },
                    { q: "'Ring' can mean a piece of jewelry or ___.", a: "A sound a phone makes", d: ["A type of food", "A color", "A planet"] },
                    { q: "If guide words are 'map — mix', which word is on that page?", a: "milk", d: ["low", "nose", "air"] }
                ]
            }
        ]
    },
    // ──────────────────── GRADE 5 ────────────────────
    5: {
        levels: [
            {
                name: "Similes and Metaphors", lesson: "A SIMILE compares two things using 'like' or 'as': 'She is as brave as a lion.' A METAPHOR says something IS something else: 'He is a shining star.' Both create vivid pictures in the reader's mind!", quiz: [
                    { q: "Which is a simile?", a: "She runs like the wind.", d: ["She is a star.", "The wind blew.", "She runs fast."] },
                    { q: "Which is a metaphor?", a: "He is a rock.", d: ["He is like a rock.", "He is strong.", "He stood still."] },
                    { q: "Similes use the words ___ or ___.", a: "like or as", d: ["is or are", "the or a", "but or and"] },
                    { q: "'The classroom was a zoo' is a ___.", a: "metaphor", d: ["simile", "fact", "idiom"] },
                    { q: "'As cold as ice' is a ___.", a: "simile", d: ["metaphor", "idiom", "fact"] }
                ], exam: [
                    { q: "What does 'Time is money' mean?", a: "Time is valuable", d: ["Time is coins", "Clocks cost money", "Money tells time"] },
                    { q: "Type whether this is simile or metaphor: 'Her smile was like sunshine.'", a: "simile", type: "identification" },
                    { q: "'The stars are diamonds in the sky' is a ___.", a: "metaphor", d: ["simile", "fact", "adjective"] },
                    { q: "Both similes and metaphors are types of ___.", a: "figurative language", d: ["grammar rules", "punctuation", "spelling"] },
                    { q: "Which is a simile?", a: "The baby's skin is as soft as silk.", d: ["The baby is an angel.", "The baby cried.", "The baby slept."] }
                ]
            },
            {
                name: "Complex Sentences", lesson: "A COMPLEX SENTENCE has an independent clause (makes sense alone) and a dependent clause (needs the main clause). Dependent clauses start with words like: because, although, when, if, before, after. 'Because it rained, we stayed inside.'", quiz: [
                    { q: "Which starts a dependent clause?", a: "because", d: ["the", "she", "big"] },
                    { q: "An independent clause can ___.", a: "stand alone as a sentence", d: ["never be a sentence", "only be short", "never have a verb"] },
                    { q: "'When she arrived, we cheered.' Which is the dependent clause?", a: "When she arrived", d: ["we cheered", "she arrived we cheered", "arrived"] },
                    { q: "A dependent clause ___ stand alone.", a: "cannot", d: ["can always", "sometimes can", "must"] },
                    { q: "Which is a complex sentence?", a: "Although it was cold, we went outside.", d: ["We went outside.", "It was cold.", "Cold and outside."] }
                ], exam: [
                    { q: "Identify the dependent clause: 'I studied hard because I wanted to pass.'", a: "because I wanted to pass", d: ["I studied hard", "I wanted", "to pass"] },
                    { q: "Type a word that starts a dependent clause.", a: "because", type: "identification" },
                    { q: "Which is NOT a subordinating conjunction?", a: "and", d: ["because", "although", "when"] },
                    { q: "A complex sentence has ___ clause(s).", a: "at least two", d: ["only one", "exactly three", "no"] },
                    { q: "Combine: 'She was tired. She kept working.' using 'although'.", a: "Although she was tired, she kept working.", d: ["She was tired although.", "Although kept working.", "Tired she although."] }
                ]
            },
            {
                name: "Pronoun-Antecedent Agreement", lesson: "The ANTECEDENT is the noun a pronoun replaces. They must AGREE in number and gender. 'Mary lost HER book.' (Mary=she, so 'her'). 'The boys lost THEIR ball.' (boys=they, so 'their'). Don't mix singular/plural!", quiz: [
                    { q: "'Anna forgot ___ lunch.' Which pronoun?", a: "her", d: ["his", "their", "its"] },
                    { q: "The antecedent is ___.", a: "the noun the pronoun refers to", d: ["the verb", "the adjective", "the sentence"] },
                    { q: "'The dogs wagged ___ tails.'", a: "their", d: ["his", "her", "its"] },
                    { q: "'Tom and I love ___ school.'", a: "our", d: ["his", "their", "my"] },
                    { q: "Pronouns must agree in ___ and ___.", a: "number and gender", d: ["color and size", "speed and time", "sound and shape"] }
                ], exam: [
                    { q: "'Each student must bring ___ pencil.'", a: "his or her", d: ["their", "our", "my"] },
                    { q: "Type the pronoun for: 'The cat licked ___ paw.'", a: "its", type: "identification" },
                    { q: "Which is correct?", a: "Sara ate her lunch.", d: ["Sara ate his lunch.", "Sara ate their lunch.", "Sara ate our lunch."] },
                    { q: "'The team won ___ game.'", a: "its", d: ["his", "her", "their"] },
                    { q: "Find the error: 'Everyone should bring their book.'", a: "their should be his or her", d: ["No error", "Everyone is wrong", "book is wrong"] }
                ]
            },
            {
                name: "Greek and Latin Roots", lesson: "Many English words come from Greek and Latin roots. 'aqua' = water (aquarium). 'bio' = life (biology). 'tele' = far (telephone). 'port' = carry (transport). Knowing roots helps you figure out new words!", quiz: [
                    { q: "'Aqua' means ___.", a: "water", d: ["fire", "earth", "air"] },
                    { q: "'Bio' means ___.", a: "life", d: ["book", "star", "stone"] },
                    { q: "What does 'telephone' relate to?", a: "Far + sound", d: ["Near + light", "Big + small", "Old + new"] },
                    { q: "'Port' means ___.", a: "carry", d: ["door", "ship", "wall"] },
                    { q: "An aquarium holds ___.", a: "water and fish", d: ["books", "fire", "air"] }
                ], exam: [
                    { q: "'Geo' means ___.", a: "earth", d: ["water", "fire", "sky"] },
                    { q: "Type what root means 'to see' (as in 'visible').", a: "vis", type: "identification" },
                    { q: "'Microscope' combines 'micro' (small) and 'scope' (___)?", a: "to look", d: ["to hear", "to taste", "to touch"] },
                    { q: "If 'auto' means self, 'autobiography' means ___.", a: "writing about yourself", d: ["writing about others", "reading a book", "painting a picture"] },
                    { q: "'Graph' means ___.", a: "write/draw", d: ["read", "run", "sleep"] }
                ]
            },
            {
                name: "Point of View", lesson: "FIRST PERSON: The narrator is a character (uses I, me, we). SECOND PERSON: Speaks directly to you (uses you). THIRD PERSON: The narrator is outside the story (uses he, she, they). Point of view affects how we experience the story!", quiz: [
                    { q: "First person uses which pronouns?", a: "I, me, we", d: ["he, she", "you, your", "they, them"] },
                    { q: "'She walked to school.' What point of view?", a: "Third person", d: ["First person", "Second person", "No person"] },
                    { q: "'I love chocolate.' What point of view?", a: "First person", d: ["Second person", "Third person", "No person"] },
                    { q: "Second person uses ___.", a: "you", d: ["I", "he", "they"] },
                    { q: "In third person, the narrator is ___.", a: "outside the story", d: ["the main character", "the reader", "the author always"] }
                ], exam: [
                    { q: "'You open the door and step inside.' What POV?", a: "Second person", d: ["First person", "Third person", "Fourth person"] },
                    { q: "Type the point of view that uses 'I' and 'me'.", a: "first person", type: "identification" },
                    { q: "Which is third person?", a: "They went to the park.", d: ["I went to the park.", "You went to the park.", "We went to the park."] },
                    { q: "Why does point of view matter?", a: "It shapes how we experience the story", d: ["It doesn't matter", "It changes spelling", "It adds punctuation"] },
                    { q: "'We explored the cave.' What POV?", a: "First person", d: ["Second person", "Third person", "None"] }
                ]
            },
            {
                name: "Cause and Effect", lesson: "CAUSE is WHY something happens. EFFECT is WHAT happens as a result. 'Because it rained (cause), the game was canceled (effect).' Signal words: because, so, therefore, as a result, since, due to.", quiz: [
                    { q: "The cause answers ___.", a: "Why something happened", d: ["What happened", "When it happened", "Who did it"] },
                    { q: "The effect is ___.", a: "What happened as a result", d: ["Why it happened", "Who caused it", "Where it happened"] },
                    { q: "'She studied hard, so she passed.' What is the effect?", a: "She passed", d: ["She studied hard", "She was smart", "She went home"] },
                    { q: "Which is a cause-effect signal word?", a: "because", d: ["the", "very", "pretty"] },
                    { q: "'The ice melted because it was hot.' What is the cause?", a: "It was hot", d: ["The ice melted", "It was cold", "The sun set"] }
                ], exam: [
                    { q: "'Due to the storm, school was closed.' What is the cause?", a: "The storm", d: ["School was closed", "Students stayed home", "It was Tuesday"] },
                    { q: "Type a signal word for cause and effect.", a: "therefore", type: "identification" },
                    { q: "'He forgot his umbrella; as a result, he got wet.' Effect?", a: "He got wet", d: ["He forgot his umbrella", "It rained", "He left home"] },
                    { q: "One cause can have ___ effect(s).", a: "multiple", d: ["only one", "zero", "exactly two"] },
                    { q: "Identify the cause: 'The flowers bloomed because spring arrived.'", a: "Spring arrived", d: ["The flowers bloomed", "It was warm", "Rain fell"] }
                ]
            },
            {
                name: "Narrative Writing", lesson: "A narrative tells a STORY with characters, setting, and plot. Include: 1) An engaging BEGINNING that hooks the reader. 2) A MIDDLE with rising action and conflict. 3) A CLIMAX (most exciting part). 4) An END with resolution. Use descriptive details!", quiz: [
                    { q: "A narrative is a ___.", a: "story", d: ["list", "chart", "recipe"] },
                    { q: "The climax is ___.", a: "the most exciting part", d: ["the beginning", "the end", "the title"] },
                    { q: "Which is NOT a narrative element?", a: "equation", d: ["characters", "setting", "plot"] },
                    { q: "The beginning should ___.", a: "hook the reader", d: ["end the story", "list facts", "give answers"] },
                    { q: "Resolution happens at the ___.", a: "end", d: ["beginning", "middle", "title"] }
                ], exam: [
                    { q: "Rising action leads to the ___.", a: "climax", d: ["beginning", "title", "resolution"] },
                    { q: "Type the part of a story where the problem is introduced.", a: "beginning", type: "identification" },
                    { q: "Good narratives include ___.", a: "descriptive details", d: ["math formulas", "data tables", "pie charts"] },
                    { q: "Conflict in a story is ___.", a: "a problem the character faces", d: ["the setting", "the title", "the author's name"] },
                    { q: "A story's setting includes ___.", a: "where and when it takes place", d: ["only the title", "the page number", "the font size"] }
                ]
            },
            {
                name: "Dialogue Punctuation", lesson: "When characters speak, use QUOTATION MARKS around their words. Put a comma before the quote. Start the spoken words with a capital. End punctuation goes INSIDE the quotes. Example: She said, \"Hello!\" \"I'm ready,\" he replied.", quiz: [
                    { q: "Spoken words go inside ___.", a: "quotation marks", d: ["parentheses", "brackets", "dashes"] },
                    { q: "Which is punctuated correctly?", a: "She said, \"Let's go!\"", d: ["She said Let's go!", "She said, Let's go!", "\"She said, Let's go!\""] },
                    { q: "End punctuation goes ___ the quotation marks.", a: "inside", d: ["outside", "after", "never used"] },
                    { q: "Before a quote, you use a ___.", a: "comma", d: ["period", "semicolon", "dash"] },
                    { q: "The first word inside quotes should be ___.", a: "capitalized", d: ["lowercase", "bold", "underlined"] }
                ], exam: [
                    { q: "Which is correct?", a: "\"I love pizza,\" said Tom.", d: ["I love pizza, said Tom.", "\"I love pizza\" said Tom.", "\"I love pizza, said Tom.\""] },
                    { q: "Type the punctuation mark that surrounds spoken words.", a: "quotation marks", type: "identification" },
                    { q: "Fix: 'She whispered I'm scared.'", a: "She whispered, \"I'm scared.\"", d: ["She whispered I'm scared.", "\"She whispered I'm scared.\"", "She \"whispered\" I'm scared."] },
                    { q: "In dialogue, each new speaker gets a ___.", a: "new paragraph", d: ["new chapter", "new page", "new book"] },
                    { q: "Which is formatted correctly?", a: "\"Wait!\" she cried.", d: ["Wait! she cried.", "\"Wait!\" She Cried.", "Wait she cried!"] }
                ]
            },
            {
                name: "Theme", lesson: "The THEME is the big message or lesson a story teaches. It's NOT the topic — it's what the author wants you to LEARN. Topic: friendship. Theme: 'True friends stand by you in tough times.' Common themes: courage, kindness, honesty, perseverance.", quiz: [
                    { q: "Theme is the ___.", a: "lesson or message of a story", d: ["main character", "setting", "title"] },
                    { q: "Theme is different from topic because ___.", a: "theme is the lesson, topic is the subject", d: ["they are the same", "topic is longer", "theme is shorter"] },
                    { q: "Which is a theme?", a: "Hard work leads to success.", d: ["A boy and a dog.", "Summer vacation.", "A red house."] },
                    { q: "Which is a common theme?", a: "Be kind to others.", d: ["Tuesday.", "School.", "Pizza."] },
                    { q: "A story about a scared child who tries anyway teaches ___.", a: "Courage", d: ["Cooking", "Math", "Geography"] }
                ], exam: [
                    { q: "A story where a liar gets caught teaches ___.", a: "Honesty is important.", d: ["Lying is easy.", "Running is fun.", "Food is good."] },
                    { q: "Type a one-word theme about never giving up.", a: "perseverance", type: "identification" },
                    { q: "Which is a topic, NOT a theme?", a: "friendship", d: ["True friends help each other.", "Honesty is the best policy.", "Kindness changes lives."] },
                    { q: "Themes are usually ___.", a: "universal truths about life", d: ["only about animals", "only in fairy tales", "only in long books"] },
                    { q: "To find the theme, ask ___.", a: "What lesson does this story teach?", d: ["What is the title?", "Who is the author?", "How many pages?"] }
                ]
            },
            {
                name: "Speech & Pronunciation", lesson: "Good public speaking needs: VOLUME (loud enough to hear), PACE (not too fast or slow), EYE CONTACT (look at your audience), CLEAR PRONUNCIATION (say words properly), POSTURE (stand tall). Practice makes perfect!", quiz: [
                    { q: "Volume means speaking ___.", a: "loud enough to be heard", d: ["as quietly as possible", "only to yourself", "while whispering"] },
                    { q: "Pace refers to ___.", a: "how fast or slow you speak", d: ["what you wear", "where you stand", "who you talk to"] },
                    { q: "Eye contact means ___.", a: "looking at your audience", d: ["closing your eyes", "looking at the floor", "reading your notes only"] },
                    { q: "Good pronunciation means ___.", a: "saying words clearly and correctly", d: ["speaking very fast", "mumbling", "whispering"] },
                    { q: "Good posture while speaking means ___.", a: "standing tall and confident", d: ["slouching", "sitting down", "leaning on the wall"] }
                ], exam: [
                    { q: "If your audience can't hear you, you need more ___.", a: "volume", d: ["speed", "notes", "words"] },
                    { q: "Type what you should maintain with your audience while speaking.", a: "eye contact", type: "identification" },
                    { q: "Speaking too fast makes it hard to ___.", a: "understand you", d: ["see you", "find you", "hear music"] },
                    { q: "Before a speech, you should ___.", a: "practice", d: ["skip preparation", "not think about it", "forget your topic"] },
                    { q: "Which helps reduce nervousness?", a: "Deep breathing and practice", d: ["Avoiding preparation", "Not caring", "Speaking faster"] }
                ]
            }
        ]
    },

    // ──────────────────── GRADE 6 ────────────────────
    6: {
        levels: [
            {
                name: "Types of Poetry", lesson: "HAIKU: 3 lines (5-7-5 syllables) about nature. LIMERICK: 5 lines, funny, AABBA rhyme. SONNET: 14 lines, usually about love. ACROSTIC: first letters spell a word. Each type has unique rules and feelings!", quiz: [
                    { q: "A haiku has ___ lines.", a: "3", d: ["5", "7", "14"] },
                    { q: "Haiku syllable pattern is ___.", a: "5-7-5", d: ["7-5-7", "3-3-3", "10-10-10"] },
                    { q: "A limerick is usually ___.", a: "funny", d: ["sad", "scary", "boring"] },
                    { q: "A sonnet has ___ lines.", a: "14", d: ["3", "5", "10"] },
                    { q: "In an acrostic poem, the first letters spell ___.", a: "a word", d: ["a number", "nothing", "a sentence"] }
                ], exam: [
                    { q: "Which poem type is about nature with strict syllable rules?", a: "Haiku", d: ["Limerick", "Sonnet", "Epic"] },
                    { q: "Type the rhyme scheme of a limerick.", a: "AABBA", type: "identification" },
                    { q: "Sonnets are often about ___.", a: "love", d: ["cooking", "math", "sports"] },
                    { q: "How many syllables in the first line of a haiku?", a: "5", d: ["7", "3", "10"] },
                    { q: "Which is the longest poem type listed?", a: "Sonnet (14 lines)", d: ["Haiku (3 lines)", "Limerick (5 lines)", "Acrostic (varies)"] }
                ]
            },
            {
                name: "Personification", lesson: "Personification gives HUMAN qualities to non-human things. 'The wind howled.' (wind can't really howl). 'The flowers danced in the breeze.' (flowers don't dance). It makes writing more vivid and engaging!", quiz: [
                    { q: "Personification gives human traits to ___.", a: "non-human things", d: ["only people", "only animals", "only plants"] },
                    { q: "Which is personification?", a: "The stars winked at me.", d: ["The stars are bright.", "I saw stars.", "Stars are far away."] },
                    { q: "'The sun smiled down on us' is ___.", a: "personification", d: ["simile", "metaphor", "fact"] },
                    { q: "'The leaves danced' gives leaves the ability to ___.", a: "dance (a human action)", d: ["grow", "fall", "change color"] },
                    { q: "Why do writers use personification?", a: "To make writing vivid and engaging", d: ["To confuse readers", "To add math", "To shorten text"] }
                ], exam: [
                    { q: "Which is NOT personification?", a: "The dog barked loudly.", d: ["The wind whispered.", "The clock stared at me.", "The waves grabbed the shore."] },
                    { q: "Type the literary device in: 'The thunder roared angrily.'", a: "personification", type: "identification" },
                    { q: "'Lightning danced across the sky.' What human action?", a: "danced", d: ["sky", "lightning", "across"] },
                    { q: "'The old house groaned.' What is personified?", a: "The house", d: ["The old", "The groaned", "Nothing"] },
                    { q: "Personification is a type of ___.", a: "figurative language", d: ["punctuation", "grammar rule", "spelling rule"] }
                ]
            },
            {
                name: "Active vs. Passive Voice", lesson: "ACTIVE VOICE: The subject DOES the action. 'The dog bit the man.' PASSIVE VOICE: The subject RECEIVES the action. 'The man was bitten by the dog.' Active voice is usually stronger and clearer. Passive uses 'was/were + past participle'.", quiz: [
                    { q: "In active voice, the subject ___.", a: "performs the action", d: ["receives the action", "is missing", "is always last"] },
                    { q: "Which is active voice?", a: "The cat chased the mouse.", d: ["The mouse was chased by the cat.", "The mouse was chased.", "Was chased the mouse."] },
                    { q: "Passive voice is identified by ___.", a: "was/were + past participle", d: ["always being short", "having no subject", "using exclamation marks"] },
                    { q: "Which voice is usually stronger?", a: "Active", d: ["Passive", "Both equal", "Neither"] },
                    { q: "'The cake was eaten by Tom.' What voice?", a: "Passive", d: ["Active", "Neither", "Both"] }
                ], exam: [
                    { q: "Change to active: 'The ball was kicked by the girl.'", a: "The girl kicked the ball.", d: ["The ball kicked the girl.", "Kicked the ball by the girl.", "The girl was kicked."] },
                    { q: "Type the voice of: 'She wrote a poem.'", a: "active", type: "identification" },
                    { q: "Which is passive?", a: "The letter was delivered.", d: ["She delivered the letter.", "He wrote quickly.", "They ran home."] },
                    { q: "Active voice makes writing ___.", a: "direct and strong", d: ["weak and vague", "longer", "harder to read"] },
                    { q: "'The window was broken by the ball.' Change to active.", a: "The ball broke the window.", d: ["The window broke the ball.", "Broken was the window.", "The ball was broken."] }
                ]
            },
            {
                name: "Author's Purpose", lesson: "Every author writes for a reason — their PURPOSE. Remember PIE: PERSUADE (convince you), INFORM (teach facts), ENTERTAIN (amuse you). An ad persuades. A textbook informs. A novel entertains. Some texts do more than one!", quiz: [
                    { q: "PIE stands for ___.", a: "Persuade, Inform, Entertain", d: ["Plan, Invent, Explore", "Practice, Improve, Edit", "Pick, Imagine, Explain"] },
                    { q: "A textbook's purpose is to ___.", a: "inform", d: ["persuade", "entertain", "confuse"] },
                    { q: "An advertisement tries to ___.", a: "persuade", d: ["inform", "entertain", "teach"] },
                    { q: "A funny story's purpose is to ___.", a: "entertain", d: ["persuade", "inform", "test"] },
                    { q: "An author who wants you to buy something is trying to ___.", a: "persuade", d: ["inform", "entertain", "educate"] }
                ], exam: [
                    { q: "A news article's main purpose is to ___.", a: "inform", d: ["persuade", "entertain", "sell"] },
                    { q: "Type the author's purpose when writing jokes.", a: "entertain", type: "identification" },
                    { q: "Which text most likely persuades?", a: "Vote for Sara — she'll improve our school!", d: ["Frogs are amphibians.", "Once upon a time...", "Mix flour and sugar."] },
                    { q: "A recipe's purpose is to ___.", a: "inform (give instructions)", d: ["persuade", "entertain", "argue"] },
                    { q: "Can a text have more than one purpose?", a: "Yes", d: ["No", "Never", "Only non-fiction"] }
                ]
            },
            {
                name: "Argumentative Writing", lesson: "Argumentative writing states a CLAIM (your position) and supports it with EVIDENCE (facts, data, examples). Include a COUNTERCLAIM (the other side's view) and REBUTTAL (why they're wrong). Structure: Introduction → Claim → Evidence → Counterclaim → Rebuttal → Conclusion.", quiz: [
                    { q: "A claim is ___.", a: "your position or argument", d: ["a random fact", "a question", "a story"] },
                    { q: "Evidence supports your ___.", a: "claim", d: ["name", "title", "feelings only"] },
                    { q: "A counterclaim is ___.", a: "the opposing viewpoint", d: ["your opinion again", "a random idea", "the conclusion"] },
                    { q: "A rebuttal explains ___.", a: "why the counterclaim is wrong", d: ["your name", "the topic", "the setting"] },
                    { q: "Good evidence includes ___.", a: "facts and data", d: ["only opinions", "guesses", "dreams"] }
                ], exam: [
                    { q: "What comes after presenting a counterclaim?", a: "A rebuttal", d: ["The introduction", "A new claim", "The title"] },
                    { q: "Type what you call the opposing side's argument.", a: "counterclaim", type: "identification" },
                    { q: "Which is the best evidence?", a: "Studies show 80% of students prefer longer recess.", d: ["I think recess is fun.", "Recess is nice.", "Everyone likes it."] },
                    { q: "An argumentative essay ends with ___.", a: "a strong conclusion restating the claim", d: ["a question", "a new topic", "no ending"] },
                    { q: "Which is a strong claim?", a: "School lunches should include more vegetables.", d: ["Food exists.", "Lunch.", "I ate today."] }
                ]
            },
            {
                name: "Analogies", lesson: "An analogy compares two PAIRS of words that share a relationship. 'Leaf is to tree as petal is to flower.' (part to whole). 'Hot is to cold as big is to small.' (opposites). Common types: synonyms, antonyms, part-to-whole, cause-effect.", quiz: [
                    { q: "Complete: Bird is to sky as fish is to ___.", a: "water", d: ["tree", "grass", "sand"] },
                    { q: "What type: 'Happy : Sad :: Hot : Cold'?", a: "Antonyms (opposites)", d: ["Synonyms", "Part to whole", "Cause and effect"] },
                    { q: "Complete: Page is to book as room is to ___.", a: "house", d: ["floor", "wall", "ceiling"] },
                    { q: "An analogy compares ___.", a: "two pairs with the same relationship", d: ["random words", "only colors", "only numbers"] },
                    { q: "'Puppy : Dog :: Kitten : ___'", a: "Cat", d: ["Mouse", "Bird", "Fish"] }
                ], exam: [
                    { q: "'Pen : Write :: Knife : ___'", a: "Cut", d: ["Fork", "Spoon", "Plate"] },
                    { q: "Type what completes: 'Eye : See :: Ear : ___'", a: "Hear", type: "identification" },
                    { q: "What relationship: 'Finger : Hand :: Toe : Foot'?", a: "Part to whole", d: ["Opposites", "Synonyms", "Cause and effect"] },
                    { q: "'Teacher : School :: Doctor : ___'", a: "Hospital", d: ["Teacher", "Classroom", "Book"] },
                    { q: "'Rain : Flood :: Spark : ___'", a: "Fire", d: ["Water", "Wind", "Snow"] }
                ]
            },
            {
                name: "Hyperbole & Understatement", lesson: "HYPERBOLE is extreme exaggeration for effect: 'I'm so hungry I could eat a horse!' UNDERSTATEMENT makes something seem less important: 'It's just a scratch' (after a big injury). Both are figurative — not meant literally!", quiz: [
                    { q: "Hyperbole uses ___.", a: "extreme exaggeration", d: ["exact facts", "small details", "quiet language"] },
                    { q: "Which is hyperbole?", a: "I've told you a million times!", d: ["I told you twice.", "I told you once.", "I told you yesterday."] },
                    { q: "Understatement makes things seem ___.", a: "less important than they are", d: ["more important", "exactly right", "confusing"] },
                    { q: "'This bag weighs a ton!' is ___.", a: "hyperbole", d: ["understatement", "fact", "simile"] },
                    { q: "'It's just a small cut' (after major surgery) is ___.", a: "understatement", d: ["hyperbole", "fact", "metaphor"] }
                ], exam: [
                    { q: "'I'm dying of boredom!' is ___.", a: "hyperbole", d: ["fact", "understatement", "personification"] },
                    { q: "Type the figurative device that exaggerates hugely.", a: "hyperbole", type: "identification" },
                    { q: "Why do authors use hyperbole?", a: "For emphasis and humor", d: ["To be accurate", "To confuse", "To lose readers"] },
                    { q: "'The earthquake was a little shake' is ___.", a: "understatement", d: ["hyperbole", "simile", "metaphor"] },
                    { q: "Which is NOT hyperbole?", a: "I ran 3 miles today.", d: ["I ran faster than light!", "My backpack weighs a ton!", "I have a million things to do!"] }
                ]
            },
            {
                name: "Summarizing vs. Paraphrasing", lesson: "SUMMARIZING: Telling ONLY the main points in your own words (much shorter). PARAPHRASING: Restating ALL the information in your own words (similar length). Both avoid copying. Summarize when you need the key idea. Paraphrase when all details matter.", quiz: [
                    { q: "A summary includes ___.", a: "only the main points", d: ["every detail", "just the title", "random facts"] },
                    { q: "Paraphrasing restates ___.", a: "all information in your own words", d: ["only half", "nothing", "the title"] },
                    { q: "Which is shorter than the original?", a: "A summary", d: ["A paraphrase", "Both are longer", "Neither"] },
                    { q: "Both summarizing and paraphrasing use ___.", a: "your own words", d: ["the exact same words", "no words", "only quotes"] },
                    { q: "When should you summarize?", a: "When you need only the key ideas", d: ["When you need all details", "Never", "Only in math"] }
                ], exam: [
                    { q: "What's the main difference between summarizing and paraphrasing?", a: "Length — summaries are shorter", d: ["Nothing", "Paraphrases are shorter", "Summaries copy text"] },
                    { q: "Type which technique only covers the main points.", a: "summarizing", type: "identification" },
                    { q: "If you rewrite a paragraph keeping all details but changing words, you are ___.", a: "paraphrasing", d: ["summarizing", "plagiarizing", "editing"] },
                    { q: "Copying someone's words exactly without credit is ___.", a: "plagiarism", d: ["summarizing", "paraphrasing", "creative writing"] },
                    { q: "A one-sentence version of a long article is a ___.", a: "summary", d: ["paraphrase", "copy", "draft"] }
                ]
            },
            {
                name: "Text Features", lesson: "Nonfiction texts use features to organize information. CHARTS show data visually. GRAPHS compare numbers. SIDEBARS give extra info in a box. FOOTNOTES add details at the bottom. INFOGRAPHICS combine images and data. These help readers understand complex information quickly.", quiz: [
                    { q: "A chart shows data ___.", a: "visually in rows and columns", d: ["only in words", "never", "randomly"] },
                    { q: "A sidebar is ___.", a: "extra info in a box on the side", d: ["the main text", "the title", "the author's name"] },
                    { q: "Footnotes appear ___.", a: "at the bottom of the page", d: ["at the top", "in the middle", "on the cover"] },
                    { q: "An infographic combines ___.", a: "images and data", d: ["only words", "only numbers", "only colors"] },
                    { q: "Text features help readers ___.", a: "understand information quickly", d: ["get confused", "ignore the text", "forget information"] }
                ], exam: [
                    { q: "Which text feature would best show temperature changes over a year?", a: "A line graph", d: ["A sidebar", "A footnote", "A caption"] },
                    { q: "Type the text feature that provides extra info at the page bottom.", a: "footnote", type: "identification" },
                    { q: "A pie chart shows ___.", a: "parts of a whole", d: ["time changes", "stories", "poems"] },
                    { q: "Where would you find a brief explanation of a complex term?", a: "Sidebar or footnote", d: ["The title only", "The cover page", "The index"] },
                    { q: "Bar graphs are best for ___.", a: "comparing categories", d: ["telling stories", "writing poems", "drawing pictures"] }
                ]
            },
            {
                name: "Oral Presentation", lesson: "A great presentation has: STRUCTURE (intro, body, conclusion), VISUAL AIDS (slides, props), AUDIENCE AWARENESS (know who you're speaking to), BODY LANGUAGE (gestures, movement), and VOCAL VARIETY (change tone to keep interest). End with a strong closing!", quiz: [
                    { q: "A presentation should have ___.", a: "an intro, body, and conclusion", d: ["only one part", "no structure", "random ideas"] },
                    { q: "Visual aids include ___.", a: "slides and props", d: ["nothing", "only words spoken", "only gestures"] },
                    { q: "Body language includes ___.", a: "gestures and movement", d: ["only words", "only notes", "only slides"] },
                    { q: "Vocal variety means ___.", a: "changing your tone and pace", d: ["speaking in one tone", "whispering always", "yelling always"] },
                    { q: "You should end a presentation with ___.", a: "a strong closing statement", d: ["nothing", "a joke always", "just stopping"] }
                ], exam: [
                    { q: "Why is audience awareness important?", a: "To adjust your language and content to your listeners", d: ["It's not important", "To ignore them", "To talk faster"] },
                    { q: "Type what you call pictures/props used during a speech.", a: "visual aids", type: "identification" },
                    { q: "Good eye contact shows ___.", a: "confidence and connection", d: ["fear", "boredom", "confusion"] },
                    { q: "If your audience looks bored, you should ___.", a: "change your tone or ask a question", d: ["keep going the same", "stop immediately", "read faster"] },
                    { q: "The best presentations are ___.", a: "well-practiced and organized", d: ["unplanned", "very long", "read word for word"] }
                ]
            }
        ]
    },

    // ──────────────────── GRADE 7 ────────────────────
    7: {
        levels: [
            {
                name: "Allusion", lesson: "An ALLUSION is a brief reference to a well-known person, place, event, or work of art/literature. 'He has the Midas touch' refers to the Greek myth of King Midas. Authors use allusions to add depth without lengthy explanations — the reader is expected to know the reference.", quiz: [
                    { q: "An allusion is a reference to ___.", a: "something well-known", d: ["something unknown", "a made-up thing", "nothing specific"] },
                    { q: "'She's a real Cinderella story' alludes to ___.", a: "the fairy tale", d: ["a movie review", "a news article", "a math problem"] },
                    { q: "Authors use allusions to ___.", a: "add meaning efficiently", d: ["confuse readers", "waste space", "avoid writing"] },
                    { q: "'He opened Pandora's box' means ___.", a: "He caused unexpected troubles", d: ["He found treasure", "He opened a gift", "He packed a box"] },
                    { q: "For an allusion to work, the reader must ___.", a: "know the reference", d: ["read footnotes", "ask the author", "ignore it"] }
                ], exam: [
                    { q: "'She has an Achilles' heel' alludes to ___.", a: "Greek mythology", d: ["A shoe brand", "A medical condition", "A sports move"] },
                    { q: "Type what literary device references well-known works.", a: "allusion", type: "identification" },
                    { q: "'It was a David and Goliath matchup' means ___.", a: "A small underdog vs. a powerful opponent", d: ["Two equal teams", "A friendly game", "A tie game"] },
                    { q: "Allusions can reference ___.", a: "mythology, history, literature, and pop culture", d: ["only mythology", "only history", "only movies"] },
                    { q: "'Don't be a Scrooge!' alludes to ___.", a: "A Christmas Carol by Dickens", d: ["A math textbook", "A science experiment", "A cooking show"] }
                ]
            },
            {
                name: "Irony", lesson: "VERBAL IRONY: Saying the opposite of what you mean ('Oh great!' when something bad happens). SITUATIONAL IRONY: The opposite of what's expected happens (a fire station burns down). DRAMATIC IRONY: The audience knows something the characters don't.", quiz: [
                    { q: "'Nice weather!' during a storm is ___ irony.", a: "verbal", d: ["situational", "dramatic", "no"] },
                    { q: "A fire station burning down is ___ irony.", a: "situational", d: ["verbal", "dramatic", "no"] },
                    { q: "When the audience knows the villain is hiding but the hero doesn't, it's ___ irony.", a: "dramatic", d: ["verbal", "situational", "no"] },
                    { q: "Verbal irony means ___.", a: "saying the opposite of what you mean", d: ["lying", "whispering", "yelling"] },
                    { q: "How many types of irony are there?", a: "3", d: ["1", "2", "5"] }
                ], exam: [
                    { q: "A traffic cop gets a parking ticket. What irony?", a: "Situational", d: ["Verbal", "Dramatic", "None"] },
                    { q: "Type the irony where the audience knows more than characters.", a: "dramatic", type: "identification" },
                    { q: "'I just LOVE getting stuck in traffic' is ___.", a: "verbal irony (sarcasm)", d: ["situational irony", "dramatic irony", "not irony"] },
                    { q: "In Romeo and Juliet, the audience knows Juliet is alive but Romeo doesn't. This is ___.", a: "dramatic irony", d: ["verbal irony", "situational irony", "no irony"] },
                    { q: "Irony creates ___ in writing.", a: "surprise, humor, or tension", d: ["boredom", "confusion only", "nothing"] }
                ]
            },
            {
                name: "Connotation vs. Denotation", lesson: "DENOTATION is a word's dictionary definition. CONNOTATION is the feeling or association a word carries. 'Home' and 'house' both mean a dwelling (denotation), but 'home' feels warm and cozy (positive connotation). Word choice matters!", quiz: [
                    { q: "Denotation is ___.", a: "the dictionary definition", d: ["a feeling", "an opinion", "a guess"] },
                    { q: "Connotation is ___.", a: "the feeling a word carries", d: ["the spelling", "the pronunciation", "the length"] },
                    { q: "'Cheap' and 'affordable' both mean low-priced, but 'cheap' has a ___ connotation.", a: "negative", d: ["positive", "neutral", "no"] },
                    { q: "'Fragrance' vs. 'stench' — both mean smell. Which is positive?", a: "fragrance", d: ["stench", "both", "neither"] },
                    { q: "Why do connotations matter?", a: "They affect how readers feel", d: ["They don't matter", "They change spelling", "They add pages"] }
                ], exam: [
                    { q: "'Slender' vs. 'skinny' — which has a more positive connotation?", a: "slender", d: ["skinny", "both equal", "neither"] },
                    { q: "Type whether 'denotation' or 'connotation' refers to emotional associations.", a: "connotation", type: "identification" },
                    { q: "'Youthful' vs. 'childish' — both relate to being young. Which is negative?", a: "childish", d: ["youthful", "both", "neither"] },
                    { q: "Good writers choose words based on ___.", a: "both denotation and connotation", d: ["only length", "only spelling", "random choice"] },
                    { q: "'Determined' vs. 'stubborn' — same denotation, different ___.", a: "connotation", d: ["spelling rules", "grammar", "pronunciation"] }
                ]
            },
            {
                name: "Parallel Structure", lesson: "PARALLEL STRUCTURE means using the same pattern of words or phrases in a list or comparison. WRONG: 'She likes reading, to swim, and bikes.' RIGHT: 'She likes reading, swimming, and biking.' Keeping the pattern consistent makes writing smooth and clear.", quiz: [
                    { q: "Parallel structure uses ___.", a: "the same grammatical pattern", d: ["random patterns", "no pattern", "opposite patterns"] },
                    { q: "Which is parallel?", a: "I like running, swimming, and hiking.", d: ["I like to run, swimming, and hike.", "I like run, to swim, and hiking.", "I like running, to swim, and bikes."] },
                    { q: "Parallel structure makes writing ___.", a: "smooth and clear", d: ["confusing", "longer", "harder"] },
                    { q: "Fix: 'He is smart, funny, and has talent.'", a: "He is smart, funny, and talented.", d: ["He is smart, funny, talent.", "He smart, funny, talented.", "Smart, funny, talent he is."] },
                    { q: "'Not only ... but also' requires ___.", a: "parallel structure", d: ["no structure", "random words", "only nouns"] }
                ], exam: [
                    { q: "Which is NOT parallel?", a: "She enjoys cooking, to read, and painting.", d: ["She enjoys cooking, reading, and painting.", "She cooks, reads, and paints.", "She is kind, smart, and brave."] },
                    { q: "Type what it's called when you keep the same word pattern in a list.", a: "parallel structure", type: "identification" },
                    { q: "Fix: 'The dog ran quickly, quietly, and was being careful.'", a: "The dog ran quickly, quietly, and carefully.", d: ["The dog ran quick, quiet, careful.", "The dog quickly ran quiet being careful.", "Quickly quietly careful the dog ran."] },
                    { q: "Parallel structure is important in ___ and ___.", a: "lists and comparisons", d: ["titles only", "names only", "dates only"] },
                    { q: "Which uses parallel structure?", a: "She was tired but determined.", d: ["She was tired but had determination.", "Tired she but determine.", "She tiredness but determined."] }
                ]
            },
            {
                name: "MLA Citations", lesson: "When you use someone else's ideas, you must give CREDIT. MLA format: In-text citation: (Author LastName page#) → (Smith 45). Works Cited entry: LastName, FirstName. Title. Publisher, Year. PLAGIARISM is using others' work without credit — it's stealing!", quiz: [
                    { q: "MLA in-text citations include ___.", a: "author's last name and page number", d: ["only the title", "only the year", "nothing"] },
                    { q: "Plagiarism is ___.", a: "using others' work without credit", d: ["writing your own ideas", "reading a book", "taking notes"] },
                    { q: "The Works Cited page lists ___.", a: "all sources used", d: ["only books", "your name", "page numbers"] },
                    { q: "Which is correct MLA in-text citation?", a: "(Smith 45)", d: ["Smith, 45", "[Smith p.45]", "Smith (45)"] },
                    { q: "Why is citing sources important?", a: "To give credit and avoid plagiarism", d: ["To make papers longer", "To confuse readers", "It's not important"] }
                ], exam: [
                    { q: "In MLA, book titles should be ___.", a: "italicized", d: ["underlined", "in quotes", "in bold"] },
                    { q: "Type what it's called when you use someone's words without credit.", a: "plagiarism", type: "identification" },
                    { q: "A Works Cited entry starts with ___.", a: "the author's last name", d: ["the title", "the date", "the publisher"] },
                    { q: "Direct quotes need ___.", a: "quotation marks and a citation", d: ["nothing", "only a citation", "only quotes"] },
                    { q: "Even paraphrased ideas need ___.", a: "a citation", d: ["nothing", "quotation marks", "a new paragraph"] }
                ]
            },
            {
                name: "Literary Analysis", lesson: "Literary analysis examines HOW an author creates meaning. Analyze: CHARACTER development (how characters change), SYMBOLISM (objects representing ideas), CONFLICT types (person vs. person, self, nature, society), and how SETTING affects the story.", quiz: [
                    { q: "Literary analysis looks at ___.", a: "how an author creates meaning", d: ["only the plot summary", "the author's biography", "the book cover"] },
                    { q: "Character development shows how characters ___.", a: "change throughout the story", d: ["stay exactly the same", "disappear", "are described physically only"] },
                    { q: "A symbol is ___.", a: "an object representing a bigger idea", d: ["a math sign", "a letter", "a number"] },
                    { q: "'Person vs. nature' is a type of ___.", a: "conflict", d: ["character", "setting", "theme"] },
                    { q: "Setting can affect ___.", a: "mood, characters, and plot", d: ["nothing", "only the title", "only page numbers"] }
                ], exam: [
                    { q: "A dove often symbolizes ___.", a: "peace", d: ["war", "anger", "speed"] },
                    { q: "Type the conflict type when a character struggles with their own feelings.", a: "person vs. self", type: "identification" },
                    { q: "A character who changes is called ___.", a: "dynamic", d: ["static", "flat", "minor"] },
                    { q: "A character who stays the same is ___.", a: "static", d: ["dynamic", "round", "main"] },
                    { q: "Analyzing literature requires ___.", a: "evidence from the text", d: ["only personal opinions", "guessing", "ignoring details"] }
                ]
            },
            {
                name: "Transitional Words", lesson: "Transitions connect ideas smoothly. ADDITION: furthermore, moreover, also. CONTRAST: however, nevertheless, on the other hand. CAUSE/EFFECT: therefore, consequently, as a result. SEQUENCE: first, next, finally. They guide the reader through your writing.", quiz: [
                    { q: "'However' shows ___.", a: "contrast", d: ["addition", "cause", "sequence"] },
                    { q: "'Furthermore' shows ___.", a: "addition", d: ["contrast", "cause", "conclusion"] },
                    { q: "'Therefore' shows ___.", a: "cause/effect", d: ["contrast", "addition", "sequence"] },
                    { q: "Transitions help writing flow ___.", a: "smoothly", d: ["roughly", "randomly", "poorly"] },
                    { q: "'First, next, finally' show ___.", a: "sequence/order", d: ["contrast", "cause", "addition"] }
                ], exam: [
                    { q: "Fill in: 'She studied hard; ___, she passed.'", a: "therefore", d: ["however", "furthermore", "first"] },
                    { q: "Type a transition word showing contrast.", a: "however", type: "identification" },
                    { q: "'On the other hand' signals ___.", a: "an opposing idea", d: ["an addition", "a sequence", "a cause"] },
                    { q: "'Consequently' is similar to ___.", a: "as a result", d: ["in addition", "however", "first"] },
                    { q: "Good writers use transitions to ___.", a: "guide readers between ideas", d: ["confuse readers", "fill space", "add word count only"] }
                ]
            },
            {
                name: "Semicolons and Colons", lesson: "SEMICOLONS (;) join two related independent clauses WITHOUT a conjunction: 'I love reading; it expands my mind.' COLONS (:) introduce a list, explanation, or quote: 'I need three things: paper, pen, and focus.' Don't confuse them!", quiz: [
                    { q: "A semicolon joins ___.", a: "two related independent clauses", d: ["a word to a letter", "unrelated ideas", "a title to a subtitle"] },
                    { q: "A colon introduces ___.", a: "a list, explanation, or quote", d: ["a new paragraph", "a conjunction", "nothing"] },
                    { q: "Which is correct?", a: "I love dogs; they are loyal.", d: ["I love dogs; and cats.", "I love; dogs.", "Dogs; I love."] },
                    { q: "Which uses a colon correctly?", a: "You need: eggs, milk, and flour.", d: ["You: need eggs.", "You need eggs: milk.", ": eggs milk flour."] },
                    { q: "A semicolon replaces ___.", a: "a period or comma + conjunction", d: ["a question mark", "an exclamation point", "quotation marks"] }
                ], exam: [
                    { q: "Fix: 'She ran fast, she won the race.'", a: "She ran fast; she won the race.", d: ["She ran fast: she won.", "She ran; fast she won.", "She, ran fast; won."] },
                    { q: "Type the punctuation that introduces a list.", a: "colon", type: "identification" },
                    { q: "Which is wrong?", a: "I like; pizza.", d: ["I like pizza; it's delicious.", "She has three pets: a dog, a cat, and a fish.", "Read this: it's important."] },
                    { q: "Before a semicolon and after it, you need ___.", a: "complete sentences", d: ["fragments", "single words", "commas"] },
                    { q: "'The answer is clear: study harder.' The colon introduces ___.", a: "an explanation", d: ["a question", "a name", "a date"] }
                ]
            },
            {
                name: "Research Skills", lesson: "Good research uses CREDIBLE SOURCES (trustworthy, expert-written). Evaluate using the CRAAP test: Currency (recent?), Relevance (related to topic?), Authority (expert author?), Accuracy (evidence-based?), Purpose (informative, not biased?). Avoid unreliable websites.", quiz: [
                    { q: "CRAAP stands for Currency, Relevance, Authority, Accuracy, and ___.", a: "Purpose", d: ["Power", "Position", "Proof"] },
                    { q: "A credible source is ___.", a: "trustworthy and expert-written", d: ["any website", "a random blog", "social media only"] },
                    { q: "Currency means the source is ___.", a: "recent and up-to-date", d: ["about money", "very old", "in a foreign language"] },
                    { q: "Which is most credible?", a: "A university research study", d: ["A random blog post", "A social media comment", "An anonymous forum"] },
                    { q: "Authority asks ___.", a: "Is the author an expert?", d: ["Is it long?", "Is it colorful?", "Is it popular?"] }
                ], exam: [
                    { q: "Which URL is most likely credible?", a: ".edu or .gov", d: [".com always", ".xyz", "any URL"] },
                    { q: "Type the 'A' in CRAAP that asks 'is the info correct?'", a: "Accuracy", type: "identification" },
                    { q: "Bias in a source means ___.", a: "the author favors one side", d: ["the source is reliable", "the source is long", "the source is academic"] },
                    { q: "Primary sources are ___.", a: "firsthand accounts (diaries, interviews, data)", d: ["summaries only", "textbooks only", "encyclopedias only"] },
                    { q: "Wikipedia is best used as ___.", a: "a starting point, not a final source", d: ["the only source needed", "always unreliable", "better than textbooks"] }
                ]
            },
            {
                name: "Debate & Persuasion", lesson: "A debate presents two sides of an issue. PROPOSITION side supports the claim. OPPOSITION argues against it. Use ETHOS (credibility), PATHOS (emotion), and LOGOS (logic/evidence). Rebuttals address the other side's points. Stay respectful and evidence-based.", quiz: [
                    { q: "Ethos appeals to ___.", a: "credibility/trust", d: ["emotions", "logic", "humor"] },
                    { q: "Pathos appeals to ___.", a: "emotions", d: ["logic", "credibility", "authority"] },
                    { q: "Logos appeals to ___.", a: "logic and evidence", d: ["emotions", "humor", "fear"] },
                    { q: "The proposition side ___.", a: "supports the claim", d: ["opposes the claim", "stays neutral", "asks questions only"] },
                    { q: "A rebuttal ___.", a: "counters the other side's argument", d: ["agrees with everything", "changes the topic", "ends the debate"] }
                ], exam: [
                    { q: "Using statistics in an argument is an example of ___.", a: "logos", d: ["pathos", "ethos", "none"] },
                    { q: "Type the persuasive appeal based on the speaker's credibility.", a: "ethos", type: "identification" },
                    { q: "Telling a sad story to convince someone uses ___.", a: "pathos", d: ["logos", "ethos", "none"] },
                    { q: "In a debate, you should ___.", a: "stay respectful and use evidence", d: ["yell louder", "insult the opponent", "make things up"] },
                    { q: "Which is the strongest argument?", a: "Research shows 75% improvement with this method.", d: ["I just feel it's better.", "Everyone thinks so.", "Trust me."] }
                ]
            }
        ]
    },

    // ──────────────────── GRADE 8 ────────────────────
    8: {
        levels: [
            {
                name: "Satire", lesson: "SATIRE uses humor, irony, and exaggeration to criticize society or human behavior. It aims to inspire change. Jonathan Swift's 'A Modest Proposal' satirized English treatment of the Irish poor. Satire can be gentle (Horatian) or harsh (Juvenalian).", quiz: [
                    { q: "Satire uses humor to ___.", a: "criticize and inspire change", d: ["just be funny", "avoid topics", "confuse people"] },
                    { q: "Satire often targets ___.", a: "society or human flaws", d: ["only individuals", "only weather", "nothing specific"] },
                    { q: "Horatian satire is ___.", a: "gentle and humorous", d: ["harsh and angry", "boring", "factual"] },
                    { q: "Juvenalian satire is ___.", a: "harsh and critical", d: ["gentle and funny", "neutral", "only about food"] },
                    { q: "The goal of satire is ___.", a: "to expose problems and prompt change", d: ["only to entertain", "to bore readers", "to avoid issues"] }
                ], exam: [
                    { q: "Political cartoons are often examples of ___.", a: "satire", d: ["biography", "autobiography", "fairy tale"] },
                    { q: "Type the type of satire that is gentle and humorous.", a: "Horatian", type: "identification" },
                    { q: "Satire differs from comedy because satire ___.", a: "has a deeper purpose of criticism", d: ["is never funny", "avoids topics", "is always long"] },
                    { q: "Which tool does satire NOT typically use?", a: "mathematical equations", d: ["irony", "exaggeration", "humor"] },
                    { q: "Satire works best when readers ___.", a: "understand the issue being criticized", d: ["ignore the humor", "don't think", "only look at pictures"] }
                ]
            },
            {
                name: "Rhetorical Devices", lesson: "Rhetorical devices make communication more effective. ANAPHORA: repeating words at the start of sentences ('I have a dream...'). RHETORICAL QUESTION: a question not needing an answer. ANTITHESIS: contrasting ideas in parallel ('It was the best of times, it was the worst of times').", quiz: [
                    { q: "Anaphora means ___.", a: "repeating words at the start of sentences", d: ["asking questions", "using big words", "whispering"] },
                    { q: "A rhetorical question expects ___.", a: "no answer", d: ["a written response", "a shout", "silence only"] },
                    { q: "Antithesis uses ___.", a: "contrasting ideas in parallel structure", d: ["similar ideas", "random words", "numbers"] },
                    { q: "'Can we really afford to ignore this?' is a ___.", a: "rhetorical question", d: ["real question", "anaphora", "antithesis"] },
                    { q: "Rhetorical devices make writing ___.", a: "more persuasive and memorable", d: ["longer only", "confusing", "boring"] }
                ], exam: [
                    { q: "'We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields' uses ___.", a: "anaphora", d: ["antithesis", "rhetorical question", "none"] },
                    { q: "Type the device that contrasts opposite ideas in balanced phrases.", a: "antithesis", type: "identification" },
                    { q: "MLK's 'I Have a Dream' speech famously uses ___.", a: "anaphora", d: ["only antithesis", "no devices", "only questions"] },
                    { q: "'To err is human; to forgive, divine' is ___.", a: "antithesis", d: ["anaphora", "rhetorical question", "simile"] },
                    { q: "Rhetorical devices are most common in ___.", a: "speeches and persuasive writing", d: ["math textbooks", "recipe books", "phone books"] }
                ]
            },
            {
                name: "Syntax & Sentence Variety", lesson: "SYNTAX is how words are arranged in sentences. Varying syntax keeps writing interesting. Mix SHORT sentences (for impact) with LONG ones (for detail). Use different sentence types: DECLARATIVE (statement), INTERROGATIVE (question), IMPERATIVE (command), EXCLAMATORY (strong feeling).", quiz: [
                    { q: "Syntax refers to ___.", a: "word arrangement in sentences", d: ["spelling", "vocabulary size", "punctuation only"] },
                    { q: "A declarative sentence is a ___.", a: "statement", d: ["question", "command", "exclamation"] },
                    { q: "An interrogative sentence is a ___.", a: "question", d: ["statement", "command", "exclamation"] },
                    { q: "Short sentences create ___.", a: "impact and emphasis", d: ["boredom", "confusion", "nothing"] },
                    { q: "Good writers use ___ sentence lengths.", a: "varied", d: ["only short", "only long", "identical"] }
                ], exam: [
                    { q: "'Stop!' is what type of sentence?", a: "Imperative (command)", d: ["Declarative", "Interrogative", "None"] },
                    { q: "Type the sentence type that asks a question.", a: "interrogative", type: "identification" },
                    { q: "'What a beautiful day!' is ___.", a: "exclamatory", d: ["declarative", "interrogative", "imperative"] },
                    { q: "Sentence variety improves ___.", a: "readability and engagement", d: ["nothing", "spelling", "only length"] },
                    { q: "Which shows good sentence variety?", a: "She ran. The wind howled against her as she pushed through the storm.", d: ["She ran. She ran fast. She ran very fast.", "Running. Fast. Very.", "She ran and she ran and she ran."] }
                ]
            },
            {
                name: "Unreliable Narrator", lesson: "An UNRELIABLE NARRATOR is a storyteller whose account cannot be fully trusted. They may lie, be biased, lack knowledge, or be mentally unstable. Readers must read between the lines! Examples: a young child who misunderstands events, a character with a hidden agenda.", quiz: [
                    { q: "An unreliable narrator ___.", a: "cannot be fully trusted", d: ["always tells truth", "is the author", "is omniscient"] },
                    { q: "A narrator might be unreliable because of ___.", a: "bias, lies, or limited knowledge", d: ["good memory", "honesty", "being the author"] },
                    { q: "Readers should ___ with an unreliable narrator.", a: "read between the lines", d: ["believe everything", "skip the story", "only read dialogue"] },
                    { q: "A young child narrator might be unreliable because ___.", a: "they don't understand adult situations", d: ["they are too smart", "they are the author", "children always lie"] },
                    { q: "Unreliable narrators make stories ___.", a: "more complex and layered", d: ["simpler", "shorter", "boring"] }
                ], exam: [
                    { q: "Which character would MOST LIKELY be unreliable?", a: "A character trying to hide a crime", d: ["An omniscient narrator", "A newspaper reporter", "A textbook author"] },
                    { q: "Type what we call a narrator whose story we can't fully trust.", a: "unreliable narrator", type: "identification" },
                    { q: "Why do authors use unreliable narrators?", a: "To create suspense and make readers think critically", d: ["To make stories boring", "To avoid writing", "Because they're lazy"] },
                    { q: "Clues that a narrator is unreliable include ___.", a: "contradictions and gaps in their story", d: ["perfect recall", "complete honesty", "detailed accuracy"] },
                    { q: "First person POV is often used with unreliable narrators because ___.", a: "we only see one perspective", d: ["first person is always unreliable", "it's the only POV", "authors require it"] }
                ]
            },
            {
                name: "Essay Structure", lesson: "A formal essay has 5 paragraphs: 1) INTRODUCTION with a hook and thesis statement. 2-4) BODY PARAGRAPHS each with a topic sentence, evidence, and analysis. 5) CONCLUSION that restates the thesis and provides a final thought. Each body paragraph supports ONE main point.", quiz: [
                    { q: "A formal essay typically has ___ paragraphs.", a: "5", d: ["3", "10", "1"] },
                    { q: "The thesis statement is in the ___.", a: "introduction", d: ["conclusion", "body paragraph 2", "title"] },
                    { q: "Each body paragraph covers ___.", a: "one main point", d: ["all points", "no points", "the conclusion"] },
                    { q: "A hook is designed to ___.", a: "grab the reader's attention", d: ["bore the reader", "end the essay", "introduce the bibliography"] },
                    { q: "The conclusion should ___.", a: "restate the thesis and give final thoughts", d: ["introduce new arguments", "ask random questions", "start a new topic"] }
                ], exam: [
                    { q: "What comes after the hook in an introduction?", a: "Background info leading to the thesis", d: ["The conclusion", "The bibliography", "Another hook"] },
                    { q: "Type the sentence that states the main argument of an essay.", a: "thesis statement", type: "identification" },
                    { q: "Body paragraphs should include evidence and ___.", a: "analysis/explanation of the evidence", d: ["more hooks", "the thesis again", "random facts"] },
                    { q: "A good conclusion does NOT ___.", a: "introduce brand new arguments", d: ["restate the thesis", "summarize main points", "end with a thought-provoking statement"] },
                    { q: "Which is the best thesis statement?", a: "Social media negatively impacts teen mental health in three key ways.", d: ["Social media.", "Teens use phones.", "I like Instagram."] }
                ]
            },
            {
                name: "Literary Criticism Intro", lesson: "Literary criticism analyzes literature from different LENSES. HISTORICAL: How does the time period affect the text? BIOGRAPHICAL: How does the author's life influence it? FEMINIST: How are gender roles portrayed? READER-RESPONSE: What does the text mean to YOU? Each lens reveals different meanings.", quiz: [
                    { q: "Literary criticism uses different ___ to analyze texts.", a: "lenses/perspectives", d: ["languages", "colors", "fonts"] },
                    { q: "Historical criticism examines ___.", a: "how the time period affects the text", d: ["only the plot", "grammar errors", "page count"] },
                    { q: "Biographical criticism looks at ___.", a: "how the author's life influences the work", d: ["reader opinions", "word count", "illustrations"] },
                    { q: "Feminist criticism examines ___.", a: "gender roles and representation", d: ["only male characters", "fonts", "page numbers"] },
                    { q: "Reader-response criticism focuses on ___.", a: "the reader's personal interpretation", d: ["only the author's intent", "the publisher", "the cover design"] }
                ], exam: [
                    { q: "Analyzing how slavery affected Mark Twain's writing uses ___ criticism.", a: "historical", d: ["feminist", "reader-response", "formalist"] },
                    { q: "Type the criticism that focuses on the reader's personal meaning.", a: "reader-response", type: "identification" },
                    { q: "Why are there multiple lenses?", a: "Different perspectives reveal different meanings", d: ["Only one is correct", "To confuse students", "To waste time"] },
                    { q: "Examining how an author's childhood trauma appears in their novel is ___.", a: "biographical criticism", d: ["historical criticism", "feminist criticism", "none"] },
                    { q: "All literary criticism requires ___.", a: "textual evidence and thoughtful analysis", d: ["only personal feelings", "guessing", "copying summaries"] }
                ]
            },
            {
                name: "Tone and Mood", lesson: "TONE is the author's ATTITUDE toward the subject (angry, sarcastic, hopeful). MOOD is the FEELING the reader gets (suspenseful, peaceful, eerie). Authors create mood through word choice, imagery, and setting. Tone is detected through diction and style.", quiz: [
                    { q: "Tone is the author's ___.", a: "attitude toward the subject", d: ["favorite color", "name", "age"] },
                    { q: "Mood is the ___.", a: "feeling the reader experiences", d: ["author's biography", "page count", "title font"] },
                    { q: "Dark, shadowy descriptions create what mood?", a: "eerie/suspenseful", d: ["happy", "funny", "boring"] },
                    { q: "Authors create mood through ___.", a: "word choice, imagery, and setting", d: ["page numbers", "font size", "margins"] },
                    { q: "Tone is revealed through ___.", a: "diction (word choice) and style", d: ["the cover art", "the publisher", "the price"] }
                ], exam: [
                    { q: "If an author uses words like 'disgusting' and 'appalling,' the tone is ___.", a: "critical/disapproving", d: ["happy", "neutral", "excited"] },
                    { q: "Type whether 'tone' or 'mood' describes the reader's emotional response.", a: "mood", type: "identification" },
                    { q: "A passage about a sunny meadow with birdsong creates a ___ mood.", a: "peaceful/serene", d: ["scary", "angry", "tense"] },
                    { q: "Can tone and mood be different?", a: "Yes — an author can write sarcastically about a sad topic", d: ["No, never", "They're always the same", "Mood doesn't exist"] },
                    { q: "'The author's tone is mocking' means the author ___.", a: "ridicules or makes fun of the subject", d: ["loves the subject", "is neutral", "is confused"] }
                ]
            },
            {
                name: "Advanced Grammar", lesson: "COMPLEX-COMPOUND sentences combine dependent and multiple independent clauses. APPOSITIVES rename a noun: 'My brother, a doctor, lives nearby.' DANGLING MODIFIERS are misplaced descriptions: WRONG: 'Walking to school, the rain started.' (Rain wasn't walking!) RIGHT: 'Walking to school, I got caught in the rain.'", quiz: [
                    { q: "An appositive ___.", a: "renames or describes a noun beside it", d: ["replaces a verb", "ends a sentence", "starts a paragraph"] },
                    { q: "A dangling modifier ___.", a: "describes the wrong word in a sentence", d: ["is always correct", "adds punctuation", "removes words"] },
                    { q: "'My friend, an artist, painted this.' The appositive is ___.", a: "an artist", d: ["My friend", "painted this", "My"] },
                    { q: "Fix: 'Running quickly, the finish line was reached.'", a: "Running quickly, she reached the finish line.", d: ["The finish line ran quickly.", "Quickly the finish ran.", "Running finish line quickly."] },
                    { q: "Appositives are set off by ___.", a: "commas", d: ["periods", "exclamation points", "question marks"] }
                ], exam: [
                    { q: "Identify the appositive: 'Paris, the City of Light, attracts millions.'", a: "the City of Light", d: ["Paris", "attracts millions", "the City"] },
                    { q: "Type what a misplaced descriptive phrase is called.", a: "dangling modifier", type: "identification" },
                    { q: "Fix: 'After eating lunch, the meeting started.'", a: "After eating lunch, we started the meeting.", d: ["The meeting ate lunch.", "Lunch started the meeting after.", "Eating meeting started lunch."] },
                    { q: "A complex-compound sentence has ___.", a: "at least two independent and one dependent clause", d: ["only one clause", "no clauses", "only dependent clauses"] },
                    { q: "Which has an appositive?", a: "Einstein, a brilliant physicist, changed science.", d: ["Einstein changed science.", "He was brilliant.", "Science changed when Einstein arrived."] }
                ]
            },
            {
                name: "Media Literacy", lesson: "Media literacy means critically evaluating media messages. Ask: WHO created this? WHAT is the message? WHY was it made (inform, persuade, sell)? HOW does it attract attention? WHAT is left out? Recognize BIAS, PROPAGANDA, and manipulation techniques in news, ads, and social media.", quiz: [
                    { q: "Media literacy means ___.", a: "critically evaluating media messages", d: ["believing everything", "ignoring media", "only watching TV"] },
                    { q: "You should always ask WHO created the message because ___.", a: "the creator's motives affect the message", d: ["it doesn't matter", "creators are always honest", "only experts create media"] },
                    { q: "Propaganda is ___.", a: "biased information used to promote a viewpoint", d: ["always true", "only in textbooks", "always neutral"] },
                    { q: "Bias means ___.", a: "favoring one side over another", d: ["being neutral", "telling the truth", "reporting all sides equally"] },
                    { q: "Asking 'what is left out?' helps you ___.", a: "identify missing perspectives", d: ["waste time", "get confused", "find spelling errors"] }
                ], exam: [
                    { q: "An ad showing only positive reviews is an example of ___.", a: "bias (selective information)", d: ["balanced reporting", "full disclosure", "honest advertising"] },
                    { q: "Type a word for biased information designed to influence opinions.", a: "propaganda", type: "identification" },
                    { q: "Clickbait headlines use ___.", a: "exaggeration to get clicks", d: ["accurate headlines", "boring titles", "no titles"] },
                    { q: "To verify a news story, you should ___.", a: "check multiple credible sources", d: ["believe the first source", "ask friends only", "ignore it"] },
                    { q: "Social media algorithms show you content that ___.", a: "matches your existing interests and views", d: ["challenges your views", "is always accurate", "is randomly selected"] }
                ]
            },
            {
                name: "Portfolio Writing", lesson: "A WRITING PORTFOLIO collects your best work over time. Include: a REFLECTIVE LETTER explaining your growth, REVISED pieces showing improvement, VARIETY of genres (narrative, argumentative, poetry). This showcases your journey as a writer and demonstrates mastery of multiple forms.", quiz: [
                    { q: "A writing portfolio is ___.", a: "a collection of your best writing over time", d: ["one single essay", "a test", "a textbook"] },
                    { q: "A reflective letter discusses ___.", a: "your growth as a writer", d: ["your favorite food", "math skills", "sports achievements"] },
                    { q: "A portfolio should include ___ genres.", a: "a variety of", d: ["only one", "zero", "only poetry"] },
                    { q: "Revised pieces show ___.", a: "how you improved through editing", d: ["only first drafts", "no changes", "mistakes only"] },
                    { q: "A portfolio demonstrates ___.", a: "your writing journey and skills", d: ["your age", "your height", "your favorite color"] }
                ], exam: [
                    { q: "What makes a portfolio different from a single assignment?", a: "It shows growth over time across multiple pieces", d: ["Nothing", "It's shorter", "It's handwritten"] },
                    { q: "Type what the introductory essay in a portfolio is typically called.", a: "reflective letter", type: "identification" },
                    { q: "When selecting pieces for a portfolio, choose work that ___.", a: "shows your range and best abilities", d: ["is the longest", "was the easiest", "has the most spelling errors"] },
                    { q: "Including drafts alongside final versions shows ___.", a: "your revision process and growth", d: ["laziness", "nothing important", "that you made mistakes"] },
                    { q: "A strong portfolio proves you can ___.", a: "write effectively in multiple forms and styles", d: ["only write one type of essay", "copy others' work", "avoid revision"] }
                ]
            }
        ]
    }
};

module.exports = data;
