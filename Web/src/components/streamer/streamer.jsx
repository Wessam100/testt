import React, { useEffect, useState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "./streamer.css"

// Use Vite's environment variable convention
const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || "http://localhost:3000";

const Streamer = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState("");
  const [stream, setStream] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate(); 

  const peers = {};

  useEffect(() => {
    if (!isStreaming || !streamId) return;

    const setUpStreaming = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(userStream);

        const newSocket = io(SIGNALING_SERVER_URL);
        setSocket(newSocket);

        newSocket.emit("room:join", streamId);

        newSocket.on("room:listener-joined", (listenerId) => {
          const peer = new Peer({
            initiator: true,
            stream: userStream,
          });

          peer.on("signal", (data) => {
            newSocket.emit("peer:signal", listenerId, data);
          });

          peers[listenerId] = peer;
        });

        newSocket.on("peer:signal", (originId, data) => {
          peers[originId]?.signal(data);
        });
      } catch (error) {
        console.error("Error accessing media devices: ", error);
      }
    };

    setUpStreaming();

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (socket) socket.disconnect();

      Object.values(peers).forEach((peer) => peer.destroy());
    };
  }, [isStreaming, streamId]);

  const startStream = () => {
    setStreamId(Math.random().toString(36).slice(2, 9));
    setIsStreaming(true);
  };

  const endStream = () => {
    // Stop the audio stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Disconnect the socket
    if (socket) {
      socket.emit("peer:disconnect");
      socket.disconnect();
    }

    // Clean up peers
    Object.values(peers).forEach((peer) => peer.destroy());

    setIsStreaming(false);
    setStreamId("");
  };

return (
  <div className="bg-color">
    <div className="listener-container">
      <button className="back-buttonn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <div className="imageContainer"></div>

      {isStreaming && streamId && (
        <div className="stream-id-display">
          <p>Stream ID: <strong>{streamId}</strong></p>
        </div>
      )}

      <button className="startstreaming" onClick={isStreaming ? endStream : startStream}>
        {isStreaming ? "End Streaming" : "Start Streaming Audio"}
      </button>
    </div>
  </div>
);


};
export default Streamer;
