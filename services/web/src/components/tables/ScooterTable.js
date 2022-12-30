import React, { useState, useEffect, useRef } from 'react';
import scooterModel from '../../models/scooterModel'


function ScooterTable() {

    const [scooters, setScooters] = useState(null);

    const inputLng = useRef(null);
    const inputLat = useRef(null);
    const inputCity = useRef(null);

    useEffect(() => {
        async function getScooters() {
            const response = await fetch(`http://localhost:3500/city/stockholm/scooter`)
            const data = await response.json();
            console.log(data)
            return data
        }
        getScooters().then(data => setScooters(data));

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