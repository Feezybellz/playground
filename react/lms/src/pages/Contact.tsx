import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto p-6">  {/*  for centering */}
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      <p className="mb-4">
        Have questions or feedback? We'd love to hear from you!  Please feel free to reach out to us using the information below.
      </p>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <ul className="list-disc ml-6">
          <li><strong>Email:</strong> [Your Email Address]</li>
          <li><strong>Phone:</strong> [Your Phone Number]</li>
          <li><strong>Address:</strong> [Your Address (if applicable)]</li>
        </ul>
      </div>

      {/*  contact form  to allow users to send messages directly. */}
      
      {
      <form>
        <label htmlFor="name">Name:</label><br />
        <input type="text" id="name" name="name" /><br /><br />

        <label htmlFor="email">Email:</label><br />
        <input type="email" id="email" name="email" /><br /><br />

        <label htmlFor="message">Message:</label><br />
        <textarea id="message" name="message" rows="4" cols="50"></textarea><br /><br />

        <button type="submit">Submit</button>
      </form>
      }
    </div>
  );
};

export default Contact;