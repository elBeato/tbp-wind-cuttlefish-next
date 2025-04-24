'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboardPage.module.css';
import config from '../util/util';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('userToken'); // Retrieve the token from localStorage

      if (!token) {
        router.push('/login'); // Redirect to login if no token is found
        return;
      }

      try {
        const response = await fetch(`${config.apiBaseUrl}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Set the user data
        } else {
          localStorage.removeItem('userToken'); // Remove invalid token
          router.push('/login'); // Redirect to login if authentication fails
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('userToken'); // Remove invalid token
        router.push('/login'); // Redirect to login on error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    checkAuthentication();
  }, [router]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>; // Show a loading message while checking authentication
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome to Your Dashboard</h1>
      {user && (
        <div className={styles.userInfo}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <button
        className={styles.logoutButton}
        onClick={() => {
          localStorage.removeItem('userToken'); // Clear the token
          router.push('/'); // Redirect to login
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
