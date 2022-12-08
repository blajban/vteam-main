import SidemenuAdmin from "../components/SidemenuAdmin"
import "../assets/css/style.css"
import React, { useState, useEffect } from 'react';

export function AdminControll() {
    const [loadedAdminPage, setLoadedAdminPage] = useState(1);

    return (
        <div className="container">
        <SidemenuAdmin setLoadedAdminPage={setLoadedAdminPage}></SidemenuAdmin>
        {(loadedAdminPage === 1)?
        <div>Profile</div>:
        (loadedAdminPage === 2) ?
        <div>Locations</div>:
        (loadedAdminPage === 3) ?
        <div>Scooters</div>:
        (loadedAdminPage === 4) ?
        <div>Users</div>:
        <div>Profile</div>
        }
        </div>
        )
}