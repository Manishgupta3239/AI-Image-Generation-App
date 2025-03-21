import React from 'react';
 import {BrowserRouter , Link ,Route,Routes } from 'react-router-dom';
 import  Home  from './pages/Home.jsx'
 import  CreatePost  from './pages/CreatePost.jsx'
 import logo from '../src/assets/logo.svg'

function App() {

  return (
    <>
   <BrowserRouter>
    <header className='w-full flex justify-between items-center bg-white px-5 py-3'>
    <Link to='/'>
      <img src={logo} alt='logo'
      className='w-28 object-contain'/>
    </Link>

    <Link to='/create-post' className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
      Create
    </Link>
    </header>
    <main className='sm:p-8 px-4 py-8 w-full bg-[#f9fafa] min-h-[calc(100vh-73px)]'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/create-post' element={<CreatePost/>}/>
      </Routes>
    </main>
    </BrowserRouter>
    </>
  )
  
}

export default App
