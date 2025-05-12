import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export async function getUserPlaylists(username) {
  const response = await axios.get(`${API_BASE}/playlists/user/${username}`);
  return response.data;
}

export async function getPlaylistDetails(playlistId) {
  const response = await axios.get(`${API_BASE}/playlists/details/${playlistId}`);
  return response.data;
} 