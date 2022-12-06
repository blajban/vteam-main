


function Sidemenu() {
    return (
    <div className="Sidemenu" style={{
      height: "100vh",
      width: "300px",
      backgroundColor: "#228377",
      borderBottomRightRadius: "5px",
      borderBottomLeftRadius: "5px",
      textAlign: "center"

      }}>
        <button>Load Scooters</button>
        <button>Load Parkingspots</button>
        <button>Load Chargingspots</button>
    </div>
    );
}

export default Sidemenu;