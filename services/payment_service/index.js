const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes} = require('../../shared/resources');
const { MongoWrapper } = require('../../shared/mongowrapper');
const { dbFiller } = require('./filler.js');

// dummy data for testing
const invoices = require('../../shared/dummy_data/payment_service/invoices.json');



const paymentService = async () => {

    const msgBroker = await new MessageBroker(host, 'payment_service');
    const mongoWrapper = await new MongoWrapper("paymentService");

    // for dev test
    dbFiller();

    /**
     * Add a new invoice, parsed through e.data.invoice
     * @param {string} eventTypes - the type of event to handle 
     * @param {function} - the function handeling the event
     */
    msgBroker.response(eventTypes.rpcEvents.addInvoice, async (e) => {
        const response = await mongoWrapper.insertOne("invoices", e.data);
        console.log(response)
        return({
            "code": "200",
            "description": "Invoice added",
            "content": e.data.invoice
        })
    });

    /**
     * Updates status of a invoice once it has been payed for
     * @param {string} eventTypes - the type of event to handle 
     * @param {function} - the function handeling the event
     */
    msgBroker.onEvent(eventTypes.paymentEvents.invoicePaid, async (e) => {
        // // for dev test
        if (e.origin === "web_server") {
            const collection = await mongoWrapper.find("invoices");
            const data = collection.map(function(result) {
                return result;
            });
            e.data._id = data[1]._id;
        }
        
        const res = await mongoWrapper.updateOne("invoices", { _id: e.data._id }, { status: "success"} );
        console.log("updated invoice!", res)
    });

    /**
     * Handles requests for invoices and returns the requested invoices.
     * @param {object} e - the event object containing the request data
     * @returns {object} - the requested invoices
     */
    msgBroker.response(eventTypes.rpcEvents.getInvoices, async (e) => {
        try {
            if (e.data.hasOwnProperty("invoiceId")) {
                console.log(`getting invoice with id ${e.data.invoiceId}`);
                const inv = await mongoWrapper.find("invoices", { _id: e.data.invoiceId });
                return(inv)
            }
            else if (e.data.hasOwnProperty("userId")) {
                console.log(`getting invoices for userId ${e.data.userId}`);
                const inv = await mongoWrapper.find("invoices", { userId: e.data.userId });
                return(inv)
            }
            else {
                console.error("neither invoiceId or userId is defined");
            }
        } catch (e) {
            if (e instanceof TypeError) {
                console.error(e, " This could be caused by making a getInvoice request with an empty _id, this is e: ", e)
            }
            else {
                console.error(e, " This error was caught in getInvoices, this is e: ", e)
            }
        }
        return
    });

    /**
     * Starts a new invoice and populating it with data from object 'e'
     * @param {string} eventTypes - the type of event to handle 
     * @param {function} - the function handeling the event
     */
    msgBroker.onEvent(eventTypes.rentScooterEvents.rideStarted, async (e) => {
        // for dev test
        if (e.origin === "web_server") {
            e.data.userId = "15";
            e.data.start = {
                lat: 57.54296029650948,
                lon: 15.018597642963284,
                time: "3022-11-01|11:17:25"
            };
        }

        const newInvoice = {
            userId: e.data.userId,
            status: "riding",
            start: e.data.start,
            end: {
                lat: undefined,
                lng: undefined,
                time: undefined
            },
            price: undefined,
        }

        const inv = await mongoWrapper.insertOne("invoices", newInvoice);
        console.log(`Started new invoice ${inv.insertedId} for user ${newInvoice.userId}`);
    });

    /**
     * Updates invoice with data about finished ride.
     * @param {string} eventTypes - the type of event to handle 
     * @param {function} - the function handeling the event
     */
    msgBroker.onEvent(eventTypes.returnScooterEvents.rideFinished, async (e) => {
        // for dev test
        if (e.origin === "web_server") {
            e.data.userId = "15";
            e.data.end = {
                lat: 157.54296029650948,
                lon: 115.018597642963284,
                time: "3022-11-01|11:32:03"
            };
        }

        let invoice = await mongoWrapper.find("invoices", { userId: e.data.userId, status: "riding" })
        
        const res = await mongoWrapper.updateOne(
            "invoices", 
            { _id: invoice[0]._id },
            { 
                status: "pending",
                "end.lat": e.data.end.lat,
                "end.lng": e.data.end.lng,
                "end.time": e.data.end.time
            }
        );
        console.log(res)

        // get the invoice from the db just to see if it updated
        invoice = await mongoWrapper.find("invoices", { userId: e.data.userId })
        console.log(invoice);

    });
    
    /**
     * Updates invoice with the price of the ride.
     * @param {string} eventTypes - the type of event to handle 
     * @param {function} - the function handeling the event
     */
    msgBroker.onEvent(eventTypes.returnScooterEvents.establishParkingRate, async (e) => {
        // TODO: get userId from e, and set the price for the invoice



        // startprice: 10kr
        // 2,5kr / min
        // rate
        // const price = 10 + 2.5 * (invoice.end.time - invoice.start.time) + rate
    });
}

paymentService();