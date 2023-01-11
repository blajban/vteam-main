/**
 * Formulate a rest answer.
 * @param {string} description
 * @param {object} content
 * @returns
 */
const success = (description, content) => {
  return {
    code: '200',
    description: description,
    content: content,
  };
};

exports.testVersion = async (req, res) => {
  res.json(success('Version', { version: 'v2' }));
};
