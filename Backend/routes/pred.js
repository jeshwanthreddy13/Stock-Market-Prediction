const router = require("express").Router();
const Pred = require("../model/Prediction")
var request = require('request-promise');
const cron = require("node-cron");

cron.schedule("00 18 * * *",function(){
    generate();
});

async function generate(){
    console.log("Predictions Started")
    var options = {
        method: 'GET',
        uri: 'http://localhost:5000/predictions'
    };
    var sendrequest = await request(options)

        .then(async function (parsedBody) {
            data = JSON.parse(parsedBody)
            const updated = await Pred.updateOne({},
            {
                stocks: data["stocks"]
            })
        })
        .catch(function (err) {
            console.log(err);
        });
};

router.get("/get_predictions", async (req,res) => {
    const result = await Pred.findOne()
    res.json({
        error: null,
        data: (result.stocks)  
    })
})

module.exports = router;