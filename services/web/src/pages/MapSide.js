import React, { useState, useEffect } from 'react';
import Sidemenu from '../components/Sidemenu'
import Map from '../components/Map'


export function Mapside() {
    const [targetCity, setTargetedcity] = useState(1);
    const [targetedItems, setTargetedItems] = useState(0);

    return (
    <>
      <div style={{display: "inline-grid", gridTemplateColumns: "auto auto"}}>
        <Sidemenu setTargetedcity={setTargetedcity} targetCity={targetCity} setTargetedItems={setTargetedItems}></Sidemenu>
        <Map targetedItems={targetedItems} targetCity={targetCity}></Map>
      </div>
      </>
    )
}