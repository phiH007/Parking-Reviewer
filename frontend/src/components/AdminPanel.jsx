import { useEffect, useState } from 'react';
import './admin.css';

const SECTIONS = ['users', 'cars', 'violations', 'comments'];

function AdminPanel({ user }) {
  const [section, setSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [violations, setViolations] = useState([]);
  const [newViolation, setNewViolation] = useState('');
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (section === 'users') fetchUsers();
    if (section === 'cars') fetchCars();
    if (section === 'violations') fetchViolations();
    if (section === 'comments') fetchComments();
  }, [section]);

  const fetchUsers = async () => {
    const res = await fetch(`/api/auth/users?role=${user.role}`);
    const data = await res.json();
    setUsers(data.users || []);
  };

  const fetchCars = async () => {
    const res = await fetch('/api/cars');
    const data = await res.json();
    setCars(data.cars || []);
  };

  const fetchViolations = async () => {
    const res = await fetch('/api/violations');
    const data = await res.json();
    setViolations(data.violations || []);
  };

  const fetchComments = async () => {
    const res = await fetch('/api/comments/all');
    const data = await res.json();
    setComments(data.comments || []);
  };

  const deleteItem = async (url, body, onSuccess) => {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      onSuccess();
    } else {
      const text = await res.text();
      let errMsg = 'Delete failed';
      try { errMsg = JSON.parse(text).error || errMsg; } catch { errMsg = text || errMsg; }
      setMsg(errMsg);
    }
  };

  const deleteUser = (userId) => {
    if (!confirm('Delete this user?')) return;
    deleteItem(
      `/api/auth/users/${userId}`,
      { requestingRole: user.role, requestingUserId: user._id },
      () => { setUsers(users.filter(u => u._id !== userId)); setMsg('User deleted'); }
    );
  };

  const deleteCar = (id) => {
    if (!confirm('Delete this car?')) return;
    deleteItem(
      `/api/cars/${id}`,
      { userId: user._id, role: user.role },
      () => { setCars(cars.filter(c => c._id !== id)); setMsg('Car deleted'); }
    );
  };

  const deleteViolation = (id) => {
    if (!confirm('Remove this violation?')) return;
    deleteItem(
      `/api/violations/${id}`,
      { requestingUserRole: user.role },
      () => { setViolations(violations.filter(v => v._id !== id)); setMsg('Violation removed'); }
    );
  };

  const deleteComment = (id) => {
    if (!confirm('Delete this comment?')) return;
    deleteItem(
      `/api/comments/${id}`,
      { userId: user._id, role: user.role },
      () => { setComments(comments.filter(c => c._id !== id)); setMsg('Comment deleted'); }
    );
  };

  const updateRole = async (userId, newRole) => {
    const res = await fetch(`/api/auth/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestingRole: user.role, requestingUserId: user._id, role: newRole }),
    });

    const txt = await res.text();
    if (!res.ok) return setMsg(txt);

    const data = JSON.parse(txt);
    setUsers(users.map(u => u._id === userId ? data.user : u));
    setMsg('Role updated');
  };

  const addViolation = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/violations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newViolation, requestingUserRole: user.role }),
    });

    const data = await res.json();
    if (res.ok) {
      setViolations([...violations, { _id: data.violationId, name: newViolation }]);
      setNewViolation('');
      setMsg('Added violation');
    } else {
      setMsg(data.error || 'Error adding');
    }
  };

  return (
    <main className="admin-panel">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setSection(s)} className={section === s ? 'active' : ''}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </aside>

      <section className="admin-content">
        {msg && <p className="admin-message">{msg}</p>}

        {section === 'users' && (
          <div>
            <h3>User Management</h3>
            <div className="admin-user-list">
              {users.map(u => (
                <div key={u._id} className="admin-user-card">
                  <div>
                    <p className="admin-user-name">{u.username}</p>
                    <p>Role: {u.role}</p>
                  </div>
                  {u._id === user._id ? <span>(You)</span> : (
                    <div className="admin-user-actions">
                      <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)}>
                        <option value="standard">Standard</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button onClick={() => deleteUser(u._id)} className="delete-button">Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'cars' && (
          <div>
            <h3>Submissions</h3>
            <div className="admin-user-list">
              {cars.length === 0 ? <p>No cars found.</p> : cars.map(car => (
                <div key={car._id} className="admin-user-card">
                  <div>
                    <p className="admin-user-name">{car.plate}</p>
                    <p>{car.make} {car.model} — {car.reason}</p>
                  </div>
                  <button onClick={() => deleteCar(car._id)} className="delete-button">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'violations' && (
          <div>
            <h3>Violations</h3>
            <form onSubmit={addViolation} className="admin-violation-form">
              <input
                type="text"
                value={newViolation}
                onChange={e => setNewViolation(e.target.value)}
                placeholder="Violation name..."
              />
              <button type="submit">Add</button>
            </form>
            <div className="admin-user-list">
              {violations.map(v => (
                <div key={v._id} className="admin-user-card">
                  <p>{v.name}</p>
                  <button onClick={() => deleteViolation(v._id)} className="delete-button">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'comments' && (
          <div>
            <h3>Comments</h3>
            <div className="admin-user-list">
              {comments.length === 0 ? <p>No comments found.</p> : comments.map(c => (
                <div key={c._id} className="admin-user-card">
                  <div>
                    <p className="admin-user-name">{c.username}</p>
                    <p>{c.text}</p>
                  </div>
                  <button onClick={() => deleteComment(c._id)} className="delete-button">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminPanel;
