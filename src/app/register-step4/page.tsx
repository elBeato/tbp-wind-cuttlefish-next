'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './registerPage.module.css';

interface Station {
  id: number;
  name: string;
}

interface Thresholds {
  username: string;
  station: number;
  threshold: number;
}

const ThresholdSettings: React.FC = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const [stationsList, setStationsList] = useState<Station[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds[]>([]);
  const [formData, setFormData] = useState<any>(null);

  // Load stations data
  useEffect(() => {
    fetch("/stations.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Stations list loaded:", data); // Debugging line
        setStationsList(data);
      })
      .catch(() => {
        console.error("Failed to load stations data");
      });
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem('registerData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem('registerData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.subscriptions) {
        setSubscriptions(parsedData.subscriptions);
  
        // Initialize thresholds for all subscribed stations
        const savedThresholds = parsedData.subscriptions.map((stationId: number) => ({
          username: parsedData.username,
          station: stationId,
          threshold: 25, // Default threshold value
        }));
        setThresholds(savedThresholds);
      }
    }
  }, []);

  // Handle threshold change
  const handleThresholdChange = (stationId: number, value: number) => {
    setThresholds((prev) =>
      prev.map((threshold) =>
        threshold.station === stationId
          ? { ...threshold, threshold: value }
          : threshold
      )
    );
  };

  // Map the station IDs to their names
  const translatedSubscriptions = subscriptions.map((id) => {
    const station = stationsList.find((station) => station.id === id);
    if (!station) {
      console.warn(`Station with ID ${id} not found in stations list.`);
    }
    return station ? `${station.id}: ${station.name}` : `${id}: Station not found`;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) {
      console.error('No form data found.');
      return;
    }

    const finalData = { ...formData, subscriptions };
    console.log(JSON.stringify(finalData));

    try {
      console.log('Sending data to server:', JSON.stringify(thresholds));
      const responseUsers = await fetch('http://localhost:5050/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      const responseThresholds = await fetch('http://localhost:5050/thresholds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(thresholds),
      });

      if (!responseUsers.ok) throw new Error('Failed to register user');
      if (!responseThresholds.ok) throw new Error('Failed to register thresholds');

      const dataUsers = await responseUsers.json();
      console.log('Registration successful:', dataUsers);
      const data = await responseThresholds.json();
      console.log('Thresholds successful:', data);
      router.push('/success');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h1 className={styles.heading}>Set Wind Speed Thresholds</h1>
        <p className={styles.info}>Adjust the slider for each station (5-50 knots)</p>
        {subscriptions.length > 0 ? (
          <ul className={styles.list}>
          {subscriptions.map((stationId) => {
            const station = stationsList.find((s) => s.id === stationId);
            if (!station) {
              console.warn(`Station with ID ${stationId} not found in stations list.`);
              return null;
            }
            return (
              <li key={station.id} className={styles.listItem}>
                <div className={styles.row}>
                  <span className={styles.stationName}>{station.name}</span>
                  <div className={styles.sliderContainer}>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={
                        thresholds.find((threshold) => threshold.station === station.id)?.threshold || 25
                      }
                      onChange={(e) => handleThresholdChange(station.id, Number(e.target.value))}
                    />
                    <span className={styles.thresholdValue}>
                      {thresholds.find((threshold) => threshold.station === station.id)?.threshold || 25} knots
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        ) : (
          <p>No subscribed stations found.</p>
        )}
        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
};

export default ThresholdSettings;
