import { current } from '@reduxjs/toolkit'
import React from 'react'
import { useSelector } from 'react-redux'
import {useRef} from 'react'

export default function Profile() {
  // the fileRef is used to reference the file input element to open the file dialog when the user clicks on the profile picture, so that we can hide the input element
  const fileRef = useRef()
  const {currentUser} = useSelector(state => state.user)
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={() => fileRef.current.click()} src={currentUser.avatar} alt="profile"className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username'/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email'/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85 disabled:75'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' >Delete account</span>
        <div><span className='text-red-700 cursor-pointer' >Sign out</span></div></div>
    </div>
  )
}
