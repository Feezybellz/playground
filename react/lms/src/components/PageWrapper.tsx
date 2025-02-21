import React from 'react';
import Navbar from './Navbar'; // Adjust path as needed
import Sidebar from './Sidebar'; // Adjust path if you have a Sidebar
import Footer from './Footer'; // Import the Footer component

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PageWrapper; // Only export the PageWrapper