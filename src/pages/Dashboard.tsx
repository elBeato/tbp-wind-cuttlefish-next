import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboardPage.module.css';
import config from '../lib/util';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('userToken');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${config.apiBaseUrl}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('userToken');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('userToken');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
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
          localStorage.removeItem('userToken');
          navigate('/');
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;