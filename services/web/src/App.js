import React, { useState, useEffect } from 'react';
import Map from './components/Map'
import Navbar from './components/Navbar'
import Sidemenu from './components/Sidemenu'


function App() {
  const [targetCity, setTargetedcity] = useState(3);
  const [targetedItems, setTargetedItems] = useState(0);

  useEffect(() => {
    console.log(targetCity)
  }, [targetCity]);


  return (
    <div className="App">
      <Navbar setTargetedcity={setTargetedcity}></Navbar>
      <div style={{display: "inline-grid", gridTemplateColumns: "auto auto"}}>
        <Sidemenu></Sidemenu>
        <Map targetCity={targetCity}></Map>
      </div>
    </div>
  );
}

export default App;
