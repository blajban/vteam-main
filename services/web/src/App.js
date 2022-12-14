import React, { useState, useEffect, useTransition } from 'react';
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Mapside } from './pages/MapSide'
import { UserProfile } from './pages/UserProfile'
import { AdminControll } from './pages/AdminControll'
import Navbar  from './components/Navbar'
import authModel from './models/authModel';
import usersModel from './models/usersModel';

function App() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  async function testFunc() {
    if (token) {
      console.log("Token från GitHub", token);
      console.log("Användarid från GitHub", userId);
      // senare ska kontroll av token ske här
      const userInfo = await usersModel.getUser(userId);
      console.log("Användarens uppgifter:")
      console.log(userInfo);
    }
  }

  async function login() {
    const loginResult = await authModel.login();
  
    console.log("Svaret från login");
    console.log(loginResult);
  
    if (loginResult.data.token) {
      setToken(loginResult.data.token);
    }
  
    if (loginResult.data._id) {
      setUserId(loginResult.data._id);
    }
  }

  useEffect(() => {
    (async () => {
      await testFunc();
    })();
  }, [token]);

  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/Map" element={<Mapside/>}></Route>
        <Route path="/Userprofile" element={<UserProfile/>}></Route>
        <Route path="/Admincontroll" element={<AdminControll/>}></Route>
      </Routes>
      {token ?
        <>
          <p>Du är inloggad!</p>
        </>
        :
        <button onClick={() => login()}>Logga in</button>
      }
    </div>
  );
}

export default App;
