const BackgroundVideo: React.FC = () => {
  return (
    <div className="background-video-container">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src="/Videos/BGVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundVideo;
