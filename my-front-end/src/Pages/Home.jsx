import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";

const HomePage = () => {
  const {user}=useAuth()
  const navigate = useNavigate();
  

  const handleBoxClick = (destination) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(destination);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Banner Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Food sharing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/40 to-orange-400/40" />
        </div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
              "Sharing Food, Nourishing Souls"
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 font-medium">
              Join our community to reduce food waste and help those in need
            </p>
          </div>
        </div>
      </div>

      {/* Action Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Share Food Card */}
          <div 
            className="relative bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all 
                      hover:scale-105 hover:shadow-2xl group"
            onClick={() => handleBoxClick("/helper")}
          >
            <div className="absolute inset-0 bg-orange-500/5 rounded-2xl group-hover:bg-orange-500/10 transition" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 p-4 rounded-lg">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-4">Share Food</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Have extra food? Share it with your community and help reduce waste while supporting those in need.
              </p>
            </div>
          </div>

          {/* Find Food Card */}
          <div 
            className="relative bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all 
                      hover:scale-105 hover:shadow-2xl group"
            onClick={() => handleBoxClick("/acceptor")}
          >
            <div className="absolute inset-0 bg-orange-500/5 rounded-2xl group-hover:bg-orange-500/10 transition" />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 p-4 rounded-lg">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-4">Find Food</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Discover fresh, donated food in your area. Connect with local donors and reduce food insecurity in your community.
              </p>
            </div>
          </div>
        </div>

        {!user && (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              You need to be logged in to access these features.{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-orange-600 font-semibold hover:underline"
              >
                Click here to login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;