// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserDetail from './components/UserDetail';
import axios from 'axios';
import './styles.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users on initial render
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching users.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <p>{error}</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserList users={users} setUsers={setUsers} />} />
        <Route path="/create" element={<UserForm users={users} setUsers={setUsers} />} />
        <Route path="/edit/:id" element={<UserForm users={users} setUsers={setUsers} />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
