


function Navbar() {
    return (
    <div className="Navbar" style={{
      height: "100px",
      backgroundColor: "#228377",
      borderBottomRightRadius: "5px",
      borderBottomLeftRadius: "5px",
      textAlign: "center"

      }}>
        <button>Show scooters</button>
        <button>Show Parkingspots</button>
        <button>Show Chargingspots</button>
    </div>
    );
}

export default Navbar;