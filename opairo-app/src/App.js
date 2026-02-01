import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Profiles from './pages/Profiles';
import EditProfile from './pages/EditProfile';
import EditDisciplines from './pages/EditDisciplines';
import Events from './pages/Events';
import Event from './pages/Event';
import EditEvent from './pages/EditEvent';
import CreateEvent from './pages/CreateEvent';
import Test from './pages/IconTest'
import Welcome from './pages/Welcome'
import EventCasting from './pages/EventCasting';
import CreateEventCasting from './pages/CreateEventCasting';
import CastingReview from './pages/CastingReview';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profiles/" element={<Profiles />} />  
      <Route path="/account/:account_slug/" element={<Profile />} />
      <Route path="/account/:public_id/edit" element={
        <ProtectedRoute>
          <EditProfile />
        </ProtectedRoute>
      } />
      <Route path="/account/:public_id/disciplines" element={
        <ProtectedRoute>
          <EditDisciplines />
        </ProtectedRoute>
      } />
      <Route path="/events/" element={<Events />} />
      <Route path="/event/:name_slug/" element={<Event />} />
      <Route path="/event/:public_id/edit" element={
        <ProtectedRoute>
          <EditEvent />
        </ProtectedRoute>
      } />
      <Route path="/events/create/" element={
        <ProtectedRoute>
          <CreateEvent />
        </ProtectedRoute>
        } />
      <Route path="/event/:name_slug/casting" element={
        <ProtectedRoute>
          <EventCasting />
        </ProtectedRoute>
      } />
      <Route path="/event/:name_slug/casting/create" element={
        <ProtectedRoute>
          <CreateEventCasting />
        </ProtectedRoute>
      } />
      <Route path="/event/:name_slug/casting/:casting_id/review" element={
        <ProtectedRoute>
          <CastingReview />
        </ProtectedRoute>
      } />
      <Route path="/register/" element={<Registration />} />
      <Route path="/login/" element={<Login />} />
      <Route path="/welcome/" element={<Welcome />} />
      <Route path="/test/" element={<Test />} />
    </Routes>
  );
}

export default App;
