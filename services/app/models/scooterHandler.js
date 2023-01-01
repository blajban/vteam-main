/**
 *  Scooter
 *  Handles
 *  Scooters
 */
const scooterHandler = {


    fetchScooters: async function fetchScooters(city) {
        if(!city) return "No city specified";
        try {
            const response = await fetch(`http://192.168.1.239:3500/city/${city}/scooter`);
            const data = await response.json();
            return data;
        } catch (e) {
            return null;
        }
    },
    rentScooter: async function rentScooter(scooterId, userId) {
        if(!scooterId) return "No scooterId or UserId specified";
        if(!userId) return "No scooterId or UserId specified";
        try {
        const response = await fetch(`http://192.168.1.239:3500/eventflows/rent_scooter/${scooterId}/${userId}`);
        const data = await response.json();
        return data;
        } catch (e) {
            return null;
        }
    },
    parkScooter: async function parkScooter(scooterId) {
        if(!scooterId) return "No scooterId specified";
        try {
            const response = await fetch(`http://192.168.1.239:3500/eventflows/park_scooter/${scooterId}`);
            const data = await response.json();
            return data;
        } catch (e) {
            return null;
        }
    },
};
export default scooterHandler;
