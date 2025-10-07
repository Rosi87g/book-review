import React from 'react'
import { assets } from '../../assets/assets'

const Banner = () => {
  return (
    <div className='flex bg-zinc-600 rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
      {/* -------- Left Side --------- */}
      <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
        <div className='text-xl italic sm:text-xl md:text-xl lg:text-2xl font-semibold'>
            <p className='text-white font-small'>"Want to publish your book on BookVerse?"</p>            
            <p className='mt-2 text-white font-light'>(#Use your Publisher ID to access publishing tools)</p>
            <p className='mt-3 text-lg text-white font-medium'>Login to Seller Dashboard to add your books!</p>
            <button onClick={() => window.open('http://localhost:5180', '_blank')} className='bg-white text-sm sm:text-base text-black px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'>Create Account / Login</button>
        </div>
      </div>

      {/* ------- Right Side ---------- */}
      <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
        <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.banner} alt="" />
      </div>
    </div>
  )
}

export default Banner
