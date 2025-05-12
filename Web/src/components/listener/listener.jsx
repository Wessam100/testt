import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import './listener.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || "http://localhost:3000";

const Listener = () => {
  const [isListening, setIsListening] = useState(false);
  const [streamId, setStreamId] = useState("");
  const audioRef = useRef(null);
   const navigate = useNavigate();

  useEffect(() => {
    if (!isListening || !streamId) return;

    const socket = io(SIGNALING_SERVER_URL);
    const peer = new Peer({ initiator: false });

    let streamerId;

    socket.emit("room:join", streamId);

    socket.once("room:streamer-connected", (originId) => {
      streamerId = originId;
    });

    socket.on("peer:signal", (_, data) => {
      peer.signal(data);
    });

    peer.on("signal", (data) => {
      socket.emit("peer:signal", streamerId, data);
    });

    peer.on("stream", (stream) => {
      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        audioRef.current.play().catch(console.error);
      }
    });

    return () => {
      socket.disconnect();
      peer.destroy();
    };
  }, [isListening, streamId]);

  return (
    <div className="listener-container">
         <button className="back-buttonn" onClick={() => navigate(-1)}>
        <FaArrowLeft/>
      </button>
      <div className="input-button-group">
        <input
          type="text"
          value={streamId}
          onChange={({ target: { value } }) => setStreamId(value)}
          disabled={isListening}
          placeholder="Enter Stream ID"
        />
  
        <button
          onClick={() => streamId && setIsListening(true)}
          disabled={isListening}
          className="play-button"
        >
               Listen
        </button>
      </div>

      <div className="imageContainer"></div>
      <audio ref={audioRef} controls autoPlay />
    </div>
  );
};

export default Listener;
