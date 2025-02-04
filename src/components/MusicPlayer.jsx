import React, { useState, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import Button from "../components/Button";
import Equalizer from "../components/Equalizer";

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(true);
  const audioRef = React.useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(
          "https://robo-music-api.onrender.com/music/my-api"
        );
        const data = await response.json();
        setSongs(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.songUrl;
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
      };
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
    }
  }, [currentSong]);

  const togglePlayPause = (song) => {
    if (currentSong?.songUrl === song.songUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
    }
  };

  const playNext = () => {
    const currentIndex = songs.findIndex(
      (song) => song.songUrl === currentSong.songUrl
    );
    const nextSong = songs[(currentIndex + 1) % songs.length];
    setCurrentSong(nextSong);
  };

  const playPrevious = () => {
    const currentIndex = songs.findIndex(
      (song) => song.songUrl === currentSong.songUrl
    );
    const prevSong = songs[(currentIndex - 1 + songs.length) % songs.length];
    setCurrentSong(prevSong);
  };

  const handleProgressChange = (event) => {
    const value = event.target.value;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolumeChange = (event) => {
    const value = event.target.value;
    audioRef.current.volume = value;
    setVolume(value);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 relative">
      {loading && <Equalizer isLoading={loading} />}
      <div className="absolute top-4 w-full text-center">
        <h1 className="text-3xl font-bold text-gray-300">Music Player</h1>
      </div>

      {/* Song Selection Area */}
      <div
        className={`w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-16 overflow-y-auto transition-all ${
          currentSong ? "pb-48 sm:pb-32" : ""
        }`}
      >
        {songs.map((song) => (
          <div
            key={song.songUrl}
            className={`relative p-4 rounded-lg group transition-all ${
              currentSong?.songUrl === song.songUrl
                ? "bg-[#303030]"
                : "bg-gray-800 hover:bg-[#303030]"
            }`}
          >
            <div
              className={`absolute inset-0 transition-all rounded-lg ${
                currentSong?.songUrl === song.songUrl
                  ? "opacity-80 bg-[#404040]"
                  : "opacity-0 group-hover:opacity-80"
              }`}
            ></div>
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h3 className="font-semibold text-lg sm:text-xl text-white">
                  {song.songTitle}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  {song.artistName}
                </p>
              </div>
              <img
                src={song.songImage}
                alt="Cover"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
              />
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 transition-all opacity-0 group-hover:opacity-100">
              <Button onClick={() => togglePlayPause(song)}>
                {currentSong?.songUrl === song.songUrl && isPlaying ? (
                  <Pause />
                ) : (
                  <Play />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Play Area */}
      {currentSong && (
        <div className="fixed bottom-0 w-full bg-gray-800 p-4 flex flex-col sm:flex-row items-center justify-between">
          {/* Left Side - Song Info */}
          <div className="flex items-center space-x-4">
            <img
              src={currentSong.songImage}
              alt="Cover"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
            />
            <p className="text-white text-sm sm:text-base ml-4">
              {currentSong.songTitle} - {currentSong.artistName}
            </p>
          </div>

          {/* Center - Play Controls */}
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <Button onClick={playPrevious}>
              <SkipBack />
            </Button>
            <Button onClick={() => togglePlayPause(currentSong)}>
              {isPlaying ? <Pause /> : <Play />}
            </Button>
            <Button onClick={playNext}>
              <SkipForward />
            </Button>
          </div>

          {/* Right Side - Progress and Volume Controls */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-2 sm:mt-0">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-40 sm:w-48"
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-40 sm:w-48"
            />
          </div>
        </div>
      )}

      <audio ref={audioRef} onEnded={playNext} />
    </div>
  );
};

export default MusicPlayer;
