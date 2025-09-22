import { useContext } from 'react'
import {assets} from '../assets/assets.js'
import { AppContent } from '../context/AppContext.jsx'

//hellooo
const Header = () => {

 const {userData} = useContext(AppContent)
  

  return (
    <div className='flex justify-center items-center flex-col min-h-screen bg-gray-100'>
      <img src={assets.header_img} alt="" className='w-40 aspect-square bg-transparent rounded-full'/>
      <h1 className='text-3xl font-semibold mt-2'>Hey {userData ? userData.fullName :'Developer'}! </h1>
            <h1 className='text-3xl font-semibold mt-2'>Welcome to Our Auth App</h1>
      <p className='text-center mt-3'>Let's start with a quick product tour and we will have you up and <br /> running and running in no time</p>
      <button className='rounded-full px-6 py-2 border outline-none mt-5 transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white'>
        Get Started
      </button>
    </div>
  )
}

export default Header
