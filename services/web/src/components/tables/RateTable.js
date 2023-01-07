import "../../assets/css/style.css"
import ratesHandler from '../../models/ratesModel'
import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

/**
 * Adds a new rate.
 *
 * @async
 * @param {object} object - An object containing the rate details.
 */
async function addRate(token, loginId, object){
  let newRate = {

    id: object.inputid.current.value,
    name: object.inputName.current.value,
    tariff: object.inputTariff.current.value,
  }
  await ratesHandler.createRate(token, loginId, newRate)
}

/**
 * Deletes an existing rate.
 *
 * @async
 * @param {string} _id - The ID of the rate to update.
 */
async function deleteRate(token, loginId, _id){
  await ratesHandler.deleteRate(token, loginId, _id)
}


/**
 * Updates an existing rate.
 *
 * @async
 * @param {string} _id - The ID of the rate to update.
 * @param {object} object - An object containing the updated rate details.
 */
async function updateRate(token, loginId, _id, object) {
  let updatedRate = {
    id: object.inputIdEdit.current.value,
    name: object.inputNameEdit.current.value,
    tariff: object.inputTariffEdit.current.value,
  }
  await ratesHandler.updateRate(token, loginId, _id, updatedRate);
}


function RateTable({token, userId}) {
    const [rates, setRates] = useState([]);
    const [tableBox, setTableBox] = useState([]);
    const inputid = useRef(null);
    const inputName = useRef(null);
    const inputTariff = useRef(null);
    const inputIdEdit = useRef(null);
    const inputNameEdit = useRef(null);
    const inputTariffEdit = useRef(null);

  // Fetches the data
  useEffect(() => {
    async function fetchData(){
      console.log("fetch data ran")
      console.log(await ratesHandler.fetchRates())
        setRates(await ratesHandler.fetchRates());
        }
      fetchData();

  }, [])

  //Runs when rates have changed
  //Creates table row for each item in rates
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
            <input type="text" defaultValue={e.id} ref={inputIdEdit} ></input>
            <input type="text" defaultValue={e.name} ref={inputNameEdit} ></input>
            <input type="text" defaultValue={e.tariff} ref={inputTariffEdit}></input>
            <button onClick={() => {updateRate(token, userId, e._id , {inputIdEdit, inputNameEdit, inputTariffEdit})}}>Update</button>
          </Popup>
        </td>
        <td><button value={e._id} onClick={(e) => {deleteRate(token, userId, e.target.value)}}>Delete</button></td>
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
        <td><button onClick={() => {addRate({token, userId, inputid, inputName, inputTariff})}}>Add</button></td>
      </tr>
      </tbody>
    </table>
    </div>
    );
}

export default RateTable;