import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Chart.module.css";
import config from "../lib/util";

interface Station {
  id: number;
  name: string;
}

const Station: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [onlineStations, setOnlineStations] = useState<Station[]>([]);
  const [sortOrder, setSortOrder] = useState<"onlineFirst" | "offlineFirst" | "none">("onlineFirst");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
        setStations(data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false);
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
      return Number(isBOnline) - Number(isAOnline);
    } else if (sortOrder === "offlineFirst") {
      const isAOnline = onlineStations.some((onlineStation) => onlineStation.id === a.id);
      const isBOnline = onlineStations.some((onlineStation) => onlineStation.id === b.id);
      return Number(isAOnline) - Number(isBOnline);
    } else {
      return 0;
    }
  });

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const navigate = useNavigate();
    const station = sortedStations[index];
    const isOnline = onlineStations.some((onlineStation) => onlineStation.id === station.id);
  
    const handleRowClick = () => {
      if (isOnline) {
        navigate(`/register-step1?stationId=${station.id}`);
      }
    };
  
    return (
      <div
        style={style}
        className={`${styles.row} ${isOnline ? styles.clickableRow : styles.disabledRow}`}
        onClick={handleRowClick}
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
    return <div className={styles.loading}>Loading stations...</div>;
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
          onClick={() => setSortOrder("none")}
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
          height={500}
          itemCount={sortedStations.length}
          itemSize={50}
          width="100%"
        >
          {Row}
        </List>
      </div>
    </div>
  );
};

export default Station;