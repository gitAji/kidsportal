// Target sequences for the pattern-matching game. Each entry in `target`
// is stamped in order; color carries over from the last `lab_set_color`
// block, exactly like the student's own program.
const patternLevels = [
  {
    id: 'pattern-1',
    name: 'Two by Two',
    target: [
      { shape: 'circle', color: 'red' },
      { shape: 'circle', color: 'blue' },
      { shape: 'circle', color: 'red' },
      { shape: 'circle', color: 'blue' },
    ],
    hint: 'A repeat block can make red-then-blue happen twice!',
  },
  {
    id: 'pattern-2',
    name: 'Squares & a Star',
    target: [
      { shape: 'square', color: 'green' },
      { shape: 'square', color: 'green' },
      { shape: 'star', color: 'yellow' },
    ],
    hint: 'Repeat the green square twice, then stamp one yellow star.',
  },
  {
    id: 'pattern-3',
    name: 'Heart Chain',
    target: [
      { shape: 'heart', color: 'purple' },
      { shape: 'heart', color: 'orange' },
      { shape: 'heart', color: 'purple' },
      { shape: 'heart', color: 'orange' },
      { shape: 'heart', color: 'purple' },
    ],
    hint: 'Purple, orange, purple, orange, purple — five hearts in total.',
  },
  {
    id: 'pattern-4',
    name: 'Star Squad',
    target: [
      { shape: 'star', color: 'red' },
      { shape: 'star', color: 'red' },
      { shape: 'star', color: 'red' },
      { shape: 'star', color: 'blue' },
      { shape: 'star', color: 'blue' },
      { shape: 'star', color: 'blue' },
    ],
    hint: 'Two repeat blocks: three red stars, then three blue stars.',
  },
  {
    id: 'pattern-5',
    name: 'Rainbow Row',
    target: [
      { shape: 'circle', color: 'red' },
      { shape: 'square', color: 'blue' },
      { shape: 'star', color: 'green' },
      { shape: 'heart', color: 'yellow' },
      { shape: 'circle', color: 'purple' },
    ],
    hint: 'No shortcuts here — build all five, one at a time.',
  },
];

export default patternLevels;
