'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './registerPage.module.css';
import config from '../util/util';

interface Station {
  id: number;
  name: string;
}

interface Thresholds {
  username: string;
  name: string;
  station: number;
  threshold: number;
}

const ThresholdSettings: React.FC = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Station[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds[]>([]);
  const [formData, setFormData] = useState<any>(null);

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
        const savedThresholds = parsedData.subscriptions.map((stationId: Station) => ({
          username: parsedData.username,
          name: stationId.name,
          station: stationId.id,
          threshold: 25, // Default threshold value
        }));
        setThresholds(savedThresholds);

      }
    }
  }, []);

  // Handle threshold change
  const handleThresholdChange = (stationId: Station, value: number) => {
    setThresholds((prev) =>
      prev.map((threshold) =>
        threshold.station === stationId.id
          ? { ...threshold, threshold: value }
          : threshold
      )
    );
  };

  // Map the station IDs to their names
  subscriptions.map((subscript) => {
    const station = subscriptions.find((station) => station === subscript);
    if (!station) {
      console.warn(`Station with ID ${subscript} not found in stations list.`);
    }
    return station ? `${station.id}: ${station.name}` : `${subscript}: Station not found`;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) {
      console.error('No form data found.');
      return;
    }

    const finalData = { ...formData, subscriptions };
    localStorage.setItem('registerThresholds', JSON.stringify(thresholds)); // Store data
    try {
      const responseUsers = await fetch(`${config.apiBaseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      const responseThresholds = await fetch(`${config.apiBaseUrl}/api/thresholds`, {
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
            const station = subscriptions.find((s) => s === stationId);
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
                      onChange={(e) => handleThresholdChange(station, Number(e.target.value))}
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
