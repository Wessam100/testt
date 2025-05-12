import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export async function getUserFavorites(username) {
  const response = await axios.get(`${API_BASE}/favorites/user/${username}`);
  console.log('response.data', response.data);
  return response.data;
}

export async function toggleFavorite(userId, bookId) {
  const response = await axios.put(`${API_BASE}/favorites/user/${userId}/book/${bookId}`);
  return response.data;
}

export async function isFavorited(userId, bookId) {
  const response = await axios.get(`${API_BASE}/favorites/user/${userId}/book/${bookId}`);
  return response.data;
} 