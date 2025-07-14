"use client";

import { useEffect, useState } from 'react';

const AnimatedNumber = ({ value }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const duration = 1500; // Animation duration in ms

  useEffect(() => {
    let startValue = 0;
    const endValue = parseInt(value.replace(/,/g, ''));
    const startTime = Date.now();

    const updateValue = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      if (elapsedTime >= duration) {
        setCurrentValue(endValue);
        return;
      }
      const progress = elapsedTime / duration;
      const animatedValue = Math.floor(progress * endValue);
      setCurrentValue(animatedValue);
      requestAnimationFrame(updateValue);
    };

    requestAnimationFrame(updateValue);
  }, [value]);

  return (
    <p className="mt-4 text-4xl font-extrabold text-gray-800">
      {currentValue.toLocaleString()}+
    </p>
  );
};

export default AnimatedNumber;
