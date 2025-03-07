import React, { useState,useEffect } from "react";
import axios from "axios";
import "./Helper.css"; // Import custom CSS
const apiUrl = import.meta.env.VITE_API_URL;

const Helper = () => {
  const [formData, setFormData] = useState({
    username: localStorage.getItem('Username'),
    item_name: "",
    quantity: "",
    img: "",
    prepared: { date: "", Time: "" },
    location: "",
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
            setFormData({ ...formData, location: address });
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

    if (!formData.location) {
      alert("Please provide a location.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/addProduct`, formData);
      if (response.data.success) {
        alert("Product added successfully!");
        setFormData({
          username: localStorage.getItem('Username'),
          item_name: "",
          quantity: "",
          img: "",
          prepared: { date: "", Time: "" },
          location: "",
        });
        fetchData();
        setLocationConfirmed(false);
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };


  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/displayMyProducts`,{username:localStorage.getItem('Username')});
      console.log(response.data); // Check the fetched data structure
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
    <div className="helper bg-cover"
    style={{
      backgroundImage:
        'url("https://cdn.deepseek.com/blog/banner-background.webp")',
    }}>
      <div className="container-div w-full h-fit bg-cover"
      style={{
        backgroundImage:
          'url("https://cdn.deepseek.com/blog/banner-background.webp")',
      }}>
    <div className="container shadow-lg"
    style={{
      backgroundImage:
        'url("https://img.freepik.com/free-vector/blue-curve-background_53876-113112.jpg?semt=ais_hybrid")',
    }}>
      <h2 className="title">Add a Product</h2>
      <form onSubmit={handleSubmit} className="form">
      
        <div className="form-group">
          <label>Item Name:</label>
          <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input type="text" name="img" value={formData.img} onChange={handleChange} required />
        </div>

        <div className="form-group row">
          <div className="column">
            <label>Date:</label>
            <input type="date" name="date" value={formData.prepared.date} onChange={handlePreparedChange} required />
          </div>
          <div className="column">
            <label>Time:</label>
            <input type="time" name="Time" value={formData.prepared.Time} onChange={handlePreparedChange} required />
          </div>
        </div>

        <button type="button" onClick={fetchLocation} className="btn btn-primary" disabled={loadingLocation}>
          {loadingLocation ? "Fetching location..." : "Use Current Location"}
        </button>

      
          <div className="form-group">
            <label>Enter Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
       
        <button type="submit" className="btn btn-success">Submit</button>
      </form>
    </div>
       
    </div>
    <hr />



    <div  className="Yours-given">
      <h1 className="font-bold text-orange-500 text-3xl font-serif p-6">MY ITEMS FOR ALL :</h1>
    <div className="grid h-full w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
      {products.map((product) => (
        <div key={product._id} className="relative rounded-xl bg-white shadow-lg group p-4 w-full bg-cover"
        style={{
          backgroundImage:
            'url("https://png.pngtree.com/thumb_back/fh260/background/20200710/pngtree-geometric-line-background-with-gradient-grey-image_351504.jpg")',
        }}>
          <div className="relative rounded-xl bg-gray-200 overflow-hidden border border-gray-300 h-64">
            <img
              src={product.img}
              alt={product.item_name}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
          <div className="p-3 text-center">
            <h5 className="font-semibold text-lg">{product.item_name}</h5>
            <span className="text-gray-600 text-sm">Quantity: {product.quantity}</span>
          </div>
          <div className="p-3 flex flex-col items-center">
          <span className="text-gray-500 text-sm">
  Prepared: {product.prepared?.date || "N/A"} at {product.prepared?.Time || "N/A"}
</span>
            <button className="mt-3 border border-gray-500 text-gray-700 bg-white px-6 py-2 rounded-lg text-base font-bold hover:bg-gray-100" onClick={()=>handleRemove(product)}>
              Remove 
            </button>
          </div>
        </div>
      ))}
    </div>
    </div>
    </div>
  );
};

export default Helper;
