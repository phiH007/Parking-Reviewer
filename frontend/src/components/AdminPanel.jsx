import { useEffect, useState } from 'react';
import './admin.css';

function AdminPanel({ user }) {
  const [selectedSection, setSelectedSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (selectedSection === 'users') {
      fetchUsers();
    }
  }, [selectedSection]);

  async function fetchUsers() {
    const response = await fetch(`/api/auth/users?role=${user.role}`);
    const data = await response.json();
    setUsers(data.users || []);
  }

  async function handleRoleChange(userId, newRole) {
    const response = await fetch(`/api/auth/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestingRole: user.role,
        requestingUserId: user._id,
        role: newRole,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      setMessage(responseText);
      return;
    }

    const data = JSON.parse(responseText);

    setUsers(users.map((currentUser) => {
      if (String(currentUser._id) === String(userId)) {
        return data.user;
      }

      return currentUser;
    }));

    setMessage('User role updated.');
  }

  return (
    <main className="admin-panel">
      <aside className="admin-sidebar">
        <h2>Admin Stuff</h2>
        <button
          type="button"
          className={`admin-sidebar-button ${selectedSection === 'users' ? 'active' : ''}`}
          onClick={() => setSelectedSection('users')}
        >
          Users
        </button>
      </aside>

      <section className="admin-content">
        {selectedSection === 'users' ? (
          <div>
            <h3>Users</h3>
            <p>Here is everyone in the app. You can change other people's role here.</p>
            {message ? <p className="admin-message">{message}</p> : <></>}

            <div className="admin-user-list">
              {users.map((listedUser) => (
                <div key={listedUser._id} className="admin-user-card">
                  <div>
                    <p className="admin-user-name">{listedUser.username}</p>
                    <p className="admin-user-role-text">Role: {listedUser.role}</p>
                  </div>

                  {String(listedUser._id) === String(user._id) ? (
                    <p className="admin-self-label">your account</p>
                  ) : (
                    <select
                      className="admin-role-select"
                      value={listedUser.role}
                      onChange={(e) => handleRoleChange(listedUser._id, e.target.value)}
                    >
                      <option value="standard">Standard</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : <></>}
      </section>
    </main>
  );
}

export default AdminPanel;
