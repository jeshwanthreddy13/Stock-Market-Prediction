const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Transaction = require("../model/Transaction");


router.post("/register", async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist)
        return res.status(400).json({ error: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        phone: req.body.phone
  });
  const transaction = new Transaction({
        email: req.body.email,
        transactions: []
  })
  try {
    const savedUser = await user.save();
    const transSave = await transaction.save();
    res.json({ error: null, data: savedUser });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error:   error.details[0].message });

    const user = await User.findOne({ email: req.body.email });

    if (!user) 
        return res.status(400).json({ error: "User does not exist" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    if (!validPassword)
        return res.status(400).json({ error: "Password is wrong" });

    const token = jwt.sign(
        {
            name: user.name,
            id: user._id,
        },
        process.env.TOKEN_SECRET
    );
    
    res.json({
      error: null,
      data: {
        token,
      },
    });
  });

module.exports = router;