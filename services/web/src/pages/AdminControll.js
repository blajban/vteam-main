import SidemenuAdmin from "../components/sidemenus/SidemenuAdmin"
import "../assets/css/style.css"
import React, { useState, useEffect } from 'react';
import LocationTable from "../components/tables/LocationTable";
import RateTable from "../components/tables/RateTable";
import InvoiceTable from "../components/tables/InvoiceTable";

export function AdminControll() {
    const [loadedAdminPage, setLoadedAdminPage] = useState(1);

    return (
        <div className="container">
        <SidemenuAdmin setLoadedAdminPage={setLoadedAdminPage}></SidemenuAdmin>
        {(loadedAdminPage === 1)?
        <div>Profile</div>:
        (loadedAdminPage === 2) ?
        <LocationTable></LocationTable>:
        (loadedAdminPage === 3) ?
        <div>Scooters</div>:
        (loadedAdminPage === 4) ?
        <div>Users</div>:
        (loadedAdminPage === 5) ?
        <RateTable></RateTable>:
        (loadedAdminPage === 6) ?
        <InvoiceTable/>:
        <div>Profile</div>
        }
        </div>
        )
}