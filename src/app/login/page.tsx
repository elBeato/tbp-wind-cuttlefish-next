'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './loginPage.module.css';
import config from '../util/util';

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    identifier: '', // Can be email or username
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userToken', data.token); // Store the token in localStorage
        router.push('/dashboard'); // Redirect to the dashboard or home page
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid login credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Login</h1>
      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email or Username:</label>
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Enter your email or username"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Enter your password"
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
