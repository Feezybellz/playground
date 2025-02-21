
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import PageWrapper from './components/PageWrapper';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseView from './pages/CourseView';
import Profile from './pages/Profile';
import Footer from './components/Footer';
//import Home from './pages/Home'; // Import Home
import Terms from './pages/Terms'; // Import Terms
import Privacy from './pages/Privacy'; // Import Privacy
import About from './pages/About'; // Import About
import Contact from './pages/Contact'; // Import Contact

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
            </Routes>
          </main>

        </div>

        <Footer/>
      </div>
    </Router>
  );
}

export default App;