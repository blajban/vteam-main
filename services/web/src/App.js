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
  const [admin, setAdmin] = useState(false);

  function login() {
    window.location.href = 'http://localhost:3500/login';
  }

  function logout() {
    window.location.reload();
  }

  async function checkAdmin() {
    const userInfo = await usersModel.getUser(token, userId, userId);
    setAdmin(userInfo.admin);
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
        await checkAdmin();
      }
    })();
  }, [userId]);

  return (
    <div className="App">
      {token && userId && admin ?
        <>
          <Navbar admin={admin}></Navbar>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/Map" element={<Mapside token={token} userId={userId} />}></Route>
            <Route path="/Admincontroll" element={<AdminControll token={token} userId={userId} admin={admin} />}></Route>
            <Route path="/Userprofile" element={<UserProfile token={token} userId={userId} />}></Route>
          </Routes>
          <button onClick={logout}>Logout</button>
        </>
        :
        <>
        {token && userId ?
          <>
            <Navbar admin={admin}></Navbar>
            <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path="/Map" element={<Mapside token={token} userId={userId} />}></Route>
              <Route path="/Userprofile" element={<UserProfile token={token} userId={userId} />}></Route>
            </Routes>
            <button onClick={logout}>Logout</button>
          </>
          :
          <>
            <p>Svenska Elsparkcyklar AB</p>
            <button onClick={login}>Login</button>
          </>
        }
        </>
      }
    </div>
  );
}

export default App;
