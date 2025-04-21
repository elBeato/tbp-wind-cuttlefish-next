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
  const [thresholdData, setThresholdData] = useState<any>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('registerData');
    const savedThresholds = localStorage.getItem('registerThresholds');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData(parsedData);
    }
    if (savedThresholds) {
      const parsedThresholds = JSON.parse(savedThresholds);
      setThresholdData(parsedThresholds);
    }
  }, []);

  const handleGoHome = () => {
    localStorage.removeItem('registerData');
    router.push('/');
  };

  if (!userData) {
    return <p>Loading...</p>; // Show a loading message while userData is being fetched
  }

  if (!thresholdData) {
    return <p>Loading...</p>; // Show a loading message while userData is being fetched
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Registration Successful! 🎉</h1>
      <p className={styles.message}>Thank you for registering! Here is your submitted information:</p>

      <div className={styles.infoBox}>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Mobile:</strong> {userData.mobile}</p>
        <p><strong>Subscriptions:</strong></p>
        <ul className={styles.list}>
          {userData.subscriptions.length > 0 ? (
            userData.subscriptions.map((station: Station) => (
              <li key={station.id} className={styles.listItem}>
                {station.name.length > 40 ? `${station.name.slice(0, 40)}...` : station.name}: 
                {thresholdData && thresholdData.find((threshold: any) => threshold.station === station.id)
                  ? ` > ${thresholdData.find((threshold: any) => threshold.station === station.id).threshold} knots`
                  : 'No threshold set'}
              </li>
            ))
          ) : (
            <li className={styles.listItem}>No subscriptions selected </li>
          )}
        </ul>
      </div>

      <button onClick={handleGoHome} className={styles.button}>Go to Home</button>
    </div>
  );
};

export default SuccessPage;
