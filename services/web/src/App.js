import React, { useState, useEffect } from 'react';
import Map from './components/Map'
import Navbar from './components/Navbar'
import Sidemenu from './components/Sidemenu'


function App() {
  const [targetCity, setTargetedcity] = useState(1);
  const [targetedItems, setTargetedItems] = useState(0);

  useEffect(() => {
    console.log(targetCity)
  }, [targetCity]);


  return (
    <div className="App">
      <Navbar setTargetedcity={setTargetedcity}></Navbar>
      <div style={{display: "inline-grid", gridTemplateColumns: "auto auto"}}>
        <Sidemenu setTargetedcity={setTargetedcity} targetCity={targetCity} setTargetedItems={setTargetedItems}></Sidemenu>
        <Map targetedItems={targetedItems} targetCity={targetCity}></Map>
      </div>
    </div>
  );
}

export default App;
