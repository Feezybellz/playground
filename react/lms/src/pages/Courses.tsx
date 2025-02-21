import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Introduction to Export Management',
    description: 'Learn the fundamentals of export management and international trade.',
    students: 45,
    duration: '6 weeks',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800&h=400',
  },
  {
    id: 2,
    title: 'International Trade Documentation',
    description: 'Master the essential documents required for international trade.',
    students: 32,
    duration: '4 weeks',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800&h=400',
  },
  {
    id: 3,
    title: 'Export Finance and Risk Management',
    description: 'Understanding financial aspects and risk mitigation in export business.',
    students: 28,
    duration: '8 weeks',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800&h=400',
  },
];

const Courses = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Courses</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Browse All Courses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;