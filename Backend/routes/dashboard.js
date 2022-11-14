const router = require("express").Router();
const Transaction = require("../model/Transaction");
const User = require("../model/User");

router.get("/", (req, res) => {
  res.json({
    error: null,
    data: {
      user: req.user, 
    },
  });
});

router.get("/get_transaction_count", async (req,res) => {
    const id= req.user.id
    const user = await User.findById(id)
    const data = await Transaction.findOne({email: user.email})
    const transactions = data.transactions
    var buy = 0
    var sell = 0
    transactions.map( (value) => {
      if (value.method === "Sell"){
        sell += 1
      }
      else{
        buy += 1
      }
    })
    const temp = [buy,sell]
    res.json({"data":temp})
})
module.exports = router;