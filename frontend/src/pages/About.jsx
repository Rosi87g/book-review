import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">About Our Platform</h1>

      <p className="text-lg mb-6">
        Welcome to <span className="font-semibold">BookPulse</span> — a community-driven platform where readers share honest reviews, discover top-rated books, and connect with publishers. Whether you're a casual reader, a passionate reviewer, or a publisher seeking feedback, BookPulse empowers you to engage meaningfully with literature.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">📚 What We Offer</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>🔍 Discover books by genre, rating, and popularity</li>
        <li>⭐ Submit reviews with star ratings and detailed feedback</li>
        <li>📈 Track review analytics and top-performing titles</li>
        <li>❤️ Save your favorite books and revisit them anytime</li>
        <li>🛠️ Publishers get dashboards to monitor reviews and reader sentiment</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">🎯 Our Mission</h2>
      <p className="mb-6">
        We believe that every book deserves a voice — and every reader deserves a space to share theirs. Our mission is to build a transparent, secure, and insightful review ecosystem that benefits readers and publishers alike.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">🔐 Built for Trust</h2>
      <p className="mb-6">
        With verified accounts, secure authentication, and moderation tools, BookPulse ensures that reviews are genuine and respectful. We’re committed to data integrity, user privacy, and a seamless experience across devices.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">🚀 Join Us</h2>
      <p>
        Whether you're here to explore new reads, share your thoughts, or manage your publishing portfolio — you're part of a growing community that values clarity, feedback, and literary impact.
      </p>
    </div>
  );
};

export default About;