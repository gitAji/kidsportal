import React, { useState } from 'react';

const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {show && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg shadow-sm opacity-90 ${positionClasses[position]} whitespace-nowrap`}
        >
          {text}
          <div className="absolute w-2 h-2 bg-gray-700 transform rotate-45"
            style={position === 'top' ? { bottom: '-4px', left: '50%', marginLeft: '-4px' } : 
                   position === 'bottom' ? { top: '-4px', left: '50%', marginLeft: '-4px' } : 
                   position === 'left' ? { right: '-4px', top: '50%', marginTop: '-4px' } : 
                   { left: '-4px', top: '50%', marginTop: '-4px' }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
