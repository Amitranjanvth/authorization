import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from '../src/pages/Home'
import ResetPass from './pages/ResetPass'
import VerifyEmail from './pages/VerifyEmail'
import Login from './pages/Login'
 import { ToastContainer} from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element = {<Home/>} />
         <Route path='/login' element = {<Login/>} />
          <Route path='/verify' element = {<VerifyEmail/>} />
           <Route path='/reset' element = {<ResetPass/>} />
      </Routes>
    </div>
  )
}

export default App
