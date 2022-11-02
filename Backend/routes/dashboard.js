const router = require("express").Router();

router.get("/", (req, res) => {
  console.log(req.user)
  res.json({
    error: null,
    data: {
      user: req.user, 
    },
  });
});

module.exports = router;