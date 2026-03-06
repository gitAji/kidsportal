const fs = require('fs');
const path = require('path');

const scienceTopics = {
    1: ["Living & Non-living Things", "Plants Around Us", "Animals Around Us", "Food We Eat", "My Body", "Good Habits & Safety", "Our Neighborhood", "Weather & Seasons", "The Sky", "Air & Water"],
    2: ["Parts of a Plant", "Uses of Plants", "Domestic & Wild Animals", "Bones & Muscles", "Food for Health", "Safety Rules", "Housing & Clothing", "Air & Wind", "Water & its Forms", "Rocks & Minerals"],
    3: ["Living Things Intro", "Plant Life Cycles", "Animal Habitats", "Birds & Their Features", "Human Body Intro", "Measurement Basics", "Forces & Motion", "Light & Sound", "The Earth & Beyond", "Helping the Environment"],
    4: ["Photosynthesis", "Plant Adaptations", "Animal Adaptations", "Reproduction in Animals", "Food & Nutrition", "Digestive System", "Teeth & Care", "Natural Fibers", "States of Matter", "Work & Energy"],
    5: ["Plant Reproduction", "Animal Lifestyles", "Skeletal System", "Nervous System", "Germs & Diseases", "Safety & First Aid", "Properties of Matter", "Chemical Changes", "Natural Disasters", "The Space Age"],
    6: ["Food Sources", "Sorting Materials", "Separation Techniques", "Studying Plants", "Body Movements", "Ecosystems", "Measurement of Length", "Lights & Shadows", "Electricity", "Magnets & Fun"],
    7: ["Nutrition in Plants", "Nutrition in Animals", "Heat Energy", "Acids, Bases & Salts", "Physical Changes", "Respiration", "Circulation & Transportation", "Reproduction in Flora", "Time & Motion", "Electric Circuits"],
    8: ["Agriculture & Crops", "Microbiology", "Fossil Fuels", "Combustion & Flames", "Conserving Nature", "Animal Reproduction", "Teenage Growth", "Pressure & Force", "Friction Science", "Acoustics & Sound"]
};

const curriculum = {};

for (let grade = 1; grade <= 8; grade++) {
    curriculum[grade] = { levels: [] };
    const topics = scienceTopics[grade];

    for (let i = 0; i < 10; i++) {
        const topic = topics[i];
        curriculum[grade].levels.push({
            name: topic,
            lesson: `This lesson covers ${topic}. In this level, students will learn the fundamental concepts and interesting facts about ${topic.toLowerCase()} in a fun and engaging way.`,
            quiz: [
                { q: `What is a basic concept of ${topic}?`, a: "Core concept", d: ["Wrong idea 1", "Wrong idea 2", "Wrong idea 3"] },
                { q: `Why is ${topic} important?`, a: "It is essential", d: ["It is not", "Only on weekends", "Maybe"] }
            ],
            exam: [
                { q: `Explain ${topic} in your own words.`, a: "A summary of the topic", d: ["Incorrect summary", "Unrelated fact", "None"] },
                { q: `Give an example related to ${topic}.`, a: "Relevant example", d: ["Irrelevant one", "Nothing", "Something else"] }
            ]
        });
    }
}

const content = `module.exports = ${JSON.stringify(curriculum, null, 2)};`;
fs.writeFileSync(path.join(__dirname, 'curriculum_science_data.js'), content);
console.log("Generated full Science curriculum data!");
