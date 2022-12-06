import { Marker, Popup, MapContainer, TileLayer, useMap } from 'react-leaflet'
import dummydata from '../dummydat/stockholmLocations.json'

const Markers = dummydata.map((e, index) => { return <Marker key={index} position={[e.lat, e.lng]} ><Popup>
  Är laddplats: {e.charging.toString()}  </Popup> </Marker>})

function Map() {
    return (
    <div className="leaftletContainer" >
        <MapContainer style={{height:'1200px', width: '100%'}}center={[59.334591, 18.063240]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {Markers}
        </MapContainer>
      </div>
    );
}

export default Map;