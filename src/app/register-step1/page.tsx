'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './registerPage.module.css';
import config from '../util/util';

const RegisterStep1: React.FC = () => {
  const router = useRouter();
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeUsername = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    if (!value.trim()) {
      setUsernameError('Username cannot be empty.');
      return;
    }
    
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/users/${value}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'False') {
          setUsernameError('Username already exists. Please choose another.');
        } else {
          setUsernameError(null); // Username is valid
        }
      } else {
        throw new Error('Failed to check username.');
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameError('An error occurred while checking the username.');
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) {
      console.error('No form data found.');
      return;
    }
    localStorage.setItem('registerData', JSON.stringify(formData)); // Store data
    router.push('/register-step2'); // Navigate to Step 2
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Register - Step 1{config.apiBaseUrl}</h1>
      <form onSubmit={(e) => e.preventDefault()}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChangeUsername}
            required
            className={styles.input}
          />
          {usernameError && <p className={styles.error}>{usernameError}</p>}
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
