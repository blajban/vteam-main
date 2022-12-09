import "../assets/css/style.css"


function HisotryTable(props) {


    return (
    <div className="table-container">
    <table className="styled-table">
      <tr>
        <th>Id</th>
        <th>Start Position</th>
        <th>End Position</th>
        <th>Time</th>
        <th>Price</th>
        <th>Status</th>
        <th></th>
      </tr>
      <tr>
        <td>132</td>
        <td>lat: "58.58502", long: "58.58502",</td>
        <td>lat: "58.58502", long: "58.58502",</td>
        <td>15:31</td>
        <td>20:-</td>
        <td>Pending</td>
        <td><button>pay</button></td>
      </tr>
    </table>
    </div>
    );
}

export default HisotryTable;