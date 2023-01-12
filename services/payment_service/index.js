const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const { MongoWrapper } = require('../../shared/mongowrapper');
const { invoiceHandler } = require('./invoice_handler');



const paymentService = async () => {
    
    const msgBroker = await new MessageBroker(host, 'payment_service');
    const mongoWrapper = await new MongoWrapper("paymentService");

    // dummy data for testing
    // const invoices = require('../../shared/dummy_data/payment_service/invoices.json');
    const handler = new invoiceHandler(mongoWrapper)

    /**
     * Add a new invoice, parsed through e.data.invoice
     * @param {string} eventTypes - the type of event to handle 
     * @param {function} - the function handeling the event
     */
    msgBroker.response(eventTypes.rpcEvents.addInvoice, async (e) => {
        const response = await handler.insertOne(e.data);
        console.log(response);
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
        console.log(e)
        const res = await handler.updateOne({ _id: e.data._id }, { status: "success"});
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
                const inv = await handler.find({ _id: e.data.invoiceId });
                console.log(`getting invoice with id ${e.data.invoiceId}`, inv);
                return(inv)
            }
            else if (e.data.hasOwnProperty("userId")) {
                const inv = await handler.find({ userId: e.data.userId });
                console.log(`getting invoices for userId ${e.data.userId}`, inv);
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
                time: "3022-11-01T11:17:25.000Z"
            };
        }

        const response = await handler.startInvoice(e.data);
        // console.log(response);
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
                time: "3022-11-01T11:32:03.000Z"
            };
        }

        const response = await handler.endInvoice(e.data);
        // console.log(response)
    });
    
    /**
     * Updates invoice with the price of the ride.
     * @param {string} eventTypes - the type of event to handle 
     * @param {function} - the function handeling the event
     */
    msgBroker.onEvent(eventTypes.returnScooterEvents.establishParkingRate, async (e) => {
        // for dev test
        if (e.origin === "web_server") {
            e.data.userId = "15";
            e.data.rate = 50;
        }
        
        const response = await handler.fixParkingRate(e.data);
        console.log(response);
    });
}

paymentService();