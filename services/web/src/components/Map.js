import { Marker, Popup, MapContainer, TileLayer, useMap } from 'react-leaflet'
import React, { useState, useEffect, useRef } from 'react';


const cities = {
  1: [59.334591, 18.063240],
  2: [57.708870, 11.974560],
  3: [55.60587, 13.00073]
}


function Map(props) {
  const [markers, setMarkers] = useState(<></>)
  useEffect(() =>{
    console.log("updated")
  if(props.targetedItems !== 0) {
    let Markers = props.targetedItems.map((e, index) => { return <Marker key={index} position={[e.properties.lat, e.properties.lng]} ><Popup>
    Marker  </Popup> </Marker>})
    setMarkers(Markers)
  }
}, [props.targetedItems])
  return (
      <MapContainer className="map" center={cities[props.targetCity]} zoom={13} scrollWheelZoom={true}>
          <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        {markers}
      </MapContainer>
  );
}


function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default Map;