const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {

    const { name, phone, password } = req.body;

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const newUser = new User({
      name,
      phone,
      password
    });

    await newUser.save();

    res.json({
      message: "Registration Successful"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {

    const { phone, password } = req.body;

    console.log(phone, password);

    const user = await User.findOne({
      phone: phone,
      password: password
    });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    res.json({
      message: "Login Successful",
      user
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }
});

module.exports = router;