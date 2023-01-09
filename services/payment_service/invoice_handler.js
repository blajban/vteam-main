/**
 * Class for handling operations related to invoices stored in a MongoDB database.
 */
class invoiceHandler {
    /**
     * Creates an instance of the invoiceHandler class.
     * @param {object} mongo - An object for interacting with a MongoDB database.
     * @param {array} invoices - An optional array of invoices to be inserted into the database.
     */
    constructor(mongo, invoices) {
        this.#construct(mongo, invoices);
    }

    /**
     * Initializes the `db` and `collectionName` properties of the invoiceHandler instance.
     * If the `invoices` argument is not `null`, inserts the invoices into the database.
     * @param {object} mongo - An object for interacting with a MongoDB database.
     * @param {array} invoices - An optional array of invoices to be inserted into the database.
     */
    async #construct(mongo, invoices=null) {
        this.db = mongo;
        this.collectionName = "invoices";
        if (invoices) {
            await this.db.insertMany(this.collectionName, invoices);  
        }
    }

    /**
     * Inserts a new invoice into the invoices collection in MongoDB.
     * @param {object} invoice - The invoice to be inserted.
     * @returns {object} - The result of the insert operation.
     */
    async insertOne(invoice) {
        const response = await this.db.insertOne(this.collectionName, invoice);
        return response;
    }

    /**
     * Updates a single invoice in the invoices collection in MongoDB.
     * @param {object} filter - A filter object to determine which invoice should be updated.
     * @param {object} parameters - The update parameters.
     * @returns {object} - The result of the update operation.
     */
    async updateOne(filter, parameters) {
        const response = await this.db.updateOne(this.collectionName, filter, parameters);
        return response;
    }

    /**
     * Finds invoices in the invoices collection in MongoDB that match a filter.
     * @param {object} filter - A filter object to determine which invoices should be returned.
     * @returns {object} - The result of the find operation.
     */
    async find(filter) {
        const response = await this.db.find(this.collectionName, filter);
        return response;
    }

    /**
     * Inserts a new invoice into the invoices collection with a status of "riding" and a start time.
     * @param {object} data - An object containing the userId and start time of the invoice.
     * @returns {object} - The result of the insert operation.
     */
    async startInvoice(data) {
        const newInvoice = {
            userId: data.userId,
            status: "riding",
            start: data.start,
            end: {
                lat: undefined,
                lng: undefined,
                time: undefined
            },
            price: undefined,
        }

        const response = await this.insertOne(newInvoice);
        return response;
    }

    /**
     * Updates an invoice with a status of "riding" for the specified user to a status of "pending" and sets the end time and location.
     * @param {object} data - An object containing the userId and end time and location of the invoice.
     * @returns {object} - The result of the update operation.
     */
    async endInvoice(data) {
        let invoice = await this.find({ userId: data.userId, status: "riding" });
        let response = await this.updateOne({ _id: invoice[0]._id }, { 
            status: "pending",
            end: {
                lat: data.end.lat,
                lng: data.end.lng,
                time: data.end.time
            }
            // "end.lat": data.end.lat,
            // "end.lng": data.end.lng,
            // "end.time": data.end.time
        });
        return response;
    }

    /**
     * Calculates the price of an invoice with a status of "pending" for the specified user and updates the invoice with the calculated price.
     * @param {object} data - An object containing the userId and rate for the invoice.
     * @returns {object} - The result of the update operation.
     */
    async fixParkingRate(data) {
        const invoice = await this.find({ userId: data.userId, price: undefined });

        const startPrice = 10;
        const pricePerMin = 2.5;
        const rate = data.rate;
        
        const deltaTime =
            (new Date(invoice[0].end.time).getTime()
            -
            new Date(invoice[0].start.time).getTime())
            / 1000 * 60;

        const price = startPrice + pricePerMin * deltaTime + rate;

        const response = await this.updateOne({ _id: invoice[0]._id }, { price: price });
        return response
    }

}

module.exports = { invoiceHandler }
