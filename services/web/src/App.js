import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Mapside } from './pages/MapSide'
import { UserProfile } from './pages/UserProfile'
import { AdminControll } from './pages/AdminControll'
import Navbar  from './components/Navbar'

function App() {


  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/Map" element={<Mapside/>}></Route>
        <Route path="/Userprofile" element={<UserProfile/>}></Route>
        <Route path="/Admincontroll" element={<AdminControll/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
