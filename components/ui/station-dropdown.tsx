"use client";

import { useEffect, useState } from "react";

export default function StationDropdown() {
  const [stations, setStations] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);



  // Send JSON to backend
  const sendToBackend = async () => {
    const payload = { subscriptions: selectedStations };
    console.log("Sending:", JSON.stringify(payload));

    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  return (
    <div>
      <label>Select Station:</label>
      <select onChange={handleSelect}>
        <option value="">--Choose a Station--</option>
        {stations.map((station) => (
          <option key={station.id} value={station.name}>
            {station.name}
          </option>
        ))}
      </select>

      <h3>Selected IDs: {JSON.stringify(selectedStations)}</h3>

      <button onClick={sendToBackend}>Submit</button>
    </div>
  );
}
