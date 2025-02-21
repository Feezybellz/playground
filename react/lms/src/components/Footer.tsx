import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-gray-200 p-4 mt-6">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} LSEM LMS. All rights reserved.</p>
        <ul className="flex justify-center mt-2 space-x-4">
          <li>
            <Link to="/terms">Terms of Service</Link>
          </li>
          <li>
            <Link to="/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer; // Only export the Footer component
