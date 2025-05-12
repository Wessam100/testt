import { useState } from 'react';
import './upload_playbar.css';


export default function UploadPlaybar() {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying); 

    if(isPlaying){

    }
  };

    return (
      <div id="audio-player-container">
        <div id="playbar-actions">
        {/* <button className="skip-icon" style={{ transform: 'scaleX(-1)' }}></button> */}
          <button type='button' id="play-icon" onClick={togglePlay} className={isPlaying ? 'playing' : 'paused'}></button>
          {/* <button className="skip-icon"></button> */}
        </div>
        <br></br>
        <div id="time-bar">
        <input type="range" id="seek-slider" max="100" defaultValue="0" />
        <span id="current-time" className="time" style={{  marginBottom: '1%' }}>0:00</span>
        </div>
      </div>
    );
  }
  