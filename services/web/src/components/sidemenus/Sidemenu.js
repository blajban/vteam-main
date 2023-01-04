import locationModel from "../../models/LocationModel"
import scooterModel from "../../models/scooterModel"
import React, { useState, useEffect, useRef } from 'react';




function Sidemenu(props) {

    async function getLocations(e) {
      switch (e) {
        case 1:
          let stockholmLocations = await locationModel.fetchStockholmLocations()
          props.setTargetedItems(stockholmLocations)
          break;
        case 2:
          let goteborgLocation = await locationModel.fetchGoteborgLocations()
          props.setTargetedItems(goteborgLocation)
          break;
        case 3:
          let malmoLocation = await locationModel.fetchMalmoLocations()
          props.setTargetedItems(malmoLocation)
          break;

        default:
          break;
      }
    }

    async function getScooters(e) {
      switch (e) {
        case 1:
          setInterval(async () => {
          let stockholmScooters = await scooterModel.fetchStockholmScooter()
          props.setTargetedItems(stockholmScooters)
          }, 4000);
          break;
        case 2:
          setInterval(async () => {
          let goteborgScooters = await scooterModel.fetchGoteborgScooter()
          props.setTargetedItems(goteborgScooters)
          }, 4000);
          break;
        case 3:
          setInterval(async () => {
          let malmoScooters = await scooterModel.fetchMalmoScooter()
          props.setTargetedItems(malmoScooters)
          }, 4000);
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

export default Sidemenu;