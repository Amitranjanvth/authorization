import React, { useContext } from 'react'
import {assets} from '../assets/assets.js'
import { useNavigate } from "react-router-dom";
import { AppContent } from '../context/AppContext.jsx';
import axios from 'axios';
import {toast} from 'react-toastify'


const Navbar = () => {

  const navigate = useNavigate();
  const {userData ,backendUrl, setUserData, setIsloggedIn} = useContext(AppContent)

  const logout = async() => {
    try {
      axios.defaults.withCredentials=true
      const {data} = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsloggedIn(false)
      data.success && setUserData(false)
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const sendVerification = async() => {
    try {
      axios.defaults.withCredentials=true
      const {data} = await axios.post(backendUrl + '/api/auth/sendverifyotp')
      if(data.success){
        navigate('/verify')
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='w-full flex items-center justify-between p-4 sm:p-6 sm:px-16 absolute top-0 '>
      <img src={assets.logo} alt="logo" />
      <div>
      </div>
      {userData ? 
          <div className='rounded-full bg-blue-900 text-white relative group h-8 w-8 flex items-center justify-center'>
        {userData.fullName[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
        <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
          {!userData.isAccountVerified &&  <li onClick={sendVerification} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li> }
           
            <li onClick={logout} className='pr-10 py-1 px-2 hover:bg-gray-200 cursor-pointer'>Logout</li>
        </ul>
    
        </div>
      </div>
      :  <button onClick={()=>navigate('/login')} className='flex items-center gap-2 rounded-full transition duration-300 ease-linear hover:bg-blue-500 hover:text-white px-4 py-2 border cursor-pointer '>Login <img src={assets.arrow_icon} alt="" className='h-4 w-4'/></button>
    }
         
      
    
    </div>
  )
}

export default Navbar
