import "../../assets/css/style.css"
import locationHandler from '../../models/LocationModel'
import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


/**
* Removes an existing location.
*
* @async
* @param {string} city - The city where the location is located.
* @param {string} _id - The ID of the location to update.
*/
async function removeLocation(token, loginId, city, id){
  await locationHandler.deleteLocation(token, loginId, city, id)
}


/**
 * Adds a new location.
 *
 * @async
 * @param {string} city - The city where the location is located.
 * @param {object} object - An object containing the location details.
 */
async function addLocation(token, loginId, city, object){
  let newLocation = {
    properties: {
      lat: object.inputLat.current.value,
      lng: object.inputLng.current.value,
    },
    rate: object.inputRate.current.value,
    charging: object.inputCharging.current.value
  }
  await locationHandler.createLocation(token, loginId, city, newLocation)
}

/**
* Updates an existing location.
*
* @async
* @param {string} city - The city where the location is located.
* @param {string} _id - The ID of the location to update.
* @param {object} object - An object containing the updated location details.
*/
async function updateLocation(token, loginId, city, _id ,object){
  let updatedLocation = {
    _id: _id,
    properties: {
      lat: object.inputLatEdit.current.value,
      lng: object.inputLngEdit.current.value,
    },
    rate: object.inputRateEdit.current.value,
    charging: object.inputChargingEdit.current.value
  }
  await locationHandler.updateLocation(token, loginId, city, updatedLocation)
}

function LocationTable({token, loginId}) {
    const [parkings, setParkings] = useState([]);
    const [tableBox, setTableBox] = useState([]);
    const [city, setCity] = useState("stockholm");
    const inputLat = useRef(null);
    const inputLng = useRef(null);
    const inputRate = useRef(null);
    const inputCharging = useRef(null);
    const inputId = useRef(null);
    const inputLatEdit = useRef(null);
    const inputLngEdit = useRef(null);
    const inputRateEdit = useRef(null);
    const inputChargingEdit = useRef(null);

  //Fetches location according to tab
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
  //Maps items in parkings to <tr>
  useEffect(() => {
  const Box = parkings.map((e, i) => {
    return(
      <tr key={i}>
        <td>{e._id}</td>
        <td>{e.properties.lat}</td>
        <td>{e.properties.lng}</td>
        <td>{e.rate}</td>
        <td>{e.charging.toString()}</td>
        <td>
          <Popup trigger={<button> Edit</button>} position="right center">
            <input type="text" value={e._id} ref={inputId} readOnly></input>
            <input type="text" defaultValue={e.properties.lat} ref={inputLatEdit} ></input>
            <input type="text" defaultValue={e.properties.lng} ref={inputLngEdit} ></input>
            <input type="text" defaultValue={e.rate} ref={inputRateEdit}></input>
            <select placeholder="Charging" ref={inputChargingEdit}>
              <option>false</option>
              <option>true</option>
            </select>
            <button onClick={() => {updateLocation(token, loginId, city,e._id , {inputLatEdit, inputLngEdit, inputRateEdit, inputChargingEdit})}}>Update</button>
          </Popup>
        </td>
        <td><button value={e._id} onClick={(e) => {removeLocation(token, loginId, city, e.target.value)}}>Delete</button></td>
      </tr>
    )
  })
  setTableBox(Box)

  }, [parkings])

    return (
    <div className="table-container">
      <div className="tab">
        <button className="tablinks" onClick={() => setCity("stockholm")}>Stockholm</button>
        <button className="tablinks" onClick={() => setCity("malmo")}>Malmö</button>
        <button className="tablinks" onClick={() => setCity("goteborg")}>Göteborg</button>
      </div>
    <table className="styled-table">
    <tbody>
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
        <td><button onClick={() => {addLocation(token, loginId, city, {inputLng, inputLat, inputRate, inputCharging})}}>Add</button></td>
      </tr>
      </tbody>
    </table>
    </div>
    );
}

export default LocationTable;