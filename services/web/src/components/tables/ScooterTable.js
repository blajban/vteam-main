import React, { useState, useEffect, useRef } from 'react';
import scooterModel from '../../models/scooterModel'
import Popup from 'reactjs-popup';



function ScooterTable() {

    const [scooters, setScooters] = useState(null);

    const inputIdEdit = useRef(null);
    const inputStatusEdit = useRef(null);
    const inputLocationEdit = useRef(null);
    const inputLatEdit = useRef(null);
    const inputLngEdit = useRef(null);

    const inputLng = useRef(null);
    const inputLat = useRef(null);
    const inputCity = useRef(null);

    useEffect(() => {
        async function getScooters() {
            const response = await fetch(`http://localhost:3500/city/stockholm/scooter`)
            const data = await response.json();
            setScooters(data);
        }
        getScooters();
      }, []);

    function AddScooter() {
        return (
            <div className="make-scooter-container">
                <input type="text" ref={inputLng} placeholder="longitude"></input>
                <input type="text" ref={inputLat} placeholder="latitude"></input>
                <input type="text" ref={inputCity} placeholder="city"></input>
                <button onClick={() => {scooterModel.addScooter(inputCity, {lng: inputLng, lat: inputLat})}}>Add scooter</button>
            </div>
        )
    }

    function Table() {
        return (
            <div>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>scooterId</th>
                            <th>status</th>
                            <th>userId</th>
                            <th>location</th>
                            <th>latitude</th>
                            <th>longitude</th>
                            <th>speed</th>
                            <th>battery</th>
                            <th></th>
                            <th></th>
                            {/* <th>log?</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {scooters.map((scooter) => (
                            <tr key={scooter._id}>
                                <td>{scooter._id}</td>
                                <td>{scooter.status}</td>
                                <td>{scooter.userId}</td>
                                <td>{scooter.properties.location}</td>
                                <td>{scooter.properties.lat}</td>
                                <td>{scooter.properties.lng}</td>
                                <td>{scooter.properties.speed}</td>
                                <td>{scooter.properties.battery}</td>
                                <td>
                                    <Popup trigger={<button>Edit</button>} position="right center">
                                        <input type="text" value={scooter._id} ref={inputIdEdit} readOnly></input>
                                        <input type="text" defaultValue={scooter.status} ref={inputStatusEdit}></input>
                                        <input type="text" defaultValue={scooter.properties.location} ref={inputLocationEdit}></input>
                                        <input type="text" defaultValue={scooter.properties.lat} ref={inputLatEdit} ></input>
                                        <input type="text" defaultValue={scooter.properties.lng} ref={inputLngEdit} ></input>
                                        <button onClick={() => {scooterModel.updateScooter(scooter._id, scooter.properties.location, inputStatusEdit, inputLocationEdit, inputLatEdit, inputLngEdit)}}>Update</button>
                                    </Popup>
                                </td>
                                <td><button onClick={() => {scooterModel.removeScooter(scooter._id, scooter.properties.location)}}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }


    if (!scooters) {
        return (
            <div>
                loading...
            </div>
        )
    }


    return (
        <div>
            <AddScooter/>
            <Table/>
        </div>
    )
}

export default ScooterTable;