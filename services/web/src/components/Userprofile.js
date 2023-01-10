import { useEffect, useState } from 'react';
import usersHandler from '../models/usersModel';

function Userprofile({token, userId}) {
    const [user, setUser] = useState([]);
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [balance, setBalance] = useState("");

    async function getUserInfo() {
        const result = await usersHandler.getUser(token, userId, userId);
        setUser(result);
    }

    async function updateUser(e) {
        e.preventDefault();
        const userToUpdate = {
            _id: userId,
            name: name,
            mail: mail,
            mobile: mobile,
            address: address,
            zip: zip,
            city: city,
            admin: user.admin,
            balance: balance
        }
        await usersHandler.updateUser(token, userToUpdate, userId);
        await getUserInfo();
    }

    useEffect(() => {
        (async () => {
            await getUserInfo();
        })();
    }, []);

    return (
        <div className="user-profile-container">
            <div className="image-holder">
                <img src={require('../assets/user.png')}></img>
            </div>

            <form>
                <label>Name
                    <br></br>
                    <input
                        type="text"
                        defaultValue={user.name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </label>
                <br></br>
                <label>Email
                    <br></br>
                    <input
                        type="email"
                        defaultValue={user.email}
                        onChange={(event) => setMail(event.target.value)}
                    />
                </label>
                <br></br>
                <label>Phone number
                    <br></br>
                    <input
                        type="tel"
                        defaultValue={user.mobile}
                        onChange={(event) => setMobile(event.target.value)}
                    />
                </label>
                <br></br>
                <label>Address
                    <br></br>
                    <input
                        type="text"
                        defaultValue={user.address}
                        onChange={(event) => setAddress(event.target.value)}
                    />
                </label>
                <br></br>
                <label>Zip code
                    <br></br>
                    <input
                        type="text"
                        defaultValue={user.zip}
                        onChange={(event) => setZip(event.target.value)}
                    />
                </label>
                <br></br>
                <label>City
                    <br></br>
                    <input
                        type="text"
                        defaultValue={user.city}
                        onChange={(event) => setCity(event.target.value)}
                    />
                </label>
                <br></br>
                <label>Balance
                    <br></br>
                    <input
                        type="number"
                        step="0.01"
                        defaultValue={user.balance}
                        onChange={(event) => setBalance(event.target.value)}
                    />
                </label>
                <br></br>
                <button onClick={(e) => updateUser(e)}>Edit information</button>
            </form>
        </div>
        )
    }
export default Userprofile;