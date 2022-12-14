const { MongoWrapper } = require('../../shared/mongowrapper');
const invoices = require('../../shared/dummy_data/payment_service/invoices.json');


async function dbFiller() {

const mongoWrapper = await new MongoWrapper("paymentService");

await mongoWrapper.insertMany("invoices", invoices);

}

module.exports = { dbFiller }