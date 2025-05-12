import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export async function getReviews(bookId) {
  const response = await axios.get(`${API_BASE}/review/${bookId}`);
  return response.data;
}

export async function addReview({ user, book, message, rating }) {
  const response = await axios.post(`${API_BASE}/review/add`, {
    user, book, message, rating
  });
  return response.data;
}
