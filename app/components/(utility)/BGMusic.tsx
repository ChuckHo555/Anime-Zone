"use client";

import { useState, useRef, useEffect } from "react";

const VolumeControl: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleAllow = () => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
      audioRef.current
        .play()
        .then(() => {
          setPermissionRequested(true);
        })
        .catch((error) => console.error("Audio play failed:", error));
    }
  };

  const handleDeny = () => {
    setPermissionRequested(true);
    if (audioRef.current) {
      audioRef.current.pause(); 
      audioRef.current.currentTime = 0; 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <audio ref={audioRef} loop>
        <source src="/Videos/BGMusic.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {!permissionRequested && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-lg shadow-lg p-4 w-[300px] z-50">
          <p className="mb-4 text-center">Allow background music?</p>
          <div className="flex justify-around">
            <button
              onClick={handleAllow}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Allow
            </button>
            <button
              onClick={handleDeny}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Deny
            </button>
          </div>
        </div>
      )}

<button
  onClick={() => setIsVisible(!isVisible)}
  className="absolute top-5 right-5 p-3 bg-gray-800 text-white rounded-full shadow-lg z-[100]"
>
  <span role="img" aria-label="volume">
    🔊
  </span>
</button>

      {isVisible && (
        <div className="absolute top-5 right-20 bg-gray-700 p-4 rounded-lg shadow-lg w-48 flex flex-col items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default VolumeControl;
