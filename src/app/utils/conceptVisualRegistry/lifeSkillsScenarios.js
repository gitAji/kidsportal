import ScenarioPicker from '@/app/components/ui/concept-visuals/ScenarioPicker';

// "What would you do?" decision rounds for Life Skills' safety and
// social-skills lessons, built from each level's own lesson content in
// db.json. Kept in its own file (rather than adding to an existing
// registry file) so a new subject's wiring can't collide with
// someone else's new-visual PR landing on the same lines — see the
// comment in conceptVisuals.js for why that split exists.
const entry = (rounds) => ({ Component: ScenarioPicker, props: { rounds } });

const HYGIENE = [
  { situation: "It's almost time to eat lunch. What should you do first?", options: ['Sit down and start eating', 'Wash your hands with soap and water', 'Wipe your hands on your shirt'], correctIndex: 1, why: 'Washing your hands with soap before eating stops germs from making you sick.' },
  { situation: 'You just used the toilet. What should you do next?', options: ['Go straight back to playing', 'Wash your hands with soap and water', 'Wipe your hands on a towel only'], correctIndex: 1, why: 'Washing your hands after the toilet stops germs from spreading.' },
];

const HOME_SAFETY = [
  { situation: 'You want to cut some paper with scissors.', options: ['Use them alone in your room', 'Ask a grown-up to be with you', 'Run around holding them'], correctIndex: 1, why: 'Sharp objects like scissors should only be used with a grown-up watching.' },
  { situation: 'You hear a smoke alarm beeping at home.', options: ['Hide under your bed', 'Go back to sleep', 'Tell a grown-up straight away and get out'], correctIndex: 2, why: 'In an emergency like a fire, you should tell a grown-up straight away or call for help.' },
];

const OUTSIDE_SAFETY = [
  { situation: 'You need to cross the road.', options: ['Run across quickly', 'Stop, look both ways, and listen for cars', 'Close your eyes and walk'], correctIndex: 1, why: 'Before crossing the road, always stop, look both ways, and listen for cars.' },
  { situation: "A stranger says 'Come with me, it's an emergency!'", options: ['Go with them because they said emergency', 'Say no and find a trusted adult', 'Get in their car quickly'], correctIndex: 1, why: "You should never go anywhere with a stranger, even if they say it's an emergency." },
];

const TEAMWORK = [
  { situation: 'Your team is building a tower together and a friend has a different idea.', options: ['Ignore their idea completely', 'Listen to their idea and talk about it', 'Tell them their idea is silly'], correctIndex: 1, why: "Listening to other people's ideas, even if different from yours, makes a team stronger." },
  { situation: 'Everyone in your group needs to help clean up after a game.', options: ['Do your part to help', 'Let everyone else do it', 'Walk away'], correctIndex: 0, why: 'When everyone does their part and helps each other, the whole team does better.' },
];

const CONFLICT = [
  { situation: 'You and a friend both want to use the same toy.', options: ['Shout and grab it', 'Take turns using it', 'Hide the toy'], correctIndex: 1, why: 'Finding a solution that works for both of you, like taking turns, is a fair way to solve a problem.' },
  { situation: "You disagree with a friend about a game's rules.", options: ['Calmly explain how you feel', 'Shout at them', 'Stop being their friend'], correctIndex: 0, why: 'It helps to calmly explain how you feel instead of shouting or getting angry.' },
];

const INTERNET_SAFETY = [
  { situation: 'Someone you only know online asks for your home address.', options: ['Tell them your address', "Say no and don't share it", 'Ask them why first'], correctIndex: 1, why: 'You should never share your name, address, or school with someone you only know online.' },
  { situation: 'Something online makes you feel scared or uncomfortable.', options: ['Keep it a secret', 'Tell a trusted grown-up straight away', 'Ignore it and keep scrolling'], correctIndex: 1, why: 'If something online makes you feel uncomfortable, tell a trusted grown-up straight away.' },
];

const STRANGER_DANGER = [
  { situation: 'A stranger offers you a gift and asks you to come with them.', options: ['Take the gift and go with them', 'Say no loudly and find a trusted adult', 'Politely say yes'], correctIndex: 1, why: "It's never safe to go anywhere with a stranger or accept gifts from them, even if they seem nice." },
  { situation: "Someone says they were 'sent by your parents' to pick you up.", options: ['Go with them straight away', 'Ask for the family password to check', "Assume it's true because they said so"], correctIndex: 1, why: 'A family password can help you check if someone claiming to be sent by your parents is telling the truth.' },
];

const DIGITAL_CITIZEN = [
  { situation: "You're about to post a message about a friend when you're annoyed at them.", options: ['Post it right away', "Think about whether it could hurt them, and don't post it", 'Post it and see what happens'], correctIndex: 1, why: 'Before sharing a photo or message, think about whether it could embarrass or hurt someone else.' },
  { situation: 'You see someone being bullied online.', options: ['Join in', 'Ignore it', 'Tell a trusted adult'], correctIndex: 2, why: 'If you see someone being bullied online, telling a trusted adult is an important and brave thing to do.' },
];

export default {
  'lifeskills-1-level-1-lesson': entry(HYGIENE),
  'lifeskills-1-level-6-lesson': entry(HOME_SAFETY),
  'lifeskills-1-level-7-lesson': entry(OUTSIDE_SAFETY),
  'lifeskills-2-level-4-lesson': entry(TEAMWORK),
  'lifeskills-2-level-5-lesson': entry(CONFLICT),
  'lifeskills-2-level-7-lesson': entry(INTERNET_SAFETY),
  'lifeskills-3-level-4-lesson': entry(STRANGER_DANGER),
  'lifeskills-3-level-5-lesson': entry(DIGITAL_CITIZEN),
};
