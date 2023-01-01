
const locationHandler = {

    /**
     * fetches locations.
     *
     * @async
     * @param {string} city - specified city to fetch locations from
     * @returns {(Object[]|null)} returns array of objects , or null if an error occurred.
     */
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

module.exports = locationHandler;
