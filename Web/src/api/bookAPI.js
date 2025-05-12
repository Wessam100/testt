import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export async function getUserBooks(username) {
  const response = await axios.get(`${API_BASE}/books/user/${username}`);
  return response.data;
}

export async function getBookDetails(bookId) {
  const response = await axios.get(`${API_BASE}/books/details/${bookId}`);
  return response.data;
}

export async function getAdminBookList(){
  const response = await axios.get(`${API_BASE}/books/admin/books`);
  return response.data;
}

export async function addAdminBook(formData) {
  try {
    console.log('Sending form data to backend');
    
    const response = await axios.post(
      `${API_BASE}/books/admin/book/add`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in addAdminBook API call:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function deleteBook(bookId) {
  console.log("Deleting book:", bookId);
  const response = await axios.post(`${API_BASE}/books/delete/${bookId}`);
  return response.data;
}

export async function editBook(id, title, genre){
  const response = await axios.post(`${API_BASE}/books/admin/editbook`, {
    id, title, genre
  });
  return response.data
}

export async function getBooksByGenre(genre) {
  const response = await axios.get(`${API_BASE}/books/genre/${genre}`);
  return response.data;
}

// export async function fetchCover(coverpath) {
//   console.log("ferching cover image from ", coverpath);
//   const response = await axios.get(`${API_BASE}/uploads/${coverpath}`);
//   return response.data;
// }