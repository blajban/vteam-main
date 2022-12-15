import "../assets/css/style.css"
import locationHandler from '../models/LocationModel'
import React, { useState, useEffect, useRef } from 'react';


async function removeLocation(city, id){
  await locationHandler.deleteLocation(city, id)
}

async function addLocation(city, object){
  console.log(object.inputLat.current.value)
  console.log(object.inputLng.current.value)
  console.log(object.inputRate.current.value)
  console.log(object.inputCharging.current.value)
  let newLocation = {
    properties: {
      lat: object.inputLat.current.value,
      lng: object.inputLng.current.value,
    },
    rate: object.inputRate.current.value,
    charging: object.inputCharging.current.value
  }
  await locationHandler.createLocation(city, newLocation)
}

async function updateLocation(){
}

function LocationTable(props) {
    const [parkings, setParkings] = useState([]);
    const [tableBox, setTableBox] = useState([]);
    const [city, setCity] = useState("stockholm");
    const inputLat = useRef(null);
    const inputLng = useRef(null);
    const inputRate = useRef(null);
    const inputCharging = useRef(null);


  useEffect(() => {
  async function fetchData(){
    console.log("fetch data ran")
        switch(city) {
          case "stockholm":
            setParkings(await locationHandler.fetchStockholmLocations());
            break;
          case "goteborg":
            setParkings(await locationHandler.fetchGoteborgLocations());
            break;
          case "malmo":
            setParkings(await locationHandler.fetchMalmoLocations());
            break;
          default:
            // code block
        }
      }
    fetchData();
  }, [city])

  useEffect(() => {
  const Box = parkings.map((e, i) => {
    return(
      <tr key={i}>
        <td>{e._id}</td>
        <td>{e.properties.lat}</td>
        <td>{e.properties.lng}</td>
        <td>{e.rate}</td>
        <td>{e.charging.toString()}</td>
        <td><button value={e._id} onClick={(e) => {updateLocation()}}>Edit</button></td>
        <td><button value={e._id} onClick={(e) => {removeLocation(city, e.target.value)}}>Delete</button></td>
      </tr>
    )
  })
  setTableBox(Box)

  }, [parkings])

    return (
    <div className="table-container">
      <div class="tab">
        <button class="tablinks" onClick={() => setCity("stockholm")}>Stockholm</button>
        <button class="tablinks" onClick={() => setCity("malmo")}>Malmö</button>
        <button class="tablinks" onClick={() => setCity("goteborg")}>Göteborg</button>
      </div>
    <table className="styled-table">
      <tr>
        <th>Id</th>
        <th>Latitude</th>
        <th>Longitude</th>
        <th>Rate</th>
        <th>Charging</th>
        <th>Change</th>
        <th>Delete</th>
        <th></th>
      </tr>
      <tbody>
      {tableBox}
      <tr>
        <td> iD </td>
        <td> <input type="text" placeholder="Latitude" ref={inputLat}></input></td>
        <td> <input type="text" placeholder="Longitude" ref={inputLng}></input></td>
        <td> <input type="text" placeholder="Rate" ref={inputRate}></input></td>
        <td>
          <select placeholder="Charging" ref={inputCharging}>
            <option>false</option>
            <option>true</option>
          </select>
        </td>
        <td><button onClick={() => {addLocation(city, {inputLng, inputLat, inputRate, inputCharging})}}>Add</button></td>
      </tr>
      </tbody>
    </table>
    </div>
    );
}

export default LocationTable;