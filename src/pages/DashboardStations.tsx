import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboardPage.module.css';
import config from '../lib/util';

interface UserSubscription {
  station: number;
  station_name: string;
  threshold: number;
}

interface OnlineStation {
  id: number;
  name: string;
}

const DashboardStations: React.FC = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [_, setThresholds] = useState<{ station: number; threshold: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [stationId, setStationId] = useState('');
  const [newThreshold, setNewThreshold] = useState('');
  const [addingSubscription, setAddingSubscription] = useState(false);
  const [error, setError] = useState('');
  const [onlineStations, setOnlineStations] = useState<OnlineStation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const userResponse = await fetch(`${config.apiBaseUrl}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          localStorage.removeItem('userToken');
          navigate('/login');
          return;
        }

        const userData = await userResponse.json();
        const userSubscriptions = userData.subscriptions || [];

        try {
          const thresholdsResponse = await fetch(`${config.apiBaseUrl}/api/auth/me/thresholds`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (thresholdsResponse.ok) {
            const thresholdsData = await thresholdsResponse.json();
            setThresholds(thresholdsData);

            const merged: UserSubscription[] = userSubscriptions.map((sub: { id: number; name: string }) => {
              const threshold = thresholdsData.find((t: { station: number }) => t.station === sub.id);
              return {
                station: sub.id,
                station_name: sub.name,
                threshold: threshold?.threshold ?? 0,
              };
            });
            setSubscriptions(merged);
          } else {
            setSubscriptions(userSubscriptions.map((sub: { id: number; name: string }) => ({
              station: sub.id,
              station_name: sub.name,
              threshold: 0,
            })));
          }
        } catch {
          setSubscriptions(userSubscriptions.map((sub: { id: number; name: string }) => ({
            station: sub.id,
            station_name: sub.name,
            threshold: 0,
          })));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const fetchOnlineStations = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/windguru/stations`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const stationsResponse = await response.json();
          setOnlineStations(stationsResponse.stations);
        }
      } catch (error) {
        console.error('Error fetching online stations:', error);
      }
    };
    fetchOnlineStations();
  }, [navigate]);

  const refreshData = async (token: string) => {
    const userResponse = await fetch(`${config.apiBaseUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) return;
    const userData = await userResponse.json();
    const userSubscriptions = userData.subscriptions || [];

    try {
      const thresholdsResponse = await fetch(`${config.apiBaseUrl}/api/auth/me/thresholds`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      let thresholdsData: { station: number; threshold: number }[] = [];
      if (thresholdsResponse.ok) {
        thresholdsData = await thresholdsResponse.json();
      }

      const merged: UserSubscription[] = userSubscriptions.map((sub: { id: number; name: string }) => {
        const threshold = thresholdsData.find((t: { station: number }) => t.station === sub.id);
        return {
          station: sub.id,
          station_name: sub.name,
          threshold: threshold?.threshold ?? 0,
        };
      });
      setSubscriptions(merged);
    } catch {
      setSubscriptions(userSubscriptions.map((sub: { id: number; name: string }) => ({
        station: sub.id,
        station_name: sub.name,
        threshold: 0,
      })));
    }
  };

  const addSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    if (!token) return;

    setError('');
    setAddingSubscription(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/me/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          station_id: parseInt(stationId),
          threshold: parseInt(newThreshold) || 0,
        }),
      });
      console.log(response);
      if (response.ok) {
        await refreshData(token);
        setStationId('');
        setNewThreshold('');
      } else {
        const text = await response.text();
        console.error('Subscription error response:', text);
        setError('Failed to add subscription');
      }
    } catch (err) {
      console.error('Error adding subscription:', err);
      setError('Failed to add subscription');
    } finally {
      setAddingSubscription(false);
    }
  };

  const removeSubscription = async (stationId: number) => {
    const confirmed = window.confirm('Are you sure you want to unsubscribe from this station?');
    if (!confirmed) return;

    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/me/subscription`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          station_id: stationId,
        }),
      });

      if (response.ok) {
        await refreshData(token);
      }
    } catch (err) {
      console.error('Error removing subscription:', err);
    }
  };

  const updateThreshold = async (stationId: number, newThreshold: number) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/me/threshold`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          station_id: stationId,
          new_threshold: newThreshold,
        }),
      });

      if (response.ok) {
        await refreshData(token);
      }
    } catch (err) {
      console.error('Error updating threshold:', err);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Your Stations</h1>

      <button
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '20px' }}
      >
        Back to Dashboard
      </button>

      <form onSubmit={addSubscription} className={styles.form}>
        <h3>Add New Station</h3>
        <div className={styles.formGroup}>
          <select
            value={stationId}
            onChange={(e) => {
              setStationId(e.target.value);
            }}
            required
          >
            <option value="">Select a station...</option>
            {onlineStations
              .filter((s) => !subscriptions.some((sub) => sub.station === s.id))
              .map((station) => (
                <option key={station.id} value={station.id}>
                  {station.id} - {station.name}
                </option>
              ))}
          </select>
          <input
            type="number"
            placeholder="Threshold"
            value={newThreshold}
            onChange={(e) => setNewThreshold(e.target.value)}
          />
          <button type="submit" disabled={addingSubscription}>
            {addingSubscription ? 'Adding...' : 'Add Station'}
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <div className={styles.subscriptions}>
        {subscriptions.length === 0 ? (
          <p>No subscriptions yet.</p>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub.station} className={styles.subscriptionRow}>
              <div className={styles.subscriptionInfo}>
                <strong>Station {sub.station}:</strong> {sub.station_name}
              </div>
              <div className={styles.subscriptionActions}>
                <label>
                  Threshold:
                  <input
                    type="number"
                    value={sub.threshold}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
                      if (!isNaN(newVal)) {
                        setSubscriptions(subscriptions.map(s =>
                          s.station === sub.station ? { ...s, threshold: newVal } : s
                        ));
                      }
                    }}
                    onBlur={(e) => updateThreshold(sub.station, parseInt(e.target.value))}
                    style={{ marginLeft: '5px', width: '60px' }}
                  />
                </label>
                <button
                  onClick={() => removeSubscription(sub.station)}
                  className={styles.deleteButton}
                  style={{ marginLeft: '10px' }}
                >
                  Unsubscribe
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardStations;