import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto p-6">  {/* Use container for centering */}
      <h1 className="text-3xl font-bold mb-4">About Us</h1>

      <p className="mb-4">
        Welcome to LSEM LMS! We are dedicated to providing high-quality online learning resources to empower students and professionals in their educational journeys. Our mission is to make education accessible, engaging, and effective for everyone.
      </p>

      <p className="mb-4">
        Founded in [Year], LSEM LMS has grown from a small initiative to a vibrant online learning community.  We offer a diverse range of courses in [List some key subject areas, e.g., technology, business, arts]. Our instructors are experienced professionals and educators who are passionate about sharing their knowledge.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Excellence in Education: We strive to provide the best possible learning experience.</li>
        <li>Accessibility: We believe education should be accessible to everyone, regardless of their background or location.</li>
        <li>Innovation: We are constantly exploring new ways to make learning more engaging and effective.</li>
        <li>Community: We foster a supportive and collaborative learning environment.</li>
      </ul>

      <p className="mb-4">
        Learn more about our courses and instructors by browsing our website.  If you have any questions, please don't hesitate to contact us.
      </p>

      {/* You can add more sections here, e.g., team members, testimonials, etc. */}
    </div>
  );
};

export default About;