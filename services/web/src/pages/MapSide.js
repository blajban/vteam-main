import React, { useState, useEffect } from 'react';
import "../assets/css/style.css"
import Sidemenu from '../components/sidemenus/Sidemenu'
import Map from '../components/Map'


export function Mapside() {
    const [targetCity, setTargetedcity] = useState(1);
    const [targetedItems, setTargetedItems] = useState(0);

    return (
    <>
      <div className="container">
        <Sidemenu setTargetedcity={setTargetedcity} targetCity={targetCity} setTargetedItems={setTargetedItems}></Sidemenu>
        <Map targetedItems={targetedItems} targetCity={targetCity}></Map>
      </div>
      </>
    )
}