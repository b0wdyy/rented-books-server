const express = require("express");
const bookModel = require("../models/book");
const router = express.Router();

router.get("/books", async (_req, res) => {
    const books = await bookModel.find();
    res.json({ data: books });
});

router.post("/books", async (req, res) => {
    const book = new bookModel({
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
