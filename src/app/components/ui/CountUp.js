"use client";

import CountUp from "react-countup";

const AnimatedNumber = ({ number, duration = 2.5, className = "" }) => {
  return (
    <CountUp
      end={number}
      duration={duration}
      className={className}
      enableScrollSpy={true}
      scrollSpyOnce={true}
    />
  );
};

export default AnimatedNumber;
