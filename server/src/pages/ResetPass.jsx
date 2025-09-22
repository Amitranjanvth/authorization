import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const ResetPass = () => {
  const navigate = useNavigate()

  const {backendUrl} = useContext(AppContent)
  axios.defaults.withCredentials=true

  const [email, setEmail] = useState('')
  const [newpassword, setNewpassword] = useState(0)
  const [isEmailsent, setIsEmailsent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isotpSubmitted, setIsotpSubmitted] = useState(false)

  
    const inputRefs = React.useRef([])
  
    const handleInput = (e,index) => {
      if (e.target.value.length > 0 && index < inputRefs.current.length -1 ) {
        inputRefs.current[index + 1].focus();
      }
    }
  
    const handleKeyDown = (e,index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index>0 ) {
        inputRefs.current[index - 1].focus();
      }
    }
    
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char,index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    })
  }

const onSubmitEmail = async(e) => {
  e.preventDefault();
  try {
    const {data} = await axios.post(backendUrl + '/api/auth/resetotp', {email})
    data.success ? toast.success(data.success) : toast.error(data.message)
    data.success && setIsEmailsent(true)
  } catch (error) {
    toast.error(error.message)
  }
}
  

const onSubmitotp = async(e) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsotpSubmitted(true)
}

const onSubmitNewPassword = async(e) => {
  e.preventDefault();
  try {
    const {data} = await axios.post(backendUrl + '/api/auth/resetpassword', {
       otp : otp,
       email : email,
       password : newpassword
      })
      data.success ? toast.success(data.message) : toast.error(data.error)
      navigate('/login')
  } catch (error) {
    toast.error(error.message)
  }
}

  return (
   <div className='bg-gradient-to-br from-blue-300 to-purple-400 min-h-screen min-w-full flex justify-center items-center'>
         <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-25 sm:w-32 cursor-pointer' />
        {/* otp sent form */}

        {!isEmailsent && 
          <form onSubmit={onSubmitEmail}  className='bg-slate-900 rounded-lg p-8 w-96 text-sm shadow-lg'>
               <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
               <p className='text-center text-indigo-300 text-xl'>Enter Your registered Email address</p>

               <div className='mt-4 mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.mail_icon} alt="mail" className='w-3 h-3' />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='enter email id' className='bg-transparent outline-none text-white' />
               </div>

                 <button  className='w-full bg-gradient-to-br from-red-300 to-blue-400 py-3 text-white rounded-full'>Submit</button>
          </form>
        }

    {/* otp input form */}

       {!isotpSubmitted && isEmailsent && 
       <form onSubmit={onSubmitotp} className='bg-slate-900 rounded-lg p-8 w-96 text-sm shadow-lg'>
               <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Otp</h1>
               <p className='text-center text-indigo-300 text-xl'>Enter the six digit code sent to your email</p>
              
              <div className='flex justify-between mb-8' onPaste={handlePaste}>
                {Array(6).fill(0).map((_, index) =>(
                  <input  type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' 
                  ref={e => inputRefs.current[index] = e}
                  onInput={(e)=>handleInput(e,index)}
                  onKeyDown={(e) => handleKeyDown(e,index)}
                  />
                ))}
              </div>
                <button  className='w-full bg-gradient-to-br from-red-300 to-blue-400 py-3 text-white rounded-full'>Submit</button>
        </form>
       }

          {isotpSubmitted && isEmailsent &&
          <form onSubmit={onSubmitNewPassword} className='bg-slate-900 rounded-lg p-8 w-96 text-sm shadow-lg'>
               <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
               <p className='text-center text-indigo-300 text-xl'>Enter Your new Password</p>

               <div className='mt-4 mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.lock_icon} alt="mail" className='w-3 h-3' />
                <input type="password" value={newpassword} onChange={(e) => setNewpassword(e.target.value)} required placeholder='enter new password' className='bg-transparent outline-none text-white' />
               </div>

                 <button type='submit'  className='w-full bg-gradient-to-br from-red-300 to-blue-400 py-3 text-white rounded-full'>Submit</button>
          </form>
          }
    </div>
  )
}

export default ResetPass
