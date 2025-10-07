import React from 'react'
import Header from '../components/Navbar/Header'
import BooksList from '../components/Navbar/BooksList'
import Banner from '../components/Navbar/Banner'

const Home = () => {
  return (
    <div>
      <Header />
      <BooksList />
      <Banner />
    </div>
  )
}

export default Home
