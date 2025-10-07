import React from 'react';
import header from '../../assets/header_img.png';

const Header = () => {
  return (
    <div className="relative w-full">
      {/* Mobile/Tablet View: Text Over Image */}
      <div className="md:hidden relative">
        <img src={header} className="w-full h-auto object-cover" />
        <div className="absolute right-32 inset-0 flex flex-col items-center justify-center px-6 py-10 text-center text-black">
          <h1 className="text-2xl sm:text-3xl font-semibold leading-snug mb-2">
            Welcome to BookReview <br /> Discover. Review. Reflect.
          </h1>
          <p className="text-sm sm:text-base font-light">
            Find Your Next Favorite Book here & Read. Discover. Review.
          </p>
        </div>
      </div>

      {/* Desktop View: Side-by-Side Layout */}
      <div className="hidden md:flex flex-row items-center justify-between px-6 md:px-10 lg:px-20 py-10 md:py-[6vw]">
        {/* Left Section: Text */}
        <div className="w-1/2 flex flex-col items-start justify-center gap-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black leading-tight">
            Welcome to BookReview <br /> Discover. Review. Reflect.
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-black font-light">
            Find Your Next Favorite Book here & Read. Discover. Review.
          </p>
        </div>

        {/* Right Section: Image */}
        <div className="w-1/2">
          <img src={header} alt="BookReview Header" className="w-full h-auto rounded-lg object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Header;