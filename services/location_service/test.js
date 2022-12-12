const stockholm = require("../../shared/location_service/stockholmLocations.json");
const goteborg = require("../../shared/location_service/goteborgLocations.json");
const malmo = require("../../shared/location_service/malmoLocations.json");
const rates = require("../../shared/location_service/rates.json");

const { MongoWrapper } = require('../../shared/mongowrapper');

async function dbFiller(){

const mongoWrapper = await new MongoWrapper("locations");

let result = await mongoWrapper.insertMany("stockholm", stockholm);
console.log(result)
result = await mongoWrapper.insertMany("goteborg", goteborg);
console.log(result)
result = await mongoWrapper.insertMany("malmo", malmo);
console.log(result)
result = await mongoWrapper.insertMany("rates", rates);
console.log(result)

/*

result = await mongoWrapper.updateOne("stockholm", {_id: "639738fe943f0965c4d7304b" }, {parkingId: 18});
console.log(result)
*/
}
dbFiller()