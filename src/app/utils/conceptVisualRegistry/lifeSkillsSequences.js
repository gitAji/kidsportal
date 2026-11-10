import SequenceOrderer from '@/app/components/ui/concept-visuals/SequenceOrderer';

// Tap-the-steps-into-order rounds for Life Skills lessons that are
// naturally a sequence (a routine, a safety drill, a plan), reusing
// the existing SequenceOrderer component built for Coding lessons —
// its "jumbled steps, tap them in order" mechanic fits just as well
// here. Own file for the same conflict-avoidance reason as the other
// conceptVisualRegistry/* files.
const entry = (scenarios) => ({ Component: SequenceOrderer, props: { scenarios } });

export default {
  'lifeskills-1-level-2-lesson': entry([
    { title: 'Tidying Up After Playing', steps: ['Finish playing with your toys', 'Pick the toys up off the floor', 'Put the toys back in their place', 'Check your room looks tidy'] },
  ]),
  'lifeskills-2-level-1-lesson': entry([
    { title: 'Getting Ready for Bed', steps: ['Put on pyjamas', 'Brush your teeth', 'Read a short story', 'Turn off the light and sleep'] },
  ]),
  'lifeskills-2-level-6-lesson': entry([
    { title: 'Stop, Drop, and Roll', steps: ['Stop where you are', 'Drop to the ground', 'Roll back and forth', 'Flames are put out'] },
  ]),
  'lifeskills-3-level-2-lesson': entry([
    { title: 'Planning a Study Afternoon', steps: ['Make a to-do list', 'Do the hardest task first', 'Take a short break', 'Finish the easier tasks'] },
  ]),
  'lifeskills-3-level-3-lesson': entry([
    { title: 'Treating a Small Cut', steps: ['Wash the cut gently with clean water', 'Press a clean cloth on the cut', 'Wait for the bleeding to stop', 'Cover it with a plaster'] },
  ]),
};
