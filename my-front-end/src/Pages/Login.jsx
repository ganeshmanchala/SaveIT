import React, { useState ,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  let Navigate=useNavigate();
  // State to track the position of the mover
  const [isSignup, setIsSignup] = useState(false);
  const [signupCredentials, setSignupCredentials] = useState({ Name: "", Username: "", Password: "", Phone: "", Email: "" })
  const [loginCredentials, setLoginCredentials] = useState({ Username: "", Password: "" })

  const signupCredentialsHandle = (e) => {
    setSignupCredentials({ ...signupCredentials, [e.target.name]: e.target.value })
  }
  const loginCredentialsHandle=(e)=>{
    setLoginCredentials({...loginCredentials,[e.target.name]:e.target.value})
  }
  const handleSignupClick = () => setIsSignup(true);
  const handleLoginClick = () => setIsSignup(false);

  const signupHandle = async (e) => {
    e.preventDefault();
    const response = await fetch(`${apiUrl}/api/createAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Name: signupCredentials.Name, Username: signupCredentials.Username, Password: signupCredentials.Password, Phone: signupCredentials.Phone, Email: signupCredentials.Email, })

    });

    const json = await response.json();
    if (!json.success) {
      alert(json.errors[0].msg)
    }
    else {
      setSignupCredentials({ Name: "", Username: "", Password: "", Phone: "", Email: "" });
      setIsSignup(false);
    }

  }
  const loginHandle = async(e) => {
    e.preventDefault();

    const response = await fetch(`${apiUrl}/api/loginAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({Username:loginCredentials.Username,Password:loginCredentials.Password})
    });

    
    const json = await response.json();
    console.log(json)
    if (!json.success) {
      alert(json.errors[0].msg)
    }
    else {
      setLoginCredentials({ Username: "", Password: "" });
    }
    if(json.success){
      localStorage.setItem("authToken",json.authToken);
       localStorage.setItem('location',location);
       localStorage.setItem('Username',loginCredentials.Username);
      console.log(localStorage.getItem('Username'));
      Navigate('/');

    }
  }



  const [location,setLocation]=useState('')

  const fetchLocation = async() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const address = response.data.display_name;
         setLocation(address);
      
        } catch (error) {
          alert("Error getting address. Try again.");
          console.error(error);
        }
      },
      (error) => {
        alert("Error getting location: " + error.message);
        
      }
    );
  };

  useEffect(() => {
   fetchLocation();
  }, []);
  
  return (
    <div className="main_login  w-full h-full flex items-center justify-center bg-cover "
    style={{
      backgroundImage:
        'url("https://cdn.deepseek.com/blog/banner-background.webp")',
    }}>
      <div className="login w-[70%] h-auto border-black border-x flex relative">
        {/* Signup Section */}
        <div className="signup h-full w-[50%]">
          <div className="heading border-b-2 border-orange-500 w-full h-16 flex  items-center text-orange-500 font-bold text-2xl justify-center">
            SIGNUP
          </div>
          <form onSubmit={signupHandle} className="form w-full h-full text-center p-7">
            <table className="w-full text-center mb-5">
              <tbody>
              <tr className="w-full">
                <td className="w-[50%] h-14 font-bold">
                  <label htmlFor="name">Name</label>
                </td>
                <td className="w-[50%] h-14">
                  <input
                    className="border-slate-600 w-full border-[1px]"
                    type="text"
                    id="name"
                    name='Name'
                    value={signupCredentials.Name}
                    onChange={signupCredentialsHandle}
                  />
                </td>
              </tr>
              <tr className="w-full">
                <td className="w-[50%] h-14 font-bold">
                  <label htmlFor="phone">Phone no.</label>
                </td>
                <td className="w-[50%] h-14">
                  <input
                    className="border-slate-600 w-full border-[1px]"
                    type="text"
                    id="phone"
                    name='Phone'
                    value={signupCredentials.Phone}
                    onChange={signupCredentialsHandle}
                  />
                </td>
              </tr>
              <tr className="w-full">
                <td className="w-[50%] h-14 font-bold">
                  <label htmlFor="email">Email</label>
                </td>
                <td className="w-[50%] h-14">
                  <input
                    className="border-slate-600 w-full border-[1px]"
                    type="text"
                    id="email"
                    name='Email'
                    value={signupCredentials.Email}
                    onChange={signupCredentialsHandle}
                  />
                </td>
              </tr>
              <tr className="w-full">
                <td className="w-[50%] h-14 font-bold">
                  <label htmlFor="signup-username">Username</label>
                </td>
                <td className="w-[50%] h-14">
                  <input
                    className="border-slate-600 w-full border-[1px]"
                    type="text"
                    id="signup-username"
                    name='Username'
                    value={signupCredentials.Username}
                    onChange={signupCredentialsHandle}
                  />
                </td>
              </tr>
              <tr className="w-full">
                <td className="w-[50%] h-14 font-bold">
                  <label htmlFor="signup-password">Password</label>
                </td>
                <td className="w-[50%] h-14">
                  <input
                    className="border-slate-600 w-full border-[1px]"
                    type="text"
                    id="signup-password"
                    name='Password'
                    value={signupCredentials.Password}
                    onChange={signupCredentialsHandle}
                  />
                </td>
              </tr>
              </tbody>
            </table>
            <input
              className="bg-orange-500 px-9 py-3 rounded-full text-white font-bold cursor-pointer font-mono"
              type="submit"
              value="SIGNUP"
            />
          </form>
        </div>

        {/* Login Section */}
        <div className="signin w-[50%] h-full">
          <div className="heading border-b-2 border-orange-500 w-full h-16 flex mb-3 items-center text-orange-500 font-bold text-2xl justify-center">
            LOGIN
          </div>
          <form onSubmit={loginHandle} className="form w-full h-full text-center py-11 pl-4 pr-8">
            <table className="w-full text-center mb-7">
              <tbody>
              <tr className="w-full">
                <td className="w-[50%] h-24 font-bold">
                  <label htmlFor="username">Username</label>
                </td>
                <td className="w-[50%] h-24">
                  <input
                    className="border-slate-600 w-full border-[1px]"
                    type="text"
                    id="username"
                    name='Username'
                    value={loginCredentials.Username}
                    onChange={loginCredentialsHandle}
                  />
                </td>
              </tr>
              <tr className="w-full">
                <td className="w-[50%] h-16 font-bold">
                  <label htmlFor="password">Password</label>
                </td>
                <td className="w-[50%] h-16">
                  <input
                    className="border-slate-600 w-full border-[1px]"
                    type="password"
                    id="password"
                    name='Password'
                    value={loginCredentials.Password}
                    onChange={loginCredentialsHandle}
                  />
                </td>
              </tr>
              </tbody>
            </table>
            <div className="flex gap-1 mx-9 pb-10">
              <p>Don't have an account? Please</p>
              <div onClick={handleSignupClick} className="text-orange-500 cursor-pointer">signup!</div>
            </div>
            <input
              className="bg-orange-500 px-9 py-3 rounded-full cursor-pointer text-white font-bold font-mono"
              type="submit"
              value="Login"
            />
          </form>
        </div>

        {/* Mover Div */}
        <div
          className={`mover absolute top-0 bottom-0 ${!isSignup ? 'left-0' : 'left-[50%]'
            } w-[50%] h-100% bg-white border-black border-x-2 transition-all duration-500`}
        >
          <div className="w-full h-full bg-gradient-to-t from-transparent via-[#ecdcff] to-transparent flex justify-center items-center">
            <div className="flex flex-col w-[50%] h-[50%] justify-around items-center">
              <button
                onClick={handleSignupClick}
                className="bg-orange-500 rounded-full w-40 py-3 font-bold"
              >
                SIGNUP
              </button>
              <button
                onClick={handleLoginClick}
                className="bg-orange-500 rounded-full w-40 py-3 font-bold"
              >
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
