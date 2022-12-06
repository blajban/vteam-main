import React, { useState, useEffect } from 'react';
import Map from './components/Map'
import Navbar from './components/Navbar'


function App() {
  const [targetedItems, setTargetedItems] = useState(0);


  return (
    <div className="App">
      <Navbar></Navbar>
      <Map></Map>
    </div>
  );
}

export default App;
