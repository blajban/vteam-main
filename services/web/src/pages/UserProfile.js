import SidemenuUser from "../components/sidemenus/SidemenuUser"
import HistoryTable from "../components/tables/HistoryTable"
import Userprofile from "../components/Userprofile";
import "../assets/css/style.css"
import React, { useState, useEffect } from 'react';

export function UserProfile({token, userId, admin}) {
    const [loadedUserPage, setLoadedUserPage] = useState(1);

    function linkToLogin() {
        window.location.href = 'http://localhost:9001';
    }

    return (
    <div className="container">
        {token && userId ?
            <>
                <SidemenuUser setLoadedUserPage={setLoadedUserPage}></SidemenuUser>

                {(loadedUserPage === 1) ?
                <Userprofile userId={userId}/>:

                <HistoryTable></HistoryTable>
                }
            </>
            :
            <>
                <button onClick={linkToLogin}>You must log in</button>
            </>
        }
    </div>
    )
}
