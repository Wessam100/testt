import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './categorypage.css';
import { FaArrowRight } from 'react-icons/fa';

export default function CategoryBooks() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryNamesMapping = {
    fantasy: 'Must Read',
    science_fiction: 'Science Fiction',
    biographies: 'Biographies',
    recipes: 'Recipes',
    romance: 'Romance',
    textbooks: 'Textbooks',
    children: 'Children\'s',
    history: 'History',
    religion: 'Philosophy',
    mystery_and_detective_stories: 'Mystery',
    plays: 'Dramas',
    science: 'Technology',
  };

  const handleBookClick = (book) => {
    console.log(`Clicked book: ${book.title}`);
    navigate(`/book/${book.title}`, { state: { book } });
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log("id testing", id);
        const response = await fetch(`https://openlibrary.org/subjects/${id}.json`);
        const data = await response.json();

        setBooks(data.works || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [id]);

  const categoryName = categoryNamesMapping[id] || id;

  if (loading) {
    return <p className='loading'>Loading books...</p>;
  }

  return (
    <div>
      <button className="back-button-right" onClick={() => navigate(-1)}>
              <FaArrowRight/>
            </button>
      <h1 className='catname'>Books in {categoryName} Category</h1>
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.key} className="book-card" onClick={() => handleBookClick(book)}> 
              <img
                src={`https://picsum.photos/600?random=${book.key}`}
                alt={book.title}
              />
              <h3>{book.title}</h3>
              <p>{book.authors?.map(author => author.name).join(', ')}</p>
            </div>
          ))
        ) : (
          <p>No books found sop sop :(</p>
        )}
      </div>
    </div>
  );
}
