import React, { useState,useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Components/AuthContext";
import "./Helper.css"; // Import custom CSS
const apiUrl = import.meta.env.VITE_API_URL;


const Helper = () => {
  const {user} =useAuth();

  const [selectedFile, setSelectedFile] = useState(null); // New state for file
  const [preview, setPreview] = useState(""); // For image preview

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  
  const [formData, setFormData] = useState({
    username: user.Username,
    item_name: "",
    quantity: "",
    img: "",
    prepared: { date: "", Time: "" },
    location: {
      lat:"",
      lon:"",
      place:""
    },
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const address = response.data.display_name;

          if (window.confirm(`Detected location: ${address}. Use this location?`)) {
            setFormData({ ...formData, location:{lat:lat,lon:lon,place:address} });
            setLocationConfirmed(true);
          } else {
            setLocationConfirmed(false);
          }
        } catch (error) {
          alert("Error getting address. Try again.");
          console.error(error);
        }
        setLoadingLocation(false);
      },
      (error) => {
        alert("Error getting location: " + error.message);
        setLoadingLocation(false);
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePreparedChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      prepared: { ...formData.prepared, [name]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.location.place) { // Changed validation check
      alert("Please provide a location.");
      return;
    }
  
    const data = new FormData();
    data.append("username", formData.username);
    data.append("item_name", formData.item_name);
    data.append("quantity", formData.quantity);
    data.append("preparedDate", formData.prepared.date);
    data.append("preparedTime", formData.prepared.Time);
    
    // Append location properties individually
    data.append("location[lat]", formData.location.lat);
    data.append("location[lon]", formData.location.lon);
    data.append("location[place]", formData.location.place);
  
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      console.log(data);
      const response = await axios.post(`${apiUrl}/api/addProduct`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true 
      });

      if (response.data.success) {
        alert("Product added successfully!");
        setFormData({
          username: localStorage.getItem('Username'),
          item_name: "",
          quantity: "",
          prepared: { date: "", Time: "" },
          location: {lat:"",lon:"",place:""},
        });
        setSelectedFile(null);
        setPreview("");
        fetchData();
        setLocationConfirmed(false);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }

  };


  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      // console.log()
      const response = await axios.post(`${apiUrl}/api/displayMyProducts`,{username:user.Username},{
        withCredentials: true // This is crucial
      });
      // console.log(response.data); // Check the fetched data structure
      setProducts(response.data); // Assuming response.data is an array of products
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData()
  }, []);
const handleRemove=async(product)=>{
  try {
    console.log(product)
    const response = await axios.post(`${apiUrl}/api/removeMyProduct`,product);
    console.log(response);
    if(response.data.success){
      fetchData();
    }
  } catch (error) {
    console.log(error);
  }

}

return (
  <div className="helper-container min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
    {/* Add Food Form */}
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-orange-100">
        <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center font-lobster">
          🍴 Share Your Surplus Food
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="form-group">
                <label className="food-label">Food Item Name</label>
                <input
                  type="text"
                  name="item_name"
                  className="food-input"
                  placeholder="e.g., Homemade Lasagna"
                  value={formData.item_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="food-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="food-input"
                  placeholder="Number of servings"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="food-label">Food Image</label>
                <div className="relative border-2 border-dashed border-orange-200 rounded-xl p-4 text-center hover:border-orange-300 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : "Click to upload food photo"}
                    </p>
                  </div>
                </div>
                {preview && (
                  <div className="mt-4">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg shadow-sm border border-orange-100"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="form-group">
                <label className="food-label">Preparation Details</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="date"
                      name="date"
                      className="food-input"
                      value={formData.prepared.date}
                      onChange={handlePreparedChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="time"
                      name="Time"
                      className="food-input"
                      value={formData.prepared.Time}
                      onChange={handlePreparedChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="food-label">Location</label>
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={fetchLocation}
                    className="location-button"
                    disabled={loadingLocation}
                  >
                    {loadingLocation ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Detecting...
                      </span>
                    ) : (
                      '📍 Use Current Location'
                    )}
                  </button>
                  <input
                    type="text"
                    name="location"
                    className="food-input"
                    placeholder="Enter address manually"
                    value={formData.location.place}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full submit-button"
          >
            🍲 Share Food Now
          </button>
        </form>
      </div>

      {/* My Shared Items */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center font-lobster">
          🥘 My Shared Items
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 bg-gray-100">
                <img
                  src={product.img}
                  alt={product.item_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                  {product.quantity} servings
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.item_name}</h3>
                <div className="text-sm text-gray-600 mb-3">
                  <div className="flex items-center mb-1">
                    <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    {product.location?.place?.substring(0, 30) || 'No location'}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    {product.prepared?.date} at {product.prepared?.Time}
                  </div>
                </div>
                <button 
                  onClick={() => handleRemove(product)}
                  className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Remove Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

export default Helper;
