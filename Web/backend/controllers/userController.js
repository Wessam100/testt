const User = require('../models/user');
const bcrypt = require('bcrypt');

// use in admin add user and signups
const createUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log('Creating user with:', username, email);
  
      if (!username || !email || !password) {
        console.log('Missing fields:', { username, email, password });
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed password:', hashedPassword);
  
      const user = await User.create({ username, email, password: hashedPassword });
      console.log('User created:', user.username);
  
      res.status(201).json(user);
    } catch (error) {
      console.error("Error in createUser:", error);
      res.status(500).json({ error: error.message });
    }
  };
  

// in admin delete user button or in user settings delete account (not implemented yet)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    console.log('delete user reached controller');
    if (!user) return res.status(404).json({ error: 'User not found' });
    console.log('db from controller found the user to delete');
    console.log('');
    await user.destroy();
    console.log('user deleted in controller')
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// login

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'very_secret_key';

const getUserByCredentials = async (req, res) => {
  try {
    const { inputUsername, inputPassword } = req.body;
    const userByUsername = await User.findOne({ where: { username: inputUsername } });
    const userByEmail = await User.findOne({ where: { email: inputUsername } });

    const user = userByUsername || userByEmail;
    if (!user) return res.status(404).json({ error: 'wrong username or password' });

    const validate = await bcrypt.compare(inputPassword, user.password);
    if (!validate) {
      return res.status(404).json({ error: 'wrong username or password' });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      isAdmin: user.username.toLowerCase() === 'admin'
    };
    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '24h' });// yes its a day, i am not trying to get kicked out </3 //marry me

    res.status(200).json({token, user: tokenPayload});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async(req, res) => { 
  try {
    console.log('fetch users reached controller')
    const users = await User.findAll();
    console.log("if this logs then issue is not in controller");
    res.status(200).json(users);
  } catch (error) {
    console.log("controller error in fetch users")
    res.status(500).json({ error: error.message });
  }
}

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.name },  attributes: ['id', 'username', 'isAuthor', 'bio', 'profilePicture']});
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editUser = async (req, res) => {
  console.log('if in admin ignore, user edit profile tho reached, req.body is: ', req.body);
  try {
    const { id, username, email } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.username = username;
    user.email = email;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userEditUser = async (req, res) => {
  console.log("edit user controller, this is the request body: ", req.body)
  try {
    const { id, bio, firstName, lastName } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if(firstName !== null)
    {
      console.log("changing first name with: ", firstName);
      user.firstName = firstName;
    }
    if(lastName !== null)
    {
      user.lastName = lastName;
    }
      
    if(bio !== null)
      user.bio = bio;
    console.log("user before changing: ", user);
    await user.save();
    console.log("user after changing: ", user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserEditProfile = async (req, res) => {
  console.log("hi, reached controller, this is the request body: ", req.body," and \nuser id: ", req.body.id)
  try {
    const { id } = req.body;
    const user = await User.findByPk(id);//, {attributes: ['username', 'email', 'firstname', 'lastname', 'password', 'bio']});
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async  (req, res) => {
  console.log("reached password contorller, rewuest: ", req.body);
  try {
    const { id, oldpass, newpass } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const validate = await bcrypt.compare(oldpass, user.password);
    if(!validate) return res.status(400).json({ error: "Wrong password"});
    const hashedPassword = await bcrypt.hash(newpass, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

userEditUser, getUserEditProfile, changePassword
module.exports = { createUser, deleteUser, getUserByCredentials , getAllUsers, getUserDetails, editUser, userEditUser, getUserEditProfile, changePassword};
