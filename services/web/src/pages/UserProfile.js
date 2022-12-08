import SidemenuUser from "../components/SidemenuUser"
import HisotryTable from "../components/HistoryTable"
import "../assets/css/style.css"

export function UserProfile() {
    return (
        <div style={{display: "inline-grid", gridTemplateColumns: "auto auto"}}>
    <SidemenuUser></SidemenuUser>
    <HisotryTable></HisotryTable>
        </div>
    )
}