import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteBook, getAdminBookList, editBook } from '../../api/bookAPI';
import './table.css';

const AdminBookslist = ({ books, fetchBooks }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [booksList, setBooksList] = useState(books);
    const [editingBookId, setEditingBookId] = useState(null);
    const [editedData, setEditedData] = useState({ title: '', genre: '' });

    useEffect(() => {
        setBooksList(books);
    }, [books]);

    const filteredBooks = booksList.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (book) => {
        setEditingBookId(book.id);
        setEditedData({ title: book.title, genre: book.genre });
    };

    const handleDoneClick = async (id) => {
        try {
            await editBook(id, editedData.title, editedData.genre);
            setBooksList(prev =>
                prev.map(book =>
                    book.id === id ? { ...book, ...editedData } : book
                )
            );
            setEditingBookId(null);
        } catch (error) {
            console.error('Failed to update book:', error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <div className='title'>
                <h3 className='title-name'>Users list</h3>
                <input className="title-search" placeholder='book title'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <table className='table-styling '>
                <thead>
                    <tr>
                        <th className='th-td-styling'>
                            Cover
                        </th>
                        <th className='th-td-styling'>
                            Title
                        </th>
                        <th className='th-td-styling'>
                            Genre
                        </th>
                        <th className='th-td-styling'>
                            Duration
                        </th>

                    </tr>
                </thead>
                <tbody className="scrolling-table">
                    {/* {books && books.map( */}
                    {filteredBooks && filteredBooks.map(
                        (book) => (
                            <tr className='rowrow' key={book.id}>
                                <td className='th-td-styling'>
                                    <Link to={book.file_url}>
                                        <img src={book.cover_image_url} className="book-cover-img" />
                                    </Link>
                                </td>
                                <td className='th-td-styling'>
                                    {editingBookId === book.id ? (
                                        <input
                                            name="title"
                                            value={editedData.title}
                                            onChange={handleInputChange}
                                            placeholder="Title"
                                        />
                                    ) : (
                                        book.title
                                    )}
                                </td>
                                <td className='th-td-styling'>
                                    {editingBookId === book.id ? (
                                        <input
                                            name="genre"
                                            value={editedData.genre}
                                            onChange={handleInputChange}
                                            placeholder="Genre"
                                        />
                                    ) : (
                                        book.genre
                                    )}
                                </td>
                                <td className='th-td-styling'>
                                    {book.duration}
                                </td>
                                <td className='edit-booklist'>
                                    {editingBookId === book.id ? (
                                        <button
                                            style={{ backgroundColor: 'green', color: 'white' }}
                                            onClick={() => handleDoneClick(book.id)}
                                        >
                                            Done
                                        </button>
                                    ) : (
                                        <button onClick={() => handleEditClick(book)}>Edit</button>
                                    )}
                                    <button
                                        className='delete-button'
                                        onClick={async () => {
                                            try { await deleteBook(book.id); await fetchBooks(); }
                                            catch (error) { console.error(error); }
                                        }}>
                                        X
                                    </button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
                {filteredBooks.length == 0?
                    searchTerm === ''?  <div>
                        No books in database
                    </div>
                    :
                    <div>
                        Nothing matches the search
                    </div>
                    :
                    <div/>
                }
            </table>
        </div>
    )
}

export default AdminBookslist;
