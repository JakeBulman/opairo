import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Events from './pages/Events';
import Test from './pages/IconTest'
import Welcome from './pages/Welcome'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/account/:account_slug/" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/account/:public_id/edit" element={
        <ProtectedRoute>
          <EditProfile />
        </ProtectedRoute>
      } />
      <Route path="/events/" element={<Events />} />
      <Route path="/register/" element={<Registration />} />
      <Route path="/login/" element={<Login />} />
      <Route path="/welcome/" element={<Welcome />} />
      <Route path="/test/" element={<Test />} />
    </Routes>
  );
}

export default App;
