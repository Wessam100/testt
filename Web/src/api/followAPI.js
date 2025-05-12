import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export async function getAllFollowing(username) {
  const response = await axios.get(`${API_BASE}/follow/${username}/following`);
  return response.data;
}

export async function followUser(username, targetUsername) {
  const response = await axios.post(`${API_BASE}/follow/${username}/follow`, {
    targetUsername
  });
  return response.data;
}

export async function unfollowUser(username, targetUsername) {
  const response = await axios.delete(`${API_BASE}/follow/${username}/unfollow/${targetUsername}`);
  return response.data;
}

export async function getFollowerCount(username) {
  const response = await axios.get(`${API_BASE}/follow/${username}/count`);
  return response.data;
}

export async function getAllFollowers(username) {
  const response = await axios.get(`${API_BASE}/follow/${username}/followers`);
  return response.data;
}
