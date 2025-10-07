import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { PublisherContext } from '../../context/PublisherContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const { aToken, backendUrl } = useContext(PublisherContext);
  const [books, setBooks] = useState([]);
  const [monthlyReviews, setMonthlyReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const booksRes = await axios.get(`${backendUrl}/api/admin/books`, { headers: { aToken } });
      const reviewsRes = await axios.get(`${backendUrl}/api/admin/monthly-reviews`, { headers: { aToken } });

      setBooks(booksRes.data.books);
      setMonthlyReviews(reviewsRes.data.monthlyData);
    };
    fetchData();
  }, []);

  const totalBooks = books.length;
  const totalReviews = books.reduce((acc, b) => acc + b.reviews.length, 0);
  const avgRating = (
    books.reduce((acc, b) => acc + b.reviews.reduce((sum, r) => sum + r.rating, 0), 0) / totalReviews || 0
  ).toFixed(1);

  const now = new Date();
  const booksThisMonth = books.filter(b => {
    const created = new Date(b.createdAt);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const trendArrow = (monthlyReviews[monthlyReviews.length - 1]?.count || 0) >=
    (monthlyReviews[monthlyReviews.length - 2]?.count || 0)
    ? '⬆️'
    : '⬇️';

  const topBooks = [...books]
    .sort((a, b) => b.reviews.length - a.reviews.length)
    .slice(0, 3);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? 'Unknown' : date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const chartData = {
    labels: monthlyReviews.length ? monthlyReviews.map(m => m.month) : ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Monthly Reviews',
      data: monthlyReviews.length ? monthlyReviews.map(m => m.count) : [0, 0, 0],
      borderColor: '#3b82f6',
      backgroundColor: '#93c5fd',
      tension: 0.3,
    }]
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-3xl font-semibold mb-6">📊 Publisher Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Summary + Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">Total Books</h4>
              <p className="text-xl font-bold">{totalBooks}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">Total Reviews</h4>
              <p className="text-xl font-bold">{totalReviews}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">Avg Rating</h4>
              <p className="text-xl font-bold">⭐ {avgRating} /5</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">Books This Month</h4>
              <p className="text-xl font-bold">{booksThisMonth} {trendArrow}</p>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">📈 Monthly Review Chart</h3>
            <Line data={chartData} />
          </div>
        </div>

        {/* Right Section: Top Books + Activity */}
        <div className="space-y-6">
          {/* Top Performing Books */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">🏆 Top Performing Books</h3>
            <div className="space-y-4">
              {topBooks.map(book => {
                const avg = (
                  book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length || 0
                ).toFixed(1);
                return (
                  <div key={book._id} className="border p-3 rounded bg-gray-50">
                    <div className="flex gap-4 items-center">
                      <img src={book.image} alt={book.title} className="w-16 h-24 object-cover rounded" />
                      <div>
                        <h4 className="font-bold text-md">{book.title}</h4>
                        <p className="text-sm text-gray-600">⭐ {avg} | {book.reviews.length} reviews</p>
                        <p className="text-xs text-gray-500">Added: {formatDate(book.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;