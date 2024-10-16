import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

const WebRTC = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      host: "localhost", // Use your peer server's host or IP
      port: 9000,
      path: "/myapp",
    });

    newPeer.on("open", (id) => {
      setPeerId(id);
      console.log(`My peer ID is: ${id}`);
    });

    newPeer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream); // Answer the call with your own video/audio stream

          call.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
            remoteVideoRef.current.srcObject = remoteStream;
          });
        })
        .catch((err) => console.error("Error getting media: ", err));
    });

    setPeer(newPeer);
  }, []);

  const connectToPeer = () => {
    const conn = peer.connect(remotePeerId);
    conn.on("open", () => {
      setConnection(conn);
      console.log(`Connected to: ${remotePeerId}`);
    });
  };

  const callPeer = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        const call = peer.call(remotePeerId, stream);

        call.on("stream", (remoteStream) => {
          setRemoteStream(remoteStream);
          remoteVideoRef.current.srcObject = remoteStream;
        });
      })
      .catch((err) => console.error("Error getting media: ", err));
  };

  return (
    <div>
      <h1>PeerJS WebRTC App</h1>
      <div>
        <h3>Your Peer ID: {peerId}</h3>
        <input
          type="text"
          placeholder="Enter Remote Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <button onClick={connectToPeer}>Connect</button>
        <button onClick={callPeer}>Call</button>
      </div>

      <div>
        <h3>Local Video</h3>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          style={{ width: "300px" }}
        ></video>
      </div>

      <div>
        <h3>Remote Video</h3>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "300px" }}
        ></video>
      </div>
    </div>
  );
};

export default WebRTC;
