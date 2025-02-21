import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LSEM LMS</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
            <Link to="/profile" className="flex items-center">
              <div className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;