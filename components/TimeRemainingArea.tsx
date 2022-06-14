import { useState, useEffect } from "react";

// endTime is the time date in epoch seconds until the auction finishes
export default function TimeRemainingArea({ endTime }: { endTime: number }) {
  const [timeRemaining, setTimeRemaining] = useState(endTime);

  //   Create a countdown that updates every second to show the time remaining
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(endTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    // Format timeRemaining as DD:HH:MM:SS
    <p>
      {"Auction Closes In: "}
      <b>
        {Math.floor(timeRemaining / 1000 / 60 / 60 / 24) +
          " Days, " +
          Math.floor((timeRemaining / 1000 / 60 / 60) % 24) +
          " Hours, " +
          Math.floor((timeRemaining / 1000 / 60) % 60) +
          " Minutes, " +
          Math.floor((timeRemaining / 1000) % 60) +
          " Seconds"}
      </b>
    </p>
  );
}
