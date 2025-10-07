import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { PublisherContext } from '../context/PublisherContext'
import { assets } from '../assets/assets'

const Sidebar = () => {

  const { aToken } = useContext(PublisherContext)

  return (
    <div className='min-h-screen bg-white border-r border-gray-600'>
      {
        aToken && <ul className='text-[#515151] mt-5'>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F2F2] border-r-4 border-black' : ''}`} to={'/publisher-dashboard'}>
            <img src={assets.home_icon} alt="" />
            <p>Dashboard</p>
          </NavLink>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F2F2] border-r-4 border-black' : ''}`} to={'/add-book'}>
            <img src={assets.add_icon} alt="" />
            <p>Add Book</p>
          </NavLink>
          <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F2F2] border-r-4 border-black' : ''}`} to={'/my-bookslist'}>
            <img src={assets.people_icon} alt="" />
            <p>My Books</p>
          </NavLink>
          <NavLink
            to="/publisher/review-insights"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F2F2] border-r-4 border-black' : ''
              }`
            }
          >
            <img src={assets.people_icon} alt="" />
            <p>Rating Insights</p>
          </NavLink>
        </ul>
      }
    </div>
  )
}

export default Sidebar
