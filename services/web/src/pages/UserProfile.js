import SidemenuUser from "../components/sidemenus/SidemenuUser"
import HisotryTable from "../components/tables/HistoryTable"
import Userprofile from "../components/Userprofile";
import "../assets/css/style.css"
import React, { useState, useEffect } from 'react';

export function UserProfile() {
    const [loadedUserPage, setLoadedUserPage] = useState(1);
    return (
    <div className="container">
        <SidemenuUser setLoadedUserPage={setLoadedUserPage}></SidemenuUser>

        {(loadedUserPage === 1) ?
        <Userprofile/>:

        <HisotryTable></HisotryTable>
        }
    </div>
    )
}
