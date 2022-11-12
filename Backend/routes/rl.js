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
router.post("/get_recommendations",async (req,res) =>{

    var data = {
        amount: req.body.amount,
        tickers: req.body.tickers
    }
    var options = {
        method: 'POST',
        uri: 'http://localhost:5000/get_recommendations',
        body: data,
        json: true
    }
    var sendrequest = await request(options)

        .then(function (parsedBody) {
            res.json(parsedBody);
        })
        .catch(function (err) {
            console.log(err);
        });
})
module.exports = router;
