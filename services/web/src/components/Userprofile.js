


function Userprofile({userId}) {
    return (
        <div className="user-profile-container">
            <div className="image-holder">
            <img src={require('../assets/user.png')}></img>
            </div>
            <h3>Alexander@email.com</h3>
        </div>
        );
    }
export default Userprofile;