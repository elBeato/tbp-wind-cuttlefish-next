import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboardPage.module.css';
import config from '../lib/util';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [thresholds, setThresholds] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [mobileEnabled, setMobileEnabled] = useState(false);
  const [updatingNotifications, setUpdatingNotifications] = useState(false);
  const [editingChannels, setEditingChannels] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    address: '',
    mobile: '',
    birthday: '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const updateUserPassword = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setUpdatingPassword(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setEditingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password updated successfully');
      } else {
        const error = await response.json();
        alert(error.message || 'Error updating password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const updateUserProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    setUpdatingProfile(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditingProfile(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdatingProfile(false);
    }
  };
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    const token = localStorage.getItem('userToken');
    if (!token) return;

    setDeleting(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/me`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('userToken');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getNotificationChannel = (email: boolean, mobile: boolean): string => {
    if (email && mobile) return 'email_and_mobile';
    if (email) return 'email';
    if (mobile) return 'mobile';
    return 'without_notification';
  };

  const updateNotificationSettings = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    setUpdatingNotifications(true);
    try {
      const channel = getNotificationChannel(emailEnabled, mobileEnabled);
      const response = await fetch(`${config.apiBaseUrl}/api/auth/me/notification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notification_channel: channel }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditingChannels(false);
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setUpdatingNotifications(false);
    }
  };

  useEffect(() => {
    if (user?.notification_channel) {
      const channel = user.notification_channel;
      setEmailEnabled(channel === 'email' || channel === 'email_and_mobile');
      setMobileEnabled(channel === 'mobile' || channel === 'email_and_mobile');
    }
  }, [user]);

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
          setProfileData({
            name: userData.name || '',
            email: userData.email || '',
            address: userData.address || '',
            mobile: userData.mobile || '',
            birthday: userData.birthday || '',
          });
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

      try {
        const response = await fetch(`${config.apiBaseUrl}/api/auth/me/thresholds`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const thresholdsData = await response.json();
          setThresholds(thresholdsData);
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
          <p><strong>Profile Information</strong> für {user.username}</p>
          <div className={styles.profileSection}>
            <h3>Notification Channels</h3>
            {editingChannels ? (
              <>
                <p>
                  <label>
                    <input
                      type="checkbox"
                      checked={emailEnabled}
                      onChange={(e) => setEmailEnabled(e.target.checked)}
                    />
                    Email
                  </label>
                </p>
                <p>
                  <label>
                    <input
                      type="checkbox"
                      checked={mobileEnabled}
                      onChange={(e) => setMobileEnabled(e.target.checked)}
                    />
                    Mobile
                  </label>
                </p>
                <button
                  onClick={updateNotificationSettings}
                  disabled={updatingNotifications}
                  className={styles.saveButton}
                >
                  {updatingNotifications ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditingChannels(false)} style={{ marginLeft: '10px' }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>
                  {user.notification_channel === 'email_and_mobile' && 'Email, Mobile'}
                  {user.notification_channel === 'email' && 'Email'}
                  {user.notification_channel === 'mobile' && 'Mobile'}
                  {user.notification_channel === 'without_notification' && 'None'}
                </p>
                <button onClick={() => setEditingChannels(true)} className={styles.editButton}>
                  Edit channels
                </button>
              </>
            )}
          </div>
          <div className={styles.profileSection}>
            <h3>Personal details</h3>
            {editingProfile ? (
              <>
                <p>
                  <strong>Name:</strong>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    style={{ marginLeft: '10px' }}
                  />
                </p>
                <p>
                  <strong>Email:</strong>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    style={{ marginLeft: '10px' }}
                  />
                </p>
                <p>
                  <strong>Address:</strong>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    style={{ marginLeft: '10px' }}
                  />
                </p>
                <p>
                  <strong>Mobile:</strong>
                  <input
                    type="text"
                    value={profileData.mobile}
                    onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                    style={{ marginLeft: '10px' }}
                  />
                </p>
                <p>
                  <strong>Birthday:</strong>
                  <input
                    type="date"
                    value={profileData.birthday}
                    onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                    style={{ marginLeft: '10px' }}
                  />
                </p>
                <button
                  onClick={updateUserProfile}
                  disabled={updatingProfile}
                  style={{ marginRight: '10px' }}
                >
                  {updatingProfile ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditingProfile(false)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Mobile:</strong> {user.mobile}</p>
                <p><strong>Birthday:</strong> {user.birthday}</p>
                <button onClick={() => setEditingProfile(true)}>Edit Profile</button>
              </>
            )}
          </div>
        </div>
      )}
      {user && (
        <div className={styles.profileSection}>
          <h3>Your Stations</h3>
          {user.subscriptions?.map((station: { id: number; name: string }) => {
            const threshold = thresholds?.find((t: { station: number }) => t.station === station.id);
            return (
              <div key={station.id} className={styles.stationRow}>
                <span>Station {station.id}: {station.name}{threshold ? ` - Threshold: ${threshold.threshold}` : ''}</span>
              </div>
            );
          }
          )}
          <button onClick={() => navigate('/dashboard-stations')} className={styles.editButton}>
            Manage Stations
          </button>
        </div>
      )}
      <div className={styles.mainButtonSection}>
        <button
          className={styles.logoutButton}
          onClick={() => {
            localStorage.removeItem('userToken');
            navigate('/');
          }}
        >
          Logout
        </button>
        {editingPassword ? (
          <>
            <div className={styles.passwordSection}>
              <p>
                <strong>Current Password:</strong>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  style={{ marginLeft: '10px' }}
                />
              </p>
              <p>
                <strong>New Password:</strong>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  style={{ marginLeft: '10px' }}
                />
              </p>
              <p>
                <strong>Confirm Password:</strong>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  style={{ marginLeft: '10px' }}
                />
              </p>
              <button
                onClick={updateUserPassword}
                disabled={updatingPassword}
                style={{ marginRight: '10px' }}
              >
                {updatingPassword ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditingPassword(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setEditingPassword(true)}
          >
            Change Password
          </button>
        )}
        <button
          className={styles.deleteButton}
          onClick={deleteAccount}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;