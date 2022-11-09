const router = require("express").Router();
const Stock = require("../model/Stock");
const User = require("../model/User");
const bcrypt = require("bcryptjs");

router.get("/user_details", async (req, res) => {
    const id = (req.user.id)
    const result = await User.findById(id)
    const stock_list = await Stock.find({email: result.email})
    var sum = 0
    stock_list.map((value) => {
        sum += value.credits_invested
    })
    res.json({
        error: null,
        data: {
            user: result,
            stocks: {
                total: sum,
                no: stock_list.length
            } 
        },
    })
});

router.post("/edit_profile", async (req, res) => {
    const id = (req.user.id)
    const old_user = await User.findById(id)
    const ou_email = old_user.email
    var upd_name = req.body.name
    var upd_email = req.body.email
    var upd_phone = req.body.phone
    var upd_password = req.body.password
    console.log(upd_name,upd_password,upd_email)
    if(upd_email == undefined || upd_email == ''){
        upd_email = old_user.email
    }
    else{
        const check = await User.findOne({email: upd_email })
        if(check){
            upd_email = old_user.email
        }
    }
    if(upd_name == undefined || upd_name == '' ){
        upd_name = old_user.name
    }
    if(upd_phone == undefined || upd_phone == ''){
        upd_phone = old_user.phone
    }
    if(upd_password == undefined || upd_password == ''){
        upd_password = old_user.password
    }
    else{
        const salt = await bcrypt.genSalt(10);
        var pass = await bcrypt.hash(upd_password, salt);
    }
    const result_user = await User.updateOne({__id: id}, 
        {
            $set : {
                name: upd_name,
                email: upd_email,
                phone: upd_phone,
                password: pass
            }
        }
        )
    const result_stock = await Stock.updateMany({email: ou_email},
        {
            email: upd_email
        })
        res.json({message : "success"})
});

module.exports = router;