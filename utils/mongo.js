const bookModel = require("../models/book");

const saveBook = async ({title, description, user_id}, res) => {
    try {
        const book = new bookModel({
            title,
            description,
            user_id
        });

        await book.save();

        return res.status(201).json({
            msg: "Book successfully created.",
            book,
        });
    } catch (e) {
        return res.json(e);
    }
};

const saveBookWithImage = async ({title, description, user_id}, res, image = null) => {
    try {
        const book = new bookModel({
            title,
            description,
            cover: image.url,
            user_id
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
