import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ item }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [itemLocation, setItemLocation] = useState(null);
  const [route, setRoute] = useState([]);

  // Get User's Current Location
  console.log(item.location);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error fetching location:", error)
    );
  }, []);

  // Convert item address to latitude & longitude
  useEffect(() => {
    if (item?.location) {
      getCoordinates(item.location).then((coords) => {
        if (coords) setItemLocation(coords);
      });
    }
  }, [item]);
  console.log("Item: ",item.location);
  // Fetch Route when both locations are available
  useEffect(() => {
    if (userLocation && itemLocation) {
      fetchRoute(userLocation, itemLocation);
    }
  }, [userLocation, itemLocation]);

  // Function to convert address to coordinates
  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
  
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      } else {
        console.error("Address not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Function to fetch route
  const fetchRoute = async (start, end) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length > 0) {
        setRoute(data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng })));
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };
 console.log("this is item location ",itemLocation);
  return (
    <div className="h-full w-full">
      <MapContainer center={userLocation || { lat: 17.385, lng: 78.4867 }} zoom={13} style={{ height: "100%", width: "100%", zIndex: 0 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <Marker position={userLocation}>
            <Popup> You are here </Popup>
          </Marker>
        )}

        {itemLocation && (
          <Marker position={itemLocation}>
            <Popup> Item Location: {item?.address} </Popup>
          </Marker>
        )}

        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
