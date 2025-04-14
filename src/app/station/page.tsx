"use client";

import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { useRouter } from "next/navigation";
import styles from "./Chart.module.css";
import config from "../util/util";

const StationChart: React.FC = () => {
  interface Station {
    id: number;
    name: string;
  }

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [onlineStations, setOnlineStations] = useState<Station[]>([]); // Online stations
  const [sortOrder, setSortOrder] = useState<"onlineFirst" | "offlineFirst" | "none">("onlineFirst");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Load stations from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/windguru/stations`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const stationsResponse = await response.json();
          setOnlineStations(stationsResponse.stations);
        } else {
          throw new Error('Failed to check username.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("stations.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStations(data); // Assuming the JSON is an array of stations
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };
    fetchData();
  }, []);

  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedStations = [...filteredStations].sort((a, b) => {
    if (sortOrder === "onlineFirst") {
      const isAOnline = onlineStations.some((onlineStation) => onlineStation.id === a.id);
      const isBOnline = onlineStations.some((onlineStation) => onlineStation.id === b.id);
      return Number(isBOnline) - Number(isAOnline); // Online stations first
    } else if (sortOrder === "offlineFirst") {
      const isAOnline = onlineStations.some((onlineStation) => onlineStation.id === a.id);
      const isBOnline = onlineStations.some((onlineStation) => onlineStation.id === b.id);
      return Number(isAOnline) - Number(isBOnline); // Offline stations first
    } else {
      return 0; // Clear filter: Keep original order
    }
  });

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const router = useRouter(); // Initialize the router
    const station = sortedStations[index];
    const isOnline = onlineStations.some((onlineStation) => onlineStation.id === station.id);
  
    const handleRowClick = () => {
      if (isOnline) {
        router.push(`/register-step1?stationId=${station.id}`); // Navigate to the register page with the station ID
      }
    };
  
    return (
      <div
        style={style}
        className={`${styles.row} ${isOnline ? styles.clickableRow : styles.disabledRow}`} // Add a disabledRow class for offline stations
        onClick={handleRowClick} // Handle row click
      >
        <span className={styles.id}>{station.id}</span>
        <span className={`${styles.name} ${!isOnline ? styles.offline : ""}`}>
          {station.name}
        </span>
        {isOnline && (
          <span className={styles.heart}>
            <div className={styles.waveIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Loading stations...</div>; // Show loading indicator
  }

  return (
    <div>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => setSortOrder("onlineFirst")}
          className={`${styles.sortButton} ${sortOrder === "onlineFirst" ? styles.activeButton : ""}`}
        >
          Online First
        </button>
        <button
          onClick={() => setSortOrder("offlineFirst")}
          className={`${styles.sortButton} ${sortOrder === "offlineFirst" ? styles.activeButton : ""}`}
        >
          Offline First
        </button>
        <button
          onClick={() => setSortOrder("none")} // Clear filter
          className={`${styles.sortButton} ${sortOrder === "none" ? styles.activeButton : ""}`}
        >
          Clear Filter
        </button>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for a station..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.container}>
        <h1 className={styles.heading}>Station Chart</h1>
        <List
          height={500} // Height of the scrollable area
          itemCount={sortedStations.length} // Total number of items
          itemSize={50} // Height of each row
          width="100%" // Width of the list
        >
          {Row}
        </List>
      </div>
    </div>
  );
};

export default StationChart;
