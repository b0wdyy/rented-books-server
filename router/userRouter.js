const express = require("express");
const userModel = require("../models/user");
const router = express.Router();

router.get("/books", async (_req, res) => {
    const books = await userModel.find();
    res.json({ data: books });
});

router.post("/books", async (req, res) => {
    const book = new userModel({
        title: req.body.title,
        description: req.body.description,
    });

    try {
        await book.save();
        res.status(201).json({ msg: "Book successfully created." });
    } catch (e) {
        res.json(e);
    }
});

module.exports = router;
