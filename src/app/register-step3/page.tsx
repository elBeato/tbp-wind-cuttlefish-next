'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './registerPage.module.css';
import config from '../util/util';

// Define the Station type
interface Station {
  id: number;
  name: string;
}

const RegisterStep3: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [stationsList, setStationsList] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [subscriptions, setSubscriptions] = useState<Station[]>([]); // Store station IDs
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

	useEffect(() => {
		const savedData = localStorage.getItem('registerData');
		if (savedData) {
		  setFormData(JSON.parse(savedData));
		}
	  }, []);
	
  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    if (formData) {
      // Save subscriptions along with other form data
      const updatedData = { ...formData, subscriptions };
      localStorage.setItem('registerData', JSON.stringify(updatedData));
    }
  }, [subscriptions, formData]);

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
          setStationsList(stationsResponse.stations);
          setFilteredStations(stationsResponse.stations); // Initialize with full list
        } else {
          throw new Error('Failed to check username.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Filter stations based on searchTerm
  useEffect(() => {
    if (!stationsList || stationsList.length === 0) return;

    setLoading(true);
    setFilteredStations(
      searchTerm.trim() === ""
        ? stationsList
        : stationsList.filter((station) =>
            station.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );
    setLoading(false);
  }, [searchTerm, stationsList]);

  const handleNext = () => {
    localStorage.setItem('registerData', JSON.stringify(formData)); // Store data
    router.push('/register-step4'); // Navigate to Step 2
  };

  const handleSelectStation = (station: Station) => {
    if (!subscriptions.includes(station)) {
      const updatedSubscriptions = [...subscriptions, station];
      setSubscriptions(updatedSubscriptions);
  
      // Save updated subscriptions to localStorage
      const updatedData = { ...formData, subscriptions: updatedSubscriptions };
      setFormData(updatedData);
      localStorage.setItem('registerData', JSON.stringify(updatedData));
    }
    setSearchTerm('');
  };
  
  const handleRemoveSubscription = (stationId: Station) => {
    const updatedSubscriptions = subscriptions.filter((id) => id !== stationId);
    setSubscriptions(updatedSubscriptions);
  
    // Save updated subscriptions to localStorage
    const updatedData = { ...formData, subscriptions: updatedSubscriptions };
    setFormData(updatedData);
    localStorage.setItem('registerData', JSON.stringify(updatedData));
  };
  
  return (
    <div className={styles.container}
      style={{ cursor: loading ? "wait" : "default" }}>
      <h1 className={styles.heading}>Register - Step 3</h1>
        <div className={styles.formGroup}>
          <label className={styles.label}>Search and Select a Station:</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /><p className={styles.onlineText}>{stationsList.length} stations are online</p>
          {searchTerm && (
            <ul className={styles.dropdown}>
              {filteredStations.length > 0 ? (
                filteredStations.map((station) => (
                  <li
                    key={station.id}
                    className={styles.dropdownItem}
                    onClick={() => handleSelectStation(station)}
                  >
                    {station.name}
                  </li>
                ))
              ) : (
                <li className={styles.dropdownItemDisabled}>No results found</li>
              )}
            </ul>
          )}
        </div>

        <div className={styles.formGroup}>
          <h3 className={styles.label}>Your Subscriptions:</h3>
          <ul className={styles.list}>
            {subscriptions.map((stationId) => {
              const station = stationsList.find((s) => s.id === stationId.id);
              return (
                <li key={stationId.id} className={styles.listItem}>
                  {station?.name || "Unknown Station"}
                  <button type="button" onClick={() => handleRemoveSubscription(stationId)} className={styles.removeButton}>
                    ❌
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <button type="button" onClick={handleNext} className={styles.button}>Next</button>
    </div>
  );
};

export default RegisterStep3;
