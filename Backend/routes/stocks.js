var request = require('request-promise');
const router = require("express").Router();
const Stock = require("../model/Stock");
const User = require("../model/User");
const yf = require("yahoo-stock-prices");
const Transaction = require("../model/Transaction");
const { BufferGeometry } = require('three');

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
    const id = (req.user.id)
    const result = await User.findById(id)
    const stock_list = await Stock.find({email: result.email})
    res.json({
      error: null,
      data: {
        stock: stock_list, 
      },
    });
});

router.get('/get_price', async(req,res) => {
  const id = (req.user.id)
  const result = await User.findById(id);
  const ticker = req.header("ticker").toUpperCase();
  const data = await yf.getCurrentData(ticker);
  res.json({"price": data.price, "credits": result.credits, "email": result.email})
})

router.post('/buy_stock', async(req,res) => {
  const id = (req.user.id)
  const user = await User.findById(id)
  const email = user.email
  const stock = new Stock({
    email: email,
    stock_name: req.body.name,
    credits_invested: req.body.credits,
    stock_units: req.body.units
  });
  const result_user = await User.updateOne({email: req.body.email}, 
    {
        $set : {
          credits: user.credits - req.body.credits - 20 - (0.0005 * req.body.credits)
        }
    }
    )
  const user_transaction = await Transaction.findOne({email: email})
  const temp = user_transaction.transactions
  const temp_data = {
    method: "Buy",
    stock_name: req.body.name.toUpperCase(),
    stock_units: req.body.units,
    credits_invested: req.body.credits,
    date: new Date().toLocaleString()
  }
  temp.push(temp_data)
  try{
    const savedTransaction = await Transaction.updateOne({email: email},
      {
        $set : {
          transactions: temp
        }
      }
      )
  }
  catch(error){
    res.status(400).json({ error });
  }
  const check = await Stock.findOne({stock_name: req.body.name, email: email})
  if(check){
    const id = check.id
    const old_units = check.stock_units
    const old_total = check.credits_invested
    try {
      const savedStock = await Stock.updateOne({__id: id}, 
        {
            $set : {
              credits_invested: old_total + req.body.credits,
              stock_units: old_units + req.body.units
            }
        }
        )
      res.json({ error: null, data: savedStock });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  else{
    try {
      const savedStock = await stock.save();
      res.json({ error: null, data: savedStock });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
})

router.post('/sell_stock', async (req,res) => {
    const id = (req.user.id)
    const user = await User.findById(id)
    const email = user.email
    const stock_name = req.body.name
    const credits = req.body.credits
    const number = req.body.number
    
    const stock = await Stock.findOne({email: email, stock_name: stock_name})
    const price = stock.credits_invested - ((stock.credits_invested / stock.stock_units) * number)
    const upd_units = stock.stock_units - number
    if(upd_units === 0){
      const deleted = await Stock.deleteOne({email: email, stock_name: stock_name})
    }
    else{
      const savedStock = await Stock.updateOne({email: email, stock_name: stock_name}, 
        {
            $set : {
              credits_invested: price,
              stock_units: upd_units
            }
        }
        )
    }
    const user_data = await User.findOne({email: email})
    const result_user = await User.updateOne({email: req.body.email}, 
    {
        $set : {
          credits: user_data.credits + credits - 20 - (0.0005 * credits)
        }
    }
    )

  const user_transaction = await Transaction.findOne({email: email})
  const temp = user_transaction.transactions
  const temp_data = {
    method: "Sell",
    stock_name: req.body.name.toUpperCase(),
    stock_units: number,
    credits_invested: credits,
    date: new Date().toLocaleString()
  }
  temp.push(temp_data)
  try{
    const savedTransaction = await Transaction.updateOne({email: email},
      {
        $set : {
          transactions: temp
        }
      }
      )
  }
  catch(error){
    res.status(400).json({ error });
  }

})

router.get('/get_transactions', async (req,res) => {
  const id = req.user.id
  const user = await User.findById(id)
  const email = user.email
  const transaction = await Transaction.findOne({email: email})
  res.json({"transactions" : transaction.transactions})
})


module.exports = router;