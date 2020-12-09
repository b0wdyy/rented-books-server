const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const router = express.Router();

router.get("/users", async (_req, res) => {
    const users = await userModel.find();
    res.json({ data: users });
});

router.post("/users/signup", async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const userExists = await userModel.findOne({username: req.body.username});
    if (userExists) {
        res.json({msg: "User already exists!"})
        return;
    }
    const user = new userModel(req.body);

    try {
        await user.save();
        res.status(201).json({ msg: "User successfully created." });
    } catch (e) {
        res.json(e);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await userModel.findOne({username: req.body.username}).exec();

        if (bcrypt.compareSync(req.body.password, user.password)) {
           const token = jwt.sign({
                username: user.username,
                userId: user._id
            }, process.env.JWT_KEY, {
                expiresIn: "1h"
            })
            res.status(200).json({msg: "User successfully logged in.", token})
        } else {
            res.status(404).json({msg: "Password or username is wrong."})
        }
    } catch(e) {
        console.error(e)
    }
})

module.exports = router;
