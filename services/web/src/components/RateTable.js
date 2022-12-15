import "../assets/css/style.css"
import ratesHandler from '../models/ratesModel'
import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';



function LocationTable(props) {
    const [rates, setRates] = useState([]);
    const [tableBox, setTableBox] = useState([]);


  useEffect(() => {
    async function fetchData(){
      console.log("fetch data ran")
        setRates(await ratesHandler.fetchRates());
        }
      fetchData();

  }, [])

  useEffect(() => {
  const Box = rates.map((e, i) => {
    return(
      <tr key={i}>
        <td>{e._id}</td>
        <td>{e.id}</td>
        <td>{e.name}</td>
        <td>{e.tariff}</td>
        <td>
          <Popup trigger={<button> Edit</button>} position="right center">
            <select placeholder="Charging">
              <option>false</option>
              <option>true</option>
            </select>
          </Popup>
        </td>
        <td></td>
      </tr>
    )
  })
  setTableBox(Box)

  }, [rates])

    return (
    <div className="table-container">
    <table className="styled-table">
    <tbody>
      <tr>
        <th>_id</th>
        <th>id</th>
        <th>name</th>
        <th>tariff</th>
        <th>Change</th>
        <th>Delete</th>
        <th></th>
      </tr>
      {tableBox}
      <tr>
        <td> iD </td>
        <td> <input type="text" placeholder="id"></input></td>
        <td> <input type="text" placeholder="name"></input></td>
        <td> <input type="text" placeholder="tariff" ></input></td>
        <td>
          <select placeholder="Charging" >
            <option>false</option>
            <option>true</option>
          </select>
        </td>
        <td><button>Add</button></td>
      </tr>
      </tbody>
    </table>
    </div>
    );
}

export default LocationTable;