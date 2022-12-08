import locationModel from "../models/LocationModel"
import scooterModel from "../models/scooterModel"


function Sidemenu(props) {

    async function getLocations(e) {
      switch (e) {
        case 1:
          let stockholmLocations = await locationModel.fetchStockholmLocations()
          props.setTargetedItems(stockholmLocations)
          break;
        case 2:
          let goteborgLocation = await locationModel.fetchGoteborgLocations()
          props.setTargetedItems(goteborgLocation)
          break;
        case 3:
          let malmoLocation = await locationModel.fetchMalmoLocations()
          props.setTargetedItems(malmoLocation)
          break;

        default:
          break;
      }
    }

    async function getScooters(e) {
      switch (e) {
        case 1:
          let stockholmScooters = await scooterModel.fetchStockholmScooter()
          props.setTargetedItems(stockholmScooters)
          break;
        case 2:
          let goteborgScooters = await scooterModel.fetchGoteborgScooter()
          props.setTargetedItems(goteborgScooters)
          break;
        case 3:
          let malmoScooters = await scooterModel.fetchMalmoScooter()
          props.setTargetedItems(malmoScooters)
          break;

        default:
          break;
      }
    }

    return (
    <div className="sidemenu">
        <button onClick={() => {props.setTargetedcity(1)}}>Stockholm</button>
        <button onClick={() => {props.setTargetedcity(2)}}>Goteborg</button>
        <button onClick={() => {props.setTargetedcity(3)}}>Malmo</button>
        <button onClick={ () => { getLocations(props.targetCity) }}>Load Parkingspots</button>
        <button onClick={ () => { getScooters(props.targetCity) }}>Load Scooters</button>
    </div>
    );
}

export default Sidemenu;