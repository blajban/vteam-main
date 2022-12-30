import React, { useState, useEffect, useRef } from 'react';

function ScooterTable() {

    const [scooters, setScooters] = useState(null);

    useEffect(() => {
        async function getScooters() {
            const response = await fetch(`http://localhost:3500/city/stockholm/scooter`)
            const data = await response.json();
            console.log(data)
            return data
        }
        setScooters(getScooters);
      }, []);
    
    if (!scooters) {
        return (
            <div>
                loading...
            </div>
        )
    }


    return (
        <div>
            FUNKAR
        </div>
    )
}

export default ScooterTable;