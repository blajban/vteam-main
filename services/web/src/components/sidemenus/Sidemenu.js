import locationModel from "../../models/LocationModel"
import scooterModel from "../../models/scooterModel"
import React, { useState, useEffect, useRef } from 'react';
let intervals = []


/**
 * Clears all intervals in the given array.
 *
 * @param {Array} array - An array of intervals to be cleared.
 *
 */
function clearInter(array) {
  for(let i of intervals) {
    clearInterval(i)
  }
}

function Sidemenu(props) {

/**
 * Retrieves location data from a specific city based on the input.
 * Clears any previous intervals and sets the retrieved data as the targeted items.
 *
 * @param {number} e - The city to fetch location data for.
 *                    1 for Stockholm, 2 for Gothenburg, 3 for Malmo.
 *
 * @async
 */
  async function getLocations(e) {
    switch (e) {
      case 1:
        let stockholmLocations = await locationModel.fetchStockholmLocations()
        console.log(stockholmLocations)
        props.setTargetedItems(stockholmLocations)
        clearInter(intervals)
        break;
      case 2:
        let goteborgLocation = await locationModel.fetchGoteborgLocations()
        props.setTargetedItems(goteborgLocation)
        clearInter(intervals)
        break;
      case 3:
        let malmoLocation = await locationModel.fetchMalmoLocations()
        props.setTargetedItems(malmoLocation)
        clearInter(intervals)
        break;
      default:
        break;
    }
  }

/**
 * Retrieves scooter data from a specific city based on the input.
 * Clears any previous intervals and sets a new interval for fetching data.
 *
 * @param {number} e - The city to fetch scooter data for.
 *                    1 for Stockholm, 2 for Gothenburg, 3 for Malmo.
 *
 * @async
 */
  async function getScooters(e) {
    switch (e) {
      case 1:
        let sthlmInter = setInterval(async () => {
        let stockholmScooters = await scooterModel.fetchStockholmScooter()
        props.setTargetedItems(stockholmScooters)
        }, 4000);
        clearInter(intervals)
        intervals.push(sthlmInter)
        break;
      case 2:
        let gbgInter = setInterval(async () => {
        let goteborgScooters = await scooterModel.fetchGoteborgScooter()
        props.setTargetedItems(goteborgScooters)
        }, 4000);
        clearInter(intervals)
        intervals.push(gbgInter)
        break;
      case 3:
        let mlmInter = setInterval(async () => {
        let malmoScooters = await scooterModel.fetchMalmoScooter()
        props.setTargetedItems(malmoScooters)
        }, 4000);
        clearInter(intervals)
        intervals.push(mlmInter)
        console.log(intervals)
        break;

      default:
        break;
    }
  }

  return (
  <div className="sidemenu">
    <button onClick={() => {props.setTargetedcity(1)}}>Stockholm</button>
    {(props.targetCity === 1) ?
    <div className="button-container">
      <button onClick={() => { getLocations(props.targetCity) }}> Parkingspots</button>
      <button onClick={() => { getScooters(props.targetCity) }}> Scooters</button>
    </div>:
    <></>
    }
    <button onClick={() => {props.setTargetedcity(2)}}>Goteborg</button>
    {(props.targetCity === 2) ?
    <div className="button-container">
      <button onClick={() => { getLocations(props.targetCity) }}> Parkingspots</button>
      <button onClick={() => { getScooters(props.targetCity) }}> Scooters</button>
    </div>:
    <></>
    }
    <button onClick={() => {props.setTargetedcity(3)}}>Malmo</button>
    {(props.targetCity === 3) ?
    <div className="button-container">
      <button onClick={() => { getLocations(props.targetCity) }}> Parkingspots</button>
      <button onClick={() => { getScooters(props.targetCity) }}> Scooters</button>
    </div>:
    <></>
    }
  </div>
  );
}

export default Sidemenu;
