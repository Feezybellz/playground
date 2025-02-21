import React from 'react';
import { User, Mail, Phone, Book, Award, Clock } from 'lucide-react';

const Profile = () => {
  // Mock user data - in a real app, this would come from your auth/user service
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    role: 'Student',
    joinDate: 'January 2024',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    progress: {
      coursesCompleted: 3,
      certificatesEarned: 2,
      hoursSpent: 45,
    },
    currentCourses: [
      {
        id: 1,
        title: 'Introduction to Export Management',
        progress: 75,
        lastAccessed: '2 days ago',
      },
      {
        id: 2,
        title: 'International Trade Documentation',
        progress: 30,
        lastAccessed: '5 days ago',
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.role}</p>
            <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">{user.phone}</span>
              </div>
            </div>
          </div>

          {/* Learning Statistics */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Book className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-gray-600">Courses Completed</span>
                </div>
                <span className="font-semibold">{user.progress.coursesCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Certificates Earned</span>
                </div>
                <span className="font-semibold">{user.progress.certificatesEarned}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-600">Hours Spent Learning</span>
                </div>
                <span className="font-semibold">{user.progress.hoursSpent}h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Courses</h2>
            <div className="space-y-4">
              {user.currentCourses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <span className="text-sm text-gray-500">Last accessed {course.lastAccessed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{course.progress}% Complete</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;