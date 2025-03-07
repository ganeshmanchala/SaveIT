import React, { useState } from 'react'
import './Navbar.css'
import { ShoppingCart } from "lucide-react";
import Logo from '../../assets/logo';
// import logopic from 'C:\\Users\\ganesh\\OneDrive\\Desktop\\FSD\\E-Commerce\\my-front-end\\src\\assets\\logo.jsx';
import {useLocation, Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../SearchContext';
import { useCart } from '../cartContext';
import CartDrawer from '../../Pages/CartDrawer';

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('location');
    navigate('/login');
  }


  const handleSearch = (event) => {
    event.preventDefault();  // Fixed `e.preventDefault()` to `event.preventDefault()`
    if (localStorage.getItem('authToken')) {
      setSearchQuery(event.target.value);
      navigate(`/acceptor?q=${event.target.value}`); // Pass search query to URL
      setconpage('acceptor');
    }
    else {
      navigate('/login')
    }
  };

  // const [conpage, setconpage] = useState('');
  // console.log(conpage);
  const conpage = useLocation();
  console.log(conpage.pathname);
  const { cart } = useCart();

  return (
    <div className='navbar-main mb-6 w-screen h-32'>
      <div className='navbar w-full h-24  px-14 py-3 flex items-center gap-3'>
        <div className='logo w-[15%] h-[80%]'>
          {/* <img src={logopic} alt="Logo" className='w-full h-full' /> */}
          <Logo/>
        </div>
        <div className='h-full w-full flex items-center'>
          <div className='location w-[30%] h-full overflow-hidden  font-sans px-9'>
            <h2 className='text-2xl font-bold'>Delivery in</h2>
            <h2 className='overflow-hidden'>{(localStorage.getItem('location'))?localStorage.getItem('location').toString():""}</h2>
          </div>
          <nav className='SearchBar h-[75%] bg-white w-[55%] rounded-md flex items-center px-2 gap-3' >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
            <input className='w-full h-full outline-none' type="text" name="search" value={searchQuery} placeholder='Search for food here ..' onChange={handleSearch} />
          </nav>
          <div className='side_login&cart w-[15%] h-full flex p-2 gap-2' >



            {(!(localStorage.getItem('authToken'))) ? <Link className='login w-full h-full flex flex-col justify-center items-center' to='/login'>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" /></svg>
              <p>Login</p>
            </Link>
              : <div className='login w-full h-full flex flex-col justify-center cursor-pointer items-center' onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" /></svg>
                <p className='text-red-600'>Logout</p>
              </div>}


            {((localStorage.getItem('authToken'))) ?  <div className="relative cursor-pointer flex-col justify-center items-center" onClick={() => setCartOpen(true)}>
          <ShoppingCart size={24} />
          Cart
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          )}
        </div> : ""}
          </div>
        </div>
      </div>

      {(localStorage.getItem('authToken')) ?
        <div className='down flex px-4'>
          <div className=' w-28  h-7 '>
            <div className='home w-fit h-fit font-serif flex flex-col  items-center' >
              <Link to='/' className='flex gap-1 items-center' >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg>
                <h2>Home</h2>
              </Link>
              {conpage.pathname === "/" ? <hr className='h-1 w-full bg-gray-500 rounded-sm ' /> : <></>}
            </div>
          </div>

          <div className='w-28  h-7'>
            <div className='helper  w-fit font-serif h-fit flex flex-col  items-center'>
              <Link to='/helper' className='flex gap-1 px-1 items-center'  >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M204-420q8-10 12-24.5t4-35.5q0-30-20-76t-20-69q0-12 2.5-25t13.5-30h60q-11 17-13.5 30t-2.5 25q0 23 20 69t20 76q0 21-4 34.5T264-420h-60Zm260 0q8-10 12-24.5t4-35.5q0-30-20-76t-20-69q0-12 2.5-25t13.5-30h60q-11 17-13.5 30t-2.5 25q0 23 20 69t20 76q0 21-4 34.5T524-420h-60Zm-130 0q8-10 12-24.5t4-35.5q0-30-20-76t-20-69q0-12 2.5-25t13.5-30h60q-11 17-13.5 30t-2.5 25q0 23 20 69t20 76q0 21-4 34.5T394-420h-60Zm56 340q-101 0-178-67.5T120-315q-3-18 9.5-31.5T160-360h421l44-414q5-45 38.5-75.5T744-880q50 0 85 35t35 85q0 14-2.5 37l-2.5 23-79-10 2-20.5q2-20.5 2-29.5 0-17-11.5-28.5T744-800q-16 0-27 10.5T704-764l-46 435q-11 106-87 177.5T390-80Zm0-80q59 0 106-33t68-87H213q23 54 70.5 87T390-160Zm0-120Z" /></svg>
                <h2>Help</h2>
              </Link >
              {conpage.pathname === "/helper" ? <hr className='h-1 w-full bg-gray-600 rounded-sm ' /> : <></>}
            </div>
          </div>


          <div className='w-28  h-7'>
            <div className='accept w-fit    font-serif h-fit flex flex-col  items-center'>
              <Link to='/acceptor' className='flex gap-1 items-center' >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M400-160h160v-44l50-20q65-26 110.5-72.5T786-400H174q20 57 65 103.5T350-224l50 20v44Zm-80 80v-70q-107-42-173.5-130T80-480h80v-320l720-80v60l-460 52v68h460v60H420v160h460q0 112-66.5 200T640-150v70H320Zm0-620h40v-62l-40 5v57Zm-100 0h40v-50l-40 4v46Zm100 220h40v-160h-40v160Zm-100 0h40v-160h-40v160Zm260 80Z" /></svg>
                <h2>Accept</h2>
              </Link>
              {conpage.pathname === "/acceptor" ? <hr className='h-1 w-full bg-gray-700 rounded-sm ' /> : <></>}
            </div>
          </div>


          <div className='w-28  h-7'>
            <div className='contact w-fit    font-serif h-fit flex flex-col  items-center'>
              <Link to='/contact' className='flex gap-1 items-center' >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="m480-80-10-120h-10q-142 0-241-99t-99-241q0-142 99-241t241-99q71 0 132.5 26.5t108 73q46.5 46.5 73 108T800-540q0 75-24.5 144t-67 128q-42.5 59-101 107T480-80Zm80-146q71-60 115.5-140.5T720-540q0-109-75.5-184.5T460-800q-109 0-184.5 75.5T200-540q0 109 75.5 184.5T460-280h100v54Zm-101-95q17 0 29-12t12-29q0-17-12-29t-29-12q-17 0-29 12t-12 29q0 17 12 29t29 12Zm-29-127h60q0-30 6-42t38-44q18-18 30-39t12-45q0-51-34.5-76.5T460-720q-44 0-74 24.5T344-636l56 22q5-17 19-33.5t41-16.5q27 0 40.5 15t13.5 33q0 17-10 30.5T480-558q-35 30-42.5 47.5T430-448Zm30-65Z" /></svg>
                <h2>Contact</h2>
              </Link>
              {conpage.pathname === "/contact" ? <hr className='h-1 w-full bg-gray-800 rounded-sm ' /> : <></>}
            </div>
          </div>
        </div> : <div className='down flex px-4'>
          <div className=' w-28  h-7 '>
            <div className='home w-fit h-fit font-serif flex flex-col  items-center' >
              <Link to='/' className='flex gap-1 items-center'  >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg>
                <h2>Home</h2>
              </Link>
              {conpage.pathname === "/" ? <hr className='h-1 w-full bg-gray-500 rounded-sm ' /> : <></>}
            </div>
          </div>
        </div>
      }
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
    </div>
  )
}

export default Navbar
