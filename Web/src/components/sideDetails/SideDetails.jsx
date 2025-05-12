import React from 'react';
import './SideDetails.css';

const SideDetails = ({ isOpen, onClose }) => {
  return (
    <div className={`side-details ${isOpen ? 'open' : ''}`}>
      <div className="side-details-header">
        <h2>Details</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="side-details-content">
        <img 
          src="https://picsum.photos/600/600" 
          alt="Book Cover" 
          className="side-details-image"
        />
        <h3 className="side-details-title">The Great Adventure</h3>
        <p className="side-details-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <p className="side-details-description">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
        </p>
      </div>
    </div>
  );
};

export default SideDetails; 