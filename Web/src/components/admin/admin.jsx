import React, { useState, useEffect } from "react";
import AdminUserslist from "./adminuserslist";
import AdminBookslist from "./adminbookslist";
import { Link } from "react-router-dom";
import './admin.css'
import { getAllUsers } from "../../api/userAPI";
import { getAdminBookList } from "../../api/bookAPI";
import { useAuth } from "../../Context";

// const dummyusers = [
//     {
//         userID: 1,
//         username: 'banana',
//         email: 'banana@gmial.com',
//         createdOn: '20/3/2024'
//     },
//     {
//         userID: 2,
//         username: 'hdj',
//         email: 'fhweu',
//         createdOn: '249894'
//     },
//     {
//         userID: 3,
//         username: 'uhrf',
//         email: 'foue',
//         createdOn: '4792'
//     },
//     {
//         userID: 4,
//         username: 'cbur',
//         email: 'unre',
//         createdOn: '834'
//     },
//     {
//         userID: 5,
//         username: 'curc',
//         email: 'curcahuef',
//         createdOn: '247233'
//     },
// ]

// const dummybooks = [
//     {
//         bookID: 1,
//         title: 'hamefd',
//         genre: 'horror',
//         file_url: 'url',
//         cover_image_url: '../../assets/react.svg',
//         duration: '03:20:03'
//     },
//     {
//         bookID: 2,
//         title: 'poyrte',
//         genre: 'romance',
//         file_url: 'url',
//         cover_image_url: '../../assets/react.svg',
//         duration: '02:15:03'
//     },
//     {
//         bookID: 3,
//         title: 'gbgb',
//         genre: 'habiba',
//         file_url: 'url',
//         cover_image_url: '../../assets/react.svg',
//         duration: '10:10:10'
//     },
// ]

function Admin(){
    const [viewTable, setTable] = useState(true);
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [fetchBooksError, setFetchBooksError] = useState(false);
    const [fetchUsersError, setFetchUsersError] = useState(false);

    const {logout} = useAuth();

    const fetchBooks = async () => { // this was moved outside of useEffect since it will be used in a child component and i'd like to access it separetely
        try {
          console.log("Fetching books...");
          const fetchedbooks = await getAdminBookList();
          setBooks(fetchedbooks);
        }
        catch (error) {
          console.error("Fetching books error: ", error);
          setFetchBooksError(true);
        }
      };

    useEffect(() =>{
        async function getUsers() {
            try {
                console.log("Fetching users...");
                const fetchedusers = await getAllUsers();
                console.log("Fetched users:", fetchedusers);
                setUsers(fetchedusers);
            }
            catch (error) {
                console.error("Fetching users error: ", error);
                setFetchUsersError(true);
            }
        }
        getUsers();
        fetchBooks();
    }, []);

    // useEffect(() => {
    //     async function getBooks() {
    //         try {
    //             const fetchedbooks = await getAllBooks();
    //             setBooks(fetchedbooks);
    //         }
    //         catch (error) {
    //             console.error("Fetching books error: ", error);
    //             setFetchBooksError(true);
    //         }
    //     }
    // }, []);

      
    return( 
    <div className="scrollable-div-container">
           <h2 className="page-title"> Admin page </h2>
        <div className='admin-page'>
            <Link to='/' onClick={ () => {logout}}>
                <button className="logout-button">Logout</button>
            </Link>
           
            {viewTable ? (
                    <div className="buttonsalign">
                        <div className="stupidbuttons"> 
                        <button className="users-table-users-button" onClick={() => setTable(true)}>
                            Users
                        </button>
                        <button className="users-table-books-button" onClick={() => setTable(false)}>
                            Books
                        </button>
                        </div>
                        <div className="div-section-layout">
                            {fetchUsersError ? (
                                <p>Error fetching users.</p>
                            ) : (
                                <AdminUserslist users={users} />
                            )}
                            <Link to="./adduser">
                                <button className="addnew">Add new user</button>
                            </Link>
                        </div>
                    </div>
                    
                    ) : (
                    <div>
                    <div className="tab-buttons"> 
                        <button className="books-table-users-button" onClick={() => setTable(true)}>
                            Users
                        </button>
                        <button className="books-table-books-button" onClick={() => setTable(false)}>
                            Books
                        </button>
                        </div>
                        <div className="div-section-layout">
                            <AdminBookslist books={books} fetchBooks={fetchBooks}/>
                            <Link to="./addbook">
                                <button className="addnew">Add new book</button>
                            </Link>
                        </div>
                    </div>
            )}

        </div>
       
    
    </div>
 
    );
}

export default Admin;