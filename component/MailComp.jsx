import React from "react";

const MainComp = () => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/istockphoto-2160472791-640_adpp_is.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

export default MainComp;
