import "../../assets/css/style.css"
import usersHandler from '../../models/usersModel'
import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

/**
 * Deletes an user.
 *
 * @async
 * @param {string} token - OAuth token.
 * @param {number} loginId - id of the user who is logged in.
 * @param {number} _id - id of the user to update.
 */
async function deleteUser(token, loginId, _id){
  await usersHandler.deleteUser(token, _id, loginId)
}

/**
 * Updates an user.
 *
 * @async
 * @param {string} token - OAuth token.
 * @param {number} loginId - id of the user who is logged in.
 * @param {number} _id - id of the user to update.
 * @param {object} userObject - An object containing the updated user details.
 */
async function updateUser(token, loginId, _id, userObject) {
  const updatedUser = {
    _id: _id,
    name: userObject.inputNameEdit.current.value,
    mobile: userObject.inputPhoneEdit.current.value,
    mail: userObject.inputMailEdit.current.value,
    city: userObject.inputCityEdit.current.value,
    address: userObject.inputAddressEdit.current.value,
    zip: userObject.inputZipEdit.current.value,
    admin: userObject.inputAdminEdit.current.value,
    balance: userObject.inputBalanceEdit.current.value
  }
  await usersHandler.updateUser(token, updatedUser, loginId);
}

function UserTable({token, userId}) {
  const [users, setUsers] = useState([]);
  const [tableBox, setTableBox] = useState([]);
  const inputId = useRef(null);
  const inputName = useRef(null);
  const inputPhone = useRef(null);
  const inputMail = useRef(null);
  const inputCity = useRef(null);
  const inputAddress = useRef(null);
  const inputZip = useRef(null);
  const inputAdmin = useRef(null);
  const inputBalance = useRef(null);
  const inputNameEdit = useRef(null);
  const inputPhoneEdit = useRef(null);
  const inputMailEdit = useRef(null);
  const inputCityEdit = useRef(null);
  const inputAddressEdit = useRef(null);
  const inputZipEdit = useRef(null);
  const inputAdminEdit = useRef(null);
  const inputBalanceEdit = useRef(null);

  async function addUser(){
    const newUser = {
      _id: inputId.current.value,
      name: inputName.current.value,
      mobile: inputPhone.current.value,
      mail: inputMail.current.value,
      city: inputCity.current.value,
      address: inputAddress.current.value,
      zip: inputZip.current.value,
      admin: inputAdmin.current.value,
      balance: inputBalance.current.value
    }
    await usersHandler.addUser(newUser, token, userId);
    setUsers(await usersHandler.getAllUsers(token, userId));
  }

  useEffect(() => {
    (async () => {
        setUsers(await usersHandler.getAllUsers(token, userId));
    })();
  }, []);

  useEffect(() => {
  const Box = users.map((user, index) => {
    return(
      <tr key={index}>
        <td>{user._id}</td>
        <td>{user.name}</td>
        <td>{user.mobile}</td>
        <td>{user.mail}</td>
        <td>{user.address}</td>
        <td>{user.zip}</td>
        <td>{user.city}</td>
        <td>{user.admin.toString()}</td>
        <td>{user.balance}</td>

        <td>
          <Popup trigger={<button> Edit</button>} position="right center">
            <input type="number" value={user._id} readonly></input>
            <input type="text" defaultValue={user.name} ref={inputNameEdit} ></input>
            <input type="tel" defaultValue={user.mobile} ref={inputPhoneEdit}></input>
            <input type="email" defaultValue={user.mail} ref={inputMailEdit} ></input>
            <input type="text" defaultValue={user.address} ref={inputAddressEdit}></input>
            <input type="text" defaultValue={user.zip} ref={inputZipEdit} ></input>
            <input type="text" defaultValue={user.city} ref={inputCityEdit}></input>
            <input type="text" defaultValue={user.admin.toString()} ref={inputAdminEdit} ></input>
            <input type="number" step="0.01" defaultValue={user.balance} ref={inputBalanceEdit}></input>
            <button onClick={() => {updateUser(token, userId, user._id,
                {inputNameEdit, inputPhoneEdit, inputMailEdit, inputAddressEdit,
                inputZipEdit, inputCityEdit, inputAdminEdit, inputBalanceEdit})}}>Update user</button>
          </Popup>
        </td>
        <td><button value={user._id} onClick={(e) => {deleteUser(token, userId, e.target.value)}}>Delete user</button></td>
        <td></td>
      </tr>
    )
  })
  setTableBox(Box)

  }, [users])

    return (
    <div className="table-container">
    <table className="styled-table">
    <tbody>
      <tr>
        <th>id</th>
        <th>name</th>
        <th>mobile</th>
        <th>mail</th>
        <th>address</th>
        <th>zip</th>
        <th>city</th>
        <th>admin</th>
        <th>balance</th>
        <th></th>
      </tr>
      {tableBox}
      <tr>
        <td> <input type="number" placeholder="id" ref={inputId}></input></td>
        <td> <input type="text" placeholder="name" ref={inputName}></input></td>
        <td> <input type="tel" placeholder="mobile" ref={inputPhone} ></input></td>
        <td> <input type="email" placeholder="mail" ref={inputMail}></input></td>
        <td> <input type="text" placeholder="address" ref={inputAddress}></input></td>
        <td> <input type="text" placeholder="zip" ref={inputZip} ></input></td>
        <td> <input type="text" placeholder="city" ref={inputCity}></input></td>
        <td> <input type="text" placeholder="admin" ref={inputAdmin}></input></td>
        <td> <input type="number" step="0.01" placeholder="balance" ref={inputBalance} ></input></td>
        <td><button onClick={() => {addUser}}>Add</button></td>
      </tr>
      </tbody>
    </table>
    </div>
    );
}

export default UserTable;
