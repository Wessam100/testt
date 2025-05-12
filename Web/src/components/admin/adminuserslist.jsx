import React from 'react';
import { useState, useEffect } from 'react';
import './table.css';
import { deleteUser, editUser } from '../../api/userAPI';

const AdminUserslist = ({ users }) => {

    const [usersList, setUsersList] = useState(users);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedData, setEditedData] = useState({ username: '', email: '' });

    useEffect(() => {
        setUsersList(users);
    }, [users]);

    const deleteFromUser = async (id) => {
        try {
            await deleteUser(id);
            setUsersList(prevUsers => prevUsers.filter(user => user.id !== id));
        } catch (error) {
            console.error('Failed to delete user:', error.message);
        }
    };

    //for the editing stuff:
    const handleEditClick = (user) => {
        setEditingUserId(user.id);
        setEditedData({ username: user.username, email: user.email });
    };

    const handleDoneClick = async (id) => {
        try {
            await editUser(id, editedData.username, editedData.email);
            setUsersList(prev =>
                prev.map(user =>
                    user.id === id ? { ...user, ...editedData } : user
                )
            );
            setEditingUserId(null);
        } catch (error) {
            console.error('Failed to update user:', error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    const filteredUsers = usersList.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return(
        <div>
            <div className='title'>
                <h3 className='title-name'>Users list</h3>
                <input className="title-search" placeholder='username or email'
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
            <table className='table-styling '>
                <thead>
                    <tr>
                        <th className='th-td-styling'>
                            Username
                        </th>
                        <th className='th-td-styling'>
                            Email
                        </th>
                        <th className='th-td-styling'>
                            Creation date
                        </th>
                        <th className='th-td-styling'/>
                    </tr>
                </thead>
                {/* <div className="scrolling-table"> */}
                    <tbody className="scrolling-table">
                        {filteredUsers && filteredUsers.map(
                            (user) => (
                                <tr key={user.id}>
                                    <td className='th-td-styling'>
                                    {editingUserId === user.id ? (
                                    <input
                                        name="username"
                                        value={editedData.username}
                                        onChange={handleInputChange}
                                        placeholder="Username"
                                    />
                                ) : (
                                    user.username
                                )}
                            </td>
                            <td className='th-td-styling'>
                                {editingUserId === user.id ? (
                                    <input
                                        name="email"
                                        value={editedData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                    />
                                ) : (
                                    user.email
                                )}
                            </td>
                            <td className='th-td-styling'>
                                {new Date(user.createdAt).toLocaleString()}
                            </td>
                            <td className='edit th-td-styling'>
                                {editingUserId === user.id ? (
                                    <button
                                        style={{ backgroundColor: 'green', color: 'white' }}
                                        onClick={() => handleDoneClick(user.id)}
                                    >
                                        Done
                                    </button>
                                ) : (
                                    <button onClick={() => handleEditClick(user)}>Edit</button>
                                )}
                                        <button className='delete-button' onClick={() => deleteFromUser(user.id)}>X</button>
                                    </td>
                                </tr>
                                )
                        )}
                    </tbody>
                {/* </div> */}

            </table>
            {filteredUsers.length == 0?
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
        </div>
    )
}
export default AdminUserslist;
