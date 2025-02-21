import React from 'react';
import { useParams } from 'react-router-dom';
import { PlayCircle, FileText, Headphones, BookOpen, CheckCircle } from 'lucide-react';

const CourseView = () => {
  const { courseId } = useParams();

  // Mock course data - in a real app, this would be fetched based on courseId
  const course = {
    id: courseId,
    title: 'Introduction to Export Management',
    description: 'Learn the fundamentals of export management and international trade.',
    progress: 35,
    modules: [
      {
        id: 1,
        title: 'Getting Started with Exports',
        items: [
          { id: 1, type: 'video', title: 'Introduction to the Course', duration: '10:15', completed: true },
          { id: 2, type: 'text', title: 'Export Basics Overview', duration: '15 mins read', completed: true },
          { id: 3, type: 'audio', title: 'Expert Interview: Market Analysis', duration: '25:30', completed: false },
        ],
      },
      {
        id: 2,
        title: 'Documentation and Compliance',
        items: [
          { id: 4, type: 'video', title: 'Essential Export Documents', duration: '15:20', completed: false },
          { id: 5, type: 'ebook', title: 'Complete Documentation Guide', duration: '1.5 hours read', completed: false },
          { id: 6, type: 'quiz', title: 'Module Assessment', duration: '20 mins', completed: false },
        ],
      },
    ],
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-5 w-5" />;
      case 'text':
        return <FileText className="h-5 w-5" />;
      case 'audio':
        return <Headphones className="h-5 w-5" />;
      case 'ebook':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{course.progress}% Complete</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Content</h2>
        {course.modules.map((module) => (
          <div key={module.id} className="mb-6 last:mb-0">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{module.title}</h3>
            <div className="space-y-2">
              {module.items.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <span className={`mr-3 ${item.completed ? 'text-green-500' : 'text-gray-400'}`}>
                      {getItemIcon(item.type)}
                    </span>
                    <span className="text-gray-700">{item.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.duration}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseView;