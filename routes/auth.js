const User = require("../models/User");

const router = require("express").Router();
const bcrypt = require("bcrypt");
//auth register
router.post("/register", async (req, res) => {
  let { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    const user = await newUser.save();

    res.status(200).json({
      message: "user registered succefully",
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    const user = await User.findOne({ email });
    !user && res.status(404).json("user not found");
    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(400).json("un valid password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
