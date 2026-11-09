import CycleExplorer from '@/app/components/ui/concept-visuals/CycleExplorer';

const ANIMAL_LIFE_CYCLES = [
  { title: 'The Butterfly Life Cycle', stages: [
    { label: 'Egg', emoji: '🥚', fact: 'A butterfly starts life as a tiny egg laid on a leaf.' },
    { label: 'Caterpillar', emoji: '🐛', fact: 'The egg hatches into a caterpillar that eats and grows.' },
    { label: 'Pupa', emoji: '🛡️', fact: 'The caterpillar forms a hard case called a pupa, or chrysalis.' },
    { label: 'Butterfly', emoji: '🦋', fact: 'A fully grown butterfly emerges and can fly and lay new eggs.' },
  ] },
  { title: 'The Frog Life Cycle', stages: [
    { label: 'Egg', emoji: '🥚', fact: 'Frogs lay their eggs in water, often in clumps called frogspawn.' },
    { label: 'Tadpole', emoji: '🐠', fact: 'The egg hatches into a tadpole that swims and breathes with gills.' },
    { label: 'Froglet', emoji: '🐸', fact: 'The tadpole grows legs and starts to look like a tiny frog.' },
    { label: 'Frog', emoji: '🐸', fact: 'A fully grown frog can hop on land and lay new eggs in water.' },
  ] },
];

const PLANT_GROWTH_CYCLE = [
  { title: 'How a Plant Grows', stages: [
    { label: 'Seed', emoji: '🌰', fact: 'A seed is planted in soil, where it has everything it needs to start growing.' },
    { label: 'Sprout', emoji: '🌱', fact: 'The seed sprouts, sending a tiny root down and a shoot up.' },
    { label: 'Seedling', emoji: '🌿', fact: 'The seedling grows leaves that catch sunlight to make food.' },
    { label: 'Flowering Plant', emoji: '🌻', fact: 'A grown plant flowers, and the flower makes new seeds to start the cycle again.' },
  ] },
];

const WATER_CYCLE = [
  { title: 'The Water Cycle', stages: [
    { label: 'Evaporation', emoji: '☀️', fact: 'The sun heats water in rivers and seas, turning it into invisible water vapour that rises.' },
    { label: 'Condensation', emoji: '☁️', fact: 'The water vapour cools high in the sky and turns back into tiny droplets, forming clouds.' },
    { label: 'Precipitation', emoji: '🌧️', fact: 'The droplets in clouds join together and fall back down as rain, snow or hail.' },
    { label: 'Collection', emoji: '🌊', fact: 'The rain collects in rivers, lakes and seas, ready to evaporate all over again.' },
  ] },
];

export default {
  'science-2-level-11-lesson': { Component: CycleExplorer, props: { cycles: ANIMAL_LIFE_CYCLES } },
  'science-2-level-17-lesson': { Component: CycleExplorer, props: { cycles: PLANT_GROWTH_CYCLE } },
  'science-3-level-8-lesson': { Component: CycleExplorer, props: { cycles: WATER_CYCLE } },
  'science-3-level-12-lesson': { Component: CycleExplorer, props: { cycles: WATER_CYCLE } },
};
