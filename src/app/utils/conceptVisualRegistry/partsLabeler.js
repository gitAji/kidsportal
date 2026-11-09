import PartsLabeler from '@/app/components/ui/concept-visuals/PartsLabeler';

const PLANT_DIAGRAMS = [
  { scene: 'plant', title: 'Parts of a Flowering Plant', parts: [
    { label: 'Roots', x: 100, y: 200, fact: 'Roots soak up water from the soil and hold the plant steady.' },
    { label: 'Stem', x: 100, y: 130, fact: 'The stem carries water up to the leaves and flower.' },
    { label: 'Leaf', x: 78, y: 72, fact: 'Leaves catch sunlight and make food for the plant.' },
    { label: 'Flower', x: 100, y: 42, fact: 'The flower makes seeds so new plants can grow.' },
  ] },
  { scene: 'tree', title: 'Parts of a Tree', parts: [
    { label: 'Roots', x: 100, y: 210, fact: 'Roots dig deep underground to find water and hold the tree up.' },
    { label: 'Trunk', x: 100, y: 175, fact: 'The trunk is the thick, woody stem that supports the whole tree.' },
    { label: 'Branches', x: 85, y: 125, fact: 'Branches grow out from the trunk and hold up the leaves.' },
    { label: 'Leaves', x: 100, y: 65, fact: 'Leaves use sunlight to make food for the tree.' },
  ] },
];

const SENSES_DIAGRAMS = [
  { scene: 'face', title: 'Your Senses: Eyes, Ears, Nose & Mouth', parts: [
    { label: 'Eyes', x: 100, y: 83, fact: 'Eyes let you see shapes, colours and movement.' },
    { label: 'Ears', x: 148, y: 98, fact: 'Ears let you hear sounds like music and voices.' },
    { label: 'Nose', x: 100, y: 108, fact: 'Your nose lets you smell things like flowers or food.' },
    { label: 'Mouth', x: 100, y: 130, fact: 'Your mouth and tongue let you taste sweet, sour, salty and bitter foods.' },
  ] },
  { scene: 'hand', title: 'Your Sense of Touch', parts: [
    { label: 'Skin', x: 100, y: 125, fact: 'The skin on your hands can feel if something is soft, hard, hot or cold.' },
  ] },
];

const SKELETON_BONES = { scene: 'skeleton', title: 'Parts of the Skeleton', parts: [
  { label: 'Skull', x: 100, y: 28, fact: 'The skull is hard bone that protects your brain.' },
  { label: 'Ribcage', x: 100, y: 75, fact: 'The ribcage is a cage of curved bones that protects your heart and lungs.' },
  { label: 'Spine', x: 100, y: 110, fact: "The spine is a chain of small bones that lets you bend and stand up straight." },
  { label: 'Arm bones', x: 50, y: 80, fact: 'Arm bones are long and straight, and let your arms lift and carry things.' },
  { label: 'Leg bones', x: 65, y: 180, fact: 'Leg bones are the strongest, longest bones — they hold up your whole body.' },
] };

const SKELETON_JOINTS = { scene: 'skeleton', title: 'Finding the Joints', parts: [
  { label: 'Shoulder joint', x: 100, y: 90, fact: 'The shoulder joint lets your whole arm swing round in a big circle.' },
  { label: 'Elbow joint', x: 58, y: 60, fact: 'The elbow joint lets your arm bend in the middle.' },
  { label: 'Hip joint', x: 100, y: 120, fact: 'The hip joint lets your leg swing forward, backward and sideways.' },
  { label: 'Knee joint', x: 68, y: 162, fact: 'The knee joint lets your leg bend so you can walk, run and sit down.' },
] };

const INSECT_DIAGRAM = [{ scene: 'insect', title: "An Insect's Body Parts", parts: [
  { label: 'Antennae', x: 100, y: 15, fact: 'Antennae help an insect feel, smell and sense what is around it.' },
  { label: 'Head', x: 100, y: 44, fact: 'The head has the eyes, mouth and antennae on it.' },
  { label: 'Thorax', x: 100, y: 85, fact: 'The thorax is the middle section — legs and wings attach here.' },
  { label: 'Abdomen', x: 100, y: 142, fact: 'The abdomen is the largest part, holding the parts that help the insect digest food and breathe.' },
  { label: 'Legs', x: 55, y: 102, fact: 'Most insects have six legs, all attached to the thorax.' },
] }];

export default {
  'science-1-level-21-lesson': { Component: PartsLabeler, props: { diagrams: PLANT_DIAGRAMS } },
  'science-3-level-14-lesson': { Component: PartsLabeler, props: { diagrams: PLANT_DIAGRAMS } },
  'science-1-level-11-lesson': { Component: PartsLabeler, props: { diagrams: SENSES_DIAGRAMS } },
  'science-1-level-18-lesson': { Component: PartsLabeler, props: { diagrams: SENSES_DIAGRAMS } },
  'science-3-level-22-lesson': { Component: PartsLabeler, props: { diagrams: [SKELETON_BONES, SKELETON_JOINTS] } },
  'science-2-level-21-lesson': { Component: PartsLabeler, props: { diagrams: INSECT_DIAGRAM } },
};
