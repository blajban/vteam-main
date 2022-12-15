import "../assets/css/style.css"
import ratesHandler from '../models/ratesModel'
import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

async function addRate(object){
  let newRate = {

    id: object.inputid.current.value,
    name: object.inputName.current.value,
    tariff: object.inputTariff.current.value,
  }
  await ratesHandler.createRate(newRate)
}

async function deleteRate(_id){
  await ratesHandler.deleteRate(_id)
}



function LocationTable(props) {
    const [rates, setRates] = useState([]);
    const [tableBox, setTableBox] = useState([]);
    const inputid = useRef(null);
    const inputName = useRef(null);
    const inputTariff = useRef(null);


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
        <td><button value={e._id} onClick={(e) => {deleteRate(e.target.value)}}>Delete</button></td>
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
        <td> <input type="text" placeholder="id" ref={inputid}></input></td>
        <td> <input type="text" placeholder="name" ref={inputName}></input></td>
        <td> <input type="text" placeholder="tariff" ref={inputTariff} ></input></td>
        <td><button onClick={() => {addRate({inputid, inputName, inputTariff})}}>Add</button></td>
      </tr>
      </tbody>
    </table>
    </div>
    );
}

export default LocationTable;