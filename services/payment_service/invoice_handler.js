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
}

module.exports = { invoiceHandler }
