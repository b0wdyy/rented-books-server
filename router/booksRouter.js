const express = require("express");
const bookModel = require("../models/book");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();

router.get("/books", checkAuth, async (_req, res) => {
    const books = await bookModel.find();
    res.json({ data: books });
});

router.post("/books", checkAuth, async (req, res) => {
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

router.get("/books/:id", checkAuth, async (req, res) => {
    const bookId = req.params.id;
    const book = await bookModel.findById(bookId, 'title description').exec();
    res.status(200).json({book});
})

router.delete("/books/:id", checkAuth, async (req, res) => {
    const bookId = req.params.id;
    await bookModel.findByIdAndDelete(bookId);
    res.status(204).json({msg: `Book with ${bookId} deleted.`})
})

module.exports = router;
