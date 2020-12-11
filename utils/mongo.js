const bookModel = require("../models/book");

const saveBook = async (req, res) => {
    try {
        const book = new bookModel({
            title: req.body.title,
            description: req.body.description,
        });

        await book.save();

        res.status(201).json({
            msg: "Book successfully created.",
            book,
        });
    } catch (e) {
        res.json(e);
    }
};

const saveBookWithImage = async (req, res, image = null) => {
    try {
        const book = new bookModel({
            title: req.body.title,
            description: req.body.description,
            cover: image.url,
        });

        await book.save();

        res.status(201).json({
            msg: "Book successfully created.",
            book,
        });
    } catch (e) {
        res.json(e);
    }
};

module.exports = {
    saveBook,
    saveBookWithImage,
};
