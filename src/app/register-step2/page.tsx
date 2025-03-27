'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './registerPage.module.css';

const RegisterStep2: React.FC = () => {
  const router = useRouter();
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
    router.push('/register-step3'); // Navigate to Step 2
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Register - Step 2</h1>
        <div className={styles.formGroup}>
          <label className={styles.label}>Name & surname:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required className={styles.input} />
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
