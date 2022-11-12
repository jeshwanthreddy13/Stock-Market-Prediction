var request = require('request-promise');
const router = require("express").Router();
router.get("/download_data", async (req, res) => {
    
    var options = {
        method: 'GET',
        uri: 'http://localhost:5000/download_data',
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
module.exports = router;
