import SidemenuAdmin from "../components/sidemenus/SidemenuAdmin"
import "../assets/css/style.css"
import React, { useState, useEffect } from 'react';
import LocationTable from "../components/tables/LocationTable";
import RateTable from "../components/tables/RateTable";
import InvoiceTable from "../components/tables/InvoiceTable";
import ScooterTable from "../components/tables/ScooterTable";
import UserTable from "../components/tables/UserTable";
import Userprofile from "../components/Userprofile";

export function AdminControll({token, userId, admin}) {
    const [loadedAdminPage, setLoadedAdminPage] = useState(1);

    return (
        <div className="container">
            {token && userId && admin ?
                <>
                    <SidemenuAdmin setLoadedAdminPage={setLoadedAdminPage}></SidemenuAdmin>
                    {(loadedAdminPage === 1)?
                    <Userprofile token={token} userId={userId}></Userprofile>:
                    (loadedAdminPage === 2) ?
                    <LocationTable token={token} userId={userId}></LocationTable>:
                    (loadedAdminPage === 3) ?
                    <ScooterTable token={token} userId={userId}/>:
                    (loadedAdminPage === 4) ?
                    <UserTable token={token} userId={userId}></UserTable>:
                    (loadedAdminPage === 5) ?
                    <RateTable token={token} userId={userId}></RateTable>:
                    (loadedAdminPage === 6) ?
                    <InvoiceTable token={token} userId={userId}/>:
                    <div></div>
                    }
                </>
                :
                <>
                    <p>You do not have access to visit this page.</p>
                </>
            }
        </div>
    )
}