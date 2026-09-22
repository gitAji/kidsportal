// Maze data for the Build Lab's maze runner game. Grids read top-to-bottom;
// '#' = wall, '.' = open path, 'S' = start, 'G' = goal. Directions: 0=N, 1=E, 2=S, 3=W.
const mazeLevels = [
  {
    id: 'maze-1',
    name: 'Straight Line',
    grid: ['S.....G'],
    startDir: 1,
    hint: 'Try "repeat 6 times { move forward }".',
  },
  {
    id: 'maze-2',
    name: 'One Turn',
    grid: [
      'S.#',
      '#.#',
      '#.G',
    ],
    startDir: 1,
    hint: 'Move forward, turn right, move forward twice, turn left, move forward.',
  },
  {
    id: 'maze-3',
    name: 'Long Corridor',
    grid: ['S........G'],
    startDir: 1,
    hint: 'A repeat block makes this much shorter to build!',
  },
  {
    id: 'maze-4',
    name: 'Zig Zag',
    grid: [
      'S..#',
      '##.#',
      '#..#',
      '#..G',
    ],
    startDir: 1,
    hint: 'East x2, turn right, south x3, turn left, east x1.',
  },
  {
    id: 'maze-5',
    name: 'The Big Loop',
    grid: [
      'S....',
      '###.#',
      '....#',
      '.####',
      '....G',
    ],
    startDir: 1,
    hint: 'This one has four turns — take it step by step!',
  },
];

export default mazeLevels;
