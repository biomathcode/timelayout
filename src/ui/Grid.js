import React, { useEffect, useMemo, useState } from "react";
// Import or define your styling

export const TimeTracker = ({ totalHours = 24 }) => {
  const [percentage, setPercentage] = useState(0);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updatePercentage = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const percentageCompleted = (totalMinutes / (totalHours * 60)) * 100;

      setPercentage(percentageCompleted);
    };

    // Update the percentage initially and every minute
    updatePercentage();
    let timer = setInterval(updatePercentage, 60000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const memoizedComponent = useMemo(
    () => (
      <div
        className="time-tracker"
        aria-hidden={true}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ top: percentage + "%", marginTop: "40px" }}
      >
        <div className="timer">{formattedTime}</div>
        <div aria-hidden={true} className="ball" />
        <div aria-hidden={true} className="ball-line" />
      </div>
    ),
    [percentage]
  );

  return memoizedComponent;
};

const VerticalGrid = () => {
  // Create an array of time slots from 0 to 24 hours with half-hour intervals
  const timeSlots = Array.from({ length: 48 }, (_, index) => index * 0.5);

  return (
    <div className="vertical-grid-container">
      {/* <TimeTracker /> */}
      {timeSlots.map((time, index) => (
        <div key={index} className="grid-item">
          {time % 1 === 0 ? (
            <>
              <div className="hour-marker">
                {time > 12 ? time - 12 : time}:00 {time > 12 ? "PM" : "AM"}
              </div>
              <div className="ticker"></div>
            </>
          ) : (
            <>
              {/* <div className="ticker"></div>
              <div className="half-hour-marker">
                {time % 1 === 0.5 ? "30" : "00"}
              </div> */}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default VerticalGrid;
