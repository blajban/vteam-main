import { Link } from 'react-router-dom'


function Navbar(props) {
    return (
    <div className="Navbar" style={{
      height: "100px",
      backgroundColor: "#228377",
      borderBottomRightRadius: "5px",
      borderBottomLeftRadius: "5px",
      textAlign: "center"

      }}>
        <button><Link to="/"> Home </Link></button>
        <button><Link to="/Map"> Map </Link></button>
        <button><Link to="/UserProfile"> Profile </Link></button>
        <button><Link to="/AdminControll"> AdminControll </Link></button>
    </div>
    );
}

export default Navbar;