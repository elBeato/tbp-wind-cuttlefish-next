'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import styles from './registerPage.module.css';
import config from '../util/util';

const RegisterStep1: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters
  const stationId = searchParams.get("stationId"); // Get the stationId from the URL
  
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isButtonNextDisabled, setIsButtonNextDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // Update the formData state
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    // Check if all fields are filled and there is no username error
    if (
      (name === 'username' ? value.trim() : formData.username.trim()) &&
      (name === 'email' ? value.trim() : formData.email.trim()) &&
      (name === 'password' ? value.trim() : formData.password.trim()) &&
      !usernameError
    ) {
      setIsButtonNextDisabled(false);
    } else {
      setIsButtonNextDisabled(true);
    }
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the formData state
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validate email if the field being updated is "email"
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
      if (!emailRegex.test(value)) {
        setEmailError('Invalid email address.');
        setIsButtonNextDisabled(true);
        return;
      } else {
        setEmailError(null); // Clear error if email is valid
        // Check if all fields are filled and enable the button
        if (
          value.trim() &&
          formData.username.trim() &&
          formData.password.trim() &&
          !usernameError
        ) {
          setIsButtonNextDisabled(false);
        }
      }
    }
  }

  const handleChangeUsername = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // Update the formData state
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    if (!value.trim()) {
      setUsernameError('Username cannot be empty.');
      setIsButtonNextDisabled(true);
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
          setIsButtonNextDisabled(true);
        } else {
          setUsernameError(null);
  
          // Check if all fields are filled and enable the button
          if (
            value.trim() &&
            formData.email.trim() &&
            formData.password.trim() &&
            !emailError
          ) {
            setIsButtonNextDisabled(false);
          }
        }
      } else {
        throw new Error('Failed to check username.');
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameError('An error occurred while checking the username.');
      setIsButtonNextDisabled(true);
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData) {
      console.error("No form data found.");
      return;
    }
  
    // Store form data in localStorage
    localStorage.setItem("registerData", JSON.stringify(formData));
  
    // Navigate to the next step, with or without stationId
    if (stationId) {
      router.push(`/register-step2?stationId=${stationId}`); // Navigate with stationId
    } else {
      router.push(`/register-step2`); // Navigate without stationId
    }
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
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChangeEmail} 
            required className={styles.input} 
            />
            {emailError && <p className={styles.error}>{emailError}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className={styles.input} />
        </div>
        <button 
          type="button" 
          onClick={handleNext} 
          className={styles.button}
          disabled={isButtonNextDisabled}
          >
            Next
        </button>
      </form>
    </div>
  );
};

export default RegisterStep1;
