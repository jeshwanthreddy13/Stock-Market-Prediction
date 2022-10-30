var request = require('request-promise');
const router = require("express").Router();
const Stock = require("../model/Stock");
const User = require("../model/User");

router.get("/", async (req, res) => {
        var data = {
            ticker: req.query.stock
        }
        var options = {
            method: 'GET',
            uri: 'http://localhost:5000/members',
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

  router.get("/owned_stocks", async (req, res) => {
    const id = (req.headers["id"])
    const result = await User.findById(id)
    const stock_list = await Stock.find({email: result.email})
    console.log("hello")
    res.json({
      error: null,
      data: {
        stock: stock_list, 
      },
    });
});
  
  router.post("/add_stock", async (req, res) => {

    const stock = new Stock({
        email: req.body.email,
        stock_name: req.body.name,
        credits_invested: req.body.credits,
        stock_units: req.body.units
  });
  try {
    const savedStock = await stock.save();
    res.json({ error: null, data: savedStock });
  } catch (error) {
    res.status(400).json({ error });
  }
});


module.exports = router;