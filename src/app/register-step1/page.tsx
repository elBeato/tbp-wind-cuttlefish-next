'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './registerPage.module.css';

const RegisterStep1: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    localStorage.setItem('registerData', JSON.stringify(formData)); // Store data
    router.push('/register-step2'); // Navigate to Step 2
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Register - Step 1</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className={styles.input} />
        </div>
        <button type="button" onClick={handleNext} className={styles.button}>Next</button>
      </form>
    </div>
  );
};

export default RegisterStep1;
