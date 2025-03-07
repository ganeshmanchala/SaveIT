import React from "react";
import { useNavigate } from "react-router-dom";
// Assume you have an authentication context; if not, replace with your own logic.


const HomePage = () => {
  const navigate = useNavigate();
  let  isLoggedIn  = false;
  if(localStorage.getItem('authToken')){
    isLoggedIn=true;
  } // Replace with your auth hook/logic

  // Handler for both boxes
  const handleBoxClick = (destination) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(destination);
    }
  };

  return (
    <div className="h-full bg-cover"
    style={{
      backgroundImage:
        'url("https://cdn.deepseek.com/blog/banner-background.webp")',
    }}
    >
    {/* Banner Section with Background Image */}
    <header
      className="relative h-64 bg-auto bg-center"
      style={{
        backgroundImage:
          'url("https://cdn.zeptonow.com/production/tr:w-1280,ar-3840-705,pr-true,f-auto,q-80/inventory/banner/4ea3de05-f469-4df2-9548-db9c9863dfdf.png")',
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-white text-4xl font-bold">
          Welcome to Our Platform
        </h1>
        <p className="text-white mt-4 text-lg">
          Be Reason For SomeOne Happiness
        </p>
      </div>
    </header>

    {/* Main Content Section with Two Boxes */}
    <div className="container  mx-auto mt-8 flex flex-col md:flex-row justify-center gap-8">
      {/* Help Box */}
      <div
        className="bg-[#d1aeff] rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition"
        onClick={() => handleBoxClick("/helper")}
      >
        <h2 className="text-2xl font-semibold mb-4">Help</h2>
        <p className="text-gray-600">Click here if you need assistance.</p>
      </div>

      {/* Accept Box */}
      <div
        className="bg-[#d1aeff] rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition"
        onClick={() => handleBoxClick("/acceptor")}
      >
        <h2 className="text-2xl font-semibold mb-4">Accept</h2>
        <p className="text-gray-600">Click here to accept the offer.</p>
      </div>
    </div>
  </div>
  );
};

export default HomePage;
