
/**
 *  locationHandler
 *  Handles
 *  Parkingspots/Chargingspots
 */
const locationHandler = {


    fetchLocations: async function fetchLocations(city) {
        if(!city) return "No city specified";
        try{
            const response = await fetch(`http://192.168.1.239:3500/city/${city}/parking`)
            const data = await response.json();
            return data;
        } catch(e) {
            return null;
        }
    }
};

export default locationHandler;
