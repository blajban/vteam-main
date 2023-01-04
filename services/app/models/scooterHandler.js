import exported from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";

/**
 *  Scooter
 *  Handles
 *  Scooters
 */
const scooterHandler = {

    /**
     * Fetches scooters available in the specified city.
     *
     * @async
     * @param {string} city - The city to fetch scooters for.
     * @returns {(Object[]|null)} An array of scooter objects, or null if an error occurred.
     */
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
    /**
     * Rents scooter.
     *
     * @async
     * @param {string} scooterId - specified scooter to rent
     * @param {string} userId - UserId.
     * @returns {(Object[]|null)} returns rentEvent started , or null if an error occurred.
     */
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
    /**
     * parks scooter.
     *
     * @async
     * @param {string} scooterId - specified scooter to rent
     * @returns {(Object[]|null)} returns parkEvent started , or null if an error occurred.
     */
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

module.exports = scooterHandler;