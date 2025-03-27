'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './successPage.module.css';

// Define the Station type
interface Station {
  id: number;
  name: string;
}

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [stationsList, setStationsList] = useState<Station[]>([]);
  const [loadingStations, setLoadingStations] = useState<boolean>(true);

  // Load stations data
  useEffect(() => {
    fetch("/stations.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Stations list loaded:", data); // Debugging line
        setStationsList(data);
        setLoadingStations(false);
      })
      .catch(() => {
        setLoadingStations(false);
      });
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem('registerData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log("User data:", parsedData); // Debugging line
      setUserData(parsedData);
    }
  }, []);

  const handleGoHome = () => {
    localStorage.removeItem('registerData');
    router.push('/');
  };

  if (loadingStations || !userData) {
    return <div className={styles.container}>Loading your data...</div>;
  }

  const subscriptions = Array.isArray(userData.subscriptions) ? userData.subscriptions : [];

  // Map the station IDs to their names
  const translatedSubscriptions = subscriptions.map((id: number) => {
    const station = stationsList.find((station) => station.id === id);
    if (!station) {
      console.warn(`Station with ID ${id} not found in stations list.`);
    }
    return station ? `${station.id}: ${station.name}` : `${id}: Station not found`;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Registration Successful! 🎉</h1>
      <p className={styles.message}>Thank you for registering! Here is your submitted information:</p>

      <div className={styles.infoBox}>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Mobile:</strong> {userData.mobile}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <p><strong>Subscriptions:</strong></p>
        <ul className={styles.list}>
          {translatedSubscriptions.length > 0 ? (
            translatedSubscriptions.map((station: string, index: number) => (
              <li key={index} className={styles.listItem}>{station}</li>
            ))
          ) : (
            <li className={styles.listItem}>No subscriptions selected</li>
          )}
        </ul>
      </div>

      <button onClick={handleGoHome} className={styles.button}>Go to Home</button>
    </div>
  );
};

export default SuccessPage;
