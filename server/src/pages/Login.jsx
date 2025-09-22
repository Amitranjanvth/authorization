import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets.js'
import { useNavigate } from "react-router-dom";

import axios from 'axios'
import {toast} from 'react-toastify'
import { AppContent } from '../context/AppContext.jsx';



const Login = () => {
  const navigate = useNavigate();
  const {backendUrl,setIsloggedIn, getUserData} = useContext(AppContent)

   const [state, setState] = useState('Sign up');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');
   const [fullName, setFullName] = useState('');
const handleSubmit = async (e) => {
  try {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if (state === 'Sign up') {
      const { data } = await axios.post(backendUrl + '/api/auth/register', 
        {
          fullName, 
          email, 
          password, 
          username
      })

      if (data.success) {
        setIsloggedIn(true);
        getUserData()
        navigate('/');
     
      } else {
        toast.error(data.message);
      }

    } else {
      const { data } = await axios.post(backendUrl + '/api/auth/login', 
        {
           email, 
           password
      });

      if (data.success) {
        setIsloggedIn(true);
        getUserData()
        navigate('/');
        
      } else {
        toast.error("nhi chala");
      }
    }
  } catch (error) {
     console.error("API Error:", error);
      
      if (error.response) {
        // Server responded with error status
        toast.error(error.response.data.message || "Operation failed");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Check your connection.");
      } else {
        // Other errors
        toast.error("An error occurred: " + error.message);
      }
    }console.error(error); // debugging ke liye
    toast.error("nhi chala bhai");
  
};


  return (
    <div className='bg-gradient-to-br from-blue-300 to-purple-400 min-h-screen min-w-full flex justify-center items-center'>
    <div className='border px-6 py-4 rounded-2xl flex items-center justify-center flex-col gap-2 bg-[#141824]'>
       <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-25 sm:w-32 cursor-pointer' />
     <h2 className='text-3xl text-gray-200 font-semibold'>{state === 'Sign up' ? 'Create Account' : 'Login'}</h2>
     <p className='text-sm text-gray-300'>{state === 'Sign up' ? 'Create Your Account' : 'Login Your Account'}</p>

      <form onSubmit={handleSubmit}>
        {state === 'Sign up' && ( <div className='mb-3.5 flex items-center gap-5 w-full px-5 py-2.5 rounded-full bg-[#6974ad]'> 
        <img src={assets.person_icon} alt="" className='h-5 w-5 '/>
        <input onChange={e =>setFullName(e.target.value)} value={fullName} type="text" placeholder='Fullname' className=' bg-transparent outline-none' />
        </div>
        
      )}
       <div className='mb-3.5 flex items-center gap-5 w-full px-5 py-2.5 rounded-full bg-[#6974ad]'> 
        <img src={assets.mail_icon} alt="" className='h-5 w-5 '/>
        <input onChange={e =>setUsername(e.target.value)} value={username} type="text" placeholder='username' className=' bg-transparent outline-none' />
        </div>

        <div className='mb-3.5 flex items-center gap-5 w-full px-5 py-2.5 rounded-full bg-[#6974ad]'> 
        <img src={assets.mail_icon} alt="" className='h-5 w-5 '/>
        <input onChange={e =>setEmail(e.target.value)} value={email} type="text" placeholder='email' className=' bg-transparent outline-none' />
        </div>

        <div className='mb-3.5 flex items-center gap-5 w-full px-5 py-2.5 rounded-full bg-[#6974ad]'> 
        <img src={assets.lock_icon} alt="" className='h-5 w-5 '/>
        <input onChange={e =>setPassword(e.target.value)} value={password} type="text" placeholder='Password' className=' bg-transparent outline-none' />
        </div>
        <p onClick={() => navigate('/reset')} className='text-blue-600 mb-2 cursor-pointer'>Forgot password ?</p>
        <button type='submit' className='text-white font-bold w-full px-4 py-2 bg-gradient-to-br from-blue-400 to-pink-300 rounded-full cursor-pointer'>{state}</button>
    </form>
    {state === 'Sign up' ? ( <p className='text-gray-200'>Already have an Account?<span onClick={() => setState('Login')} className='text-blue-500 cursor-pointer ml-2'>Login here</span> </p>) : 
    ( <p className='text-gray-200'>Don't have an Account? { } <span onClick={() => setState('Sign up')} className='text-blue-500 cursor-pointer ml-2'>Signup here</span> </p>)}
   

    </div>
    </div>
  )
}

export default Login
