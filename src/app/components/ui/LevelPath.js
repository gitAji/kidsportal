'use client';

import { useEffect, useState } from 'react';

const LevelPath = ({ cardRefs }) => {
  const [path, setPath] = useState('');

  useEffect(() => {
    if (cardRefs.length > 0) {
      const newPath = cardRefs.slice(1).map((ref, index) => {
        const prevRef = cardRefs[index];
        if (prevRef && prevRef.current && ref && ref.current && prevRef.current.parentElement && prevRef.current.parentElement.parentElement) {
          const prevRect = prevRef.current.getBoundingClientRect();
          const currentRect = ref.current.getBoundingClientRect();
          const containerRect = prevRef.current.parentElement.parentElement.getBoundingClientRect();

          if (containerRect) {
            const startX = prevRect.left - containerRect.left + prevRect.width / 2;
            const startY = prevRect.top - containerRect.top + prevRect.height / 2;
            const endX = currentRect.left - containerRect.left + currentRect.width / 2;
            const endY = currentRect.top - containerRect.top + currentRect.height / 2;

            return `M ${startX} ${startY} L ${endX} ${endY}`;
          }
        }
        return '';
      }).join(' ');
      setPath(newPath);
    }
  }, [cardRefs]);

  return (
    <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
      <path d={path} stroke="rgba(0, 0, 0, 0.2)" strokeWidth="4" strokeDasharray="10,5" />
    </svg>
  );
};

export default LevelPath;
  