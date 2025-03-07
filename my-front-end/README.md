# React + Vite

# SaveIT – Food Donation Platform

SaveIT is a full-stack web application designed for food donation and e-commerce. It enables users to browse and donate food items, manage a shopping cart, and get directions from their current location to a product’s location via an integrated map. The project includes user authentication, a dynamic search bar, and a responsive UI built with React, Vite, and Tailwind CSS.

## Features

- **User Authentication:**  
  - Secure signup and login functionality.  
  - JWT-based token storage to persist sessions across pages.
  
- **Product Browsing & Donation:**  
  - Users can view a list of food donation items/products with details like name, quantity, image, and location.
  - Search functionality integrated into the navbar to filter products dynamically.
  
- **Cart Management:**  
  - Global cart state is managed using React Context.  
  - Users can add items to the cart, remove items, and view a floating cart drawer.
  - A badge on the cart icon displays the number of items.
  
- **Map Integration for Route Navigation:**  
  - When a user clicks the "Reach" button in the cart drawer, a map opens alongside the cart.
  - The map shows the route from the user’s current location (using the Geolocation API) to the selected product’s location.
  - The product’s address (stored as a string) is converted to coordinates using OpenStreetMap’s Nominatim API.
  
- **Responsive Design:**  
  - Styled with Tailwind CSS for a clean, modern, and responsive UI.

## Technologies Used

- **Frontend:**  
  - React, Vite  
  - React Router DOM, React Context API  
  - Tailwind CSS  
  - Lucide Icons  
  - React-Leaflet for map integration
  
- **Backend:**  
  - Node.js, Express  
  - MongoDB (Atlas for production, with Mongoose ODM)

## Getting Started

### Prerequisites

- **Node.js:** v14 or later  
- **npm or yarn**  
- **MongoDB Atlas account** (or a local MongoDB instance for development)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
