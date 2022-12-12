const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes} = require('../../shared/resources');

// dummy data for testing
const invoices = require('../../shared/dummy_data/payment_service/invoices.json');


const tempVariables = {
    cost: 500,
    length: 3.5,
    userId: 53,
    amount: 350
};

const paymentService = async () => {

    const msgBroker = await new MessageBroker(host, 'payment_service');

    // msgBroker.response(eventType.rpcEvents.addInvoice, (e) => {
    //     // ser variables based on input from e.data
    //     const newInvoice = {
    //         "id": 0,
    //         "userId": 5,
    //         "startPos": {
    //             "lat": 55.59896029650948,
    //             "lng": 13.008597642963284
    //         },
    //         "endPos": {
    //             "lat": 55.57896029650948,
    //             "lng": 13.028597642963284
    //         },
    //         "time": "00-08-16",
    //         "price": 87,
    //         "payedFor": false
    //     }
    //     // TODO: save invoice to db
    //     if (e.data.invoice.payedFor) {
    //         return("added invoice" + newInvoice);
    //         const payedinvoice = msgBroker.constructEvent(eventTypes.paymentEvents.invoicePaid, { invoice: newInvoice } );
    //         msgBroker.publish(payedinvoice);
    //     }
    //     return("added invoice, but it still needs to be payed for");
        
    // });

    
    
    const newinvoice = msgBroker.constructEvent(eventTypes.paymentEvents.invoiceCreated, { invoice: invoices[1] } );
    msgBroker.publish(newinvoice);

    msgBroker.onEvent(eventTypes.paymentEvents.invoiceCreated, (e) => {
        // TODO: save invoice to db
        console.log("made invoice");

        // for dev test 
        e.data.invoice = {
            "id": 1,
            "userId": 2,
            "startPos": {
                "lat": 57.54296029650948,
                "lng": 15.018597642963284
            },
            "endPos": {
                "lat": 57.67896029650948,
                "lng": 12.048597642963284
            },
            "time": "00-02-51",
            "price": 38,
            "payedFor": true
        }
        
        if (e.data.invoice.payedFor) {
            console.log("invoice created!");
            const payedinvoice = msgBroker.constructEvent(eventTypes.paymentEvents.invoicePaid, { invoice: e.data.invoice } );
            msgBroker.publish(payedinvoice);
        }
        else {
            console.log("Invoice created, but still needs to be payed for")
        }
    });

    msgBroker.onEvent(eventTypes.paymentEvents.invoicePaid, (e) => {
        console.log("User with id", e.data.invoice.userId, "payed for invoice id:", e.data.invoice.id)
    })

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

    //temp 
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
    

    msgBroker.request(msgBroker.constructEvent(eventTypes.rpcEvents.getInvoices, { userId: 17 }), (res) => {
            console.log(res)
        }
    );

    msgBroker.response(eventTypes.rpcEvents.getInvoices, (e) => {
        return("getting invoices for userId " + e.data.userId);
    });

}

paymentService();