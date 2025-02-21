import React from 'react';
import { BookOpen, Users, Clock, Award } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: BookOpen, label: 'Active Courses', value: '12' },
    { icon: Users, label: 'Total Students', value: '248' },
    { icon: Clock, label: 'Hours of Content', value: '156' },
    { icon: Award, label: 'Certifications', value: '8' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          {/* Activity content will go here */}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Deadlines
          </h2>
          {/* Deadlines content will go here */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;