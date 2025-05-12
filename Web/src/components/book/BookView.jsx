import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './BookView.css';
import LibraryList from '../playlist/LibraryList';
import { addReview, getReviews } from '../../api/reviewAPI';
import { useAuth } from '../../Context';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          style={{
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: rating >= star ? 'gold' : 'gray',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const Book = () => {
  const { title } = useParams(); 
  const location = useLocation(); 
  const navigate = useNavigate();
  const book = location.state?.book;
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [rating, setRating] = useState(0);
  const [likedCount, setLikedCount] = useState(10000);
  const [isAuthorBooks, setIsAuthorBooks] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookData, setBookData] = useState({
    BookCoverImage: book?.cover || 'https://picsum.photos/200/300',
    description: book?.description || 'No description available.',
    author: book?.author || 'Unknown Author',
    id: book?.id
  });

  const [reviews, setReviews] = useState([]);

  useEffect(() =>{
          async function get_Reviews() {
              try {
                  console.log("Fetching reviews... for book id: ", bookData.id);  //remove after debugging
                  const fetchedreviews = await getReviews(bookData.id);
                  console.log("Fetched reviews:", fetchedreviews);
                  setReviews(fetchedreviews);
              }
              catch (error) {
                  console.error("Fetching reviews error: ", error);
              }
          }
          get_Reviews();
      }, [bookData.id]);

    async function handleAddReview(data) {
      try {
        const review = await addReview({
          user: user.id,
          book: bookData.id,
          message: data.content,
          rating,
        });
        console.log('frontend: added comment yay');
        setErrorMessage('');
        setReviews([...reviews, review]);
        setRating(0);
      } catch (err) {
        console.error("Create review error:", err);
        if (err.response?.data?.error === 'already reviewed') {
          setErrorMessage('You have already reviewed this book. You can only review a book once.');
        } else {
          setErrorMessage('Failed to add review. Please try again.');
        }
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }

  const handlePlaylistClick = (playlistName) => {
    navigate(`/playlist/${playlistName}`, {
      state: {
        book: {
          id: book?.id,
          title: book?.title,
          author: book?.author,
          cover: book?.cover
        }
      }
    });
  };

  return (
    <div className="book-wrapper">
      <div className="book-container">
        <div className="book-profile">
          <div className="book-header">
            <div className="book-header-content">
              <img
                src={bookData.BookCoverImage}
                alt={`${title} cover`}
                className="book-cover"
              />
              <div className="book-info">
                <h1 className="book-title">{title}</h1>
                <p className="book-author">{bookData.author}</p>
                <p className="book-description">{bookData.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="book-content">
          <LibraryList
            key={book?.id}
            type="playlists"
            title={title}
            header={'Listen Now'}
            book={book}
          />
        </div>

        <div className="comments-section">
          <h3 className="readers-say">What Other Readers Say</h3>

          <div className="comments-list">
            {reviews.length > 0 ? (
              reviews.map(comment => (
                <div key={comment.id} className="comment-item">
                  <p className="comment-text">{comment.content || 'fail'}</p>
                  <div className="comment-box-thing ">
                    <span className="comment-user">{comment.username || 'fail'}</span>
                    <span className="comment-date">{dayjs(comment.createdAt).fromNow() || 'fail'}</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={`${comment.id}-star-${star}`}
                        style={{
                          fontSize: '1rem',
                          color: comment.rating >= star ? 'gold' : 'gray',
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>

          <form className="comment-form" onSubmit={handleSubmit(handleAddReview)}>
            {/* googled an implementation for this error message thats why its inline */}
            {errorMessage && (
              <div className="error-notification" style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '10px',
                fontSize: '14px',
                border: '1px solid #ef9a9a'
              }}>
                {errorMessage}
              </div>
            )}
            <textarea
              placeholder="Add your comment..."
              className="comment-input"
              {...register("content", { required: "lol idiot you didnt add a comment" })}
            />
            <StarRating rating={rating} setRating={setRating} />
            <button type="submit" className="comment-submit-btn">
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Book;