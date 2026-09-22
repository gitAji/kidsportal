"use client";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { registerLabBlocks } from './blocklyBlocks';
import { runLabCode } from './engine';

// Thin client-only wrapper around Blockly. Blockly touches the DOM directly
// on import, so everything (including the library itself) is loaded inside
// useEffect rather than at module scope, which would break SSR.
const BlocklyWorkspace = forwardRef(function BlocklyWorkspace({ blocks, height = 420 }, ref) {
  const containerRef = useRef(null);
  const workspaceRef = useRef(null);
  const blocklyRef = useRef(null);
  const generatorRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;

    (async () => {
      const Blockly = await import('blockly/core');
      await import('blockly/blocks');
      const En = await import('blockly/msg/en');
      const { javascriptGenerator } = await import('blockly/javascript');
      Blockly.setLocale(En);

      if (disposed || !containerRef.current) return;

      registerLabBlocks(Blockly, javascriptGenerator);
      blocklyRef.current = Blockly;
      generatorRef.current = javascriptGenerator;

      const toolboxXml = `<xml>${blocks.map(b => `<block type="${b}"></block>`).join('')}</xml>`;

      const workspace = Blockly.inject(containerRef.current, {
        toolbox: toolboxXml,
        trashcan: true,
        zoom: { controls: true, wheel: true, startScale: 0.95 },
        grid: { spacing: 24, length: 2, colour: '#e2e8f0', snap: true },
        move: { scrollbars: true, drag: true, wheel: false },
      });
      workspaceRef.current = workspace;

      const startBlock = workspace.newBlock('lab_start');
      startBlock.initSvg();
      startBlock.render();
      startBlock.setDeletable(false);
      startBlock.setMovable(false);
      startBlock.moveBy(24, 24);

      setReady(true);
    })();

    return () => {
      disposed = true;
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- blocks list is fixed per game instance
  }, []);

  useImperativeHandle(ref, () => ({
    run() {
      if (!workspaceRef.current || !generatorRef.current) return [];
      const code = generatorRef.current.workspaceToCode(workspaceRef.current);
      return runLabCode(code);
    },
    reset() {
      if (!workspaceRef.current || !blocklyRef.current) return;
      const workspace = workspaceRef.current;
      workspace.getTopBlocks(false).forEach(block => {
        if (block.type !== 'lab_start') block.dispose(false);
      });
    },
  }), []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-200 bg-white" style={{ height }}>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-white text-slate-400 font-bold text-sm">
          Loading blocks…
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
});

export default BlocklyWorkspace;
