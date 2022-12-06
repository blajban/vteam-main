import { Marker, Popup, MapContainer, TileLayer, useMap } from 'react-leaflet'
import dummydata from '../dummydat/stockholmLocations.json'

const Markers = dummydata.map((e, index) => { return <Marker key={index} position={[e.lat, e.lng]} ><Popup>
  Är laddplats: {e.charging.toString()}  </Popup> </Marker>})

const cities = {
  1: [59.334591, 18.063240],
  2: [57.708870, 11.974560],
  3: [55.60587, 13.00073]
}

function Map(props) {
    return (
        <MapContainer style={{height:'800px', width: '800px'}}center={cities[props.targetCity]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {Markers}
        </MapContainer>
    );
}

export default Map;