// UserList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to track if the form should be shown
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '' });

  // Fetch users from API
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching users.');
        setLoading(false);
      });
  }, []);

  // Handle delete user
  const deleteUser = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(() => {
        setError('Error deleting user.');
      });
  };

  // Handle form input changes
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Handle form submit (create new user)
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://jsonplaceholder.typicode.com/users', newUser)
      .then((response) => {
        // Add the newly created user to the users list
        setUsers([...users, { ...response.data, id: users.length + 1 }]);
        // Reset form fields
        setNewUser({ name: '', email: '', phone: '' });
        // Hide the form after submission
        setShowForm(false);
      })
      .catch(() => {
        setError('Error creating user.');
      });
  };

  if (loading) return <div className="spinner"></div>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2>User Management</h2>

      {/* Create User Button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Create User</button>
      )}

      {/* Show Form Conditionally */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <h3>Create User</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={newUser.phone}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      {/* User List Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <Link to={`/users/${user.id}`}>Details</Link>
                <Link to={`/edit/${user.id}`}>
                  <button>Edit</button>
                </Link>
                <button className="delete" onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
