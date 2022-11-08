const router = require("express").Router();
const Pred = require("../model/Prediction")
var request = require('request-promise');

router.get("/", async (req, res) => {

    var options = {
        method: 'GET',
        uri: 'http://localhost:5000/predictions'
    };
    var sendrequest = await request(options)

        .then(async function (parsedBody) {
            data = JSON.parse(parsedBody)
            const prediction = new Pred({
                stocks: data["stocks"]
          });
        const savedStock = await prediction.save();
        res.json({"stocks" : savedStock.stocks})
        })
        .catch(function (err) {
            console.log(err);
        });
});

router.get("/get_predictions", async (req,res) => {
    const result = await Pred.findOne()
    res.json({
        error: null,
        data: (result.stocks)  
    })
})

module.exports = router;