import SidemenuUser from "../components/sidemenus/SidemenuUser"
import HistoryTable from "../components/tables/HistoryTable"
import Userprofile from "../components/Userprofile";
import "../assets/css/style.css"
import React, { useState } from 'react';

export function UserProfile({token, userId}) {
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
                <Userprofile token={token} userId={userId}/>:

                <HistoryTable token={token} userId={userId}></HistoryTable>
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
