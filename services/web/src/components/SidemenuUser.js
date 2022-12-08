


function SidemenuUser(props) {


    return (
    <div className="sidemenu">
        <button onClick={() => { props.setLoadedUserPage(1)}}>User info</button>
        <button onClick={() => { props.setLoadedUserPage(2)}}>History</button>
    </div>
    );
}

export default SidemenuUser;