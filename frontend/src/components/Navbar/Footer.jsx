import React from 'react'
import logoBlack from '../../assets/LogoBlack.png';

const Footer = () => {
  return (
    <div className='md:mx-8'>
      <div className='flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-14 my-10 mt-10 text-sm'>
        {/*------------ Left Section --------- */}
        <div>
            <img className='mb-5 w-60' src={logoBlack} alt="" />
            <p className='w-full md:w-3/3 text-gray-700 leading-6 text-base '>Explore the shelves of BookReview — a curated collection of titles across genres, each waiting to be discovered, rated, and reviewed. Browse through paginated listings of top reads, from timeless classics to trending releases, and find your next favorite book</p>
        </div>

        {/*------------ Center Section --------- */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='text-base flex flex-col gap-2 text-gray-700'>
                <li>Home</li>
                <li>Top Rated Books</li>
                <li>About Us</li>
                <li>Seller Dashboard</li>
            </ul>
        </div>

        {/*------------ Right Section --------- */}
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>            
            <ul className='text-base flex flex-col gap-2 text-zinc-600'>
                <li>+1 938-4448--33</li>        
                <li>support@email.com</li>
            </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright ©{new Date().getFullYear()} BookReview - All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Footer
