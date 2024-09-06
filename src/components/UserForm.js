// src/components/UserForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = ({ users, setUsers }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieve user ID from URL
  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch the user data if editing
      const selectedUser = users.find(user => user.id === parseInt(id));
      if (selectedUser) {
        setUser(selectedUser);
      }
    }
  }, [id, users]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      // Handle update user
      axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, user)
        .then((response) => {
          // Update the local user list
          setUsers(users.map(u => (u.id === parseInt(id) ? response.data : u)));
          navigate('/');
        })
        .catch(() => {
          setError('Error updating user.');
        });
    } else {
      // Handle create new user
      axios.post('https://jsonplaceholder.typicode.com/users', user)
        .then((response) => {
          setUsers([...users, { ...response.data, id: users.length + 1 }]);
          navigate('/');
        })
        .catch(() => {
          setError('Error creating user.');
        });
    }
  };

  return (
    <div className="container">
      <h2>{id ? 'Edit User' : 'Create User'}</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={user.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">{id ? 'Update User' : 'Create User'}</button>
        <button type="button" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  );
};

export default UserForm;
