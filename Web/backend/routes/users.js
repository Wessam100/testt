const express = require('express');
const router = express.Router();
const { createUser, getUserByCredentials, getAllUsers , getUserDetails, deleteUser, editUser, userEditUser, getUserEditProfile, changePassword } = require('../controllers/userController');

router.post('/', getUserByCredentials);
router.get('/:name', getUserDetails);
router.delete('/admin/:id', deleteUser)
router.get('/admin', getAllUsers);

// Sign up route
router.post('/signup', createUser);

router.post('/admin/adduser', createUser);
router.post('/admin/edit', editUser)

router.get('/admin/users', getAllUsers);

router.post('/edituser', getUserEditProfile);
router.post('/edituser/profile', userEditUser);
router.post('/edituser/password', changePassword);

router.get('/:name', getUserDetails);

module.exports = router; 