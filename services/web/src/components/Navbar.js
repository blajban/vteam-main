


function Navbar(props) {
    return (
    <div className="Navbar" style={{
      height: "100px",
      backgroundColor: "#228377",
      borderBottomRightRadius: "5px",
      borderBottomLeftRadius: "5px",
      textAlign: "center"

      }}>
        <button onClick={() => {props.setTargetedcity(1)}}>Stockholm</button>
        <button onClick={() => {props.setTargetedcity(2)}}>Goteborg</button>
        <button onClick={() => {props.setTargetedcity(3)}}>Malmö</button>
    </div>
    );
}

export default Navbar;