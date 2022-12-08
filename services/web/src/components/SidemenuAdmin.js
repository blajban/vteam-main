


function SidemenuAdmin(props) {


    return (
    <div className="sidemenu">
        <button onClick={() => { props.setLoadedAdminPage(1)}}>Profile</button>
        <button onClick={() => { props.setLoadedAdminPage(2)}}>Locations</button>
        <button onClick={() => { props.setLoadedAdminPage(3)}}>Scooters</button>
        <button onClick={() => { props.setLoadedAdminPage(4)}}>Users</button>
    </div>
    );
}

export default SidemenuAdmin;