import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Playlist.css';
import LibraryList from './LibraryList'


const Playlist = () => {
  const { name } = useParams();
  const [likedCount, setLikedCount] = useState(10000); 
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaylist, setIsPlaylist] = useState(true);
  const [isBook, setIsBook] = useState(true);
  const [playlistData, setPlaylistData] = useState({
    PlaylistBackgroundImage: 'https://picsum.photos/3000/3000', // will also be replaced with fetched data from db
  });
  
  let likedButtonClass = 'not-liked-btn';
  if (isLiked) {
    likedButtonClass += ' not-liked-btn--liked';
  }

  let ButtonText = 'Like';
  if (isLiked) {
    ButtonText = 'Liked';
  }

  return (

    <div className="playlist-wrapper">
      <div className="playlist-container">
        <div className="playlist-profile">
        
        <div className="playlist-header" style={{ backgroundImage: `url('${playlistData.PlaylistBackgroundImage}')`}}>
        <div className="playlist-header-overlay">
            <div className="playlist-identity">
              <h1 className="playlist-title">{name}</h1>
              <p className="playlist-liked-count">
                {likedCount.toLocaleString()} Likes
              </p>
            </div>

          <div className="playlist-actions">
            <button className={likedButtonClass} onClick={() => setIsLiked(!isLiked)}>
              {ButtonText}
            </button>
          </div>
        </div>
        </div>
      


        </div>

          <div className="playlist-content">

          <LibraryList type="books" name={name} header={"Hot Spicy Playlist"}/>
          </div> 

      </div>


     </div>

  );
};

export default Playlist; 