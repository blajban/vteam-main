import React, { useState, useEffect } from 'react';
import "../assets/css/style.css"
import Sidemenu from '../components/sidemenus/Sidemenu'
import Map from '../components/Map'


export function Mapside({token, userId}) {
    const [targetCity, setTargetedcity] = useState(1);
    const [targetedItems, setTargetedItems] = useState(0);
    const [scootersOrParkings, setscootersOrParkings] = useState("parkings");

    function linkToLogin() {
      window.location.href = 'http://localhost:9001';
    }

    return (
      <div>
        {token && userId ?
          <>
            <div className="container">
              <Sidemenu setTargetedcity={setTargetedcity} targetCity={targetCity} setTargetedItems={setTargetedItems} setscootersOrParkings={setscootersOrParkings}></Sidemenu>
              <Map targetedItems={targetedItems} targetCity={targetCity} scootersOrParkings={scootersOrParkings}></Map>
            </div>
          </>
          :
          <>
            <button onClick={linkToLogin}>You must log in</button>
          </>
        }
      </div>
    )
}