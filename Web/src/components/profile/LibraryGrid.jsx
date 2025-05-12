import React, { useState, useEffect } from 'react';
import { getAllFollowing } from '../../api/followAPI';
import { getUserBooks } from '../../api/bookAPI';
import { getUserFavorites } from '../../api/favoriteAPI';
import AddBook from '../admin/addbook';
import { useAuth } from '../../Context';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const LibraryGrid = ({ type, username, userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const API_BASE = 'http://localhost:3000';
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const effectiveUserId = user.id;

  const handleBookClick = async (book) => {
    console.log(`Clicked book: ${book.title}`);
    navigate(`/book/${book.title}`, {
      state: {
        book: {
          ...book,
          cover: book.coverImage ? `${API_BASE}/${book.coverImage}` : "https://picsum.photos/200/300",
          author: username
        },
      },
    });
  };
// very simple implementation for accessing user profiles as a button. dont look into it >:c
  const handleProfileClick = (profileUsername) => {
    console.log(`Clicked profile: ${profileUsername}`);
    navigate(`/profile/${profileUsername}`);
  };

  const refreshBooks = async () => {
    if (type === 'books' && username) {
      try {
        const data = await getUserBooks(username);
        setItems(data);
      } catch (err) {
        console.error(`Couldn't reload books:`, err);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!username) return;
      
      try {
        let data;
        if (type === 'books') {
          data = await getUserBooks(username);
        } else if (type === 'following') {
          data = await getAllFollowing(username);
        } else if (type === 'favorites') {
          data = await getUserFavorites(username);
        }

        setItems(data || []); // Ensure data is an array even if null
        setError(null);
      } catch (err) {
        console.error(`Couldn't load ${type}:`, err);
        setError(`Failed to load ${type}`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [type, username, userId]);

  if (loading) return <div className="author-profile-loading">Loading...</div>;

  const handleBookAdded = () => {
    setShowAddBook(false);
    refreshBooks(); // Refresh the books after adding
  };

  if (showAddBook && type === 'books') {
    return <AddBook 
      onCancel={handleBookAdded} 
      userId={effectiveUserId} 
    />; 
  }
  return (
    <div className="author-profile-library">
      <div className="author-profile-section-header">
        <h2 className="author-profile-section-title">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </h2>
        {type === 'books' && user && user.username === username && (
          <button onClick={() => setShowAddBook(true)} className="add-book-button">
            Add Book
          </button>
        )}
      </div>
      <div className="author-profile-grid">
      {items.map((item) => {
          const imageUrl = item.coverImage ? `${API_BASE}/${item.coverImage}` : "https://picsum.photos/200/300";
          return (
            <div 
              key={item.id} 
              className="author-profile-grid-item"
              onClick={() => {
                if (type === 'books') {
                  handleBookClick(item);
                } else if (type === 'following') {
                  handleProfileClick(item.username);
                }
              }}
              style={{ cursor: (type === 'books' || type === 'following') ? 'pointer' : 'default' }}
            >
              <div className="author-profile-book-cover"
                style={{
                  backgroundImage: `url('${imageUrl}')`,
                  backgroundSize: 'cover', backgroundPosition: 'center'
                }}
              />
              <div className="author-profile-book-info">
                <h3 className="author-profile-book-title">
                  {type === 'following' ? item.username :
                  type === 'playlists' ? item.name :
                  item.title}
                </h3>
                <p className="author-profile-book-author">
                  {type === 'following' ? (item.isAuthor ? 'Author' : 'User') :
                  type === 'playlists' ? `${item.bookCount || 0} books` :
                  item.author}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryGrid;