import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Myprofile = () => {

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {
    try {

      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('bio', userData.bio)

      image && formData.append('image', image)

      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }
  }

  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {
        isEdit
          ? <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
              <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
          </label>
          : <img className='w-36 rounded' src={userData.image} alt="" />
      }

      {
        isEdit
          ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
          : <p className='font-medium text-3xl text-neutral-800 mt-4'>Full Name: {userData.name}</p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium text-base'>Email Address:</p>
          <p className='text-blue-900 text-base'>{userData.email}</p>
          <p className='font-medium text-base'>Short Bio:</p>
          {
            isEdit
              ? <input className='bg-zinc-200 max-w-52' rows={4} type="text" value={userData.bio} onChange={e => setUserData(prev => ({ ...prev, bio: e.target.value }))} />
              : <p className='text-blue-900 text-base'>{userData.bio}</p>
          }
        </div>
      </div>
      <div className='mt-10'>
        {
          isEdit
            ? <button className='border border-black shadow-lg px-8 py-2 rounded-full hover:bg-black hover:text-white transition-all' onClick={updateUserProfileData}>Save Information</button>
            : <button className='border border-black shadow-lg px-8 py-2 rounded-full hover:bg-black hover:text-white transition-all' onClick={() => setIsEdit(true)}>Edit Info</button>
        }
      </div>
    </div>
  )
}

export default Myprofile
