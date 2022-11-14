var request = require('request-promise');
const router = require("express").Router();

router.get("/", async (req, res) => {
    var data = {
        ticker: req.query.stock
    }
    var options = {
        method: 'GET',
        uri: 'http://localhost:5000/support_and_resistance',
        body: data,
        json: true
    };
    var sendrequest = await request(options)

        .then(function (parsedBody) {
            res.json(parsedBody);
        })
        .catch(function (err) {
            console.log(err);
        });
});

module.exports = router