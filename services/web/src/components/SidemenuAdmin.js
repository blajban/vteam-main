


function SidemenuAdmin(props) {


    return (
    <div className="Sidemenu" style={{
      height: "100vh",
      width: "300px",
      backgroundColor: "#228377",
      borderBottomRightRadius: "5px",
      borderBottomLeftRadius: "5px",
      textAlign: "center"

      }}>
        <button>Profile</button>
        <button>Locations</button>
        <button>Scooters</button>
        <button>Users</button>
    </div>
    );
}

export default SidemenuAdmin;