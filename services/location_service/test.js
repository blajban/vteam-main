const stockholm = require("../../shared/location_service/stockholmLocations.json");
const goteborg = require("../../shared/location_service/goteborgLocations.json");
const malmo = require("../../shared/location_service/malmoLocations.json");
const rates = require("../../shared/location_service/rates.json");

const { mongowrapper } = require('../../shared/mongowrapper');

async function dbFiller(){

const mongoWrapper = new mongowrapper();
await mongoWrapper.connectClient();
/*
let result = await mongoWrapper.insertMany("locaions", "stockholm", stockholm);
console.log(result)
result = await mongoWrapper.insertMany("locaions", "goteborg", goteborg);
console.log(result)
result = await mongoWrapper.insertMany("locaions", "malmo", malmo);
console.log(result)

/*

result = await mongoWrapper.deleteOne("locaions", "malmo", {_id: "63945e552f9838569eb8f2a9" });
console.log(result)
*/


result = await mongoWrapper.updateOne("locaions", "stockholm", {_id: "6394862bc01e1509db076b4c" }, {parkingId: 18});
console.log(result)


}
dbFiller()