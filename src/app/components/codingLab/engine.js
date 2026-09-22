// Runs Blockly-generated JS against a recording API instead of executing it
// for real, so every game can animate the resulting command list step by
// step rather than having student code touch the DOM/state directly.

const MAX_COMMANDS = 250;

export class TooManyStepsError extends Error {
  constructor() {
    super("Whoa, that's a lot of steps! Try a smaller repeat.");
    this.name = 'TooManyStepsError';
  }
}

export function runLabCode(code) {
  const commands = [];
  const guard = () => {
    if (commands.length >= MAX_COMMANDS) throw new TooManyStepsError();
  };
  const api = {
    moveForward: () => { guard(); commands.push({ type: 'move' }); },
    turnLeft: () => { guard(); commands.push({ type: 'turnLeft' }); },
    turnRight: () => { guard(); commands.push({ type: 'turnRight' }); },
    setColor: (color) => { guard(); commands.push({ type: 'color', color }); },
    stamp: (shape) => { guard(); commands.push({ type: 'stamp', shape }); },
  };

  // eslint-disable-next-line no-new-func -- sandboxed against a fixed `api`,
  // running only the student's own Blockly-generated code in their own browser.
  const run = new Function('api', code || '');
  run(api);

  return commands;
}
