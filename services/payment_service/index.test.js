const { invoiceHandler } = require("./invoice_handler");
const dummy_invoices = require('../../shared/dummy_data/payment_service/invoices.json');

afterEach(() => {
    jest.useRealTimers();
  });


class mockMongo {
    constructor() {
      this.invoices = [];
    }
  
    addInvoices(invoices) {
      const addIdToInvoices = invoices => invoices.map(invoice => ({
        ...invoice,
        _id: Math.random().toString(36).substr(2, 6),
      }));
  
      const invoicesWithId = addIdToInvoices(invoices);
  
      for (const invoice of invoicesWithId) {
        this.invoices.push(invoice);
      }
    }

    insertOne(collectionName, invoice) {
        invoice._id = Math.random().toString(36).substr(2, 6);
        this.invoices.push(invoice)
        return { insertedCount: 1, _id: invoice._id };
    }

    find(collectionName, filter) {
        let invoices = [];
        for (const invoice of this.invoices) {
            if (filter._id === invoice._id) {
                invoices.push(invoice);
            }
            if (filter.userId === invoice.userId && filter.status === invoice.status) {
                invoices.push(invoice);
            }
            if (filter.userId === invoice.userId && filter.price === invoice.price) {
                invoices.push(invoice);
            }
            if (filter.status === invoice.status && filter.status === "pending") {
                invoices.push(invoice);
            }
            if (filter.userId == invoice.userId) {
                invoices.push(invoice);
            }
        }
        if (invoices.length === 0) {
            return null;
        }
        return invoices;
    }

    updateOne(collectionName, filter, parameters) {
        if (filter.hasOwnProperty("_id")) {
            for (const invoice of this.invoices) {
                if (filter._id === invoice._id) {
                    if (parameters.hasOwnProperty("status")) {
                        invoice.status = parameters.status
                    }
                    if (parameters.hasOwnProperty("end")) {
                        invoice.end = parameters.end
                    }
                    if (parameters.hasOwnProperty("price")) {
                        invoice.price = parameters.price
                    }
                    return { modifiedCount: 1, _id: filter._id };
                }
            }
        }
        return { modifiedCount: 0 };
    }
}

const mongo = new mockMongo();
mongo.addInvoices(dummy_invoices.slice(0, 10))

describe('paymentService', () => {
    const handler = new invoiceHandler(mongo);
    describe("Make invoices", () => {
        it("Add an invoice", async () => {
            const newInvoice = dummy_invoices.slice(10, 11)[0];
            const response = await handler.insertOne(newInvoice);
            const invoice = await handler.find({ _id: response._id })
            expect(response.insertedCount).toEqual(1);
            expect(invoice).toBeDefined();
        });
        let invoiceData = {};
        it("Start an invoice", async () => {
            const data = {
                userId: "12345",
                properties: {
                    lat: 100,
                    lng: 75,
                    time: "4022-11-01T11:17:25.000Z"
                }
            }
            invoiceData.start = data.start;
            const response = await handler.startInvoice(data);
            const invoice = await handler.find({ _id: response._id });
            expect(response.insertedCount).toEqual(1);
            expect(invoice).toBeDefined();
        });

        it("Add end-data to invoice", async () => {
            const data = {
                log: [{userId: "12345"}],
                properties: {
                    lat: 200,
                    lng: 150
                }
            }
            invoiceData.end = data.end;
            const response = await handler.endInvoice(data);
            const invoice = await handler.find({ _id: response._id });
            expect(response.modifiedCount).toEqual(1);
            expect(invoice).toBeDefined();
        });
        
        it("Make rate for invoice", async () => {

            jest.useFakeTimers('legacy');

            const data = {
                userId: "12345",
                rate: 100,
                fromtest: true
            };

            const response = await handler.fixParkingRate(data);
            const invoice = await handler.find({ _id: response._id });
            expect(response.modifiedCount).toEqual(1);
            expect(invoice).toBeDefined();
        });
    });

    describe("General invoice tests", () => {
        it("Get all invoices for a user", async () => {
            const userId = 2;
            const invoices = await handler.find({ userId: userId });
            expect(invoices.length).toEqual(5);
            expect(invoices.every(object => object.userId == 2)).toBe(true);
        });

        it ("Update status after invoice is payed", async () => {
            const invoice = await handler.find({ status: "pending" });
            const response = await handler.updateOne({ _id: invoice[0]._id }, { status: "success" });
            const newInvoice = await handler.find({ _id: invoice[0]._id });

            expect(response.modifiedCount).toEqual(1);
            expect(newInvoice[0].status).toBe("success");
        });
    });
})