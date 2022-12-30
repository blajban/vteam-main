const { MessageBroker } = require('../../../../shared/mq')
const { host, eventTypes } = require('../../../../shared/resources');
const mesBroker = new MessageBroker(host, "gateway");

/**
 * Formulate a rest answer.
 * @param {string} description
 * @param {object} content
 * @returns
 */
const success = (description, content) => {
    return {
        code: "200",
        description: description,
        content: content
    };
}

exports.testVersion = async (req, res) => {
    console.log(req.params);
    res.json(success('Version', { version: 'v2' }));
}
