import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import LibraryGrid from './LibraryGrid';
import { getUserDetails } from '../../api/userAPI';
import { useAuth } from '../../Context'; // adding this to check if my current user is the same user with the registered token in this wrapper 
import { getFollowerCount, getAllFollowing, followUser, unfollowUser } from '../../api/followAPI';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AuthorProfile = () => {
  const [followerCount, setFollowerCount] = useState(0); 
  const { username } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: currentUser } = useAuth(); // fetching the usrname from the jwt token decoded in the useAuth Function
  function checkOwner(currentUser, profileUser) {
    return currentUser.username === profileUser.username; // return the logical state of whether u accessed ur own profile or someone else's
  }
  const [user, setUser] = useState({
    username: '',
    isAuthor: false,
    bio: '',
    backgroundImage: 'https://picsum.photos/3000/3000', // i am defaulting to this image because we're most probably going to call it from the db
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetails(username);
        setUser({
          id: userData.id,
          username: userData.username,
          isAuthor: userData.isAuthor,
          bio: userData.bio || '',
          backgroundImage: 'https://picsum.photos/3000/3000',
        });
        const count = await getFollowerCount(username);
        setFollowerCount(count.count); // fix for count since the returned json is something like count : a number, using just count will try to show the whole json object which is wrong
        if (currentUser) {
          const followingList = await getAllFollowing(currentUser.username);
          const followingUsernames = followingList.map(user => user.username);
          const isAlreadyFollowing = followingUsernames.includes(username);
          setIsFollowing(isAlreadyFollowing);
        }
  
      } catch (error) {
        console.error('Error fetching user or follow info:', error);
      }
    };
  
    if (username) {
      fetchUser();
    }
  }, [username, currentUser]);

  const followButton = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(currentUser.username, user.username);
        setIsFollowing(false);
      } else {
        await followUser(currentUser.username, user.username);
        setIsFollowing(true);
      }
      
      // making sure the follower count is reflected in the front end without causing an infinite loop
      const updatedCount = await getFollowerCount(username);
      setFollowerCount(updatedCount.count);
    } catch (error) {
      console.error(error);
    }
  };
  
  const Owner = checkOwner(currentUser, user);
  let followButtonClass = 'author-profile-follow-btn';
  if (isFollowing) {
    followButtonClass += ' author-profile-follow-btn--following';
  }

  let followButtonText = 'Follow';
  if (isFollowing) {
    followButtonText = 'Following';
  }

  return (


    <div className="author-profile-wrapper">
        <Link to='/homepage' className='homehome'>
        <FaHome />
      </Link>
      <div className="author-profile-container">
        <div className="author-profile">
          <div className="author-profile-header" style={{ backgroundImage: `url('${user.backgroundImage}')`}}>
            <div className="author-profile-header-overlay">
              <div className="author-profile-identity">
                <h1 className="author-profile-title">{user.username}</h1>
                {(
                  <p className="author-profile-follow-count">
                    {followerCount.toLocaleString()} followers
                  </p>
                )}
              </div>
              {!Owner && ( // this Owner varaible will carry the bool that comes as a result from the previously made function, to control whether this button renders or not.
                <div className="author-profile-actions">
                  <button className={followButtonClass} onClick={followButton}>
                    {followButtonText}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="author-profile-content">
            {user.isAuthor ? (
              // Author view
              <>
                <LibraryGrid type="books" username={user.username} />
              </>
            ) : (
              //Uset view
              <>
                <LibraryGrid type="favorites" username={user.username} />
                <LibraryGrid type="following" username={user.username} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile; 