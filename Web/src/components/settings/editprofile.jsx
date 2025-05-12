import { useAuth } from "../../Context";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {editUser,getUserEditProfile,editUserProfile,editUserPassword} from '../../api/userAPI';
import "./editprofile.css";
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
   const navigate = useNavigate();
  const { user } = useAuth();

  const [userInfo, setUserInfo] = useState(null);
  const [accountInfoEdit, setAccountInfoEdit] = useState(false);
  const [profileInfoEdit, setProfileInfoEdit] = useState(false);

  const [accountInfo, setAccountInfo] = useState({ username: '', email: '' });
  const [profileInfo, setProfileInfo] = useState({ firstname: '', lastname: '', bio: '' });

  const [passwordEdit, setPasswordEdit] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldpass: '',
    newpass: '',
    confirmNewPass: ''
  });
  const [passwordError, setPasswordError] = useState('');

  async function getInfo() {
    try {
      const fetchedInfo = await getUserEditProfile(user.id);
      setUserInfo(fetchedInfo);
      setAccountInfo({ username: fetchedInfo.username, email: fetchedInfo.email });
      setProfileInfo({
        firstname: fetchedInfo.firstname || '',
        lastname: fetchedInfo.lastname || '',
        bio: fetchedInfo.bio || ''
      });
    } catch (error) {
      console.error("Fetching user info error: ", error);
    }
  }

  useEffect(() => {
    if (user?.id) getInfo();
  }, [user]);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountEdit = async () => {
    try {
      await editUser(user.id, accountInfo.username, accountInfo.email);
      setAccountInfoEdit(false);
      await getInfo(); // refresh UI
    } catch (error) {
      console.error('Failed to update account info:', error.message);
    }
  };

  const handleProfileEdit = async (e) => {
    e.preventDefault();
    try {
      await editUserProfile({
        id: user.id,
        firstname: profileInfo.firstname,
        lastname: profileInfo.lastname,
        bio: profileInfo.bio
      });
      setProfileInfoEdit(false);
      await getInfo(); // refresh UI
    } catch (error) {
      console.error('Failed to update profile info:', error.message);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordData.newpass !== passwordData.confirmNewPass) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
    console.log("sending: id: ", user.id, " old pass: ", passwordData.oldpass,", and new pass: ", passwordData.newpass)
      await editUserPassword(user.id, passwordData.oldpass, passwordData.newpass);
      alert("Password changed successfully!");
      setPasswordEdit(false);
      setPasswordData({ oldpass: '', newpass: '', confirmNewPass: '' });
    } catch (error) {
      setPasswordError("Failed to change password: " + error.message);
    }
  };

  return (
    <div className="edit-account-container">
       <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowRight />
      </button>

      {/* Account Info */}
      <div className="edit-account-card">
        <h2 className="cardtitle">Edit Account</h2>
        <button onClick={() => setAccountInfoEdit(!accountInfoEdit)}>Edit</button>
        {accountInfoEdit ? (
          <div>
            <label>Username</label>
            <input name="username" value={accountInfo.username} onChange={handleAccountChange} />
    
            <label>Email</label>
            <input name="email" value={accountInfo.email} onChange={handleAccountChange} />
            <br/>
            <button className="leavemealone" onClick={handleAccountEdit}>Save Changes</button>
          </div>
        ) : (
          <div>
            <label>Username</label>
            <h3>{userInfo?.username}</h3>
           
            <label>Email</label>
            <h3>{userInfo?.email}</h3>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="edit-account-card">
        <h2 className="cardtitle">Edit Profile</h2>
        <button onClick={() => setProfileInfoEdit(!profileInfoEdit)}>Edit</button>
        {profileInfoEdit ? (
          <form onSubmit={handleProfileEdit}>
            <label>First Name</label>
            <input name="firstname" value={profileInfo.firstname} onChange={handleProfileChange} />
        
            <label>Last Name</label>
            <input name="lastname" value={profileInfo.lastname} onChange={handleProfileChange} />

            <label>Bio</label>
            <input name="bio" value={profileInfo.bio} onChange={handleProfileChange} />
            <br/>
            <button className="leavemealone" type="submit">Save Changes</button>
          </form>
        ) : (
          <div>
            <label>First Name</label>
            <h3>{userInfo?.firstname}</h3>
            
            <label>Last Name</label>
            <h3>{userInfo?.lastname}</h3>
      
            <label>Bio</label>
            <h3>{userInfo?.bio}</h3>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="edit-account-card">
        <h2 className="cardtitle">Change Password</h2>
        <button onClick={() => setPasswordEdit(!passwordEdit)}>Change Password</button>
        {passwordEdit && (
          <form onSubmit={handlePasswordSubmit}>
            <label>Old Password</label>
            <input
              type="password"
              name="oldpass"
              value={passwordData.oldpass}
              onChange={handlePasswordChange}
              required
            />
            <br />
            <label>New Password</label>
            <input
              type="password"
              name="newpass"
              value={passwordData.newpass}
              onChange={handlePasswordChange}
              required
            />
            <br />
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPass"
              value={passwordData.confirmNewPass}
              onChange={handlePasswordChange}
              required
            />
            <br />
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            <button className="leavemealone" type="submit">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
}
