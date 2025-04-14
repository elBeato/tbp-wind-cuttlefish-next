'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import styles from './registerPage.module.css';

const RegisterStep2: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters
  const stationId = searchParams.get("stationId"); // Get the stationId from the URL

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
    birthday: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('registerData');
    if (savedData) {
      setFormData(prev => ({ ...prev, ...JSON.parse(savedData) }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    localStorage.setItem('registerData', JSON.stringify(formData)); // Store data
        // Navigate to the next step, with or without stationId
        if (stationId) {
          router.push(`/register-step3?stationId=${stationId}`); // Navigate with stationId
        } else {
          router.push(`/register-step3`); // Navigate without stationId
        }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Register - Step 2</h1>
        <div className={styles.formGroup}>
          <label className={styles.label}>Name & surname:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Mobile:</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Birthday:</label>
          <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} required className={styles.input} />
        </div>
        <button type="button" onClick={handleNext} className={styles.button}>Next</button>
    </div>
  );
};

export default RegisterStep2;
