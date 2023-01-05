import React, { useState, useEffect } from 'react';
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
  const [code, setCode] = useState("");

  function login() {
    window.location.href = 'http://localhost:3500/login';
  }

  function logout() {
    window.location.reload();
  }

  async function testFunc() {
    const userInfo = await usersModel.getUser(userId, token);
    console.log("Userid:", userInfo._id);
    console.log("Name:", userInfo.name);
    console.log("Mail:", userInfo.mail);
    console.log("Mobile:", userInfo.mobile);
    console.log("Zip:", userInfo.zip);
    console.log("Address:", userInfo.address);
    console.log("City:", userInfo.city);
    console.log("Admin:", userInfo.admin);
    console.log("Balance:", userInfo.balance);
  }

  useEffect(() => {
    (async () => {
      if (!code) {
        const urlQuery = window.location.search;
        const urlParams = new URLSearchParams(urlQuery);
        if (urlParams.has('code')) {
          setCode(urlParams.get('code'));
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (code) {
        setToken(await authModel.getToken(code));
      }
    })();
  }, [code]);

  useEffect(() => {
    (async () => {
      if (token && !userId) {
        setUserId(await authModel.getGitHubUser(token));
      }
    })();
  }, [token]);

  useEffect(() => {
    (async () => {
      if (userId) {
        await testFunc();
      }
    })();
  }, [userId]);

  return (
    /** <Route path="/Userprofile" element={<UserProfile token={token} userId={userId} />}></Route>*/
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
          <p>You are logged in</p>
          <button onClick={logout}>Logout</button>
        </>
        :
        <>
          <button onClick={login}>Login</button>
        </>
      }
    </div>
  );
}

export default App;
