import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import Profile from './pages/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Certificates from './pages/Certificates';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import { useAuth } from './context/AuthContext';
import './styles/ImprovedStyles.css';
import './styles/UnifiedTheme.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {user && (
            <>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/certificates" element={<Certificates />} />
              {user.is_admin && (
                <Route path="/admin" element={<AdminDashboard />} />
              )}
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;
