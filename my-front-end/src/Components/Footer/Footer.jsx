import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
const Footer = () => {
  const [conpage,setconpage]=useState('home');

  console.log(conpage);
  return (
    <div  className='footer absolute bottom-0 w-screen h-24 px-14 py-2 flex items-center gap-3 justify-around'>
      <div className='home p-2 font-serif w-[20%] font-bold text-2xl flex flex-col gap-1 items-center' >
      <Link to='/' className='flex gap-1 items-center' onClick={()=>{setconpage('home')}} >
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
        <h2>Home</h2>
      </Link>
        {conpage==="home"?<div className='h-1 w-36 bg-white rounded-sm '></div>:<></>}
      </div>

      <div className='helper p-2 font-serif w-[20%] font-bold text-2xl flex flex-col gap-1 items-center'>
      <Link to='/helper' className='flex gap-1 items-center'  onClick={()=>{setconpage('helper')}} >
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M204-420q8-10 12-24.5t4-35.5q0-30-20-76t-20-69q0-12 2.5-25t13.5-30h60q-11 17-13.5 30t-2.5 25q0 23 20 69t20 76q0 21-4 34.5T264-420h-60Zm260 0q8-10 12-24.5t4-35.5q0-30-20-76t-20-69q0-12 2.5-25t13.5-30h60q-11 17-13.5 30t-2.5 25q0 23 20 69t20 76q0 21-4 34.5T524-420h-60Zm-130 0q8-10 12-24.5t4-35.5q0-30-20-76t-20-69q0-12 2.5-25t13.5-30h60q-11 17-13.5 30t-2.5 25q0 23 20 69t20 76q0 21-4 34.5T394-420h-60Zm56 340q-101 0-178-67.5T120-315q-3-18 9.5-31.5T160-360h421l44-414q5-45 38.5-75.5T744-880q50 0 85 35t35 85q0 14-2.5 37l-2.5 23-79-10 2-20.5q2-20.5 2-29.5 0-17-11.5-28.5T744-800q-16 0-27 10.5T704-764l-46 435q-11 106-87 177.5T390-80Zm0-80q59 0 106-33t68-87H213q23 54 70.5 87T390-160Zm0-120Z"/></svg>
        <h2>Help</h2>
      </Link >
      {conpage==="helper"?<div className='h-1 w-36 bg-white rounded-sm '></div>:<></>}
      </div>
      <div className='accept p-2 font-serif w-[20%] font-bold text-2xl flex flex-col gap-1 items-center'>
      <Link to='/acceptor' className='flex gap-1 items-center' onClick={()=>{setconpage('acceptor')}}>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M400-160h160v-44l50-20q65-26 110.5-72.5T786-400H174q20 57 65 103.5T350-224l50 20v44Zm-80 80v-70q-107-42-173.5-130T80-480h80v-320l720-80v60l-460 52v68h460v60H420v160h460q0 112-66.5 200T640-150v70H320Zm0-620h40v-62l-40 5v57Zm-100 0h40v-50l-40 4v46Zm100 220h40v-160h-40v160Zm-100 0h40v-160h-40v160Zm260 80Z"/></svg>
        <h2>Accept</h2>
      </Link>
      {conpage==="acceptor"?<div className='h-1 w-36 bg-white rounded-sm '></div>:<></>}
      </div>
      <div className='contact p-2 font-serif w-[20%] font-bold text-2xl flex flex-col gap-1 items-center'>
      <Link to='/contact' className='flex gap-1 items-center'  onClick={()=>{setconpage('contact')}}>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="m480-80-10-120h-10q-142 0-241-99t-99-241q0-142 99-241t241-99q71 0 132.5 26.5t108 73q46.5 46.5 73 108T800-540q0 75-24.5 144t-67 128q-42.5 59-101 107T480-80Zm80-146q71-60 115.5-140.5T720-540q0-109-75.5-184.5T460-800q-109 0-184.5 75.5T200-540q0 109 75.5 184.5T460-280h100v54Zm-101-95q17 0 29-12t12-29q0-17-12-29t-29-12q-17 0-29 12t-12 29q0 17 12 29t29 12Zm-29-127h60q0-30 6-42t38-44q18-18 30-39t12-45q0-51-34.5-76.5T460-720q-44 0-74 24.5T344-636l56 22q5-17 19-33.5t41-16.5q27 0 40.5 15t13.5 33q0 17-10 30.5T480-558q-35 30-42.5 47.5T430-448Zm30-65Z"/></svg>
        <h2>Contact</h2>
      </Link>
      {conpage==="contact"?<div className='h-1 w-36 bg-white rounded-sm '></div>:<></>}
      </div>
    </div>
    
  )
}

export default Footer
