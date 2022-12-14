import "../assets/css/style.css"
import locationHandler from '../models/LocationModel'
import React, { useState, useEffect } from 'react';


async function removeLocation(city, id){
  const object = {_id: id}
  let result = await locationHandler.deleteLocation(city, object)
  console.log(result)
}

function LocationTable(props) {
    const [parkings, setParkings] = useState([]);
    const [tableBox, setTableBox] = useState([]);
    const [city, setCity] = useState("stockholm")
    console.log(parkings)
    useEffect(() => {
      async function fetchData(){
        setParkings(await locationHandler.fetchStockholmLocations());
      }
    fetchData();
  }, [])

  useEffect(() => {
  const Box = parkings.map((e, i) => {
    return(
      <tr key={i}>
        <td>{e._id}</td>
        <td>{e.properties.lat}</td>
        <td>{e.properties.lng}</td>
        <td>{e.rate}</td>
        <td>{e.charging.toString()}</td>
        <td><button value={e._id}>Edit</button></td>
        <td><button value={e._id} onClick={(e) => {removeLocation(city, e.target.value)}}>Delete</button></td>
      </tr>
    )
  })
  setTableBox(Box)

}, [parkings])

    return (
    <div className="table-container">
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
      </tbody>
    </table>
    </div>
    );
}

export default LocationTable;