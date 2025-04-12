import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useCart } from '../cartContext';
import { useSearch } from '../SearchContext';
import CartDrawer from '../../Pages/CartDrawer';
import Logo from '../../assets/logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (user) {
      navigate(`/acceptor?q=${value}`);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', name: 'Home', icon: '🏠' },
    { path: '/helper', name: 'Share Food', icon: '🍴', auth: true },
    { path: '/acceptor', name: 'Find Food', icon: '🔍', auth: true },
    { path: '/contact', name: 'Contact', icon: '📞',auth:true },
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      {/* Top Section - Logo, Search, Auth */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <Logo className="h-12 w-auto text-orange-600" />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <input
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              {user && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="p-2 text-gray-700 hover:text-orange-600 relative"
                >
                  <ShoppingCart size={24} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </button>
              )}

              {/* Auth */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-orange-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Navigation Links */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center  space-x-6">
            {navLinks.map((link) => (
              (!link.auth || user) && (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 px-3 text-sm font-medium ${
                    location.pathname === link.path
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {link.icon} {link.name}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200">
          {/* Mobile Search */}
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Mobile Navigation Links */}
          {navLinks.map((link) => (
            (!link.auth || user) && (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {link.icon} {link.name}
              </Link>
            )
          ))}
        </div>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
    </nav>
  );
};

export default Navbar;