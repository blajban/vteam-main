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

    // for testing
    // msgBroker.onEvent(eventTypes.adminEvents.testEvent, (e) => {
    //     console.log("testing eventTypes.rpcEvents.addInvoice...")
    //     const invoice = {
    //         "invoiceId": "150",
    //         "userId": "60",
    //         "status": "pending",
    //         "start": {
    //             "lat": 57.54296029650948,
    //             "lng": 15.018597642963284,
    //             "time": "14-17-08-2022"  
    //         },
    //         "end": {
    //             "lat": 57.67896029650948,
    //             "lng": 12.048597642963284,
    //             "time": "28-31-08-2022"
    //         },
    //         "price": 58,
    //     }
    //     const event = msgBroker.constructEvent(eventTypes.rpcEvents.addInvoice, { invoice: invoice });
    //     msgBroker.request(event, (res) => { console.log(res) });
    // });


    // Done
    msgBroker.response(eventTypes.rpcEvents.addInvoice, async (e) => {
        await mongoWrapper.insertOne("invoices", e.data.invoice);
        // const data = await mongoWrapper.find("invoices")
        // console.log("all invoices: ", data);
        return({
            "code": "200",
            "description": "Invoice added",
            "content": e.data.invoice
        })
    });

    // NOT done
    msgBroker.onEvent(eventTypes.accountEvents.addMoney, (e) => {
        console.log("adding money");
        msgBroker.publish(
            msgBroker.constructEvent(
                eventTypes.accountEvents.moneyAdded, 
                {
                    amount: 500,
                    userId: 53
                }
            )
        );
    });

    // NOT done 
    msgBroker.onEvent(eventTypes.accountEvents.moneyAdded, (e) => {
        console.log("added", e.data.amount, "kr to userId:", e.data.userId);
        console.log("requesting invoices:");
        msgBroker.request(msgBroker.constructEvent
            (
                eventTypes.rpcEvents.getInvoices, 
                {
                    userId: 14
                }
            ), 
            (res) => {
                console.log(res)
            }
        );
    });
    
    // msgBroker.request(msgBroker.constructEvent(eventTypes.rpcEvents.getInvoices, { userId: 2 }), (res) => {
    //     console.log(res)
    // });

    // Done
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

    // Done
    msgBroker.response(eventTypes.rpcEvents.getInvoices, async (e) => {
        console.log("getting invoices for userId " + e.data.userId);
        const inv = await mongoWrapper.find("invoices", { userId: e.data.userId });
        return(inv)
    });
}

paymentService();