import { Link } from 'react-router-dom'


function Navbar({admin}) {
    return (
    <div className="navbar">
        <button><Link to="/"> Home </Link></button>
        <button><Link to="/Map"> Map </Link></button>
        <button><Link to="/UserProfile"> Profile </Link></button>
        {admin ?
            <>
                <button><Link to="/AdminControll"> AdminControll </Link></button>
            </>
            :
            <></>
        }
    </div>
    );
}

export default Navbar;