const stockholm = require("../../shared/location_service/stockholmLocations.json");
const goteborg = require("../../shared/location_service/goteborgLocations.json");
const malmo = require("../../shared/location_service/malmoLocations.json");
const rates = require("../../shared/location_service/rates.json");
const database = require("./database/database")

const { MongoDBWrapper } = require('../../shared/mongowrapper');

async function dbFiller(){

const mongoDbwrapper = new MongoDBWrapper(await database.getDb())

let result = await mongoDbwrapper.insertMany("locaions", "stockholm", stockholm);
console.log(result)
result = await mongoDbwrapper.insertMany("locaions", "goteborg", goteborg);
console.log(result)
result = await mongoDbwrapper.insertMany("locaions", "malmo", malmo);
console.log(result)
/*
mongoDbwrapper = new MongoDBWrapper(await database.getDb())
result = await mongoDbwrapper.deleteOne("locaions", "malmo", {_id: "639383d094289fcb703ba414" });
console.log(result)
*/
}

dbFiller()