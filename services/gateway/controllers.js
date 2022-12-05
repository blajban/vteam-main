exports.getTest = (req, res) => {
    const testObject = {
        test: "a test",
        test2: "another test"
    };

    res.json(testObject);
}

exports.createTest = (req, res) => {
    res.status(201).json(req.body);
}