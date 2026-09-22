// Custom, kid-friendly Blockly block definitions + JS generators shared by
// every Coding Build Lab game (maze runner, pattern match, free build).
// Kept deliberately small and self-contained (no built-in Blockly blocks)
// so wording, colors and step-count are fully in our control.

let registered = false;

export function registerLabBlocks(Blockly, javascriptGenerator) {
  if (registered) return;
  registered = true;

  Blockly.defineBlocksWithJsonArray([
    {
      type: 'lab_start',
      message0: '▶️ Start',
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      colour: 135,
      tooltip: 'Your program begins here. Snap blocks inside!',
    },
    {
      type: 'lab_move_forward',
      message0: '🚶 move forward',
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: 'Move one step forward.',
    },
    {
      type: 'lab_turn_left',
      message0: '↶ turn left',
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: 'Turn left 90 degrees.',
    },
    {
      type: 'lab_turn_right',
      message0: '↷ turn right',
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: 'Turn right 90 degrees.',
    },
    {
      type: 'lab_repeat',
      message0: '🔁 repeat %1 times',
      args0: [{ type: 'field_number', name: 'TIMES', value: 3, min: 1, max: 12, precision: 1 }],
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      colour: 30,
      tooltip: 'Repeat the blocks inside this many times.',
    },
    {
      type: 'lab_set_color',
      message0: '🎨 set color to %1',
      args0: [{
        type: 'field_dropdown',
        name: 'COLOR',
        options: [
          ['red', 'red'],
          ['blue', 'blue'],
          ['green', 'green'],
          ['yellow', 'yellow'],
          ['purple', 'purple'],
          ['orange', 'orange'],
        ],
      }],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Set the color used by the next stamp or trail.',
    },
    {
      type: 'lab_stamp',
      message0: '⭐ stamp a %1',
      args0: [{
        type: 'field_dropdown',
        name: 'SHAPE',
        options: [
          ['circle', 'circle'],
          ['square', 'square'],
          ['star', 'star'],
          ['heart', 'heart'],
        ],
      }],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: 'Stamp a shape in the current color.',
    },
  ]);

  javascriptGenerator.forBlock['lab_start'] = function (block, generator) {
    return generator.statementToCode(block, 'DO');
  };
  javascriptGenerator.forBlock['lab_move_forward'] = function () {
    return "api.moveForward();\n";
  };
  javascriptGenerator.forBlock['lab_turn_left'] = function () {
    return "api.turnLeft();\n";
  };
  javascriptGenerator.forBlock['lab_turn_right'] = function () {
    return "api.turnRight();\n";
  };
  javascriptGenerator.forBlock['lab_repeat'] = function (block, generator) {
    const times = Math.max(1, Math.min(12, Number(block.getFieldValue('TIMES')) || 1));
    const branch = generator.statementToCode(block, 'DO');
    const loopVar = generator.nameDB_.getDistinctName('count', 'VARIABLE');
    return `for (let ${loopVar} = 0; ${loopVar} < ${times}; ${loopVar}++) {\n${branch}}\n`;
  };
  javascriptGenerator.forBlock['lab_set_color'] = function (block) {
    const color = block.getFieldValue('COLOR');
    return `api.setColor(${JSON.stringify(color)});\n`;
  };
  javascriptGenerator.forBlock['lab_stamp'] = function (block) {
    const shape = block.getFieldValue('SHAPE');
    return `api.stamp(${JSON.stringify(shape)});\n`;
  };
}
