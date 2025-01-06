import React, { useEffect, useState } from 'react';
import { fetchAllUsers, createEmployee, updateEmployee, deleteEmployee } from '../../Utils/Employees';
import './ManageEmployees.css';

const ManageEmployees = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // New Employee Form State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('artist');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Edit Employee Form State
  const [editUserId, setEditUserId] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('artist');
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users.');
      }
    };
    fetchData();
  }, []);

  // Create Employee
  const handleCreate = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setError('');

    try {
      const newUser = {
        email: newEmail,
        password: newPassword,
        role: newRole,
        name: newName,
        phone: newPhone,
      };
      const result = await createEmployee(newUser);
      setStatusMessage(`User ${result.authUser.email} created successfully.`);
      setUsers((prev) => [...prev, result.userData[0]]);

      // Clear form
      setNewEmail('');
      setNewPassword('');
      setNewRole('artist');
      setNewName('');
      setNewPhone('');
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user.');
    }
  };

  return (
    <div className="manage-employees-container">
      <h1>Manage Employees</h1>

      {/* Status Messages */}
      {statusMessage && <p className="success-message">{statusMessage}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Create Employee Form */}
      <div className="create-employee-form">
        <h2>Create New Employee</h2>
        <form onSubmit={handleCreate}>
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="artist">Artist</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      </div>

      {/* Employee List */}
      <h2>Existing Employees</h2>
      <table className="employees-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.name || 'N/A'}</td>
              <td>{user.phone || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEmployees;
