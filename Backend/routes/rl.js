var request = require('request-promise');
const router = require("express").Router();
const Recommendation = require("../model/Recommendation")
const User = require("../model/User")
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
    const id = req.user.id;
    const user = await User.findById(id);
    const email = user.email;
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

        .then(async function (parsedBody) {
            const data = new Recommendation({
                stocks: parsedBody,
                email: email
            });
            const check = await Recommendation.findOne({email:email});
            if (check){
                const result = await Recommendation.updateOne({email:email},
                    {$set:{stocks: parsedBody}});
            }
            else {
                const result = await data.save();
            }
            res.json({"message":"done"});
        })
        .catch(function (err) {
            console.log(err);
        });
})
router.get("/get_stored_data", async (req, res) => {
    
    const id = req.user.id;
    const user = await User.findById(id);
    const email = user.email;
    const data = await Recommendation.findOne({email:email});
    res.json({"stocks":data.stocks});
});
module.exports = router;
